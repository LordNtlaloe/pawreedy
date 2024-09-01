import React from "react";

const ContactusForm = () => {
  return (
    <main>
      <div className="bg-blue-900 h-16 flex items-center justify-center font-bold text-white text-2xl">
        <h1>CONTACT US</h1>
      </div>
      <div className="p-2 flex flex-col gap-4">
        <div>
          <p>Your Names:</p>
          <input
            type="text"
            placeholder="names..."
            className=" border w-full px-2 py-3 rounded-md"
          />
        </div>
        <div>
          <p>Your Email:</p>
          <input
            type="text"
            placeholder="email@domain.com..."
            className=" border w-full px-2 py-3 rounded-md"
          />
        </div>
        <div>
          <p>Subject</p>
          <input
            type="text"
            placeholder="contact subject..."
            className=" border w-full px-2 py-3 rounded-md"
          />
        </div>
        <div>
          <p>Your Message/Enquiry</p>
          <textarea className="border w-full " >

          </textarea>
        </div>
      </div>
    </main>
  );
};

export default ContactusForm;