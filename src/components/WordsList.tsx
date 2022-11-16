import React from "react";

const WordsList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hiddenWords">
      <p>Your muted words:</p>
      <ul className="wordsList">{children}</ul>
    </div>
  );
};

export default WordsList;
