"use server"
import { revalidatePath } from "next/cache";
import { connectToDB } from "../_database/database";
import { ObjectId, MongoClient, Db } from "mongodb";
import { redirect } from "next/navigation";
import { error } from "console";

let dbConnection: MongoClient;
let database: Db;

const init = async () => {
    const connection = await connectToDB();
    if(!connection){
        throw new Error("Failed To Connect To The Database")
    }
    dbConnection = connection;
    database = await dbConnection?.db('');
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

export const saveNewProductRating = async ( formData: FormData ) => {
    if(!dbConnection) await init ();
    
    try{
        const productsCollection = database?.collection("products");
        const ratingsCollection = database?.collection("ratings");
        
        const productId = formData.get("productId") as string;
        const userID = formData.get("userId") as string;
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment");

        if(!database || !productsCollection){
            console.log("Failed To Get Products");
            return;
        }

        if(!ratingsCollection){
            console.log("Failed To Get Ratings");
            return;
        }

        const productObjectId = new ObjectId(productId);
        const product = await productsCollection.findOne( {"_id": productObjectId});
        if(product){
            console.log("Product Not Found");
            return { error: "Product Not Found" }
        }
    }
    catch(error: any){
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}