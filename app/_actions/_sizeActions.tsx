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

export const getAllSizes = async () => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("sizes");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const allSizes = await collection
      .find({})
      .map((size: any) => ({ ...size, _id: size._id.toString() }))
      .toArray();
    return allSizes;
  } catch (error: any) {
    console.log("An error occurred...", error.message);
    return { error: error.message };
  }
};

export const getSizeByName = async (sizeName: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("sizes");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const size = await collection
      .find({ "name": sizeName })
      .map((size: any) => ({ ...size, _id: size._id.toString() }))
      .toArray();
    return size;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};

export const deleteOneSize = async (_id: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("sizes");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const deleted = await collection
      .deleteOne({ "_id": new ObjectId(_id) })
    revalidatePath('/dashboard/sizes')
    return deleted;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};


export const updateSize = async (_id: string, newName: string) => {
  if (!dbConnection) await init();

  try {

    const collection = await database?.collection("sizes");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const updated = await collection
      .updateOne({ "_id": new ObjectId(_id) }, { $set: { "name": newName } })
    revalidatePath('/dashboard/sizes')
    return updated;
  } catch (error: any) {
    console.log("An error occured...", error.message);
    return { error: error.message };
  }
};

export const saveNewSize = async (formData: FormData) => {
  const data = {
    name: formData.get("sizeName"),
  };

  if (!dbConnection) await init();

  try {
    const collection = await database.collection("sizes");

    if (!collection || !database) {
      return { error: "Faled to connect to collection!!" };
    }
    const newSize = await collection.insertOne(data);
    revalidatePath('/dashboard/sizes')
    return { "sizeID": newSize }
  } catch (error: any) {
    console.log("An error occured saving new size:", error.message);
    return { "error": error.message }
  }
};

const seedSizes = async () => {
  const initialSizes = [
    { name: "XL",},
    { name: "L",},
    { name: "M",},
    { name: "Sm",},
    { name: "Xs"},
  ];

  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("sizes");
    
    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(initialSizes);
      console.log("Seeded initial sizes.");
    } else {
      console.log("Sizes collection already populated.");
    }
  } catch (error: any) {
    console.log("An error occurred seeding sizes:", error.message);
  }
};

// Run the seed function (you can call this from an appropriate place)
seedSizes();

