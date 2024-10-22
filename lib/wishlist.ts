// wishlist.ts

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Sample function to simulate adding to wishlist
export const addToWishlist = (product: any) => {
  // You can save to local storage or an API call here
  try {
    const wishlist = localStorage.getItem("wishlist")
      ? JSON.parse(localStorage.getItem("wishlist")!)
      : [];
    const isAlreadyInWishlist = wishlist.some((item: any) => item._id === product._id);

    if (isAlreadyInWishlist) {
      MySwal.fire({
        title: "Already in Wishlist!",
        text: `${product.name} is already in your wishlist`,
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    MySwal.fire({
      title: "Added to Wishlist!",
      text: `${product.name} has been added to your wishlist`,
      icon: "success",
      confirmButtonText: "OK",
      timer: 2000,
    });
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Failed to add the product to the wishlist",
      icon: "error",
      confirmButtonText: "Try Again",
    });
  }
};
