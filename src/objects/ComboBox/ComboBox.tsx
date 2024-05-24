type PropsComboBox = {
  titulo: string;
  value?: string;
  onChange?: (value: string, index: number | null) => void;
  options: string[];
};

export const ComboBox: React.FC<PropsComboBox> = ({ titulo, value, onChange, options }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex;
    if (onChange) {
      onChange(event.target.value, selectedIndex !== -1 ? selectedIndex : null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white text-center text-lg">{titulo}</h1>
      <select
        id={titulo}
        value={value}
        onChange={handleChange}
        className="w-44 m-1 h-8 rounded-md text-center"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

