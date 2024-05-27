import { ComboBox } from "objects/ComboBox";
import { Icons } from "objects/Icons";
import { TextInput } from "objects/TextInput";
import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import { api } from "services/api";
import { RootState } from "services/redux/store";
import Modal from 'react-modal';

type PropsTransactionPanel = {
  selectedButton: string;
};

type Conta = {
  id: number;
  idUsuario: number;
  numero: string;
  dataAbertura: string;
  tipo: string;
  agencia: string;
  status: string;
  saldo: number;
};

type Fatura = {
  id: number;
  idUsuario: number;
  dataFatura: string;
  dataVencimento: string;
  enderecoEmitente: string;
  descricaoItem: string;
  quantidade: string;
  precoUnitario: string;
  subtotal: number;
  status: string;
};

type Transacao = {
  id: number;
  idConta: number;
  valor: number;
  cpfDestino: string;
  contaDestino: string;
  dataTransacao: string;
  saldo: number;
};

type DadosContaTransacoes = {
  saldo: number;
  transacoes: Transacao[];
};

export const TransactionPanel: React.FC<PropsTransactionPanel> = ({ selectedButton }) => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [contas, setContas] = useState<Conta[]>([]);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [saldoUsuarioLogado, setSaldoUsuarioLogado] = useState<number>(0);
  const [contaUsuarioLogado, setContaUsuarioLogado] = useState<string>("");
  const [valorTransacao, setValorTransacao] = useState("");
  const [cpfRecebedorTransacao, setCpfRecebedorTransacao] = useState("");
  const [contaDestinoTransacao, setContaDestinoTransacao] = useState("");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [dataVencimento, setDataVencimento] = useState("");
  const [endereçoEmitente, setEndereçoEmitente] = useState("");
  const [descricaoItem, setDescricaoItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [status, setStatus] = useState("");
  const [faturaSelecionada, setFaturaSelecionada] = useState<Fatura | null>(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const response = await api.get(`/conta/lista-contas-usuario?idUsuario=${userData?.id}`);
        const contasData: Conta[] = response.data;
        setContas(contasData);

        const contaUsuario = contasData.find(conta => conta.idUsuario === userData?.id);
        if (contaUsuario) {
          setContaUsuarioLogado(contaUsuario.numero);
        }
      } catch (error) {
        console.error("Erro ao recuperar contas:", error);
      }
    };

    const fetchTransacoes = async () => {
      try {
        const response = await api.get(`/conta/dados-conta-transacoes?idUsuario=${userData?.id}`);
        const dadosContaTransacoes: DadosContaTransacoes = response.data;

        dadosContaTransacoes.transacoes.sort((a, b) => new Date(b.dataTransacao).getTime() - new Date(a.dataTransacao).getTime());

        setSaldoUsuarioLogado(dadosContaTransacoes.saldo);
        setTransacoes(dadosContaTransacoes.transacoes);
      } catch (error) {
        console.error("Erro ao recuperar transações:", error);
      }
    };

    const fetchSaldoUsuario = async () => {
      try {
        const response = await api.get(`/conta/lista-contas-usuario?idUsuario=${userData?.id}`);
        const saldoUsuario = response.data[0].saldo;
        setSaldoUsuarioLogado(saldoUsuario);
      } catch (error) {
        console.error("Erro ao recuperar saldo do usuário:", error);
      }
    };

    const fetchFaturas = async () => {
      try {
        const response = await api.get(`/conta/fatura?idUsuario=${userData?.id}`);
        const faturasData: Fatura[] = response.data;
        setFaturas(faturasData);
      } catch (error) {
        console.error("Erro ao recuperar contas:", error);
      }
    };

    if (selectedButton === "Saldo" && userData) {
      fetchContas();
      fetchTransacoes();
      fetchSaldoUsuario();
    }
    if (selectedButton === "Rastrear Faturas" && userData) {
      fetchFaturas();
    }
  }, [selectedButton, userData]);

  const novaFatura = async () => {
      // Obtém a data atual
      const dataAtual = new Date();
    
      // Formata a data da fatura manualmente
      const ano = dataAtual.getFullYear();
      const mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2);
      const dia = ('0' + dataAtual.getDate()).slice(-2);
      const hora = ('0' + dataAtual.getHours()).slice(-2);
      const minutos = ('0' + dataAtual.getMinutes()).slice(-2);
    
      const dataFaturaFormatada = `${ano}-${mes}-${dia}T${hora}:${minutos}`;
    
      const quantidadeNumerica = parseInt(quantidade);
      const precoNumerico = parseFloat(precoUnitario);
      
      if(!dataVencimento){
        alert('Selecione uma data de vencimento')
      }
      if(!endereçoEmitente){
        alert('Preencha o endereço para continuar')
      }
      if(!descricaoItem){
        alert('Descreva o item para continuar')
      }
      if(!quantidadeNumerica){
        alert('Descreva a quantidade de itens para continuar')
      }
      if(!precoNumerico){
        alert('Descreva preço de cada item para continuar')
      }
      if(!status){
        alert('Selecione o status da fatura para continuar')
      }

    try{
      
      const url = "/conta/fatura";
      const requestBody = {
        dataFatura: dataFaturaFormatada,
        dataVencimento: dataVencimento,
        enderecoEmitente: endereçoEmitente,
        idUsuario: userData?.id,
        descricaoItem: descricaoItem,
        quantidade: quantidadeNumerica.toString(),
        precoUnitario: precoNumerico.toString(),
        subtotal: (quantidadeNumerica * precoNumerico).toString(),
        status: status,
        ativo: 1
      };

      const response = await api.post(url, requestBody);
      console.log(requestBody)
      setDataVencimento("")
      setEndereçoEmitente("")
      setDescricaoItem("")
      setQuantidade("")
      setPrecoUnitario("")
      setStatus("")
      alert("Fatura criado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar conta:", error);
    }
    };

    const editarFatura = async () => {
      if (!faturaSelecionada) {
        console.error("Nenhuma conta selecionada para edição.");
        return;
      }
      try{
        if(!(faturaSelecionada.status === "PAGA")){
          alert('O status da fatura pode ser alternado apenas para "PAGA" em maiúsculo dando baixa na fatura atual');
          return;
        }
    
        const url = "/conta/fatura";
        const requestBody = {
          id: faturaSelecionada.id,
          dataFatura: faturaSelecionada.dataFatura,
          dataVencimento: faturaSelecionada.dataVencimento,
          enderecoEmitente: faturaSelecionada.enderecoEmitente,
          idUsuario: userData?.id,
          descricaoItem: faturaSelecionada.descricaoItem,
          quantidade: faturaSelecionada.quantidade,
          precoUnitario: faturaSelecionada.precoUnitario,
          subtotal: faturaSelecionada.subtotal,
          status: faturaSelecionada.status,
          ativo: 1
        };
        const response = await api.patch(url, requestBody);
        setFaturaSelecionada(null)
        console.log(requestBody)
        alert("Conta editada com sucesso!");
        closeModal()
      } catch (error) {
        console.error("Erro ao registrar conta:", error);
      }
    };

    const formatarData = (data: string) => {
      const [datePart, timePart] = data.split('T');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      return `${day}/${month}/${year} ${hour}:${minute}`;
    };

    const formatarSaldo = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const novaTransacao = async () => {
    try {
      if (!valorTransacao || !cpfRecebedorTransacao || !contaDestinoTransacao) {
        alert("Por favor, preencha todos os campos para a transação.");
        return;
      }

      const url = "/conta/transacao";
      const requestBody = {
        idUsuario: userData?.id,
        numeroConta: contaUsuarioLogado,
        valor: valorTransacao,
        cpfRecebedor: cpfRecebedorTransacao,
        numeroContaDestino: contaDestinoTransacao
      };
      const response = await api.post(url, requestBody);
      setValorTransacao("")
      setCpfRecebedorTransacao("");
      setContaDestinoTransacao("");
      alert("Transação feita com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar conta:", error);
      alert("Algo deu errado, confira os dados e tente novamente!")
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div className='m-5 font-montserrat'>
      {selectedButton === "Saldo" && (
        <>
          <div className="xl:min-w-transfer-panel-width xl:m-8">
            <div className='bg-panel-primary flex justify-center items-center shadow-custom w-full min-h-16 rounded-t-md'>
              <h1 className="text-white text-2xl">Saldo: {formatarSaldo(saldoUsuarioLogado)}</h1>
            </div>
            <div className='bg-panel-secondary shadow-custom xl:min-h-96 max-h-28 overflow-x-auto min-h-72 rounded-b-md'>
            <div className="flex flex-col ml-1 mr-1 gap-y-1">
                {transacoes.map((transacao) => (
                  <div key={transacao.id} className="flex flex-col rounded-lg items-center justify-center w-full h-10 mt-1 bg-white">
                    {transacao.idConta != userData?.id ? 
                      <>
                        <h1 className="text-gray-500 text-xl">
                          <span className="text-green-600">Transação recebida</span> | Valor: {formatarSaldo(transacao.valor)} | Data: {formatarData(transacao.dataTransacao)} | Conta remetente: {transacao.idConta}
                        </h1>
                      </>
                      :
                      <>
                        <h1 className="text-gray-500 text-xl">
                          <span className="text-red-600">Transação enviada</span> | Valor: {formatarSaldo(transacao.valor)} | Data: {formatarData(transacao.dataTransacao)} | Conta destinatária: {transacao.contaDestino}
                        </h1>
                      </>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {selectedButton === "Nova transação" && (
        <>
          <div className="xl:min-w-transfer-panel-width xl:m-8">
            <div className='bg-panel-primary flex justify-center items-center shadow-custom w-full min-h-16 rounded-t-md'>
              <h1 className="text-white text-2xl">Nova Transação</h1>
            </div>
            <div className='bg-panel-secondary flex flex-col items-center p-2 shadow-custom overflow-x-auto max-h-96 rounded-b-md'>
                <TextInput titulo="Valor" type="number" value={valorTransacao} onChange={(e) => setValorTransacao(e.target.value)} />
                <TextInput titulo="CPF do recebedor" value={cpfRecebedorTransacao} onChange={(e) => setCpfRecebedorTransacao(e.target.value)} />
                <TextInput titulo="Numero da conta de destino" value={contaDestinoTransacao} onChange={(e) => setContaDestinoTransacao(e.target.value)} />
              <button className="h-12 w-28 mt-2 mb-2 text-white bg-slate-800 rounded-xl shadow-custom" onClick={novaTransacao}>
                  Enviar
              </button>
            </div>
          </div>
        </>
      )}
      {selectedButton === "Emitir Faturas" && (
        <div className="xl:min-w-transfer-panel-width xl:m-8">
          <div className="bg-panel-primary flex justify-center items-center shadow-custom w-full min-h-16 rounded-t-md">
            <h1 className="text-white text-2xl">Registrar nova fatura</h1>
          </div> 
          <div className="bg-panel-secondary flex flex-col items-center p-2 ps-6 shadow-custom overflow-x-auto min-h-account-panel rounded-b-md">
            <TextInput titulo="Data de Vencimento da fatura" type="datetime-local" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} />
            <TextInput titulo="Endereço do emitente" type="text" value={endereçoEmitente} onChange={(e) => setEndereçoEmitente(e.target.value)} />
            <TextInput titulo="Descreva o item" type="text" value={descricaoItem} onChange={(e) => setDescricaoItem(e.target.value)} />
            <TextInput titulo="Quantidade de itens" type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
            <TextInput titulo="Preço unitário" type="number" value={precoUnitario} onChange={(e) => setPrecoUnitario(e.target.value)} />
            <ComboBox
              titulo="Status da fatura"
              value={status}
              onChange={(value: string, index: number | null) => {
                if (index !== null) {
                  setStatus(value); 
                }
              }}
              options={["", "ABERTA"]}
            />
            <button className="h-12 w-28 mt-2 mb-2 text-white bg-slate-800 rounded-xl shadow-custom" onClick={novaFatura}>
              Nova Fatura
            </button>
          </div>
        </div>
      )}
      {selectedButton === "Rastrear Faturas" && (
        <>
          <div className="xl:min-w-transfer-panel-width xl:m-8">
            <div className='bg-panel-primary flex justify-center items-center shadow-custom w-full min-h-16 rounded-t-md'>
              <h1 className="text-white text-2xl">Rastrear faturas</h1>
            </div>
            <div className='bg-panel-secondary shadow-custom overflow-x-auto min-h-account-panel max-h-96 rounded-b-md'>
              {faturas.map((fatura, index) => (
                <div key={index} className="flex gap-x-1 rounded-lg items-center justify-center w-full h-12 mt-1 bg-white">
                  <h1 className="text-gray-500 text-lg">Data de vencimento: <span className="text-blue-800 text-lg">{formatarData(fatura.dataVencimento)}</span></h1>
                  <h1 className="text-gray-500 text-lg">Item: <span className="text-blue-800 text-lg">{fatura.descricaoItem}</span></h1>
                  <h1 className="text-gray-500 text-lg">Quantidade: <span className="text-blue-800 text-lg">{fatura.quantidade}</span></h1>
                  <h1 className="text-gray-500 text-lg">Preço unitário: <span className="text-blue-800 text-lg">{formatarSaldo(parseFloat(fatura.precoUnitario))}</span></h1>
                  <h1 className="text-gray-500 text-lg">Total: <span className="text-blue-800 text-lg">{formatarSaldo(fatura.subtotal)}</span></h1>
                  <h1 className="text-gray-500 text-lg">Ultima edição: <span className="text-blue-800 text-lg">{formatarData(fatura.dataFatura)}</span></h1>
                  {fatura.status != "PAGA" ?
                  <>
                    <button className="bg-panel-primary text-white h-7 w-full max-w-24 p-1 rounded-lg" onClick={() => {
                    openModal();
                    setFaturaSelecionada(fatura)
                    }}>
                      Opções
                    </button>
                  </>
                  : <></> }
                </div>
              ))}
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    className={'right-auto bottom-auto mt-1/2 bg-panel-secondary w-1/2 ml-auto mr-auto font-montserrat text-white p-4'}
                  >
                    <div className="flex justify-between p-4">
                      <h2>Gerenciamento e edição de fatura</h2>
                      <button onClick={closeModal}>Fechar</button>
                    </div>
                    <div className="flex flex-col items-center text-black">
                      <TextInput titulo="Data de Vencimento da fatura" type="datetime-local" value={faturaSelecionada?.dataVencimento || ''} onChange={(e) => setFaturaSelecionada(prevState => prevState ? {...prevState, dataVencimento: e.target.value} : null)} />
                      <TextInput titulo="Endereço do emitente" type="text" value={faturaSelecionada?.enderecoEmitente || ''} onChange={(e) => setFaturaSelecionada(prevState => prevState ? {...prevState, enderecoEmitente: e.target.value} : null)} />
                      <TextInput titulo="Descreva o item" type="text" value={faturaSelecionada?.descricaoItem || ''} onChange={(e) => setFaturaSelecionada(prevState => prevState ? {...prevState, descricaoItem: e.target.value} : null)} />
                      <TextInput titulo="Quantidade de itens" type="number" value={faturaSelecionada?.quantidade || ''} onChange={(e) => setFaturaSelecionada(prevState => prevState ? {...prevState, quantidade: e.target.value} : null)} />
                      <TextInput titulo="Preço unitário" type="number" value={faturaSelecionada?.precoUnitario || ''} onChange={(e) => setFaturaSelecionada(prevState => prevState ? {...prevState, precoUnitario: e.target.value} : null)} />
                      <TextInput titulo="Status da fatura" type="text" value={faturaSelecionada?.status || ''} onChange={(e) => setFaturaSelecionada(prevState => prevState ? {...prevState, status: e.target.value} : null)} />
                      <button className="h-12 w-28 mt-2 mb-2 text-white bg-slate-800 rounded-xl shadow-custom" onClick={editarFatura}>
                        Editar fatura
                      </button>
                    </div>
                  </Modal>
            </div>
          </div>
        </>
      )}
    </div>
  );
};