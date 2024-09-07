
import { dashboardMenu } from "@/lib/constants";
import { LayoutDashboardIcon, SettingsIcon, User2Icon, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import DashboardSidebarMenu from "./DashboardSidebarMenu";

const DashboardSidebar = () => {
  return (
    <main className="hidden md:flex">
      <DashboardSidebarMenu />
    </main>
  );
};

export default DashboardSidebar;