// Import necessary modules
"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Correct import for App Router

export default function Home() {
  const router = useRouter(); // Initialize the router

  const handleGetStarted = () => {
    router.push("/email"); // Navigate to the /sign route
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center space-y-8">
        {/* Heading */}
        <h1 className="text-4xl font-bold">
        Generates automatically  contextual responses to client emails 
        </h1>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="primary" 
            className="px-6 py-2" 
            onClick={handleGetStarted} // Add onClick handler
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
      </div>
    </div>
  );
}
