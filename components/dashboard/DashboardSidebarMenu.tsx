import { dashboardMenu } from "@/lib/constants";
import { LayoutDashboardIcon, SettingsIcon, User2Icon, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashboardSidebarMenu = () => {
  return (
    <main className="md:block w-72 md:w-16  bg-slate-800 text-white md:hover:w-72 transition-all duration-500">
      <nav className="pt-3 py-2 flex flex-col justify-between h-full">
        <div>
          {dashboardMenu.map((item) => (
            <Link
              href={item.href}
              key={item.id}
              className="items-center md:pl-6 py-3 pl-3 "
            >
              <div className="flex pl-3 gap-6 hover:bg-slate-600 mx-2 py-2 rounded-[5px] transition-all duration-500">
                <item.icon className={`shrink-0  text-${item.color}`} />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="pt-10 border-t mb-3 justify-end flex flex-col border-white/20">

          <Link href="/dashboard/settings">
            <div className="flex pl-3 gap-6 hover:bg-slate-600 mx-2 py-2 rounded-[5px] transition-all duration-500">
              <SettingsIcon className="shrink-0 text-yellow-400" />
              Settings
            </div>
          </Link>
          <Link href="/dashboard/profile">
            <div className="flex pl-3 gap-6 hover:bg-slate-600 mx-2 py-2 rounded-[5px] transition-all duration-500">
              <User2Icon className="shrink-0 text-pink-400" />
              profile
            </div>
          </Link>

        </div>

      </nav>
    </main>
  );
};

export default DashboardSidebarMenu;