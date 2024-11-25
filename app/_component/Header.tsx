import { Button } from "@/components/ui/button";
import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-6 bg-gray-600 text-white">
      {/* Logo and Text */}
      <div className="flex items-center space-x-4">
        <img src="/mamane_tech_logo.jpeg" alt="Logo" className="w-10 h-10" />
        <span className="text-lg font-semibold">AI Email Assistant</span>
      </div>

      {/* Button */}
      <Button variant="destructive">Dashboard</Button>
    </header>
  );
};

export default Header;
