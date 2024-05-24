import React, { useState, useEffect } from 'react';
import { TransactionPanel } from 'objects/TransactionPanel';
import { Buttons } from 'objects/Buttons';
import { FaMoneyBillTransfer, FaFileInvoiceDollar, FaFileInvoice, FaMoneyCheckDollar } from "react-icons/fa6";
import { Graph } from 'objects/Graph';
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

export const Transacoes = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [selectedButton, setSelectedButton] = useState("Saldo");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const handleButtonClick = (label: string) => {
    setSelectedButton(label);
  };

  const buttonData = [
    { icon: FaMoneyCheckDollar, label: "Saldo" },
    { icon: FaMoneyBillTransfer, label: "Nova transação" },
    { icon: FaFileInvoice, label: "Emitir Faturas" },
    { icon: FaFileInvoice, label: "Rastrear Faturas" }
  ];
  

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className='xl:flex'>
        <div className='xl:w-96 xl:h-screen'>
          <NavBar />
        </div>
        <div>
          <TransactionPanel selectedButton={selectedButton} />
          <div className='xl:flex xl:flex-col xl:items-center'>
            <Buttons buttonData={buttonData} onButtonClick={handleButtonClick} />
          </div>
        </div>
      </div>
    </>
  );
};
