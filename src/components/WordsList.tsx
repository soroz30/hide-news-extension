import React from "react";

const WordsList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hiddenWords">
      <p className="mutedWords">Your muted words:</p>
      <ul className="wordsList">{children}</ul>
    </div>
  );
};

export default WordsList;
