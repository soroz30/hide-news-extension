type WordItemProps = {
  word: string;
  onClick: () => void;
};

const WordItem = ({ word, onClick }: WordItemProps) => {
  return (
    <li className="wordItem" key={word}>
      {word}{" "}
      <button className="wordRemove" onClick={onClick}>
        <span className="close" />
      </button>
    </li>
  );
};

export default WordItem;
