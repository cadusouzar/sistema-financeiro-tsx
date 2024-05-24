import {Routes, Route, Navigate} from 'react-router-dom'
import { Contas } from 'pages/Contas'
import { Transacoes } from 'pages/Transações'
import { Login } from 'pages/Login'

export const Rotas = () => {
  return(
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/transacoes" element={<Transacoes/>} />
      <Route path="/contas" element={<Contas/>}/>
      <Route path="*" element={<Navigate to="/login"/>} />
    </Routes>
  )
}