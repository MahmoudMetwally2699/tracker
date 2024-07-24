import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkLogin, logout, login } from '../redux/authSlice';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const { userToken, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLogin());
  }, [dispatch]);

  const signIn = async (email, password) => {
    const result = await dispatch(login({ email, password }));
    return result.meta.requestStatus === 'fulfilled';
  };

  const signOut = () => {
    dispatch(logout());
  };

  return (
    <SessionContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
