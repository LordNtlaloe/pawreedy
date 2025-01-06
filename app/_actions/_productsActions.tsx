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
    } catch (error: any) {
        console.error("Failed to connect to the database:", error.message);
    }
}

export const saveNewProduct = async (formData: FormData) => {
    // Convert form data into the expected fields
    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        category: formData.get("category"),
        quantity: formData.get("quantity"),
        ratings: 0,
        ratingsCount: 0,
        status: "In Stock",
        createdAt: new Date(),
        updatedAt: new Date(),
        features: JSON.parse(formData.get("features") as string || "[]"),
        colors: JSON.parse(formData.get("colors") as string || "[]"),
        sizes: JSON.parse(formData.get("sizes") as string || "[]"),
        images: formData.getAll("images") as string[]
    };

    // data.features = data.features.length > 0 ? data.features : [];
    // data.colors = data.colors.length > 0 ? data.colors : [];
    // data.sizes = data.sizes.length > 0 ? data.sizes : [];
    // data.images = data.images.length > 0 ? data.images : [];


    if (!dbConnection) await init();

    try {
        const collection = await database.collection("products");
        if (!collection || !database) {
            return { error: "Failed To Get Products From Database" };
        }
        const newCategory = await collection.insertOne(data);
        revalidatePath('/dashboard/products');
        return { "productId": newCategory };
    }
    catch (error: any) {
        console.log("An Error Occurred While Saving A New Category", error.message);
        return { "error": error.message };
    }
}



export const getAllProducts = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("products");

        if (!database || !collection) {
            console.log("Failed To Get Products");
            return;
        }

        const allCategories = await collection.find({})
            .map((category: any) => ({ ...category, _id: category._id.toString() }))
            .toArray();
        return allCategories;
    }
    catch (error: any) {
        console.log("An Error Occured... ", error.message);
        return { "error": error.message }
    }
}

export const getAllProductsCount = async () => {
    if (!dbConnection) {
        console.error("Database connection not initialized.");
        await init();
    }

    try {
        const collection = await database?.collection("products");

        if (!database || !collection) {
            console.error("Failed to connect to the products collection.");
            return { success: false, error: "Failed to connect to the products collection" };
        }

        const allProducts = await collection.find({}).toArray();

        if (!allProducts || allProducts.length === 0) {
            console.warn("No products found in the database.");
            return { success: true, totalProducts: 0, totalQuantity: 0 };
        }

        const totalQuantity = allProducts.reduce(
            (sum: number, product: any) => sum + (product.quantity || 0),
            0
        );

        return { success: true, totalProducts: allProducts.length, totalQuantity };
    } catch (error: any) {
        console.error("An Error Occurred:", error.message);
        return { success: false, error: error.message };
    }
};


export const getAllProductsByCategory = async (categoryName: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("products");

        if (!database || !collection) {
            console.log("Failed To Get Products");
            return;
        }

        const products = await collection.find({ "category": categoryName })
            .map((products: any) => ({ ...products, id: products._id.toString() }))
            .toArray();
        return products;
    }
    catch (error: any) {
        console.log("An Error Occured... ", error.message);
        return {
            "error": error.message
        };
    }
}


export const getProductById = async (_id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("products");

        if (!collection) {
            console.error("Failed to get the product: Collection is missing");
            return null;
        }

        const product = await collection.findOne({ _id: new ObjectId(_id) });

        console.log("Fetched Product:", product); // Debugging log

        if (product) {
            return {
                _id: product._id.toString(), // Convert _id to string
                name: product.name || "",
                description: product.description || "",
                price: product.price ? Number(product.price) : 0,
                category: product.category || "",
                quantity: product.quantity ? Number(product.quantity) : 0,
                ratings: product.ratings ? Number(product.ratings) : 0,
                ratingsCount: product.ratingsCount ? Number(product.ratingsCount) : 0,
                status: product.status || "",
                createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : "",
                updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : "",
                features: Array.isArray(product.features) ? product.features : [],
                colors: Array.isArray(product.colors) ? product.colors : [],
                sizes: Array.isArray(product.sizes) ? product.sizes : [],
                images: Array.isArray(product.images) ? product.images : [],
            };
        }

        return null;
    } catch (error) {
        console.error("Error in fetching product: ", error);
        return null;
    }
};





