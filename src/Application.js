import React, { useReducer, useEffect } from 'react';

import id from 'uuid/v4';

import Grudges from './Grudges';
import NewGrudge from './NewGrudge';

import initialState from './initialState';

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

const useLocalStorage = (initialState, key) => {
  const get = () => {
    let storage = localStorage.getItem(key);
    storage = JSON.parse(storage);
    debugger;
    if (storage && Object.keys(storage).length > 0) {
      return storage[key];
    }
    console.log('here2');
    return initialState;
  };

  const [grudges, dispatch] = useReducer(reducer, get());

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ [key]: grudges }));
  }, [grudges]);

  return [grudges, dispatch];
};

const Application = () => {
  const [grudges, dispatch] = useLocalStorage(initialState, 'my_grudges');

  const addGrudge = ({ person, reason }) => {
    dispatch({
      type: ADD_GRUDGE,
      payload: { person, reason, id: id(), forgiven: false }
    });
  };

  const toggleForgiveness = (id) => {
    dispatch({
      type: REMOVE_GRUDGE,
      payload: { id }
    });
  };

  return (
    <div className="Application">
      <NewGrudge onSubmit={addGrudge} />
      <Grudges grudges={grudges} onForgive={toggleForgiveness} />
    </div>
  );
};

export default Application;
