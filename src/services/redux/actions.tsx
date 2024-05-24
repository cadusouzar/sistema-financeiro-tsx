export const setUserData = (data:object) => {
  return {
    type: 'SET_USER_DATA',
    payload: data,
  };
};

export const logoutUser = () => {
  return {
    type: 'LOGOUT_USER',
  };
};

