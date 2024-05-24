import React, { useState } from 'react';
import { TextInput } from 'objects/TextInput';

import { useDispatch } from 'react-redux';
import { setUserData } from 'services/redux/actions';
import { api } from 'services/api';
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const goLogin = async () => {
    if (!login || !password) {
      alert("Login e Senha não coincidem");
      return;
    }
    const url = `/usuario/login?cpf=${login}&senha=${password}`;
    await api.get(url)
      .then((resp) => {
        if(resp.data){
        dispatch(setUserData(resp.data)); 
        //@ts-ignore
        navigate("/transacoes")
        setLogin('')
        setPassword('')
        }else{
          alert("Login ou senha errados!");
        }
      })
      .catch((err) => console.log(err));
  };

  return(
    <>
      <div className='flex font-montserrat justify-center xl:justify-normal mt-48 xl:mt-0'>
        <div className='min-w-80 xl:min-w-96 xl:min-h-screen p-20 rounded-3xl xl:rounded-none xl:p-0 bg-panel-primary xl:rounded-r-3xl flex flex-col justify-center gap-y-10'>
          <TextInput titulo='Login' value={login} onChange={handleLoginChange} />
          <TextInput titulo='Senha' type='password' value={password} onChange={handlePasswordChange} />
          <button className='font-montserrat text-2xl text-white flex justify-center mt-24 xl:mt-32 cursor-pointer' onClick={goLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  )
}
