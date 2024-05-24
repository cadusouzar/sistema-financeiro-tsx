import { IoHome } from 'react-icons/io5';
import { GrTransaction } from 'react-icons/gr';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { ButtonText } from 'objects/ButtonText';
import { LinkTo } from 'objects/LinkTo';

type DropDownProps = {
  isOpen: boolean;
  closeDropDown: () => void;
};

export const DropDown: React.FC<DropDownProps> = ({ isOpen, closeDropDown }) => {
  return (
    <div className={`absolute z-10 h-screen w-screen bg-panel-secondary dropdown transition-all duration-300 transform origin-top-left ${isOpen ? 'scale-100' : 'scale-0'}`}>
      <div className='flex flex-col'>
        <LinkTo to='/transacoes'>
          <ButtonText text='Home' icon={IoHome} onClick={closeDropDown} />
        </LinkTo>
        <LinkTo to='/transacoes'>
          <ButtonText text='Transações' icon={GrTransaction} onClick={closeDropDown} />
        </LinkTo>
        <LinkTo to='/contas'>
          <ButtonText text='Contas' icon={MdOutlineSupervisorAccount} onClick={closeDropDown} />
        </LinkTo>
      </div>
      <a className='font-montserrat text-2xl text-white flex justify-center mt-48' onClick={closeDropDown}>
        <h1>Sair</h1>
      </a>
    </div>
  );
};