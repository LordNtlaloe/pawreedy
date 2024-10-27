import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createNewUserFromClerk } from "@/app/_actions/_userActions";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username!,
            firstName: first_name,
            lastName: last_name,
            photo: image_url,
            role: "Member"
        };

        console.log("Creating user in MongoDB:", user);

        const newUser = await createNewUserFromClerk(user);

        if (newUser && newUser.insertedId) {
            console.log("User created in MongoDB, updating Clerk role");

            await clerkClient.users.updateUser(id, {
                publicMetadata: {
                    userId: newUser.insertedId,
                    role: user.role
                },
            });

            return NextResponse.json({ message: "New user created with role", user: newUser });
        } else {
            console.error("Failed to create user in MongoDB");
            return new Response("User creation failed", { status: 500 });
        }
    }

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", body);

    return new Response("", { status: 200 });
}
