"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import "./styles.css";
import testimonialData from "@/data/testimonials.json";

interface TestimonialsProps {
  type: "member" | "sustainer";
}
const Testimonials: React.FC<TestimonialsProps> = ({ type }) => {
  // Filter the testimonials based on type
  const filteredTestimonials = useMemo(() => {
    return testimonialData.filter((t) => t.type === type);
  }, [type]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");

  // prevents stale index bugs for edge cases when type changes
  useEffect(() => {
    setCurrentTestimonial(0);
  }, [type]);

  useEffect(() => {
    if (filteredTestimonials.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentTestimonial(
        (currentTestimonial + 1) % filteredTestimonials.length
      );
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentTestimonial, filteredTestimonials]);

  const nextTestimonial = () => {
    setCurrentTestimonial(
      (currentTestimonial + 1) % filteredTestimonials.length
    );
    setSlideDirection("right");
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (currentTestimonial - 1 + filteredTestimonials.length) %
        filteredTestimonials.length
    );
    setSlideDirection("left");
  };

  const testimonial = filteredTestimonials[currentTestimonial];
  const testimonialClassName =
    slideDirection === "right" ? "animate-slideInRight" : "animate-slideInLeft";
  const testimonialKey = `${currentTestimonial}-${slideDirection}`;

  const logoSliderChangeHandler = (value: number) => {
    if (value === currentTestimonial) {
      return;
    } else {
      setCurrentTestimonial(value);
      if (currentTestimonial > value) {
        setSlideDirection("left");
      } else {
        setSlideDirection("right");
      }
    }
  };

  // Safely handle cases where no testimonials match the selected type
  if (filteredTestimonials.length === 0) {
    return null;
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-[#0E002A] via-[#1A0B3D] to-[#0E002A] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl px-6 py-16 mx-auto text-center lg:py-24">
          {/* Testimonial Container */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
              <figure key={testimonialKey}>
                {/* Quote Icon */}
                <div className="mb-8">
                  <svg
                    className="h-12 w-12 mx-auto text-pink opacity-60"
                    viewBox="0 0 24 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* Quote */}
                <blockquote className={`${testimonialClassName} mb-8`}>
                  <div className="min-h-[200px] md:min-h-[180px] flex items-center justify-center">
                    <p className="text-xl md:text-2xl leading-relaxed font-medium text-white/90 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>
                </blockquote>

                {/* Author Info */}
                <figcaption className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Image
                    className="w-16 h-16 rounded-full border-2 border-pink-400/30 object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                  />
                  <div className="text-center sm:text-left">
                    <div className="text-lg font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-pink font-medium">
                      {testimonial.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-12 space-x-6">
            <button
              className="group p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-pink-400/50 transition-all duration-300"
              onClick={prevTestimonial}
              aria-label="Previous Testimonial"
            >
              <FaArrowLeft className="w-5 h-5 text-white group-hover:text-pink transition-colors" />
            </button>

            {/* Progress indicators */}
            <div className="flex space-x-2">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => logoSliderChangeHandler(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? "w-8 bg-pink-400"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="group relative p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-pink-400/50 transition-all duration-300 overflow-hidden"
              onClick={nextTestimonial}
              aria-label="Next Testimonial"
            >
              <FaArrowRight className="w-5 h-5 text-white group-hover:text-pink transition-colors relative z-10" />
              {/* Progress ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-400 animate-spin opacity-60"
                style={{ animationDuration: "8s" }}
              />
            </button>
          </div>

          {/* Company logos navigation */}
          <div className="flex justify-center items-center mt-12 space-x-8">
            {filteredTestimonials.map((testimonial, index) => (
              <button
                key={index}
                onClick={() => logoSliderChangeHandler(index)}
                className={`transition-all duration-300 opacity-60 hover:opacity-100 ${
                  currentTestimonial === index
                    ? "opacity-100 scale-110"
                    : "hover:scale-105"
                }`}
                aria-label={`${testimonial.companyName} Testimonial`}
              >
                <div className="h-12 w-32 flex items-center justify-center">
                  <Image
                    src={testimonial.companyLogo}
                    alt={testimonial.companyName}
                    className="max-h-full max-w-full object-contain brightness-0 invert"
                    width={128}
                    height={48}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
