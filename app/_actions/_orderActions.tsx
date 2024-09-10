"use server"
import { connectToDB } from "../_database/database";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("pawreedy");
};

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
