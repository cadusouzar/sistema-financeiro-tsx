import React, { useState } from 'react';
import { Buttons } from 'objects/Buttons';
import { Graph } from 'objects/Graph';
import { HiUserAdd } from "react-icons/hi";
import { ImUsers } from "react-icons/im";
import { FaUserAlt } from "react-icons/fa";
import { AccountPanel } from 'objects/AccountPanel';
import { NavBar } from 'components/NavBar';
import { useSelector } from 'react-redux';
import { RootState } from 'services/redux/store';


export const data = [
  ["Task", "Hours per Day"],
  ["Work", 11],
  ["Eat", 2],
  ["Commute", 2],
  ["Watch TV", 2],
  ["Sleep", 7],
];
export const options = {
  title: "My Daily Activities",
};

export const Contas = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [selectedButton, setSelectedButton] = useState("Registrar Conta");

  const handleButtonClick = (label: string) => {
    setSelectedButton(label);
  };

  const buttonData = userData.cargo === "MASTER" ? [
    { icon: HiUserAdd , label: "Registrar Conta" },
    { icon: ImUsers , label: "Gerenciar Contas" },
    { icon: FaUserAlt , label: "Novo Usuário" },
    { icon: FaUserAlt , label: "Meu Usuário" }
  ] : [
    { icon: FaUserAlt , label: "Meu Usuário" }
  ];

  return(
    <>
      <div className='xl:flex'>
        <div className='xl:w-96 xl:h-screen'>
          <NavBar/>
        </div>
        <div>
          <AccountPanel selectedButton={userData.cargo == "USUARIO"? "Meu Usuário" : selectedButton} />
          <div className='xl:flex xl:flex-col xl:items-center'>
            <Buttons buttonData={buttonData} onButtonClick={handleButtonClick} />
          </div>
        </div>
      </div>
    </>
  );
};
