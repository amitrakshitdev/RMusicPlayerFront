// src/store/localStorageMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';

// Example of the saving middleware part (if you have one)
export const localStorageMiddleware: Middleware<object, object> = store => next => action => {
  const result = next(action);
  try {
    const state = store.getState();
    // You might want to serialize only specific parts of the state
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage:", err); // Add error logging
  }
  return result;
};

