'use client'
import { useCart } from '@/apis/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Proceed with checkout logic
    console.log('Checkout details:', shippingAddress, cart);
    clearCart();
    alert('Checkout successful! Thank you for your purchase.');
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
                <h2 className="text-xl font-bold text-gray-800">Shipping info</h2>

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
                      <Image src="https://readymadeui.com/images/visa.webp" className="w-12" alt="visa" />
                      <Image src="https://readymadeui.com/images/master.webp" className="w-12" alt="master" />
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input type="radio" className="w-5 h-5 cursor-pointer" id="paypal" />
                    <label htmlFor="paypal" className="ml-4 flex gap-2 cursor-pointer">
                      <Image src="https://readymadeui.com/images/paypal.webp" className="w-20" alt="paypal" />
                    </label>
                  </div>
                </div>

                <div className="grid gap-8 mt-8">
                  <div>
                    <input
                      type="text"
                      placeholder="Cardholder's Name"
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div className="flex bg-white border-b focus-within:border-blue-600 overflow-hidden">
                    <input
                      type="number"
                      placeholder="Card Number"
                      className="px-2 pb-2 bg-white text-gray-800 w-full text-sm outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <input
                        type="number"
                        placeholder="EXP."
                        className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="CVV"
                        className="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/" className="min-w-[150px] text-center px-6 py-3.5 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                  Back
                </Link>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="min-w-[150px] text-center px-6 py-3.5 text-sm bg-violet-800 text-white rounded-lg hover:bg-violet-700"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-violet-100 lg:h-screen lg:sticky lg:top-0">
            <div className="relative h-full">
              <div className="p-6 overflow-auto max-lg:max-h-[400px] lg:h-[calc(100vh-60px)] max-lg:mb-8">
                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>

                <div className="space-y-8 mt-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4">
                      <div className="max-w-[140px] p-4 rounded-md">
                        <Image src={item.image} className="w-full object-contain rounded-md" alt={item.name} />
                      </div>

                      <div className="w-full">
                        <h3 className="text-base text-gray-800 font-bold">{item.name}</h3>
                        <ul className="text-sm text-gray-800 space-y-2 mt-2">
                          <li className="flex flex-wrap gap-4">
                            Quantity <span className="ml-auto">{item.quantity}</span>
                          </li>
                          <li className="flex flex-wrap gap-4">
                            Total Price <span className="ml-auto">M{(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                  <p className="font-bold text-xl mt-4">
                    Total: M{cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
