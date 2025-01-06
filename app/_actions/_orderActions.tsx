"use server"
import { ObjectId } from "mongodb";
import { connectToDB } from "../_database/database";
import { getProductByName } from "./_productsActions";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("pawreedy");
};

// Function to save an order
export const saveOrder = async (orderData: any) => { // Adjust type according to your data structure
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");
        const usersCollection = database?.collection("users");
        const productsCollection = database?.collection("products"); // Add your products collection

        if (!ordersCollection || !productsCollection) {
            throw new Error("Failed to get necessary collections");
        }

        // Optional: Check if user exists if userEmail is provided
        let user = null;
        if (orderData.userEmail) {
            if (!usersCollection) {
                throw new Error("Failed to get users collection");
            }
            user = await usersCollection.findOne({ "email": orderData.userEmail });
            if (!user) {
                throw new Error("User not found");
            }
        }

        // Validate stock availability and prepare update operations
        const updateOperations = [];
        for (const item of orderData.cartSummary.items) {
            const product = await productsCollection.findOne({ _id: item.id }); // Ensure 'id' matches your product schema
            if (!product) {
                throw new Error(`Product with ID ${item.id} not found`);
            }
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }

            // Prepare update operation for stock deduction
            updateOperations.push({
                updateOne: {
                    filter: { _id: item.id },
                    update: { $inc: { quantity: -item.quantity } },
                },
            });
        }

        // Perform all inventory updates in a transaction
        const session = database?.startSession();
        session.startTransaction();
        try {
            // Update product quantities
            await productsCollection.bulkWrite(updateOperations, { session });

            // Save the order details
            const result = await ordersCollection.insertOne(
                {
                    ...orderData,
                    status: "Pending",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userEmail: orderData.userEmail || null,
                },
                { session }
            );

            if (!result.insertedId) {
                throw new Error("Failed to save order");
            }

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            return { success: true, orderId: result.insertedId };
        } catch (transactionError) {
            // Rollback the transaction on error
            await session.abortTransaction();
            session.endSession();
            throw transactionError;
        }
    } catch (error: any) {
        console.error("Error saving order:", error.message);
        return { error: error.message };
    }
};

// Function to get orders by user email
export const getOrdersByUserEmail = async (userEmail: string) => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
        }

        const orders = await ordersCollection.find({ userEmail }).toArray();

        // Convert MongoDB special objects to plain objects
        const plainOrders = orders.map((order: { _id: { toString: () => any; }; createdAt: string | number | Date; updatedAt: string | number | Date; }) => {
            return {
                ...order,
                _id: order._id.toString(), // Convert ObjectId to string
                createdAt: new Date(order.createdAt).toISOString(), // Convert Date to string
                updatedAt: new Date(order.updatedAt).toISOString(), // Convert Date to string
            };
        });

        return plainOrders;
    } catch (error: any) {
        console.error("Error fetching orders by user email:", error.message);
        return { error: error.message };
    }
};


export const getUserEmailsByProductId = async (productId: string) => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
        }

        // Fetch orders with the given productId and extract user emails
        const orders = await ordersCollection.find({ productId }, { projection: { userEmail: 1 } }).toArray();
        const userEmails = orders.map((order: { userEmail: any; }) => order.userEmail).filter((email: null) => email !== null);

        return userEmails;
    } catch (error: any) {
        console.error("Error fetching user emails by product ID:", error.message);
        return { error: error.message };
    }
};

// Function to get all orders
export const getAllOrders = async () => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
        }

        // Fetch all orders
        const orders = await ordersCollection.find().toArray();

        // Map and convert _id and other problematic fields to strings
        const ordersWithStringId = orders.map((order: { _id: { toString: () => any; }; shippingDetails: any; cartSummary: any; createdAt: any; updatedAt: any; userEmail: any; orderStatus: any; status: any; orderStauts: any; }) => ({
            _id: order._id.toString(),  // Convert the _id to string
            shippingDetails: order.shippingDetails,
            cartSummary: order.cartSummary,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            userEmail: order.userEmail,
            orderStatus: order.orderStatus,
            status: order.status,
            orderStauts: order.orderStauts
        }));

        return { success: true, orders: ordersWithStringId };
    } catch (error: any) {
        console.error("Error fetching all orders:", error.message);
        return { error: error.message };
    }
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
        }

        console.log("Updating order with ID:", new ObjectId(orderId));

        const result = await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) }, // Filter by order ID
            {
                $set: {
                    orderStatus: newStatus,
                    updatedAt: new Date(),
                },
            }
        );

        console.log("Matched count:", result.matchedCount);
        console.log("Modified count:", result.modifiedCount);

        if (result.matchedCount === 0) {
            throw new Error("Order not found");
        }

        if (result.modifiedCount === 0) {
            throw new Error("Failed to update order status");
        }

        return { success: true, message: "Order status updated successfully" };
    } catch (error: any) {
        console.error("Error updating order status:", error.message);
        return { error: error.message };
    }
};


