"use server";

import { ObjectId } from "mongodb";
import { connectToDB } from "../_database/database";
import { revalidatePath } from "next/cache";

let dbConnection: any;
let database: any

const init = async () => {
  const connection = await connectToDB();
  dbConnection = connection;
  database = await dbConnection?.db("pawreedy");
};

export const getAllCategories = async () => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("categories");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const allCategories = await collection
      .find({})
      .map((category: any) => ({ ...category, _id: category._id.toString() }))
      .toArray();
    return allCategories;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};

export const getCategoryByName = async (categoryName: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("categories");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const category = await collection
      .find({ "name": categoryName })
      .map((category: any) => ({ ...category, _id: category._id.toString() }))
      .toArray();
    return category;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};

export const deleteOneCategory = async (_id: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("categories");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const deleted = await collection
      .deleteOne({ "_id": new ObjectId(_id) })
    revalidatePath('/dashboard/categories')
    return deleted;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};


export const updateCategory = async (_id: string, newName: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("categories");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const updated = await collection
      .updateOne({ "_id": new ObjectId(_id) }, { $set: { "name": newName } })
    revalidatePath('/dashboard/categories')
    return updated;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};

export const saveNewCategory = async (formData: FormData) => {
  const data = {
    name: formData.get("categoryName"),
    icon: formData.get("iconURL")
  };

  if (!dbConnection) await init();

  try {
    const collection = await database.collection("categories");

    if (!collection || !database) {
      return { error: "Faled to connect to collection!!" };
    }
    const newCategory = await collection.insertOne(data);
    revalidatePath('/dashboard/categories')
    return { "categoryID": newCategory }
  } catch (error: any) {
    console.log("An error occured saving new category:", error.message);
    return { "error": error.message }
  }
};

