import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import error404 from '/public/images/404-1.png';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <div className="mb-8">
        <Image src={error404} alt="404 Error" className="w-1/2 max-w-sm" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Oops! Page Not Found</h1>
      <p className="mb-6">We can&apos;t seem to find the page you&apos;re looking for.</p>
      <Link href="/">
        <a className="bg-[#51358C] text-[#F2DF7E] hover:bg-[#6C548C]">Go back to Home</a>
      </Link>
    </div>
  );
};

export default ErrorPage;
