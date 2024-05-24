import { Icons } from "objects/Icons"
import { IconType } from "react-icons"

type propsButtonText = {
  text: string
  icon: IconType
  onClick: () => void
  marginTop?: string
}

export const ButtonText: React.FC<propsButtonText> = ({ text, icon, onClick, marginTop = 'mt-20' }) => {
  return (
    <div className={`flex justify-center gap-x-2 ${marginTop} items-end font-montserrat`}>
      <Icons Icon={icon} />
      <h1 className='text-white text-2xl' onClick={onClick}>{text}</h1>
    </div>
  )
}
