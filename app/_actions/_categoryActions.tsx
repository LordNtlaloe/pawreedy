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
    subcategories: [
      { name: "Dog Food" },
      { name: "Cat Food" },
      { name: "Bird Food" },
      { name: "Fish Food" },
      { name: "Small Animal Food" },
      { name: "Reptile Food" },
      { name: "Treats and Snacks" },
    ],
  },
  {
    name: "Toys",
    icon: "https://img.freepik.com/free-photo/flat-lay-pile-colorful-weights_23-2148523275.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Dog Toys" },
      { name: "Cat Toys" },
      { name: "Bird Toys" },
      { name: "Small Animal Toys" },
      { name: "Chew Toys" },
      { name: "Interactive Toys" },
    ],
  },
  {
    name: "Grooming Supplies",
    icon: "https://img.freepik.com/free-photo/close-up-dog-accessories_23-2150959988.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Shampoos and Conditioners" },
      { name: "Brushes and Combs" },
      { name: "Nail Clippers" },
      { name: "Ear and Eye Care" },
      { name: "Dental Care" },
    ],
  },
  {
    name: "Beds and Furniture",
    icon: "https://img.freepik.com/free-photo/outdoor-with-circle-chair_1339-5459.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Pet Beds" },
      { name: "Cat Trees and Scratching Posts" },
      { name: "Cages and Habitats" },
      { name: "Fish Tanks and Aquariums" },
    ],
  },
  {
    name: "Clothing and Accessories",
    icon: "https://img.freepik.com/free-photo/set-dog-food-clothes_23-2147828992.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Pet Clothing" },
      { name: "Collars and Leashes" },
      { name: "Harnesses" },
      { name: "ID Tags" },
      { name: "Seasonal Costumes" },
    ],
  },
  {
    name: "Health and Wellness",
    icon: "https://img.freepik.com/free-photo/still-life-refillable-reusable-container_23-2150936061.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Vitamins and Supplements" },
      { name: "Flea and Tick Treatments" },
      { name: "Medications" },
      { name: "First Aid Kits" },
      { name: "Dental Health Products" },
    ],
  },
  {
    name: "Training and Behavior",
    icon: "https://img.freepik.com/free-photo/dog-stuff-composition_23-2147799888.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Training Treats" },
      { name: "Training Collars and Leashes" },
      { name: "Bark Control Devices" },
      { name: "Litter Boxes and Training Pads" },
    ],
  },
  {
    name: "Travel and Outdoor Gear",
    icon: "https://img.freepik.com/free-photo/adorable-dalmatian-dog-with-muzzle-outdoors_23-2149198350.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Carriers and Crates" },
      { name: "Travel Bowls and Water Bottles" },
      { name: "Pet Strollers" },
      { name: "Seat Covers and Travel Accessories" },
    ],
  },
  {
    name: "Feeding Supplies",
    icon: "https://img.freepik.com/free-photo/top-view-pet-accessories_23-2150930416.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Food and Water Bowls" },
      { name: "Automatic Feeders" },
      { name: "Water Dispensers" },
      { name: "Feeding Mats" },
    ],
  },
  {
    name: "Cleaning and Waste Management",
    icon: "https://img.freepik.com/free-photo/pet-accessories-still-life-concept-with-grooming-objects-food_23-2148949582.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Litter and Litter Boxes" },
      { name: "Poop Bags and Scoopers" },
      { name: "Cage Cleaners" },
      { name: "Odor Control Products" },
    ],
  },
  {
    name: "Cages",
    icon: "https://img.freepik.com/free-photo/beautiful-pet-portrait-small-dog-with-cage_23-2149218436.jpg?semt=ais_hybrid",
    subcategories: [
      { name: "Cages" },
      { name: "Perches and Stands" },
      { name: "Bird Baths" },
      { name: "Feeding Accessories" },
    ],
  },
];

// Seed Categories Function
export const seedCategories = async () => {
  if (!dbConnection) await init();

  try {
    const collection = await database.collection("categories");

    if (!collection || !database) {
      return { error: "Failed to connect to the collection!!" };
    }

    // Insert many categories
    const result = await collection.insertMany(categories);
    console.log(`Seeded ${result.insertedCount} categories successfully.`);
    return { success: true, count: result.insertedCount };
  } catch (error: any) {
    console.log("An error occurred seeding categories:", error.message);
    return { error: error.message };
  }
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
      .map((category: any) => ({
        ...category,
        _id: category._id.toString(),
        subcategories: category.subcategories || [],
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
        subcategories: category.subcategories || [],
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

// Save a new category with subcategories (optional)
export const saveNewCategory = async (formData: FormData) => {
  const data = {
    name: formData.get("categoryName"),
    icon: formData.get("iconURL"),
    subcategories: formData.getAll("subcategories") || [],
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

(async () => {
  await seedCategories();
})();