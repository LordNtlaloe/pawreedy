'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';

const CartModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, updateCartQuantity } = useCart();
  const router = useRouter();

  // Initialize quantities based on the cart's initial state
  const [quantities, setQuantities] = useState(cart.map(item => item.quantity || 1));

  // Sync quantities with cart whenever cart changes
  useEffect(() => {
    setQuantities(cart.map(item => item.quantity || 1));
  }, [cart]);

  if (!isOpen) return null;

  // Calculate total price
  const getTotal = () => {
    return cart.reduce((total, item, index) => total + item.price * (quantities[index] || 1), 0);
  };

  // Handle quantity change with validation
  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = newQuantity;
    setQuantities(updatedQuantities);
    updateCartQuantity(cart[index].id, newQuantity);
  };

  // Handle Checkout with modal close
  const handleCheckout = () => {
    onClose(); // Close modal
  
    // Use setTimeout to ensure modal closes before redirecting
    setTimeout(() => {
      router.push('/checkout'); // Redirect to checkout
    }, 300); // Adjust timeout duration if necessary
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Shopping Cart</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <p>Your cart is empty.</p>
                    ) : (
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cart.map((item, index) => (
                          <li key={item.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <Image
                                alt={item.name}
                                src={item.image}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">M{item.price}</p>
                                </div>
                                <div className="flex items-center mt-2">
                                  <button
                                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                                    onClick={() => handleQuantityChange(index, quantities[index] - 1)}
                                  >
                                    <Minus className="h-5 w-5" />
                                  </button>
                                  <span className="text-gray-700 mx-2">{quantities[index]}</span>
                                  <button
                                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                                    onClick={() => handleQuantityChange(index, quantities[index] + 1)}
                                  >
                                    <Plus className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="font-medium text-violet-700 hover:text-violet-900"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>M{getTotal()}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button
                      onClick={handleCheckout}
                      className="flex items-center justify-center rounded-md border border-transparent bg-violet-700 hover:bg-violet-900 px-6 py-3 text-base font-medium shadow-sm text-white"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={onClose}
                      className="font-medium text-violet-700 hover:text-violet-900"
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CartModal;
