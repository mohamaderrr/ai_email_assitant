"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const fullText = "Generates automatically contextual responses to client emails";
  const words = fullText.split(" ");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);

  useEffect(() => {
    if (displayedWords.length < words.length) {
      const timer = setTimeout(() => {
        setDisplayedWords(prevWords => [...prevWords, words[prevWords.length]]);
      }, 200); // Adjust this value to change the speed of word appearance

      return () => clearTimeout(timer);
    }
  }, [displayedWords, words]);

  const handleGetStarted = () => {
    router.push("/signin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center space-y-6">
        {/* Dynamic Heading */}
        <h1 className="text-4xl font-bold h-24 sm:h-16">
          {displayedWords.join(" ")}
        </h1>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="primary" 
            className="px-6 py-2" 
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
          <Button 
            variant="secondary" 
            className="px-6 py-2"
          >
            Watch a Demo
          </Button>
        </div>

        {/* Developed by text - now below buttons with bold font */}
        <div className="text-green-500 text-sm font-bold">
          Developed by mamane.tech
        </div>
      </div>
    </div>
  );
}

