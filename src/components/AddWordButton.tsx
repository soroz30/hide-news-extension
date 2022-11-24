import plus from "../assets/images/plus@3x.svg";
import { getSvgUrl } from "../common";

type AddWordButtonProps = {
  onClick: () => void;
};

const AddWordButton = ({ onClick }: AddWordButtonProps) => {
  return (
    <button className="buttonAdd" onClick={onClick}>
      <img src={`${getSvgUrl(plus)}`} alt="plus" />
      <span className="buttonAddLabel">Add</span>
    </button>
  );
};

export default AddWordButton;
