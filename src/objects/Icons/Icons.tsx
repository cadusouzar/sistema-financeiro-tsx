import { IconType } from "react-icons";
import React from 'react';

type PropsIcons = {
  Icon: IconType;
  size?: string
  onClick?: () => void;
  className?: string
};

export const Icons: React.FC<PropsIcons> = ({ Icon, onClick, className, size = '70px' }) => {
  return (
    <div onClick={onClick} className={className}>
      <Icon size={size} color='white'/>
    </div>
  );
};