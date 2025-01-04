// import { clerkClient } from "@clerk/nextjs/server";
// import { WebhookEvent } from "@clerk/nextjs/server";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import { Webhook } from "svix";
// import { createNewUserFromClerk } from "@/app/_actions/_userActions";


// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.SIGNING_SECRET;

//   if (!SIGNING_SECRET) {
//     throw new Error(
//       "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
//     );
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET);

//   // Get headers
//   const headerPayload = headers();
//   const svix_id = (await headerPayload).get("svix-id");
//   const svix_timestamp = (await headerPayload).get("svix-timestamp");
//   const svix_signature = (await headerPayload).get("svix-signature");

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response("Error: Missing Svix headers", {
//       status: 400,
//     });
//   }

//   // Get body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   let evt: WebhookEvent;

//   // Verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error("Error: Could not verify webhook:", err);
//     return new Response("Error: Verification error", {
//       status: 400,
//     });
//   }

//   // Do something with payload
//   // For this guide, log payload to console

//   const eventType = evt.type;

//   if (eventType === "user.created") {
//     const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

//     const user = {
//         clerkId: id,
//         email: email_addresses[0].email_address,
//         username: username!,
//         firstName: first_name,
//         lastName: last_name,
//         photo: image_url,
//         role: "Member",
//     };

//     console.log("Creating user in MongoDB:", user);

//     const newUser  = await createNewUserFromClerk(user);

//     if (newUser  && newUser .insertedId) {
//         console.log("User  created in MongoDB, updating Clerk role");

//         await clerkClient.users.updateUser (id, {
//             publicMetadata: {
//                 userId: newUser .insertedId,
//                 role: user.role,
//             },
//         });

//         return NextResponse.json({ message: "New user created with role", user: newUser  });
//     } else {
//         console.error("Failed to create user in MongoDB");
//         return new Response("User  creation failed", { status: 500 });
//     }
// }
//   if (eventType === "user.deleted") {
//     const { id } = evt.data;
//     console.log("Our deleted user details:", id);

//     //call server action to delete user from database

//     NextResponse.json("deleted successfully");
//   }

//   if (eventType === "user.updated") {
//     const { id, username, email_addresses } = evt.data;
//     console.log("Our updated user details", id, username, email_addresses);

//     //call server action to update user on the database
//   }

//   return new Response("everything good", { status: 200 });
// }