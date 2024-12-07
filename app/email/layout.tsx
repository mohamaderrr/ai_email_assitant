import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode; // Type for the children prop
}

function layout({ children }: LayoutProps) {
  return (
    <div>
      {children}
    </div>
  );
}

export default layout;
