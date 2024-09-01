import { connectToDB } from "../_database/database";
import { ObjectId } from "mongodb";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("db_experthub");
};

export const getAllProducts = async () => {
    if (!dbConnection) await init();

    try {
        const collection = database.collection("products");
        if (!collection) {
            throw new Error("Failed to connect to products collection");
        }

        const products = await collection.find({}).toArray();
        return products;
    } catch (error: any) {
        console.error("An error occurred while fetching products:", error.message);
        return { error: error.message };
    }
};

export const addToCart = async (userId: string, productId: string, quantity: number) => {
    if (!dbConnection) await init();

    try {
        const cartCollection = database.collection("carts");

        // Check if the cart already has this product
        const existingCartItem = await cartCollection.findOne({ userId, productId });

        if (existingCartItem) {
            // Update the quantity if the product is already in the cart
            const updatedCart = await cartCollection.updateOne(
                { userId, productId },
                { $inc: { quantity } }
            );
            return { updatedCart };
        } else {
            // Insert a new item into the cart
            const newCartItem = await cartCollection.insertOne({ userId, productId, quantity });
            return { newCartItem };
        }
    } catch (error: any) {
        console.error("An error occurred while adding to cart:", error.message);
        return { error: error.message };
    }
};

export const checkout = async (userId: string) => {
    if (!dbConnection) await init();

    try {
        const cartCollection = database.collection("carts");
        const ordersCollection = database.collection("orders");

        // Fetch cart items
        const cartItems = await cartCollection.find({ userId }).toArray();

        if (cartItems.length === 0) {
            return { error: "Cart is empty" };
        }

        // Create a new order
        const orderData = {
            userId,
            items: cartItems,
            dateOfOrder: new Date().toLocaleDateString(),
            timeOfOrder: new Date().toLocaleTimeString(),
            orderStatus: "pending"
        };

        const newOrder = await ordersCollection.insertOne(orderData);

        // Clear the cart
        await cartCollection.deleteMany({ userId });

        return { orderId: newOrder.insertedId };
    } catch (error: any) {
        console.error("An error occurred during checkout:", error.message);
        return { error: error.message };
    }
};
