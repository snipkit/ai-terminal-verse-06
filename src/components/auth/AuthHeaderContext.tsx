
import React, { createContext } from 'react';

type AuthHeaderContextType = (display: boolean) => void;

const AuthHeaderContext = createContext<AuthHeaderContextType>(() => {});

export default AuthHeaderContext;
