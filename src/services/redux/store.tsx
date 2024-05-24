// store.ts

import { createStore, combineReducers } from 'redux';
import { authReducer } from './authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // Outros redutores podem ser adicionados aqui, se necessário
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default store;
