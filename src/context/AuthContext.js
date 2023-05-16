// import { createContext, useReducer } from "react";
// import AuthReducer from "./AuthReducer";

// const INITIAL_STATE = {
//     currentUser: null,
// };

// export const AuthContext = createContext(INITIAL_STATE);

// export const AuthContextProvider = ({children}) => {
//     const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

//     return (
//         <AuthContext.Provider value={{ currentUser: state.current, dispatch}}>
//             { children }
//         </AuthContext.Provider>
//     );
// };
import { createContext, useReducer, useEffect } from 'react';
import { auth } from '../firebase';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
};

const AuthContext = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case 'SIGNIN':
      return {
        ...state,
        currentUser: action.payload,
      };
    case 'SIGNOUT':
      return {
        ...state,
        currentUser: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: 'SIGNIN', payload: user });
      } else {
        dispatch({ type: 'SIGNOUT' });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.currentUser))
  }, [state.currentUser])
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
