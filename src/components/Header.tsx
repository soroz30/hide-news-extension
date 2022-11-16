import React from "react";

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="App-header">
      <img className="fearlessLogo" src="/logo.png" alt="Fear Less Logo" />
      {children}
    </header>
  );
};

export default Header;
