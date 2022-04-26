import React, { createContext, useReducer, useCallback } from 'react';
import initialState from './initialState';

import id from 'uuid/v4';

export const GrudgeContext = createContext();

const ADD_GRUDGE = 'ADD_GRUDGE';
const REMOVE_GRUDGE = 'REMOVE_GRUDGE';

const reducer = (state, action) => {
  if (action.type === ADD_GRUDGE) {
    return [{ ...action.payload }, ...state];
  }
  if (action.type === REMOVE_GRUDGE) {
    return state.map((grudge) => {
      if (grudge.id !== action.payload.id) return grudge;
      return { ...grudge, forgiven: !grudge.forgiven };
    });
  }
  return state;
};

export const GrudgeProvider = ({ children }) => {
  const [grudges, dispatch] = useReducer(reducer, initialState);

  const addGrudge = useCallback(
    ({ person, reason }) => {
      dispatch({
        type: ADD_GRUDGE,
        payload: { person, reason, id: id(), forgiven: false }
      });
    },
    [dispatch]
  );

  const toggleForgiveness = useCallback(
    (id) => {
      dispatch({
        type: REMOVE_GRUDGE,
        payload: { id }
      });
    },
    [dispatch]
  );

  const value = { grudges, addGrudge, toggleForgiveness };

  return (
    <GrudgeContext.Provider value={value}>{children}</GrudgeContext.Provider>
  );
};
