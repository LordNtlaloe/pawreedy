"use server"
import { revalidatePath } from "next/cache";
import { connectToDB } from "../_database/database";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("pawreedy")
}

export const saveNewProduct = async(formData: FormData) => {
    const userID = formData.get("userId") as string;
    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        image: formData.get("image"),
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

        const products = await collection.find({ "category ": categoryName})
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

export const getProductsById = async (_id: string) => {
    if(!dbConnection) await init();

    try{
        const collection = await database?.collection("products");

        if(!database || !collection){
            console.log("Failed To Get Products");
            return;
        }

        let product = await collection.findOne({ "_id": new ObjectId(_id) });

        if(product){
            product = { ...product, _id: product._id.toString() }
        }
        return product;
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}

export const updateProduct = async (_id: string, formData: FormData) => {
    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        image: formData.get("image"),
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

        const productId = formData.get("productId") as string;
        const userID = formData.get("userId") as string;
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment");

        if (!database || !productsCollection) {
            console.log("Failed To Get Products");
            return;
        }

        if (!ratingsCollection) {
            console.log("Failed To Get Ratings");
            return;
        }

        const productObjectId = new ObjectId(productId);
        const product = await productsCollection.findOne({ "_id": productObjectId });

        // Handle case where product is null
        if (!product) {
            console.log("Product Not Found");
            return { error: "Product Not Found" };
        }

        const newRatingsCount = (product.ratingsCount ?? 0) + 1;
        const previousOverallRating = isNaN(product.ratings) ? 0 : product.ratings;
        const newOverallRating = ((previousOverallRating * (product.ratingsCount ?? 0)) + rating) / newRatingsCount;

        const updateResult = await productsCollection.updateOne(
            { "_id": productObjectId },
            {
                $set: {
                    ratings: newOverallRating,
                    ratingsCount: newRatingsCount
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            console.log("Failed To Update Product Ratings");
            return { error: "Failed To Update Product Ratings" };
        }

        await ratingsCollection.insertOne({
            productId: productObjectId,
            userId: userID,
            rating,
            comment,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error: any) {
        console.log("An Error Occurred... ", error.message);
        return { "error ": error.message };
    }
}

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

        const ratings = await collection.find({ productId: new ObjectId(productId)})
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

export const getUserRatingCount = async (userId: string, businessId: string) => {
    if(!dbConnection) await init();

    try{
        const collection = database?.collection("ratings");
        if(!database || !collection){
            console.log("Failed To Get Product Ratings");
            return { error: "Failed To Get Product Ratings"};
        }

        const ratingCount = await collection.countDocuments({userId: userId, businessId: new ObjectId(businessId)});
        return ratingCount;
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}