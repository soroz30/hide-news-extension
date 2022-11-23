import React from "react";
import logo from "../assets/images/logo@3x.svg";
import { getSvgUrl } from "../common";

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="App-header">
      <div className="fearlessLogoContainer">
        <img className="fearlessLogo" src={`${getSvgUrl(logo)}`} alt="Fear Less Logo" />
        <p className="fearlessLogoHeader">GoodNewsOnly</p>
      </div>
      {children}
    </header>
  );
};

export default Header;
