import { Icons } from 'objects/Icons';
import { IconType } from 'react-icons';
import React from 'react';

interface ButtonData {
  icon: IconType;
  label: string;
}

interface ButtonsProps {
  buttonData: ButtonData[];
  onButtonClick: (label: string) => void;
}

export const Buttons: React.FC<ButtonsProps> = ({ buttonData, onButtonClick }) => {
  const handleButtonClick = (label: string) => {
    onButtonClick(label);
  };

  return (
    <div className='m-5 flex gap-x-2 overflow-y-auto bg-white rounded-lg'>
      {buttonData.map((button, index) => (
        <div key={index} className='cursor-pointer m-2 min-w-56 gap-y-2 min-h-28 rounded-lg flex flex-col justify-center items-center bg-panel-primary shadow-custom font-montserrat text-2xl text-white' onClick={() => handleButtonClick(button.label)}>          
          <div className='mt-2'>
            <Icons Icon={button.icon}/>
          </div>
          <h1>{button.label}</h1>
        </div>
      ))}
    </div>
  );
};
