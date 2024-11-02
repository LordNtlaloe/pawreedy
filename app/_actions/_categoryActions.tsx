"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { connectToDB } from "../_database/database";

let dbConnection: any;
let database: any;

const init = async () => {
  const connection = await connectToDB();
  dbConnection = connection;
  database = await dbConnection?.db("pawreedy");
};

// Seed Data
const categories = [
  {
    name: "Pet Food",
    icon: "https://img.freepik.com/free-photo/pet-accessories-still-life-concept-with-food-bowl_23-2148949576.jpg?semt=ais_hybrid",
  },
  {
    name: "Toys",
    icon: "https://img.freepik.com/free-photo/flat-lay-pile-colorful-weights_23-2148523275.jpg?semt=ais_hybrid",
  },
  {
    name: "Grooming Supplies",
    icon: "https://img.freepik.com/free-photo/close-up-dog-accessories_23-2150959988.jpg?semt=ais_hybrid",
  },
  {
    name: "Beds and Furniture",
    icon: "https://img.freepik.com/free-photo/outdoor-with-circle-chair_1339-5459.jpg?semt=ais_hybrid",
  },
  {
    name: "Clothing and Accessories",
    icon: "https://img.freepik.com/free-photo/set-dog-food-clothes_23-2147828992.jpg?semt=ais_hybrid",
  },
  {
    name: "Health and Wellness",
    icon: "https://img.freepik.com/free-photo/still-life-refillable-reusable-container_23-2150936061.jpg?semt=ais_hybrid",
  },
  {
    name: "Training and Behavior",
    icon: "https://img.freepik.com/free-photo/dog-stuff-composition_23-2147799888.jpg?semt=ais_hybrid",
  },
  {
    name: "Travel and Outdoor Gear",
    icon: "https://img.freepik.com/free-photo/adorable-dalmatian-dog-with-muzzle-outdoors_23-2149198350.jpg?semt=ais_hybrid",
  },
  {
    name: "Feeding Supplies",
    icon: "https://img.freepik.com/free-photo/top-view-pet-accessories_23-2150930416.jpg?semt=ais_hybrid",
  },
  {
    name: "Cleaning and Waste Management",
    icon: "https://img.freepik.com/free-photo/pet-accessories-still-life-concept-with-grooming-objects-food_23-2148949582.jpg?semt=ais_hybrid",
  },
  {
    name: "Cages",
    icon: "https://img.freepik.com/free-photo/beautiful-pet-portrait-small-dog-with-cage_23-2149218436.jpg?semt=ais_hybrid",
  },
];

// Function to find duplicate category names
const findDuplicates = (array: { name: string }[]) => {
  const names = array.map(item => item.name);
  const nameCount: { [key: string]: number } = {};
  const duplicates: string[] = [];

  names.forEach(name => {
    nameCount[name] = (nameCount[name] || 0) + 1;
    if (nameCount[name] === 2) {
      duplicates.push(name); // Only add the name the first time it is found to be a duplicate
    }
  });

  return duplicates;
};

// Seed Categories Function
// Seed Categories Function
export const seedCategories = async () => {
  if (!dbConnection) await init();

  try {
    const collection = await database.collection("categories");

    if (!collection || !database) {
      return { error: "Failed to connect to the collection!!" };
    }

    // Check for existing categories in the database
    const existingCategories = await collection.find({}).toArray();
    const existingNames = new Set(existingCategories.map((cat: { name: any; }) => cat.name));

    let categoriesToInsert = categories.filter(category => !existingNames.has(category.name));

    if (categoriesToInsert.length === 0) {
      console.log("All categories already exist. Seeding terminated.");
      return { success: true, count: 0 }; // No new categories to insert
    }

    // Insert only new categories
    const result = await collection.insertMany(categoriesToInsert);
    console.log(`Seeded ${result.insertedCount} new categories successfully.`);
    return { success: true, count: result.insertedCount };
  } catch (error: any) {
    console.log("An error occurred seeding categories:", error.message);
    return { error: error.message };
  }
};

// Immediately seed categories
(async () => {
  await seedCategories();
})();

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
      .map((category: any) => ({
        ...category,
        _id: category._id.toString(),
      }))
      .toArray();
    return allCategories;
  } catch (error: any) {
    console.log("An error occurred...", error.message);
    return { error: error.message };
  }
};

// Fetch a category by name
export const getCategoryByName = async (categoryName: string) => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("categories");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const category = await collection
      .find({ name: categoryName })
      .map((category: any) => ({
        ...category,
        _id: category._id.toString(),
      }))
      .toArray();
    return category;
  } catch (error: any) {
    console.log("An error occurred...", error.message);
    return { error: error.message };
  }
};

// Delete a category by ID
export const deleteOneCategory = async (_id: string) => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("categories");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const deleted = await collection.deleteOne({ _id: new ObjectId(_id) });
    revalidatePath("/dashboard/categories");
    return deleted;
  } catch (error: any) {
    console.log("An error occurred...", error.message);
    return { error: error.message };
  }
};

// Update a category's name by ID
export const updateCategory = async (_id: string, newName: string) => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("categories");

    if (!database || !collection) {
      console.log("Failed to connect to collection..");
      return;
    }

    const updated = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { name: newName } }
    );
    revalidatePath("/dashboard/categories");
    return updated;
  } catch (error: any) {
    console.log("An error occurred...", error.message);
    return { error: error.message };
  }
};

export const saveNewCategory = async (formData: FormData) => {
  const data = {
    name: formData.get("categoryName"),
    icon: formData.get("iconURL"),
  };

  if (!dbConnection) await init();

  try {
    const collection = await database.collection("categories");

    if (!collection || !database) {
      return { error: "Failed to connect to collection!!" };
    }
    const newCategory = await collection.insertOne(data);
    revalidatePath("/dashboard/categories");
    return { categoryID: newCategory };
  } catch (error: any) {
    console.log("An error occurred saving new category:", error.message);
    return { error: error.message };
  }
};

// Immediately seed categories
(async () => {
  await seedCategories();
})();
