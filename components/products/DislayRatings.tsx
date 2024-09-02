"use client";

import { useEffect, useState } from 'react';
import { getAllRatingsByProductId } from '@/app/_actions/_productsActions';

interface Rating {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
}

const ProductRatings = ({ productId }: { productId: string }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getAllRatingsByProductId(productId);
        console.log("Fetched Ratings Data:", data); // Debugging line
        if (data.error) {
          setError(data.error);
        } else {
          setRatings(data);
        }
      } catch (err) {
        setError('Failed to fetch ratings');
      }
    };

    fetchRatings();
  }, [productId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-5">
      {ratings.length === 0 ? (
        <p>No ratings available</p>
      ) : (
        <ul>
          {ratings.map((rating) => (
            <li key={rating._id}>
              <p>Rating: {rating.rating}</p>
              <p>Comment: {rating.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductRatings;