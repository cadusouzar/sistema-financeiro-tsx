import './App.css';
import { ResetStyles } from 'components/ResetStyles';
import { NavBar } from 'components/NavBar';
import { Rotas } from 'routes';
import { Provider } from 'react-redux';
import store from 'services/redux/store';
function App() {
  return (
    <>
      <Provider store={store}>
        <ResetStyles/>
        <Rotas/>
      </Provider>
    </>
  );
}

export default App;