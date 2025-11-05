"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ["/assets/hero-1.jpg", "/assets/hero-2.jpg", "/assets/hero-3.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="relative min-h-screen bg-gradient-hero pt-16 px-8">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-foreground">Welcome to the </span>
              <span className="text-primary font-extrabold">
                Future
              </span>
              <span className="text-foreground"> of </span>
              <span className="text-primary font-extrabold">
                Institutional Reporting
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Streamline your reporting processes with our advanced platform. Efficient, secure, and designed for excellence.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="hero" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-strong animate-fade-in">
            {images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={img}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-medium transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-medium transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? "w-8 bg-primary" : "w-2 bg-background/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
