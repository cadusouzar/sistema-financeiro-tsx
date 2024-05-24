import React, { useEffect, useState } from "react";
import { TextInput } from "objects/TextInput";
import { api } from "services/api";
import { useSelector } from "react-redux";
import { RootState } from "services/redux/store";
import { ComboBox } from "objects/ComboBox";
import Modal from 'react-modal';

type PropsAccountPanel = {
  selectedButton: string;
};

type Conta = {
  id: number;
  idTitular: number;
  numero: string;
  dataAbertura: string;
  tipo: string;
  saldo: number;
  status: string;
  agencia: string;
};

type Usuario = {
  id: number;
  nome: string;
};

export const AccountPanel: React.FC<PropsAccountPanel> = ({ selectedButton }) => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [nomeUsuario, setnomeUsuario] = useState("");
  const [cpfUsuario, setcpfUsuario] = useState("");
  const [emailUsuario, setemailUsuario] = useState("");
  const [cargoUsuario, setcargoUsuario] = useState("");
  const [senhaUsuario, setsenhaUsuario] = useState("");
  const [numeroConta, setNumeroConta] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [tipoConta, setTipoConta] = useState("");
  const [agencia, setAgencia] = useState("");
  const [statusConta, setStatusConta] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [senhaAtual, setsenhaAtual] = useState("");
  const [senhaNova, setsenhaNova] = useState("");
  const [contas, setContas] = useState<Conta[]>([]);
  const [contasPorMaster, setContasPorMaster] = useState<Usuario[]>([]);
  const [idUsuarioSelecionado, setIdUsuarioSelecionado] = useState<number | null>(null);
  const [contaSelecionada, setContaSelecionada] = useState<Conta | null>(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const novaConta = async () => {
    if (!tipoConta) {
      alert("Por favor, selecione o tipo da conta do usuário.");
      return;
    }

    if (!statusConta) {
      alert("Por favor, selecione o status da conta do usuário.");
      return;
    }
  
    if (idUsuarioSelecionado === null) {
      alert("Por favor, selecione um titular para a conta.");
      return;
    }
  
    try {
      const url = "/conta";
      const requestBody = {
        idUsuario: idUsuarioSelecionado,
        numeroConta,
        tipoConta,
        agenciaConta: agencia,
        statusConta,
        saldoInicial
      };
      const response = await api.post(url, requestBody);
      setIdUsuarioSelecionado(null);
      setNumeroConta("");
      setTipoConta("");
      setAgencia("");
      setStatusConta("");
      setSaldoInicial("");
      alert("Conta registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar conta:", error);
    }
  };

  useEffect(() => {
    const fetchTitulares = async () => {
      try {
        if (!userData) return;
        const response = await api.get(`/usuario/lista-usuarios?idUsuario=${userData?.id}`);
        setContasPorMaster(response.data);
      } catch (error) {
        console.error("Erro ao obter titulares:", error);
      }
    };

    fetchTitulares();

    if (selectedButton !== "Gerenciar Contas") {
      return;
    }
  
    const fetchContas = async () => {
      try {
        if (contasPorMaster.length === 0) return;

        const contasPromises = contasPorMaster.map(usuario =>
          api.get(`/conta/lista-contas-usuario?idUsuario=${usuario.id}`)
        );
        
        const contasResponses = await Promise.all(contasPromises);
        const todasContas = contasResponses.flatMap(response => response.data);
        setContas(todasContas);
      } catch (error) {
        console.error("Erro ao recuperar contas:", error);
      }
    };
  
    if (selectedButton === "Gerenciar Contas" && userData) {
      fetchContas();
    }
  }, [selectedButton, userData, contasPorMaster]);

  const novoUsuario = async () => {
    try {
      if (!cargoUsuario) {
        alert("Por favor, selecione o cargo do usuário.");
        return;
      }
      const url = "/usuario/novo-usuario";
      const requestBody = {
        nome: nomeUsuario,
        email: emailUsuario,
        senha: senhaUsuario,
        cpf: cpfUsuario,
        cargo: cargoUsuario,
        idMaster: userData?.id
      };
      const response = await api.post(url, requestBody);
      setnomeUsuario("");
      setemailUsuario("");
      setsenhaUsuario("");
      setcpfUsuario("");
      setcargoUsuario("");
      alert("Usuario criado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar conta:", error);
    }
  };

  const handleCargoChange = (value: string) => {
    setcargoUsuario(value);
  };

  const trocaSenha = async () => {
    const url = `/usuario/nova-senha?idUsuario=${userData?.id}&senhaAtual=${senhaAtual}&novaSenha=${senhaNova}`;
    await api.patch(url)
      .then((resp) => {
        if(resp.data){
          setsenhaAtual('');
          setsenhaNova('');
        }else{
          alert("Senha trocada com sucesso!");
        }
      })
      .catch((err) => console.log(err));
  };

  const formatarData = (data: string) => {
    const partes = data.split('T')[0].split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const editarConta = async () => {
    if (!contaSelecionada) {
      console.error("Nenhuma conta selecionada para edição.");
      return;
    }
    try{
      if(!(contaSelecionada.tipo === "CORRENTE" || contaSelecionada.tipo === 'POUPANÇA')){
        alert('O tipo da conta deve ser "CORRENTE" ou "POUPANÇA" em letras maiúsculas');
        return;
      }
      if(!(contaSelecionada.status === "ABERTA" || contaSelecionada.status === 'FECHADA')){
        alert('O status da conta deve ser "ABERTA" ou "FECHADA" em letras maiúsculas');
        return;
      }
  
      const url = "/conta";
      const requestBody = {
        id: contaSelecionada.id,
        idUsuario: contaSelecionada.id,
        numero: contaSelecionada.numero,
        tipo: contaSelecionada.tipo,
        agencia: contaSelecionada.agencia,
        status: contaSelecionada.status,
        saldo: contaSelecionada.saldo
      };
      const response = await api.patch(url, requestBody);
      setContaSelecionada(null)
      
      alert("Conta editada com sucesso!");
      closeModal()
    } catch (error) {
      console.error("Erro ao registrar conta:", error);
    }
  };



  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const formatarSaldo = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="m-5 font-montserrat">
      {selectedButton === "Registrar Conta" && (
        <div className="xl:min-w-transfer-panel-width xl:m-8">
          <div className="bg-panel-primary flex justify-center items-center shadow-custom w-full min-h-16 rounded-t-md">
            <h1 className="text-white text-2xl">Registrar nova conta</h1>
          </div>
          <div className="bg-panel-secondary flex flex-col items-center p-2 ps-6 shadow-custom overflow-x-auto min-h-account-panel rounded-b-md">
            <TextInput titulo="Número da conta" type="number" value={numeroConta} onChange={(e) => setNumeroConta(e.target.value)} />
            <ComboBox
              titulo="Titular (apenas usuários criados por você)"
              value={nomeTitular}
              onChange={(value: string, index: number | null) => {
                if (index !== null) {
                  if (index === 0) {
                    setIdUsuarioSelecionado(null);
                  } else {
                    setIdUsuarioSelecionado(contasPorMaster[index - 1].id);
                  }
                  setNomeTitular(value);
                }
              }}
              options={["", ...contasPorMaster.map((usuario) => usuario.nome)]}
            />
            <ComboBox
              titulo="Tipo da conta"
              value={tipoConta}
              onChange={(value: string, index: number | null) => {
                if (index !== null) {
                  setTipoConta(value); 
                }
              }}
              options={["", "CORRENTE", "POUPANÇA"]}
            />
            <TextInput titulo="Agência" type="number" value={agencia} onChange={(e) => setAgencia(e.target.value)} />
            <ComboBox
              titulo="Status da conta"
              value={statusConta}
              onChange={(value: string, index: number | null) => {
                if (index !== null) {
                  setStatusConta(value); 
                }
              }}
              options={["", "Aberta"]}
            />
            <TextInput titulo="Saldo inicial" type="number" value={saldoInicial} onChange={(e) => setSaldoInicial(e.target.value)} />
            <button className="h-12 w-28 mt-2 mb-2 text-white bg-slate-800 rounded-xl shadow-custom" onClick={novaConta}>
              Registrar
            </button>
          </div>
        </div>
      )}
      {selectedButton === "Gerenciar Contas" && (
        <>
          <div className="xl:min-w-transfer-panel-width xl:m-8">
            <div className='bg-panel-primary flex justify-center items-center shadow-custom w-full min-h-16 rounded-t-md'>
              <h1 className="text-white text-2xl">Gerenciar Contas</h1>
            </div>
            <div className='bg-panel-secondary shadow-custom overflow-x-auto min-h-account-panel max-h-96 rounded-b-md'>
              {contas.map((conta, index) => (
                <div key={index} className="flex gap-x-2 rounded-lg items-center justify-center w-full h-12 mt-1 bg-white">
                  <h1 className="text-gray-500 text-lg">Agência: <span className="text-blue-800 text-lg">{conta.agencia}</span></h1>
                  <h1 className="text-gray-500 text-lg">Número da conta: <span className="text-blue-800 text-lg">{conta.numero}</span></h1>
                  <h1 className="text-gray-500 text-lg">Saldo: <span className="text-blue-800 text-lg">{formatarSaldo(conta.saldo)}</span></h1>
                  <h1 className="text-gray-500 text-lg">Status: <span className="text-blue-800 text-lg">{conta.status}</span></h1>
                  <h1 className="text-gray-500 text-lg">Tipo de conta: <span className="text-blue-800 text-lg">{conta.tipo}</span></h1>
                  <h1 className="text-gray-500 text-lg">Ultima edição: <span className="text-blue-800 text-lg">{formatarData(conta.dataAbertura)}</span></h1>
                  <button className="bg-panel-primary text-white h-7 w-full max-w-24 p-1 rounded-lg" onClick={() => {
                    openModal();
                    setContaSelecionada(conta);
                  }}>
                    Opções
                  </button>
                </div>
              ))}
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    className={'right-auto bottom-auto mt-1/2 bg-panel-secondary w-1/2 ml-auto mr-auto font-montserrat text-white p-4'}
                  >
                    <div className="flex justify-between p-4">
                      <h2>Gerenciamento e edição de conta</h2>
                      <button onClick={closeModal}>Fechar</button>
                    </div>
                    <div className="flex flex-col items-center text-black">
                      <TextInput titulo='Número da conta' type="number" value={contaSelecionada?.numero || ''} onChange={(e) => setContaSelecionada(prevState => prevState ? {...prevState, numero: e.target.value} : null)} />
                      <TextInput titulo='Tipo da conta' value={contaSelecionada?.tipo || ''} onChange={(e) => setContaSelecionada(prevState => prevState ? {...prevState, tipo: e.target.value} : null)} />
                      <TextInput titulo='Agência da conta' type="number" value={contaSelecionada?.agencia || ''} onChange={(e) => setContaSelecionada(prevState => prevState ? {...prevState, agencia: e.target.value} : null)} />
                      <TextInput titulo='Status da conta' value={contaSelecionada?.status || ''} onChange={(e) => setContaSelecionada(prevState => prevState ? {...prevState, status: e.target.value} : null)} />
                      <TextInput titulo='Saldo da conta' type="number" value={contaSelecionada?.saldo?.toString() || ''} onChange={(e) => setContaSelecionada(prevState => prevState ? {...prevState, saldo: parseFloat(e.target.value)} : null)} />
                      <button className="h-12 w-28 mt-2 mb-2 text-white bg-slate-800 rounded-xl shadow-custom cursor-pointer" onClick={editarConta}>
                        Editar
                      </button>
                    </div>
                  </Modal>
            </div>
          </div>
        </>
      )}
      {selectedButton === "Novo Usuário" && (
        <>
          <div className="xl:min-w-transfer-panel-width xl:m-8">
            <div className='bg-panel-primary flex justify-center items-center shadow-custom w-full min-h-16 rounded-t-md'>
              <h1 className="text-white text-2xl">Registrar novo usuário</h1>
            </div>
            <div className='bg-panel-secondary flex flex-col items-center p-2 ps-6 shadow-custom overflow-x-auto min-h-account-panel rounded-b-md'>
              <TextInput titulo='Nome do usuário' value={nomeUsuario} onChange={(e) => setnomeUsuario(e.target.value)} />
              <TextInput titulo='CPF do usuário' value={cpfUsuario} onChange={(e) => setcpfUsuario(e.target.value)} />
              <TextInput titulo='Email do usuário' value={emailUsuario} onChange={(e) => setemailUsuario(e.target.value)} />
              <ComboBox titulo='Cargo do usuário' value={cargoUsuario} onChange={handleCargoChange} options={["", "MASTER", "USUÁRIO"]} />
              <TextInput titulo='Senha do usuário' value={senhaUsuario} onChange={(e) => setsenhaUsuario(e.target.value)} />
              <button className="h-12 w-28 mt-2 mb-2 text-white bg-slate-800 rounded-xl shadow-custom cursor-pointer" onClick={novoUsuario}>
                Criar
              </button>
            </div>
          </div>
        </>
      )}
      {selectedButton === "Meu Usuário" && (
        <>
          <div className="xl:min-w-transfer-panel-width xl:m-8">
            <div className='bg-panel-primary flex justify-center items-center shadow-custom w-full min-h-16 rounded-t-md'>
              <h1 className="text-white text-2xl">Alterar senha</h1>
            </div>
            <div className='bg-panel-secondary shadow-custom flex flex-col p-8 items-center max-h-28 overflow-x-auto min-h-72 rounded-b-md'>
              <TextInput titulo='Senha anterior' value={senhaAtual} onChange={(e) => setsenhaAtual(e.target.value)} />
              <TextInput titulo='Nova senha' value={senhaNova} onChange={(e) => setsenhaNova(e.target.value)} />
              <button className="h-12 w-28 mt-2 mb-2 text-white bg-slate-800 rounded-xl shadow-custom cursor-pointer" onClick={trocaSenha}>
                Salvar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
