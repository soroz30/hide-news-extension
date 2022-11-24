type AddWordInputProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder: string;
};

const AddWordInput = ({ value, onChange, onKeyDown, placeholder }: AddWordInputProps) => {
  return (
    <input className="addWordInput" value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown} />
  );
};

export default AddWordInput;
