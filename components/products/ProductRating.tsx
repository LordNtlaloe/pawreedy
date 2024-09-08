import React, { useEffect, useState } from 'react';
import { Save, StarsIcon } from 'lucide-react';
import { saveNewProductRating, getProductById, getUserRatingCount } from '@/app/_actions/_productsActions';
import { showConfirmationMessage, showToastMessage } from '@/lib/GeneralFunctions';
import { Rate } from 'antd';
import { useClerk } from '@clerk/nextjs';
import { sendMail } from '@/app/_email/mail';
import { Input } from '../ui/input';

const ProductRatings = ({ isReadOnly, isEnabled, product }: { isReadOnly: boolean, isEnabled: boolean, product?: any }) => {
  const [selectedValue, setSelectedValue] = useState(product?.overallRating ?? 4);
  const [showRatingComment, setShowRatingComment] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [userCanRate, setUserCanRate] = useState(false);
  const { user } = useClerk();
  const userId = user?.id;
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userName = user?.firstName;

  useEffect(() => {
    if (product) {
      setSelectedValue(product?.overallRating ?? 4);
      setCurrentProduct(product);
    }

    const checkUserRatingEligibility = async () => {
      if (userId && product?._id) {
        if (product) {
          const ratingCount = await getUserRatingCount(userId, product._id);
          setUserCanRate(product.ratingsCount > ratingCount); // Fixed comparison
        }
      }
    };

    checkUserRatingEligibility();
  }, [product, userId]);

  const saveRating = async (formData: FormData) => {
    const comment = formData.get('comment');
    if (!comment) {
      showConfirmationMessage('error', 'Please Provide A Comment For Your Rating...');
      return null;
    }
    const title = formData.get('title');
    if(!title){
      showConfirmationMessage('error', 'Please Provide A Title For Your Rating...');
      return null;
    }
    formData.append('productId', currentProduct._id);
    formData.append('userId', userId as string);
    formData.append('rating', selectedValue.toString());
    const result = await saveNewProductRating(formData);
    if (result && result.error) {
      showConfirmationMessage('error', result.error);
      return;
    }

    setShowRatingComment(false);
    showToastMessage('success', 'Your rating was successfully submitted.');

    const updatedProduct = await getProductById(currentProduct._id);
    setCurrentProduct(updatedProduct);

    await sendMail({
      to: userEmail as string,
      name: userName as string,
      subject: 'Rating Submitted',
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
            allowHalf={true}
            allowClear={false}
            style={{ color: 'orange' }}
            disabled={isReadOnly}
          />
          {isEnabled && (
            <div>
              <h1>
                ({(currentProduct?.overallRating ?? 0).toFixed(1)}) | {currentProduct?.ratingsCount} <span className="italic">ratings</span>
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
              ''
            )}
          </div>
        )}
      </div>
      {isEnabled && (
        <div className="flex justify-end pr-2 mt-2">
          <button
            className={`transition-all flex gap-1 items-center px-2 py-1 rounded border border-violet-800 ${
              userCanRate ? 'bg-white hover:bg-violet-100' : 'bg-violet-800 cursor-not-allowed'
            }`}
            onClick={() => userCanRate && setShowRatingComment(!showRatingComment)}
            disabled={!userCanRate}
          >
            <StarsIcon className='w-5 h-5' />
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
            Rate {currentProduct?.name} <span className="text-gray-600 font-bold px-1 rounded">: Your Rating: {selectedValue}</span>{' '}
          </h1>
          <Input type="text" name='title' placeholder='A Catchy Title For Your Review...' required={true} className='my-4'/>
          <textarea name="comment" className="border rounded p-2" placeholder="Post Your Comment..." />
          <button className="text-white bg-violet-800 mx-2 my-1 rounded py-1 px-2 hover:bg-violet-600 transition-all place-self-end mt-2 flex items-center gap-1">
            <Save size={16} />
            <span>Submit Rating</span>
          </button>
        </form>
      )}
    </main>
  );
};

export default ProductRatings;
