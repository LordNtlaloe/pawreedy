import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

const DashboardPage = async () => {
  try {
    // Fetch user and session claims
    const { sessionClaims } = auth();
    const user = await currentUser();

    // Extract role from user public metadata
    const role = user?.publicMetadata.role as string;

    return (
      <main>
        <h1>Your role: <span className="font-bold">{role}</span></h1>
        {role !== "admin" ? (
          <div>
            <h1>You are not authorised to access this page anyway...</h1>
          </div>
        ) : (
          <div>
            <h1>All is good dear admin, this is your page...</h1>
          </div>
        )}
        <div>Welcome to dashboard page...</div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <main>
        <h1>There was an error loading your information.</h1>
      </main>
    );
  }
};

export default DashboardPage;
