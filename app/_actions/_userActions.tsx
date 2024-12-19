"use server"

import { connectToDB } from "../_database/database";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("pawreedy");
}

export const saveNewUser = async (formData: FormData) => {

    const password = formData.get("userPassword") as string
    const hashedPassword = await bcrypt.hash(password, 10)
    let newUser

    const data = {
        email: formData.get("userEmail"),
        name: formData.get("name"),
        surname: formData.get("userSurname"),
        othernames: formData.get("userOtherNames"),
        phoneNumber: formData.get("userPhoneNumber"),
        password: hashedPassword
    }

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("users");

        if (!collection || !database) {
            return { error: "Faled to connect to collection!!" };
        }


        newUser = await collection.insertOne(data);

        if (newUser) {
            newUser = { ...newUser, insertedId: newUser.insertedId.toString() }
        }

    } catch (error: any) {
        console.log("An error occured saving new user:", error.message);
        return { "error": error.message }
    }

    if (newUser) {
        redirect("/sign-in")
    }

    return newUser

}
export const createNewUserFromClerk = async (user: any) => {

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("users");

        if (!collection || !database) {
            return { error: "Faled to connect to collection!!" };
        }


        const newUser = await collection.insertOne(user);

        return newUser

    } catch (error: any) {
        console.log("An error occured saving new user:", error.message);
        return { "error": error.message }
    }

}

export const getUserByEmail = async (email: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection...");
            return { error: "Failed to connect to users collection" };
        }

        const user = await collection.findOne({ email });

        if (user) {
            return { firstName: user.firstName, lastName: user.lastName, photo: user.photo || "/default-profile.jpg" };
        }

        return { error: "User not found" };
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
};


export const getAllUsers = async () => {
    if (!dbConnection) await init();

    try {

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return;
        }

        const result = await collection
            .find({})
            .map((user: any) => ({ ...user, _id: user._id.toString() }))
            .toArray();
        return result;
    } catch (error: any) {
        console.log("An error occured getting all users...", error.message);
        return { "error": error.message };
    }

}
const deleteUserFromMongoDB = async (clerkId: string) => {
    if (!dbConnection) await init();

    try {

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return;
        }

        const result = await collection.deleteOne({ clerkId: clerkId })
        console.log("User deleted from MongoDB");


        return result;
    } catch (error: any) {
        console.log("An error occured getting all users...", error.message);
        return { "error": error.message };
    }

}

const updateUserRoleInMongoDB = async (clerkId: string, newRole: string) => {
    if (!dbConnection) await init();

    try {

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return;
        }

        const result = await collection.updateOne({ clerkId: clerkId }, { $set: { role: newRole } })
        console.log("User role updated");


        return result;
    } catch (error: any) {
        console.log("An error occured updating user role...", error.message);
        return { "error": error.message };
    }

}

export async function setUserRole(userId: string, newRole: string) {
    try {
        const res = await clerkClient.users.updateUser(
            userId,
            {
                publicMetadata: { role: newRole },
            }
        );
        return { message: res.publicMetadata };
    } catch (err) {
        return { message: err };
    }
}

export const deleteUser = async (_clerkId: string) => {
    try {
        const mongodb = await deleteUserFromMongoDB(_clerkId)
        const response = await clerkClient.users.deleteUser(_clerkId);

        revalidatePath("/dashboard/users")

        return JSON.stringify(response)
    } catch (error: any) {
        //console.log(error);
        return {
            error: JSON.stringify(error)
        }
    }
}

export const updateUserRole = async (_clerkId: string, _newRole: string) => {


    try {
        const res = await clerkClient.users.updateUser(
            _clerkId,
            {
                publicMetadata: { role: _newRole },
            }
        );
        await updateUserRoleInMongoDB(_clerkId, _newRole)

        revalidatePath('/dashboard/users')

        return { message: res.publicMetadata };
    } catch (err) {
        return { message: err };
    }

}

export const getUsersCount = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return { count: 0 };
        }

        const count = await collection.countDocuments({});
        return { count };
    } catch (error: any) {
        console.log("An error occurred getting users count...", error.message);
        return { error: error.message };
    }
};

export const getUserByRole = async (role: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return;
        }

        const user = await collection.findOne({ role });

        if (user) {
            return { ...user, _id: user._id.toString() };
        }
        return null; // Return null if no user found
    } catch (error: any) {
        console.log("An error occurred while fetching user by role:", error.message);
        return { error: error.message };
    }
};
export const updateUserProfilePictureInMongoDB = async (clerkId: string, profilePictureUrl: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return;
        }

        const result = await collection.updateOne(
            { clerkId },
            { $set: { profilePicture: profilePictureUrl } }
        );
        console.log("User profile picture updated in MongoDB.");
        return result;
    } catch (error: any) {
        console.log("An error occurred updating user profile picture...", error.message);
        return { error: error.message };
    }
};
export const updateClerkUserProfilePicture = async (userId: string, profilePictureUrl: string) => {
    try {
        const res = await clerkClient.users.updateUser(userId, {
            profileImageID: profilePictureUrl,
        });
        return { message: "Profile picture updated successfully", data: res };
    } catch (error: any) {
        console.error("Error updating Clerk profile picture:", error.message);
        return { error: error.message };
    }
};


export const updateUserProfilePicture = async (clerkId: string, profilePictureUrl: string) => {
    try {
        await updateClerkUserProfilePicture(clerkId, profilePictureUrl);
        await updateUserProfilePictureInMongoDB(clerkId, profilePictureUrl);
        revalidatePath("/dashboard/users"); // Revalidate your page
        return { message: "Profile picture updated successfully" };
    } catch (error: any) {
        console.error("Error updating user profile picture:", error.message);
        return { error: error.message };
    }
};
