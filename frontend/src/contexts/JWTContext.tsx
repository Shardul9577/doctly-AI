import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { BACKEND_URL } from '../config';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
  };
  [Types.Login]: undefined;
  [Types.Logout]: undefined;
  [Types.Register]: undefined;
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof JWTAuthPayload];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
};

const JWTReducer = (state: AuthState, action: JWTActions): AuthState => {
  switch (action.type) {
    case Types.Initial:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
      };
    case Types.Login:
      return {
        ...state,
        isAuthenticated: true,
      };
    case Types.Logout:
      return {
        ...state,
        isAuthenticated: false,
      };
    case Types.Register:
      return {
        ...state,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const router = useRouter();

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       const accessToken =
  //         typeof window !== 'undefined'
  //           ? localStorage.getItem('accessToken')
  //           : null;

  //       if (accessToken && isValidToken(accessToken)) {
  //         setSession(accessToken);

  //         const response = await axios.get('/api/account/my-account');
  //         const { user } = response.data;

  //         dispatch({
  //           type: Types.Initial,
  //           payload: {
  //             isAuthenticated: true,
  //           },
  //         });
  //       } else {
  //         dispatch({
  //           type: Types.Initial,
  //           payload: {
  //             isAuthenticated: false,
  //           },
  //         });
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       dispatch({
  //         type: Types.Initial,
  //         payload: {
  //           isAuthenticated: false,
  //         },
  //       });
  //     }
  //   };

  //   initialize();
  // }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email,
      password,
    });
    const { token, user, message, refreshToken } = response.data;

    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);

    let role = user?.role;

    if (role === 'doctor') {
      router.push(`/dashboard/app`);
    } else {
      router.push(`/${user?.role}/app`);
    }

    dispatch({
      type: Types.Login,
    });
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    role: string,
    showSuccess?: (message: string) => void
  ) => {
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
    });

    const { message } = response.data;

    router.push('/auth/login');

    // Wait for 5 seconds before dispatching
    setTimeout(() => {
      dispatch({
        type: Types.Register,
      });
    }, 5000);

    return message;
  };

  const logout = async () => {
    setSession(null);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');

    router.push('/auth/login');

    dispatch({ type: Types.Logout });
  };

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <AuthContext.Provider
        value={{
          ...state,
          method: 'jwt',
          login,
          logout,
          register,
        }}
      >
        {children}
      </AuthContext.Provider>
    </SnackbarProvider>
  );
}

export { AuthContext, AuthProvider };
