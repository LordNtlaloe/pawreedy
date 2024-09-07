import { Search, User } from "lucide-react";
import React from "react";
import SaveButton from "../general/SaveButton";
import DashboardMobileNav from "./DashboardMobileNav";

const DashboardHeader = () => {
  return (
    <div className="h-32 flex flex-col gap-2 ">
      <div className="md:h-16 bg-white p-2  mt-2 rounded-[5px] grid md:grid-cols-3  items-center">
        <div className="md:flex flex-col mr-2 hidden">
          <h1 className="text-xs md:text-base">PRIMARY</h1>
          <h1 className="font-bold text-xs md:text-base">DASHBOARD</h1>
        </div>

        <div className="bg-slate-200 flex py-2 items-center gap-1 px-2 border rounded-[10px] mr-4 w-full">
          <Search className="" />
          <input
            type="text"
            className="bg-slate-200 outline-none w-full"
            placeholder="Search Dashboard..."
          />
        </div>
        <div className="hidden md:flex items-center justify-end">
          <SaveButton
            btnFunction="registerBusiness"
            btnText="Register Business"
            bgColor="bg-blue-600"
          />
        </div>
      </div>
      <div className="h-20 bg-blue-950 text-white md:hidden flex items-center justify-between">
        <DashboardMobileNav />
      </div>
    </div>
  );
};

export default DashboardHeader;