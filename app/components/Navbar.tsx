"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 shadow-soft px-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/assets/logo.png" alt="Institution Logo" width={40} height={40} className="h-10 w-10" />
              <span className="text-xl font-bold text-foreground">NPC Smart Report</span>
            </div>
            
            {/* Desktop Button */}
            <div className="hidden md:block">
              <Link href="/auth/login">
                <Button variant="hero" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Right-to-Left Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-background border-l border-border shadow-strong z-[70] transform transition-transform duration-300 ease-in-out md:hidden ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-lg font-bold text-foreground">Menu</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 p-6">
            <Link href="/login" onClick={() => setIsDrawerOpen(false)}>
              <Button variant="hero" size="lg" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
