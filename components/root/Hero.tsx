'use client'

import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import CategoryList from "@/components/category/CategoryList";

const Hero = ({ userInput }: any) => {

  const [searchText, setSearchText] = useState<string>("")

  return (
    <main className=" bg-slate-100 flex flex-col items-center">
      <h1 className="font-extrabold text-3xl md:text-6xl mt-10">
        Find & Discover Experts
      </h1>
      <h1 className="font-bold md:text-7xl text-4xl text-blue-700 my-10">
        Near You
      </h1>
      <p className="md:w-[50%] w-full ml-6 text-sm text-gray-500 px-2 md:px-0">{"business name or category (blank='all')"}</p>
      <div className="flex md:w-[50%]  w-full items-center space-x-2 px-2 md:px-0 mb-10">
        <Input
          type="text"
          placeholder="search..."
          className=" rounded-full outline-none border-black/10 shadow-xl bg-white"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-primary rounded-full hover:bg-secondary/50"
          onClick={() => userInput(searchText)}
        >
          <SearchIcon />
        </Button>
      </div>
      <Suspense fallback={<p>This is Loading...</p>}>
        <CategoryList />
      </Suspense>
    </main>
  );
};

export default Hero;