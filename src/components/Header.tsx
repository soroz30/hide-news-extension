import React from "react";
import logo from "../assets/images/logo@3x.svg";
import { getSvgUrl } from "../common";

const Header = ({ button }: { button: React.ReactNode }) => {
  return (
    <div className="App-header">
      <div className="fearlessLogoContainer">
        <img className="fearlessLogo" src={`${getSvgUrl(logo)}`} alt="Fear Less Logo" />
        <p className="fearlessLogoHeader">GoodNewsOnly</p>
      </div>
      {button}
    </div>
  );
};

export default Header;
