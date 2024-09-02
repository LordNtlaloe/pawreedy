"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const SaveButton = ({
  btnFunction,
  btnText,
  bgColor,
}: {
  btnFunction: string;
  btnText: string;
  bgColor: string;
}) => {
  return (
    <main>
      <Link
        href={btnFunction === "registerBusiness" ? "/business/register" : "/"}
      >
        <button
          className={cn(
            "text-black py-1 md:py-2 px-3 md:font-bold rounded-[6px] mr-2 border bg-secondary hover:bg-secondary/70"
          )}
        >
          <h1>{btnText}</h1>
        </button>
      </Link>
    </main>
  );
};

export default SaveButton;