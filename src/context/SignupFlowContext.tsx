import React, {createContext, useContext, useState, ReactNode} from 'react';
import {RegisterPayload} from '../api/auth';

type SignupData = Partial<RegisterPayload> & {
  otp?: string;
  password?: string | number; // from first step
};

interface SignupFlowContextValue {
  data: SignupData;
  update: (patch: Partial<SignupData>) => void;
  reset: () => void;
}

const SignupFlowContext = createContext<SignupFlowContextValue | undefined>(
  undefined,
);

export const SignupFlowProvider = ({children}: {children: ReactNode}) => {
  const [data, setData] = useState<SignupData>({});

  const update = (patch: Partial<SignupData>) => {
    setData(prev => ({
      ...prev,
      ...patch,
    }));
  };

  const reset = () => setData({});

  return (
    <SignupFlowContext.Provider value={{data, update, reset}}>
      {children}
    </SignupFlowContext.Provider>
  );
};

export const useSignupFlow = (): SignupFlowContextValue => {
  const ctx = useContext(SignupFlowContext);
  if (!ctx) {
    throw new Error('useSignupFlow must be used within SignupFlowProvider');
  }
  return ctx;
};
