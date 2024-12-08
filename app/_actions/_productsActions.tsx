"use server"
import { revalidatePath } from "next/cache";
import { connectToDB } from "../_database/database";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { subDays } from "date-fns"; 

let dbConnection: any;
let database: any;

const init = async () => {
    try {
        const connection = await connectToDB();
        dbConnection = connection;
        database = await dbConnection?.db("pawreedy");
    } catch (error:any) {
        console.error("Failed to connect to the database:", error.message);
    }
}

export const saveNewProduct = async(formData: FormData) => {
    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        image: formData.get("imageUrl"),
        category: formData.get("category"),
        quantity: formData.get("quantity"),
        ratings: 0,
        ratingsCount: 0,
        status: "In Stock",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    if(!dbConnection) await init();

    try{
        const collection = await database.collection("products");
        if(!collection || !database){
            return { error: "Failed To Get Products From Database"}
        }
        const newCategory = await collection.insertOne(data);
        revalidatePath('/dashboard/products');
        return { "productId": newCategory }
    }
    catch(error: any){
        console.log("An Error Occured While Saving A New Category", error.message);
        return { "error": error.message }
    }
}

export const getAllProducts = async () => {
    if(!dbConnection) await init();
    
    try {
        const collection = await database?.collection("products");

        if(!database || !collection){
            console.log("Failed To Get Products");
            return;
        }

        const allCategories = await collection.find({})
            .map((category:any) => ({ ...category, _id: category._id.toString() }))
            .toArray();
        return allCategories;
    }
    catch(error:any){
        console.log("An Error Occured... ", error.message);
        return {"error": error.message}
    }
}

export const getAllProductsByCategory = async (categoryName: string) => {
    if(!dbConnection) await init();

    try{
        const collection = await database?.collection("products");

        if(!database || !collection){
            console.log("Failed To Get Products");
            return;
        }

        const products = await collection.find({ "category": categoryName})
            .map((products: any) => ({ ...products, id: products._id.toString() }))
            .toArray();
        return products;
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return {
            "error" : error.message
        };
    }
}

export const getProductById = async (_id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("products");

        if (!collection) {
            console.error("Failed To Get Products");
            return;
        }

        const product = await collection.findOne({ _id: new ObjectId(_id) });

        if (product) {
            return {
                ...product,
            };
        }

        return null;
    } catch (error: any) {
        console.error("An Error Occurred: ", error.message);
        return { error: error.message };
    }
};


export const updateProduct = async (_id: string, formData: FormData) => {
    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        image: null,
        category: formData.get("category"),
        quantity: formData.get("quantity"),
        updatedAt: new Date()
    };

    if(!dbConnection) await init ();

    let result;

    try{
        const collection = await database?.collection("products");
        if(!database || !collection){
            console.log("Failed To Get Products");
            return;
        }

        result = await collection.updateOne({"_id": new ObjectId(_id)}, {$set: data});
        revalidatePath('/dashboard/products');
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }

    if(result){
        return redirect('/dashboard/products');
    }
}

export const updateProductStatus = async (_id: string, newStatus: string) => {
    if(!dbConnection) await init();

    let result;

    try{
        const collection = await database?.collection("products");

        if(!collection || !database){
            console.log("Failed To Get Products");
            return;
        }

        result = await collection.updateOne({ "_id": new ObjectId(_id)}, { $set: { status: newStatus}});
        revalidatePath('/dashboard/products');
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }

    if(result){
        return redirect('/dashboard/products');
    }
}

