"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface Initiative {
  image: string;
  header: string;
  description: string | React.ReactNode;
}

interface KeyInitiativesProps {
  initiatives: Initiative[];
  title: string;
  description?: string;
}

const KeyInitiatives: React.FC<KeyInitiativesProps> = ({
  initiatives,
  title,
  description,
}: KeyInitiativesProps) => {
  useEffect(() => {
    const listeners: Array<{
      container: HTMLElement;
      handleMouseEnter: () => void;
      handleMouseLeave: () => void;
    }> = [];

    initiatives.forEach((_, i) => {
      const container = document.getElementById(`card-container-${i}`);
      const checkbox = document.getElementById(
        `toggle-${i}`
      ) as HTMLInputElement | null;

      if (!container || !checkbox) return;

      const handleMouseEnter = () => {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      };

      const handleMouseLeave = () => {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      };

      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      listeners.push({ container, handleMouseEnter, handleMouseLeave });
    });

    return () => {
      listeners.forEach(({ container, handleMouseEnter, handleMouseLeave }) => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [initiatives]);

  return (
    <div className="p-4 border-t border-[#39314a] mt-[60px] pt-[40px] md:pt-[80px] w-full">
      <h2 className="text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
        {title}
      </h2>
      {description && (
        <p className="text-[16px] text-[#c4bfce] p-6 max-w-[900px] text-center mx-auto mt-6 leading-relaxed">
          {description}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full item-center mt-10 p-4 mx-auto max-w-[1180px]">
        {initiatives.map(({ image, header, description }, i) => {
          const isNthValue = i >= 3;
          return (
            <div
              className="relative max-w-[382px] w-full"
              id={`card-container-${i}`}
              key={i}
            >
              <input
                type="checkbox"
                id={`toggle-${i}`}
                className="peer hidden"
              />
              <span className="hidden lg:peer-checked:hidden lg:block absolute bottom-[10px] right-[20px] text-[#ff1464]">
                +
              </span>
              <div
                className={`relative transform  ${
                  isNthValue && "lg:peer-checked:translate-y-[-236px]"
                }  group h-[212px] w-full border-[1px] border-[#39314a] hover:border-[#ff1464]/40 rounded-[20px] cursor-pointer overflow-visible transition-all duration-300 lg:peer-checked:border-[#ff1464]/70 lg:peer-checked:border-b-0 lg:peer-checked:rounded-bl-none lg:peer-checked:rounded-br-none bg-gradient-to-b from-[#1e1133]/60 to-[#0d0129]/60 lg:peer-checked:backdrop-blur-sm shadow-lg hover:shadow-[#ff1464]/5`}
              >
                <label htmlFor={`toggle-${i}`}>
                  <div className="flex flex-col justify-center items-center gap-6 h-full cursor-pointer p-6">
                    <div className="bg-gradient-to-br from-[#281645] to-[#39194d] p-4 rounded-full">
                      <Image
                        src={`/images/initiatives/${image}`}
                        className="mb-0 w-16 h-16"
                        alt=""
                        aria-hidden="true"
                        width={64}
                        height={64}
                      />
                    </div>
                    <h3 className="text-2xl font-medium text-center px-4 text-white">
                      {header}
                    </h3>
                  </div>
                </label>
              </div>
              <div
                className={`hidden transform ${
                  isNthValue && "lg:peer-checked:translate-y-[-236px]"
                } lg:peer-checked:block absolute backdrop-blur-xl h-auto min-h-[236px] top-full left-0 w-full mt-[-1px] border-[1px] border-t-0 border-[#ff1464]/70 rounded-b-[20px] z-10 p-6 bg-gradient-to-b from-[#1e1133]/60 to-[#0d0129]/60 shadow-lg shadow-[#ff1464]/10`}
              >
                <div className="text-white text-sm px-4 text-center leading-relaxed">
                  {description}
                </div>
                <span className="absolute bottom-[10px] right-[20px] text-[#ff1464]">
                  _
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyInitiatives;
