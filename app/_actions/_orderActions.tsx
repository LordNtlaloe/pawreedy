"use server"
import { connectToDB } from "../_database/database";

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

        if (!ordersCollection) {
            throw new Error("Failed to get orders collection");
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

        // Save the order details
        const result = await ordersCollection.insertOne({
            ...orderData,
            status: "Pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            userEmail: orderData.userEmail || null, // Store user email if available, otherwise null
        });

        if (!result.insertedId) {
            throw new Error("Failed to save order");
        }

        return { success: true, orderId: result.insertedId };
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

        return { success: true, orders };
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