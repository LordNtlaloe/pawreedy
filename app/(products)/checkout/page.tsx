'use client';

import { useCart } from '@/apis/CartContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs'; // Clerk for authentication
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { sendMail } from '@/app/_email/mail';
import { saveOrder } from '@/app/_actions/_orderActions'; // Adjust the path to your _orderActions file

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

const CheckoutPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { cart, clearCart } = useCart();
  const { user, isLoaded, isSignedIn } = useUser(); // Clerk user
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });
  const router = useRouter(); // Initialize router for redirecting

  // Pre-fill the form if the user is authenticated
  useEffect(() => {
    if (isSignedIn && user) {
      setShippingAddress({
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
      });
    }
  }, [isLoaded, isSignedIn, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateCardDetails = () => {
    const cardNumberRegex = /^[0-9]{16}$/;
    const expDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cvvRegex = /^[0-9]{3}$/;

    const { cardName, cardNumber, expDate, cvv } = cardDetails;

    if (!cardName || !cardNumberRegex.test(cardNumber) || !expDateRegex.test(expDate) || !cvvRegex.test(cvv)) {
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      await Swal.fire({
        title: 'Cart is empty',
        text: 'Your cart is empty.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    const isFormValid = Object.values(shippingAddress).every(field => field.trim() !== '');
    if (!isFormValid) {
      await Swal.fire({
        title: 'Incomplete Form',
        text: 'Please fill out all shipping address fields.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!validateCardDetails()) {
      await Swal.fire({
        title: 'Invalid Payment Details',
        text: 'Please provide valid card details.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Clear form fields
      setShippingAddress({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
      });
      setCardDetails({
        cardName: '',
        cardNumber: '',
        expDate: '',
        cvv: '',
      });

      // Create the order data object
      const orderData = {
        shippingDetails: shippingAddress,
        cartSummary: {
          totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
          items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
        userEmail: shippingAddress.email
      };

      const savedOrder = await saveOrder(orderData);

      if (savedOrder.success) {
        await sendMail({
          to: shippingAddress.email,
          name: shippingAddress.name,
          subject: 'Order Confirmation',
          body: `<p>Dear ${shippingAddress.name},</p>
                 <p>Thank you for your purchase! Your order has been successfully processed.</p>
                 <p>Order Summary:</p>
                 <ul>
                   ${cart.map(item => `<li>${item.name} - M${item.price} (Quantity: ${item.quantity})</li>`).join('')}
                 </ul>
                 <p>Total: M${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
                 <p>We hope you enjoy your purchase!</p>`
        });
        await Swal.fire({
          title: 'Checkout Successful!',
          text: 'Thank you for your purchase.',
          icon: 'success',
          confirmButtonText: 'OK',
        });  
        setIsLoading(false);
        clearCart();
        router.push('/');
      } else {
        await Swal.fire({
          title: 'Order Error',
          text: 'There was an issue saving the order.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      await Swal.fire({
        title: 'Checkout Error',
        text: 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="font-[sans-serif] bg-white py-6 px-4 sm:p-6 md:py-10 md:px-8">
      <div className="max-lg:max-w-xl mx-auto w-full">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Checkout Section */}
          <div className="lg:col-span-2 max-lg:order-1 p-6 !pr-0 max-w-4xl mx-auto w-full">
            <div className="text-center max-lg:hidden">
              <h2 className="text-3xl font-extrabold text-gray-800 inline-block border-b-2 border-gray-800 pb-1">Checkout</h2>
            </div>

            <form className="lg:mt-16">
              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">Shipping Info</h2>

                <div className="grid sm:grid-cols-2 gap-8 mt-8">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={shippingAddress.name}
                      onChange={handleInputChange}
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-16">
                <h2 className="text-xl font-bold text-gray-800">Payment method</h2>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div className="flex items-center">
                    <input type="radio" className="w-5 h-5 cursor-pointer" id="card" defaultChecked />
                    <label htmlFor="card" className="ml-4 flex gap-2 cursor-pointer">
                      <Image src="https://readymadeui.com/images/visa.webp" className="w-12" alt="visa" width={48} height={48} />
                      <Image src="https://readymadeui.com/images/master.webp" className="w-12" alt="master" width={48} height={48} />
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input type="radio" className="w-5 h-5 cursor-pointer" id="paypal" />
                    <label htmlFor="paypal" className="ml-4 flex gap-2 cursor-pointer">
                      <Image src="https://readymadeui.com/images/paypal.webp" className="w-20" alt="paypal" width={48} height={48} />
                    </label>
                  </div>
                </div>

                <div className="grid gap-8 mt-8">
                  <div>
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Cardholder's Name"
                      value={cardDetails.cardName}
                      onChange={handleCardInputChange}
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div className="flex bg-white border-b focus-within:border-blue-600 overflow-hidden">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInputChange}
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="expDate"
                        placeholder="EXP. MM/YY"
                        value={cardDetails.expDate}
                        onChange={handleCardInputChange}
                        className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 max-lg:order-2">
            <div className="bg-gray-100 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <ul>
                {cart.map((item, index) => (
                  <li key={index} className="flex justify-between items-center mb-4">
                    <Image src={item.image} width={100} height={100} alt={item.name} />
                    <span>{item.name} * {item.quantity}</span>
                    <span>M{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>M{cart.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-6 w-full py-3 bg-violet-800 text-white font-bold rounded-lg hover:bg-violet-600 transition-colors"
              >
                Complete Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
