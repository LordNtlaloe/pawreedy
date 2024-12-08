"use client";
import React, { useEffect, useState } from "react";
import { saveNewProductRating, getProductById } from "@/app/_actions/_productsActions";
import { showConfirmationMessage, showToastMessage } from "@/lib/GeneralFunctions";
import { Rate } from "antd";
import { useClerk } from "@clerk/nextjs";
import { sendMail } from "@/app/_email/mail";
import { Input } from "../ui/input";
import { getOrdersByUserEmail } from "@/app/_actions/_orderActions";
import { Save } from "lucide-react";

const ProductRatings = ({
  isReadOnly,
  isEnabled,
  product,
}: {
  isReadOnly: boolean;
  isEnabled: boolean;
  product?: any;
}) => {
  const [selectedValue, setSelectedValue] = useState(product?.overallRating ?? 4);
  const [showRatingComment, setShowRatingComment] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [userCanRate, setUserCanRate] = useState(false);
  const { user } = useClerk();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userName = user?.firstName;
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    if (product) {
      setSelectedValue(product?.overallRating ?? 4);
      setCurrentProduct(product);
    }

    const checkUserRatingEligibility = async () => {
      if (userEmail && product?._id) {
        // console.log("Checking rating eligibility for:", userEmail);
        // console.log("Product name to match:", product.name);

        // Fetch user orders
        const ordersResult = await getOrdersByUserEmail(userEmail);

        if (ordersResult.success) {
          // console.log("Orders fetched:", ordersResult.orders);

          // Check if the user has purchased the product
          const hasPurchasedProduct = ordersResult.orders.some((order: { cartSummary: { items: any[]; }; }) =>
            order.cartSummary.items.some((item: { name: string }) => {
              // console.log("Comparing item:", item.name, "with product:", product.name);
              return item.name.toLowerCase() === product.name.toLowerCase(); // Case-insensitive comparison
            })
          );

          // console.log("Has purchased product:", hasPurchasedProduct);
          setUserCanRate(hasPurchasedProduct);
        } else {
          // console.error("Failed to fetch user orders:", ordersResult.error);
          setUserCanRate(false);
        }
      } else {
        if (!userEmail) console.log("User email is missing.");
        if (!product?._id) console.log("Product ID is missing.");
        setUserCanRate(false);
      }
    };

    checkUserRatingEligibility();
  }, [product, userEmail]);

  const saveRating = async (formData: FormData) => {
    const comment = formData.get("comment");
    if (!comment) {
      showConfirmationMessage("error", "Please Provide A Comment For Your Rating...");
      return;
    }
    const title = formData.get("title");
    if (!title) {
      showConfirmationMessage("error", "Please Provide A Title For Your Rating...");
      return;
    }
    formData.append("productName", currentProduct.name);
    formData.append("userEmail", userEmail as string);
    formData.append("rating", selectedValue.toString());
    const result = await saveNewProductRating(formData);
    if (result && result.error) {
      showConfirmationMessage("error", result.error);
      return;
    }

    setShowRatingComment(false);
    showToastMessage("success", "Your rating was successfully submitted.");

    const updatedProduct = await getProductById(currentProduct._id);
    setCurrentProduct(updatedProduct);

    await sendMail({
      to: userEmail as string,
      name: userName as string,
      subject: "Rating Submitted",
      body: `<p>Dear ${userName},</p><p>Your rating for ${currentProduct?.name} has been submitted successfully.</p><p>Thank you for your feedback!</p>`,
    });
  };

  return (
    <main className="py-2">
      <div className="bg-white py-1 w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Rate
            value={selectedValue}
            onChange={(value) => setSelectedValue(value)}
            allowHalf
            allowClear={false}
            style={{ color: "#fde047" }}
            disabled={isReadOnly}
          />
          {isEnabled && (
            <div>
              <h1>
                ({(currentProduct?.ratings ?? 0).toFixed(1)}) | {currentProduct?.ratingsCount}{" "}
                <span className="italic">ratings</span>
              </h1>
            </div>
          )}
        </div>
        {isEnabled && (
          <div className="mr-2">
            {currentProduct?.overallRating >= 4.5 ? (
              <div className="bg-green-800 text-white py-1 px-2 rounded">Excellent</div>
            ) : currentProduct?.overallRating >= 3.5 && currentProduct?.overallRating < 4.5 ? (
              <div className="bg-green-500 text-white py-1 px-2 rounded">Very Good</div>
            ) : currentProduct?.overallRating >= 2.5 && currentProduct?.overallRating < 3.5 ? (
              <div className="bg-primary text-black py-1 px-2 rounded">Fair</div>
            ) : currentProduct?.overallRating < 2.5 ? (
              <div className="bg-red-600 text-white py-1 px-2 rounded">Poor</div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
      {isEnabled && (
        <div className="flex justify-end pr-2 mt-2">
          <button
            className={`transition-all flex gap-1 items-center px-2 py-1 rounded ${
              userCanRate
                ? "bg-violet-700 text-white"
                : "bg-white border border-violet-700 text-violet-700 cursor-not-allowed"
            }`}
            onClick={() => userCanRate && setShowRatingComment(!showRatingComment)}
            disabled={!userCanRate}
          >
            Rate Product
          </button>
        </div>
      )}
      {showRatingComment && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await saveRating(formData);
          }}
          className="flex flex-col"
        >
          <h1>
            Rate {currentProduct?.name}{" "}
            <span className="text-gray-600 font-bold px-1 rounded">
              : Your Rating: {selectedValue}
            </span>
          </h1>
          <Input
            type="text"
            name="title"
            placeholder="A Catchy Title For Your Review..."
            required
            className="my-4"
          />
          <textarea
            name="comment"
            className="border rounded p-2"
            placeholder="Post Your Comment..."
          />
          <button className="text-white bg-violet-800 mx-2 my-1 rounded py-1 px-2 hover:bg-violet-600 transition-all place-self-end mt-2 flex items-center gap-1">
            <Save size={16} />
            <span>Submit</span>
          </button>
        </form>
      )}
    </main>
  );
};

export default ProductRatings;
