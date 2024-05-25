import React, { useState, useEffect } from 'react';
import { Icons } from 'objects/Icons';
import { MdAccountCircle, MdOutlineSupervisorAccount } from 'react-icons/md';
import { DropDown } from 'components/DropDown';
import { IoMenu, IoClose, IoHome } from 'react-icons/io5';
import { LinkTo } from 'objects/LinkTo';
import { ButtonText } from 'objects/ButtonText';
import { GrTransaction } from 'react-icons/gr';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from 'services/redux/store';
import { logoutUser } from 'services/redux/actions';

export const NavBar: React.FC = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();

  function logOut() {
    dispatch(logoutUser());
    //@ts-ignore
    navigation.navigate('Login');
  }

  function nomeCompleto(name: string) {
    if (name) {
      const nomes = name.split(' ');

      const letrasFormatadas = nomes.map((nome) => {
        return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
      });

      const nomeFormatado = letrasFormatadas.join(' ');
      return nomeFormatado;
    }
    return '';
  }

  function formatCPF(cpf: string) {
    if (!cpf) return '';
    const numericCPF = cpf.replace(/\D/g, '');

    const formattedCPF = numericCPF
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    return formattedCPF;
  }

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenuIcon = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeDropDown = () => {
    setIsOpen(false);
  };

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
    <div className='relative'>
      <div className='xl:h-screen xl:rounded-r-3xl xl:max-w-80 xl:justify-start min-h-24 xl:flex-col xl:shadow-custom flex items-center justify-between p-4 bg-panel-primary'>
        <Icons Icon={isMenuOpen ? IoClose : IoMenu} onClick={() => { toggleDropDown(); toggleMenuIcon(); }} className='xl:hidden' />
        <Icons 
          Icon={MdAccountCircle} 
          className='xl:mt-12' 
          size={windowWidth > 1280 ? '140px' : '70px'}
        />
        <div className='xl:flex xl:flex-col xl:gap-y-7 hidden'>
          <h1 className='text-white text-2xl font-montserrat text-center'>{nomeCompleto(userData?.nome || '')}</h1>
          <h1 className='text-white text-2xl font-montserrat text-center'>{formatCPF(userData?.cpf || '')}</h1>
          <div className='xl:flex xl:flex-col hidden'>
            <LinkTo to='/transacoes'>
              <ButtonText text='Home' icon={IoHome} onClick={closeDropDown} marginTop='mt-12'/>
            </LinkTo>
            <LinkTo to='/transacoes'>
              <ButtonText text='Transações' icon={GrTransaction} onClick={closeDropDown} marginTop='mt-12'/>
            </LinkTo>
            <LinkTo to='/contas'>
              <ButtonText text='Contas' icon={MdOutlineSupervisorAccount} onClick={closeDropDown} marginTop='mt-12'/>
            </LinkTo>
            <button className='font-montserrat text-2xl text-white flex justify-center mt-32 cursor-pointer' onClick={logOut}>
              Sair
            </button>
          </div>
        </div>
      </div>
      <DropDown isOpen={isOpen} closeDropDown={closeDropDown} />
    </div>
  );
};
