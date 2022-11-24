type WordItemProps = {
  word: string;
  onClick: () => void;
};

const WordItem = ({ word, onClick }: WordItemProps) => {
  return (
    <li className="wordItem" key={word}>
      {word}{" "}
      <span className="wordRemove" onClick={onClick} style={{ cursor: "pointer" }}>
        <a href="#" className="close"></a>
      </span>
    </li>
  );
};

export default WordItem;
