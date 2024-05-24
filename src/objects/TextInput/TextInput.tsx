type PropsTextInput = {
  titulo: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: any
}

export const TextInput: React.FC<PropsTextInput> = ({ titulo, value, onChange, type = "text", min }) => {
  return(
    <div className="flex flex-col items-center">
      <h1 className="text-white text-center text-lg">{titulo}</h1>
      <input type={type} value={value} onChange={onChange} min={min} className="w-44 m-1 h-8 rounded-md text-center" />
    </div>
  )
}
