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

export const getAllColors = async () => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("colors");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const allColors = await collection
      .find({})
      .map((color: any) => ({ ...color, _id: color._id.toString() }))
      .toArray();
    return allColors;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};

export const getColorByName = async (colorName: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("colors");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const color = await collection
      .find({ "name": colorName })
      .map((color: any) => ({ ...color, _id: color._id.toString() }))
      .toArray();
    return color;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};

export const deleteOneColor = async (_id: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("colors");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const deleted = await collection
      .deleteOne({ "_id": new ObjectId(_id) })
    revalidatePath('/dashboard/colors')
    return deleted;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};


export const updateColor = async (_id: string, newName: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("colors");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const updated = await collection
      .updateOne({ "_id": new ObjectId(_id) }, { $set: { "name": newName } })
    revalidatePath('/dashboard/colors')
    return updated;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};

export const saveNewColor = async (formData: FormData) => {
  const data = {
    name: formData.get("colorName"),
    icon: formData.get("iconURL")
  };

  if (!dbConnection) await init();

  try {
    const collection = await database.collection("colors");

    if (!collection || !database) {
      return { error: "Faled to connect to collection!!" };
    }
    const newColor = await collection.insertOne(data);
    revalidatePath('/dashboard/colors')
    return { "colorID": newColor }
  } catch (error: any) {
    console.log("An error occured saving new color:", error.message);
    return { "error": error.message }
  }
};

