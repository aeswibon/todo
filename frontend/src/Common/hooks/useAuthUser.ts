import { createContext, useContext } from "react";

import {
  IRegister,
  JwtTokenObtainPair,
  LoginCredentials,
} from "../../Redux/api";
import { RequestResult } from "../../Utils/request/types";
import { User } from "../../types/task";

type SignInReturnType = RequestResult<JwtTokenObtainPair>;

type AuthContextType = {
  user: User | undefined;
  signIn: (creds: LoginCredentials) => Promise<SignInReturnType>;
  register: (creds: IRegister) => Promise<RequestResult<User>>;
  signOut: () => Promise<void>;
};

export const AuthUserContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthUserContext);

  if (!ctx) {
    throw new Error(
      "'useAuthContext' must be used within 'AuthUserProvider' only"
    );
  }

  return ctx;
};

export default function useAuthUser() {
  const { user } = useAuthContext();

  if (!user) {
    throw new Error("'useAuthUser' must be used within 'AppRouter' only");
  }

  return user;
}
