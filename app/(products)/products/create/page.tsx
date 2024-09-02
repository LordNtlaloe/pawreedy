import ProductRegistrationForm from "@/components/products/AddNewProductForm";
import Image from "next/image";
import React from "react";

const BussinessRegistrationPage = () => {
  return (
    <main className=" md:max-w-5xl mt-6 md:border-4 flex flex-col mx-auto rounded-md justify-center rounded-t-full mb-6 ">
      {/* End top selection panel */}

      <div className="">
        {/* Image: Left section */}

        {/* Form : right section*/}
        <section className=" border-rounded p-4 bg-white">
        <h1 className="text-center font-semibold text-gray-900">Profile</h1>
          <div className="">
            <ProductRegistrationForm />
          </div>
        </section>
      </div>
    </main>
  );
};

export default BussinessRegistrationPage;