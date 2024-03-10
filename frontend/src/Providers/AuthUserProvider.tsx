import { navigate } from "raviger";
import { useCallback, useEffect } from "react";

import { LocalStorageKeys } from "../Common/constants";
import { AuthUserContext } from "../Common/hooks/useAuthUser";
import Loading from "../Components/Common/Loading";
import routes, { IRegister } from "../Redux/api";
import request from "../Utils/request/request";
import useQuery from "../Utils/request/useQuery";

interface Props {
  children: React.ReactNode;
  unauthorized: React.ReactNode;
}

export default function AuthUserProvider({ children, unauthorized }: Props) {
  const tokenRefreshInterval = 5 * 60 * 1000;

  const {
    res,
    data: user,
    loading,
    refetch,
  } = useQuery(routes.currentUser, { silent: true });

  useEffect(() => {
    if (!user) {
      return;
    }

    updateRefreshToken(true);
    setInterval(() => updateRefreshToken(), tokenRefreshInterval);
  }, [user, tokenRefreshInterval]);

  const signIn = useCallback(
    async (creds: { username: string; password: string }) => {
      const query = await request(routes.login, { body: creds });

      if (query.res?.ok && query.data) {
        localStorage.setItem(LocalStorageKeys.accessToken, query.data.access);
        localStorage.setItem(LocalStorageKeys.refreshToken, query.data.refresh);

        await refetch();

        if (location.pathname === "/" || location.pathname === "/login") {
          navigate(getRedirectOr("/"));
        }
      }

      return query;
    },
    [refetch]
  );

  const register = useCallback(async (form: IRegister) => {
    const query = await request(routes.createUser, { body: form });

    if (query.res?.ok) {
      navigate("/login");
    }

    return query;
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(LocalStorageKeys.accessToken);
    localStorage.removeItem(LocalStorageKeys.refreshToken);

    await refetch();

    const redirectURL = getRedirectURL();

    navigate(redirectURL ? `/?redirect=${redirectURL}` : "/");
  }, [refetch]);

  // Handles signout from current tab, if signed out from another tab.
  useEffect(() => {
    const listener = (event: any) => {
      if (
        !event.newValue &&
        (LocalStorageKeys.accessToken === event.key ||
          LocalStorageKeys.refreshToken === event.key)
      ) {
        signOut();
      }
    };

    addEventListener("storage", listener);

    return () => {
      removeEventListener("storage", listener);
    };
  }, [signOut]);

  if (loading || !res) {
    return <Loading />;
  }

  return (
    <AuthUserContext.Provider value={{ signIn, signOut, register, user }}>
      {!res.ok || !user ? unauthorized : children}
    </AuthUserContext.Provider>
  );
}

const updateRefreshToken = async (silent = false) => {
  const refresh = localStorage.getItem(LocalStorageKeys.refreshToken);

  if (!refresh) {
    return;
  }

  const { res, data } = await request(routes.token_refresh, {
    body: { refresh },
    silent,
  });

  if (res?.status !== 200 || !data) {
    localStorage.removeItem(LocalStorageKeys.accessToken);
    localStorage.removeItem(LocalStorageKeys.refreshToken);

    return;
  }

  localStorage.setItem(LocalStorageKeys.accessToken, data.access);
  localStorage.setItem(LocalStorageKeys.refreshToken, data.refresh);
};

const getRedirectURL = () => {
  return new URLSearchParams(window.location.search).get("redirect");
};

const getRedirectOr = (fallback: string) => {
  const url = getRedirectURL();

  if (url) {
    try {
      const redirect = new URL(url);

      if (window.location.origin === redirect.origin) {
        return redirect.pathname + redirect.search;
      }
      console.error("Redirect does not belong to same origin.");
    } catch {
      console.error(`Invalid redirect URL: ${url}`);
    }
  }

  return fallback;
};
