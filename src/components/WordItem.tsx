import { getSvgUrl } from "../common";
import x from "../assets/images/x@3x.svg";

type WordItemProps = {
  word: string;
  onClick: () => void;
};

const WordItem = ({ word, onClick }: WordItemProps) => {
  return (
    <li className="wordItem" key={word}>
      {word}{" "}
      <button className="wordRemove" onClick={onClick}>
        <img src={`${getSvgUrl(x)}`} alt="Remove word" className="wordRemoveCross" />
      </button>
    </li>
  );
};

export default WordItem;
