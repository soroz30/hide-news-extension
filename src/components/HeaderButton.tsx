import { getSvgUrl } from "../common";
import check from "../assets/images/check@3x.svg";

type HeaderButtonProps = {
  onClick: () => void;
  checked: boolean;
};

const HeaderButton = ({ onClick, checked }: HeaderButtonProps) => {
  return (
    <div className="hidingButton" onClick={onClick}>
      <input className="checkbox-input" id="hiding" type="checkbox" checked={checked} />
      <label className="checkbox" htmlFor="hiding">
        <span>
          <img src={`${getSvgUrl(check)}`} alt="active" />
        </span>
        <span className="hidingButtonLabel">Hiding Active</span>
      </label>
    </div>
  );
};

export default HeaderButton;
