"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Assuming you're using next/image for images
import { getAllRatingsByProductId } from "@/app/_actions/_productsActions";

interface Rating {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  title: string;
  createdAt: string;
  user: {
    profilePicture: string;
  };
}

const DisplayRatings = ({ productId }: { productId: string }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getAllRatingsByProductId(productId);
        console.log("Fetched Ratings Data:", data); // Debugging line
        
        // Check if the data is an array
        if (Array.isArray(data)) {
          setRatings(data);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch ratings");
      }
    };

    fetchRatings();
  }, [productId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-5">
      <article>
        {ratings.length === 0 ? (
          <p>No Ratings</p>
        ) : (
          ratings.map((rating) => (
            <div key={rating._id} className="mb-6">
              {/* User Information */}
              <div className="flex items-center mb-4">
                <Image
                  className="w-10 h-10 me-4 rounded-full"
                  src={rating.user.profilePicture}
                  alt="User profile picture"
                  width={40}
                  height={40}
                />
                <div className="font-medium dark:text-white">
                  <p>Made On {new Date(rating.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                {[...Array(rating.rating)].map((_, index) => (
                  <svg
                    key={index}
                    className="w-4 h-4 text-yellow-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
                <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {rating.title}
                </h3>
              </div>

              {/* Comment */}
              <p className="mb-2 text-gray-500 dark:text-gray-400">{rating.comment}</p>
            </div>
          ))
        )}
      </article>
    </div>
  );
};

export default DisplayRatings;
