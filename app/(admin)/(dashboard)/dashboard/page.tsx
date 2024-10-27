"use server"
import { redirect } from "next/navigation";
import { getUserByRole } from "@/app/_actions/_userActions"; // Update this path as needed

const DashboardPage = async () => {
  try {
    const user = await getUserByRole("Admin");

    // If user is not found or not an admin, redirect
    if (!user) {
      redirect("/");
    }

    return (
      <main>
        <h1>Your role: <span className="font-bold">{user.role}</span></h1>
        <h1>All is good dear admin, this is your page...</h1>
        <div>Welcome to the dashboard page...</div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    redirect("/")
  }
};

export default DashboardPage;