export const saveNewProductRating = async (formData: FormData) => {
    if (!dbConnection) await init();

    try {
        const productsCollection = database?.collection("products");
        const ratingsCollection = database?.collection("ratings");
        const ordersCollection = database?.collection("orders");

        const productName = formData.get("productName") as string;
        const userEmail = formData.get("userEmail") as string;
        const rating = Number(formData.get("rating"));
        const title = formData.get("title");
        const comment = formData.get("comment");

        if (!productsCollection || !ratingsCollection || !ordersCollection) {
            throw new Error("Failed to get necessary collections");
        }

        
        const product = await productsCollection.findOne({ "name": productName });

        if (!product) {
            throw new Error("Product not found");
        }

        // Log the values for debugging
        console.log("Checking if the user has purchased the product...");
        console.log("Product Name:", productName);
        console.log("User Email:", userEmail);

        // Refined query to check if the user has purchased the product
        const userOrder = await ordersCollection.findOne({
            userEmail: userEmail,
            "cartSummary.items": {
                $elemMatch: { name: productName }, // Ensure this matches the structure
            },
        });

        // Debug logging
        console.log("Found user order:", userOrder);

        if (!userOrder) {
            console.error("Debug: No order found for the user with productId", {
                productName: productName,
                userEmail,
            });
            throw new Error("You must purchase the product before rating it");
        }

        // Update product ratings
        const newRatingsCount = (product.ratingsCount ?? 0) + 1;
        const previousOverallRating = isNaN(product.ratings) ? 0 : product.ratings;
        const newOverallRating = ((previousOverallRating * (product.ratingsCount ?? 0)) + rating) / newRatingsCount;

        const updateResult = await productsCollection.updateOne(
            { "name": productName },
            {
                $set: {
                    ratings: newOverallRating,
                    ratingsCount: newRatingsCount
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            throw new Error("Failed to update product ratings");
        }

        // Insert the rating into the ratings collection
        await ratingsCollection.insertOne({
            productId: productName,
            userEmail: userEmail,
            rating,
            title,
            comment,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error: any) {
        console.error("An Error Occurred: ", error.message);
        return { error: error.message };
    }
};

export const getProductCount = async () => {
    if(!dbConnection) await init();

    try{
        const collection = database?.collection("products");
        if(!database || !collection){
            console.log("Failed To Get Products");
            return { count: 0 };
        }

        const count = await collection.countDocuments({});
        return { count };
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}

export const getAllRatingsByProductId = async ( productId: string ) =>{
    if(!dbConnection) await init();
    
    try{
        const collection = database?.collection("ratings");

        if(!database || !collection){
            console.log("Failed To Get Product Ratings");
            return { error: "Failed To Get Product Ratings"};
        }

        const ratings = await collection.find({ productId: productId })
            .map((rating: any) => ({...rating, _id: rating._id.toString()})).toArray();
        
        return ratings;
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}

export const getProductByName = async (productName: string) => {
    if(!dbConnection) await init();

    try{
        const collection = database?.collection("products");
        if(!database || !collection){
            console.log("Failed To Get Product Name");
            return {error: "Failed To Get Product Name"};
        }

        const result = await collection.find({ $or: 
            [
                { productName: {$regex: productName, $options: "i"}},
                { category: {$regex: productName, $options: "i"}}
            ]
        }).map((product: any) => ({ ...product, _id: product._id.toString() })).toArray();

        return result;
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}

export const getUserRatingCount = async (userEmail: string, productId: string) => {
    if(!dbConnection) await init();

    try{
        const collection = database?.collection("ratings");
        if(!database || !collection){
            console.log("Failed To Get Product Ratings");
            return { error: "Failed To Get Product Ratings"};
        }

        const ratingCount = await collection.countDocuments({userEmail: userEmail, productId: new ObjectId(productId)});
        return ratingCount;
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}

export const getProductsByFilters = async (
    size?: string[],
    color?: string[],
    category?: string,
    priceRange?: { min: number; max: number }
) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("products");

        if (!database || !collection) {
            console.log("Failed To Get Products");
            return { error: "Failed To Get Products" };
        }

        // Build the query object
        const query: any = {};

        if (size && size.length > 0) {
            query.size = { $in: size };
        }

        if (color && color.length > 0) {
            query.color = { $in: color };
        }

        if (category) {
            query.category = category;
        }

        if (priceRange) {
            query.price = { $gte: priceRange.min, $lte: priceRange.max };
        }

        // Fetch the filtered products
        const products = await collection.find(query)
            .map((product: any) => ({ ...product, _id: product._id.toString() }))
            .toArray();

        return products;
    } catch (error: any) {
        console.log("An Error Occurred... ", error.message);
        return { error: error.message };
    }
}

export const getLatestProducts = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("products");

        if (!database || !collection) {
            console.log("Failed To Get Products");
            return { error: "Failed to get products from database" };
        }

        const oneMonthAgo = subDays(new Date(), 30); // Get the date 30 days ago

        // Find products created within the last month
        const latestProducts = await collection
            .find({ createdAt: { $gte: oneMonthAgo } })
            .map((product: any) => ({ ...product, _id: product._id.toString() }))
            .toArray();

        return latestProducts;
    } catch (error: any) {
        console.log("An Error Occurred... ", error.message);
        return { error: error.message };
    }
};
