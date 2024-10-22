"use server";

import { ObjectId } from "mongodb";
import { connectToDB } from "../_database/database";
import { revalidatePath } from "next/cache";

let dbConnection: any;
let database: any;

const init = async () => {
  const connection = await connectToDB();
  dbConnection = connection;
  database = await dbConnection?.db("pawreedy");
};

// Get all colors
export const getAllColors = async () => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("colors");

    if (!database || !collection) {
      console.log("Failed to connect to collection.");
      return;
    }

    const allColors = await collection
      .find({})
      .map((color: any) => ({ ...color, _id: color._id.toString() }))
      .toArray();
    return allColors;
  } catch (error: any) {
    console.log("An error occurred:", error.message);
    return { error: error.message };
  }
};

// Get a color by name
export const getColorByName = async (colorName: string) => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("colors");

    if (!database || !collection) {
      console.log("Failed to connect to collection.");
      return;
    }

    const color = await collection
      .find({ name: colorName })
      .map((color: any) => ({ ...color, _id: color._id.toString() }))
      .toArray();
    return color;
  } catch (error: any) {
    console.log("An error occurred:", error.message);
    return { error: error.message };
  }
};

// Delete a color by _id
export const deleteOneColor = async (_id: string) => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("colors");

    if (!database || !collection) {
      console.log("Failed to connect to collection.");
      return;
    }

    const deleted = await collection.deleteOne({ _id: new ObjectId(_id) });
    revalidatePath("/dashboard/colors");
    return deleted;
  } catch (error: any) {
    console.log("An error occurred:", error.message);
    return { error: error.message };
  }
};

// Update a color by _id
export const updateColor = async (_id: string, newName: string) => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("colors");

    if (!database || !collection) {
      console.log("Failed to connect to collection.");
      return;
    }

    const updated = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { name: newName } }
    );
    revalidatePath("/dashboard/colors");
    return updated;
  } catch (error: any) {
    console.log("An error occurred:", error.message);
    return { error: error.message };
  }
};

// Save a new color
export const saveNewColor = async (formData: FormData) => {
  const data = {
    name: formData.get("colorName"),
  };

  if (!dbConnection) await init();

  try {
    const collection = await database.collection("colors");

    if (!collection || !database) {
      return { error: "Failed to connect to collection!" };
    }
    const newColor = await collection.insertOne(data);
    revalidatePath("/dashboard/colors");
    return { colorID: newColor.insertedId };
  } catch (error: any) {
    console.log("An error occurred saving new color:", error.message);
    return { error: error.message };
  }
};

// Seed database with basic colors
export const seedColors = async () => {
  if (!dbConnection) await init();

  const basicColors = [
    { name: "Red" },
    { name: "Blue" },
    { name: "Green" },
    { name: "Black" },
    { name: "White" },
    { name: "Yellow" },
    { name: "Gray" },
    { name: "Purple" },
    { name: "Pink" },
  ];

  try {
    const collection = await database.collection("colors");

    // Check if collection already has data
    const existingColors = await collection.find({}).toArray();
    if (existingColors.length > 0) {
      console.log("Colors collection already seeded.");
      return { message: "Colors collection already seeded." };
    }

    const result = await collection.insertMany(basicColors);
    revalidatePath("/dashboard/colors");
    console.log("Colors seeded successfully:", result.insertedCount);
    return { message: "Colors seeded successfully." };
  } catch (error: any) {
    console.log("An error occurred while seeding colors:", error.message);
    return { error: error.message };
  }
};
