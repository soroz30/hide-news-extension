import React from "react";
import logo from "../assets/images/logo@3x.svg";

const getSvgUrl = (svg: any) => {
  if (window.chrome) {
    return window.chrome.runtime.getURL(svg.toString());
  }

  return svg;
};

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="App-header">
      <div className="fearlessLogoContainer">
        <img className="fearlessLogo" src={`${getSvgUrl(logo)}`} alt="Fear Less Logo" />
        <p className="fearlessLogoHeader">GoodNewsOnly</p>
      </div>
      {/* <Logo /> */}
      {children}
    </header>
  );
};

export default Header;
