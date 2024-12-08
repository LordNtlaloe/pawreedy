import Image from 'next/image';
import React from 'react';
const CTA = () => {
  return (
    <section className="py-10" aria-label="service">
      <div className="container mx-auto px-4">

        <Image
          src="/banner-image.png"
          width={122}
          height={136}
          loading="lazy"
          alt=""
          className="mx-auto mb-8"
        />

        <h2 className="text-center text-4xl text-slate-800 mb-14 font-bold">
          <span className="text-violet-900">What your pet needs,</span> when they need it.
        </h2>

        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: '/delivery-truck.svg',
              title: 'Free Same-Day Delivery',
              text: 'Order by 2pm local time to get free delivery on orders R35+ today.'
            },
            {
              icon: '/package-return.svg',
              title: '30 Day Return',
              text: '35% off your first order plus 5% off all future orders.'
            },
            {
              icon: '/secure-payment.svg',
              title: 'Security payment',
              text: '25% off your online order of R50+. Available at most locations.'
            },
            {
              icon: '/support.svg',
              title: '24/7 Support',
              text: 'Shop online to get orders over R35 shipped fast and free.'
            }
          ].map((service, index) => (
            <li key={index}>
              <div className="text-center p-4 shadow-lg rounded-lg h-60">
                <figure className="mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src={service.icon}
                    width={70}
                    height={70}
                    loading="lazy"
                    alt="service icon"
                  />
                </figure>
                <h3 className="text-xl text-violet-800 font-bold mb-2">{service.title}</h3>
                <p className="text-slate-700">{service.text}</p>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
};

export default CTA;
