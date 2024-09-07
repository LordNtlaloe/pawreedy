
import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

const DashboardPage = async () => {

  const { sessionClaims } = auth()
  const user = await currentUser()

  const role = user?.publicMetadata.role as string


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
};

export default DashboardPage;