import { Action } from 'redux'; // Importe o tipo Action do Redux

export interface GenericAction<T extends string> extends Action {
  type: T;
  payload?: any;
}

const initialState = {
  userData: null,
  localizacaoContatoData: null,
};

export const authReducer = (state = initialState, action: GenericAction<string>) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        userData: null,
      };
    default:
      return state;
  }
};
