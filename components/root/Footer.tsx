import { CopyrightIcon } from "lucide-react";
import React from "react";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <main className=" bg-blue-950 h-16 text-white flex items-center justify-center gap-2">
      <div className="flex gap-1">
        <CopyrightIcon />
        {currentYear}
      </div>
      <p>All Rights Reserved</p>
    </main>
  );
};

export default Footer;