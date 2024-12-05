"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getAllRatingsByProductId } from "@/app/_actions/_productsActions";
import { FaStar } from "react-icons/fa";
import { useUser } from '@clerk/nextjs';

interface Rating {
  _id: string;
  userEmail: string;
  rating: number;
  comment: string;
  title: string;
  createdAt: string;
  user: {
    profilePicture: string;
  };
}

const DisplayRatings = ({ productId }: { productId: string }) => {
  const { user } = useUser();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getAllRatingsByProductId(productId);
        console.log("Fetched Ratings Data:", data);

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

  useEffect(() => {
    const fetchUserProfilePictures = async () => {
      const userProfiles = new Map();
      for (const rating of ratings) {
        if (!userProfiles.has(rating.userEmail)) {
          try {
            userProfiles.set(rating.userEmail, user?.imageUrl || ""); // Store profile picture URL
          } catch (err) {
            console.error(`Error fetching user data for ${rating.userEmail}:`, err);
          }
        }
      }
      setUsers(userProfiles);
    };

    if (ratings.length > 0) {
      fetchUserProfilePictures();
    }
  }, [ratings, user]);

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
                  src={users.get(rating.userEmail) || "/default-profile.jpg"}
                  alt="User profile picture"
                  width={40}
                  height={40}
                />
                <div className="font-medium dark:text-white">
                  <p>{user?.firstName} {user?.lastName}</p>
                  <time
                    dateTime={rating.createdAt}
                    className="block text-sm text-gray-500 dark:text-gray-400"
                  >
                    Made On {new Date(rating.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                {[...Array(rating.rating)].map((_, index) => (
                  <FaStar key={index} className="w-4 h-4 text-yellow-300" />
                ))}
                <h3 className="ml-4 pl-4 ms-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {rating.title}
                </h3>
              </div>

              {/* Comment */}
              <p className="mb-2 text-gray-500 dark:text-gray-400">{rating.comment}</p>
              <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                <p>Reviewed on {new Date(rating.createdAt).toLocaleDateString()}</p>
              </footer>

              <a
                href="#"
                className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Read more
              </a>
            </div>
          ))
        )}
      </article>
    </div>
  );
};

export default DisplayRatings;
