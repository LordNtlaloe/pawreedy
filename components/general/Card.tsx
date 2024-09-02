import React from "react";

const Card = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="border border-solid border-transparent rouded-[5px] overflow-hidden">
      {children}
    </div>
  );
};

export default Card;