export const updateProduct = async (_id: string, formData: FormData) => {
    const data: any = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        category: formData.get("category"),
        quantity: formData.get("quantity"),
        sizes: (formData.get("sizes") as string)?.split(","),
        colors: (formData.get("colors") as string)?.split(","),
        updatedAt: new Date(),
    };

    // Handle image upload if a new image is provided
    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        uploadData.append("upload_preset", "pawreedy");

        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dvbcqdbfa/image/upload",
                { method: "POST", body: uploadData }
            );
            const result = await response.json();
            if (result.secure_url) {
                data.image = result.secure_url;
            } else {
                console.log("Image upload failed.");
            }
        } catch (error: any) {
            console.log("Error uploading image:", error.message);
            return { error: "Image upload failed." };
        }
    }

    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("products");
        if (!database || !collection) {
            console.log("Failed to connect to the products collection.");
            return;
        }

        const result = await collection.updateOne({ "_id": new ObjectId(_id) }, { $set: data });
        revalidatePath("/dashboard/products");

        if (result.modifiedCount > 0) {
            return redirect("/dashboard/products");
        } else {
            console.log("No documents were updated.");
            return { error: "Update failed." };
        }
    } catch (error: any) {
        console.log("An error occurred during the update:", error.message);
        return { error: error.message };
    }
};


export const updateProductStatus = async (_id: string, newStatus: string) => {
    if (!dbConnection) await init();

    let result;

    try {
        const collection = await database?.collection("products");

        if (!collection || !database) {
            console.log("Failed To Get Products");
            return;
        }

        result = await collection.updateOne({ "_id": new ObjectId(_id) }, { $set: { status: newStatus } });
        revalidatePath('/dashboard/products');
    }
    catch (error: any) {
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }

    if (result) {
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
    if (!dbConnection) await init();

    try {
        const collection = database?.collection("products");
        if (!database || !collection) {
            console.log("Failed To Get Products");
            return { count: 0 };
        }

        const count = await collection.countDocuments({});
        return { count };
    }
    catch (error: any) {
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}

export const getAllRatingsByProductId = async (productId: string) => {
    if (!dbConnection) await init();

    try {
        const collection = database?.collection("ratings");

        if (!database || !collection) {
            console.log("Failed To Get Product Ratings");
            return { error: "Failed To Get Product Ratings" };
        }

        const ratings = await collection.find({ productId: productId })
            .map((rating: any) => ({ ...rating, _id: rating._id.toString() })).toArray();

        return ratings;
    }
    catch (error: any) {
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}

export const getProductByName = async (productName: string) => {
    if (!dbConnection) await init();

    try {
        const collection = database?.collection("products");
        if (!database || !collection) {
            console.log("Failed To Get Product Name");
            return { error: "Failed To Get Product Name" };
        }

        const result = await collection.find({
            $or:
                [
                    { productName: { $regex: productName, $options: "i" } },
                    { category: { $regex: productName, $options: "i" } }
                ]
        }).map((product: any) => ({ ...product, _id: product._id.toString() })).toArray();

        return result;
    }
    catch (error: any) {
        console.log("An Error Occured... ", error.message);
        return { "error ": error.message }
    }
}

export const getUserRatingCount = async (userEmail: string, productId: string) => {
    if (!dbConnection) await init();

    try {
        const collection = database?.collection("ratings");
        if (!database || !collection) {
            console.log("Failed To Get Product Ratings");
            return { error: "Failed To Get Product Ratings" };
        }

        const ratingCount = await collection.countDocuments({ userEmail: userEmail, productId: new ObjectId(productId) });
        return ratingCount;
    }
    catch (error: any) {
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

export const getSalesDataByProduct = async (productName: string) => {
    if (!dbConnection) await init();

    try {
        const ordersCollection = database?.collection("orders");
        if (!ordersCollection) {
            console.log("Failed To Get Orders Collection");
            return { error: "Failed to get orders collection" };
        }

        // Fetch orders containing the product
        const orders = await ordersCollection.aggregate([
            { $unwind: "$cartSummary.items" },
            { $match: { "cartSummary.items.name": productName } },
            {
                $group: {
                    _id: { product: "$cartSummary.items.name", month: { $month: "$createdAt" } },
                    totalSales: { $sum: "$cartSummary.items.quantity" }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]).toArray();

        return orders;
    } catch (error: any) {
        console.log("An Error Occurred...", error.message);
        return { error: error.message };
    }
};

export const updateProductQuantity = async (_id: string, newQuantity: number) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("products");

        if (!collection || !database) {
            console.log("Failed to connect to the products collection.");
            return { error: "Failed to connect to the products collection." };
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { quantity: newQuantity, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            console.log("No matching product found to update.");
            return { error: "No matching product found." };
        }

        revalidatePath('/dashboard/products');
        return { success: true };
    } catch (error: any) {
        console.error("An error occurred while updating product quantity:", error.message);
        return { error: error.message };
    }
};