export const getOrderDetails = async (orderId: string) => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
        }

        // Fetch the order details by ID
        const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

        if (!order) {
            throw new Error("Order not found");
        }

        return { success: true, order };
    } catch (error: any) {
        console.error("Error fetching order details:", error.message);
        return { error: error.message };
    }
};

export const getTotalRevenueByMonth = async () => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
        }

        // Aggregate to calculate total revenue per month
        const revenueData = await ordersCollection.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },  // Extract year from createdAt
                        month: { $month: "$createdAt" } // Extract month from createdAt
                    },
                    totalRevenue: { $sum: "$totalAmount" }, // Sum up the totalAmount field
                    totalOrders: { $count: {} },           // Optional: Count total orders per month
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]).toArray();

        // Format the response
        const formattedData = revenueData.map((data: { _id: { year: any; month: any; }; totalRevenue: any; totalOrders: any; }) => ({
            year: data._id.year,
            month: data._id.month,
            totalRevenue: data.totalRevenue,
            totalOrders: data.totalOrders || 0
        }));

        return { success: true, data: formattedData };
    } catch (error: any) {
        console.error("Error calculating revenue by month:", error.message);
        return { error: error.message };
    }
};

export const getTotalRevenueByYear = async () => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
        }

        // Aggregate to calculate total revenue for the whole year
        const revenueData = await ordersCollection.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$createdAt" } }, // Group by year
                    totalRevenue: { $sum: "$totalAmount" }, // Sum up the totalAmount field
                }
            },
            {
                $sort: { "_id.year": 1 } // Sort by year (ascending)
            }
        ]).toArray();

        // If there's any data, return the total revenue for the most recent year
        if (revenueData.length > 0) {
            const totalRevenue = revenueData[0].totalRevenue;
            return { success: true, totalRevenue };
        } else {
            return { success: true, totalRevenue: 0 }; // No data found
        }

    } catch (error: any) {
        console.error("Error calculating total revenue for the year:", error.message);
        return { error: error.message };
    }
};


export const getMostOrderedProductsByCategory = async () => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
        }

        // Fetch all orders
        const orders = await ordersCollection.find().toArray();

        // Map through the orders and get all products with their categories
        const productsWithCategories: { name: string; category: string }[] = [];

        // Loop through each order and each item in the cartSummary
        for (let order of orders) {
            if (Array.isArray(order.cartSummary)) { // Ensure cartSummary is an array
                for (let item of order.cartSummary) {
                    // Fetch product category based on the name in the cart
                    const productDetails = await getProductByName(item.name);

                    if (productDetails && productDetails.length > 0) {
                        const productCategory = productDetails[0].category;
                        productsWithCategories.push({ name: item.name, category: productCategory });
                    }
                }
            } else {
                console.error("Invalid cartSummary format for order:", order);
            }
        }

        // Group the products by category and count occurrences
        const categoryProductCounts: { [category: string]: { [productName: string]: number } } = {};

        // Count products per category
        productsWithCategories.forEach((item) => {
            if (!categoryProductCounts[item.category]) {
                categoryProductCounts[item.category] = {};
            }
            categoryProductCounts[item.category][item.name] = (categoryProductCounts[item.category][item.name] || 0) + 1;
        });

        // Sort the products within each category by order frequency
        const sortedCategories = Object.keys(categoryProductCounts).map((category) => {
            const products = categoryProductCounts[category];
            const sortedProducts = Object.keys(products)
                .map((productName) => ({ name: productName, count: products[productName] }))
                .sort((a, b) => b.count - a.count); // Sort by frequency (descending)

            return {
                category,
                products: sortedProducts,
            };
        });

        return { success: true, categories: sortedCategories };
    } catch (error: any) {
        console.error("Error fetching most ordered products by category:", error.message);
        return { error: error.message };
    }
};

