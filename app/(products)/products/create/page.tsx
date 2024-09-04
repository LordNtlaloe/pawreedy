import ProductRegistrationForm from "@/components/products/AddNewProductForm";
import React from "react";

const BusinessRegistrationPage = () => {
  return (
    <main className="md:max-w-5xl mt-20 shadow-lg flex flex-col mx-auto rounded-md justify-center mb-6">
      {/* Top section panel can be added here if needed */}

      <div className="flex">
        {/* Form: right section */}
        <section className="p-4 bg-white w-full">
          <h1 className="text-center font-semibold text-gray-900">Profile</h1>
          <div>
            <ProductRegistrationForm />
          </div>
        </section>
      </div>
    </main>
  );
};

export default BusinessRegistrationPage;
