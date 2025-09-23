import React from "react";

interface CommonButtonProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  className = "",
  icon,
}) => {
  return (
    <button
      className={`bg-transparent mt-10 border-2 border-pink-500/0 text-white text-base  leading-6 font-normal w-[186px] h-[48px] rounded-[80px] gradient-border ${className}`}
    >
      {children}
      {icon}
    </button>
  );
};

export default CommonButton;
