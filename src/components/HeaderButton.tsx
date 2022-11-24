import { getSvgUrl } from "../common";
import check from "../assets/images/check@3x.svg";

type HeaderButtonProps = {
  onClick: () => void;
  checked: boolean;
};

const HeaderButton = ({ onClick, checked }: HeaderButtonProps) => {
  return (
    <button className="hidingButton" onClick={onClick}>
      <span className="hidingButtonCheckbox">
        <img src={`${getSvgUrl(check)}`} alt="active" className={checked ? "visible" : "hidden"} />
      </span>
      <span className="hidingButtonLabel">Hiding Active</span>
    </button>
  );
};

export default HeaderButton;
