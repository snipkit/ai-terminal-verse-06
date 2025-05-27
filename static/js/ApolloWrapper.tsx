import React, { useEffect, useMemo, useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  Operation,
  createHttpLink,
  useMutation,
  useQuery,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as sentry from '@sentry/browser';
import { Navigate, useSearchParams } from 'react-router-dom';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import firebase from './utils/firebase';
import './login.css';
import AuthenticatedView, { User } from './AuthenticatedView';
import WarpError from './WarpError';
import LoadingScreen from './loading-screen/LoadingScreen';
import createRedirectForLinking from './utils/redirectToLinking';
import GetOrCreateUser from './graphql/mutations/GetOrCreateUser';
import CreateAnonymousUser from './graphql/mutations/CreateAnonymousUser';
import IsTelemetryEnabled from './graphql/queries/IsTelemetryEnabled';

const LOGIN_ANON_USER_QUERY_KEY = 'customToken';

export interface ApolloWrapperProps {
  setReferralCode: React.Dispatch<React.SetStateAction<string>>;
  setAnonymousUserLinked: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  // Whether there's an in-flight request to fetch the user from storage.
  userLoading: boolean;
  // Whether there was an error fetching the user from storage.
  userError: boolean;
  logout: () => Promise<void>;
  isUserAnonymous: boolean;
  anonymousUserProvidedLoginToken: boolean;
  deletedAnonymousUser: boolean;
}

const cache = new InMemoryCache({});
const linkWithOperationName = (operation: Operation) => {
  const url = new URL(process.env.REACT_APP_GRAPHQL_ROOT!);
  url.searchParams.append('op', operation.operationName);
  return url.toString();
};
const httpLink = createHttpLink({
  uri: linkWithOperationName,
});
const apolloClient = new ApolloClient({
  cache,
  link: httpLink,
});

interface AnonymousUserInfo {
  token: string;
  firebaseUID: string;
}

export const AuthenticatedApolloWrapper = ({
  allowAnonymous,
  createAnonymousUserIfUnauthenticated,
  loginAnonymousUserWithTokenQueryParam,
  children,
}: any) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [
    anonymousUserInfo,
    setAnonymousUserInfo,
  ] = useState<AnonymousUserInfo | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<boolean>(false);
  const [deletedAnonymousUser, setDeletedAnonymousUser] = useState<boolean>(
    false
  );
  const [telemetryEnabled, setTelemetryEnabled] = useState<boolean>(false);
  const [anonymousUserLinked, setAnonymousUserLinked] = useState<boolean>(
    false
  );

  const [referralCode, setReferralCode] = useState<string | undefined>(
    undefined
  );
  const [queryParams, setQueryParams] = useSearchParams();

  // Run a one-time function to potentially sign the anonymous user into Firebase.
  // Note that this is distinct from getting the user from Warp.
  useEffect(() => {
    const checkAnonymousUserSignedIn = async (customToken: string) => {
      await signInWithCustomToken(getAuth(firebase), customToken || '');
    };

    const customToken = queryParams.get(LOGIN_ANON_USER_QUERY_KEY);
    if (loginAnonymousUserWithTokenQueryParam && !user && customToken) {
      checkAnonymousUserSignedIn(customToken);
    }
  }, [user, queryParams, loginAnonymousUserWithTokenQueryParam]);

  useEffect(() => {
    if (loginAnonymousUserWithTokenQueryParam && user) {
      // Strip the custom token from the url to prevent it from being leaked.
      if (queryParams.has(LOGIN_ANON_USER_QUERY_KEY)) {
        queryParams.delete(LOGIN_ANON_USER_QUERY_KEY);
        setQueryParams(queryParams, { replace: true });
      }
    }
  }, [
    user,
    loginAnonymousUserWithTokenQueryParam,
    queryParams,
    setQueryParams,
  ]);

  // setAuthToken is responsible for calling setToken (to ensure any effects are triggered)
  // and additionally updates the Apollo client's links to attach the authorization header
  // to every request with the correct token.
  const setAuthToken = (authToken: string) => {
    setToken(authToken);
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    }));
    apolloClient.setLink(authLink.concat(httpLink));
  };

  // If there was previously an authenticated temporary web user, we'll pass along their auth token
  // when creating their new account. This lets the server import Warp Drive state.
  let anonymousUserToken: string | null = null;
  if (
    user &&
    anonymousUserInfo &&
    user.firebaseUID !== anonymousUserInfo.firebaseUID
  ) {
    anonymousUserToken = anonymousUserInfo.token;
  }
  const { query, variables, parseData, context } = useMemo(
    () =>
      GetOrCreateUser(
        {
          referralCode,
        },
        anonymousUserToken
      ),
    [referralCode, anonymousUserToken]
  );
  // We're not keying off the `loading` prop from `useMutation`, because it only turns to true
  // when the mutation function is invoked, and there's a period of time at the beginning of the
  // lifecycle of this component where we need to perform some token header setup before we can
  // call the function, and so we'd incorrectly tell children that the user was not loading.
  // We manage it manually via the `userLoading` state variable.
  const [getOrCreateUser, { error }] = useMutation(query, {
    client: apolloClient,
    variables,
    context,
  });

  const {
    query: createAnonymousUserQuery,
    variables: createAnonymousUserVariables,
    parseData: createAnonymousUserParseData,
  } = useMemo(() => CreateAnonymousUser(), []);
  const [
    createAnonymousUser,
    { error: createAnonymousUserError },
  ] = useMutation(createAnonymousUserQuery, {
    client: apolloClient,
    variables: createAnonymousUserVariables,
  });

  const {
    query: telemetryQuery,
    variables: telemetryVariables,
    parseData: telemetryParseData,
  } = IsTelemetryEnabled();
  const { error: telemetryError } = useQuery(telemetryQuery, {
    client: apolloClient,
    variables: telemetryVariables,
    skip: !user,
    onCompleted(data) {
      setTelemetryEnabled(telemetryParseData(data));
    },
  });
  if (telemetryError) {
    setTelemetryEnabled(false);
  }

  useMemo(() => {
    setUserError(!!error);
  }, [error]);

  useMemo(() => {
    setUserError(!!createAnonymousUserError);
  }, [createAnonymousUserError]);

  useEffect(() => {
    // Set up an onAuthStateChanged handler after each render of the auth
    // wrapper, and give React the unsubscribe function returned by
    // `onAuthStateChanged` so that it removes the listener before
    // re-rendering (to avoid incrementing the listener count on every render).
    return getAuth(firebase).onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Store the ID Token (JWT) in memory - we purposefully do not store this in
        // local storage as it is recommended to only store auth tokens in memory
        // for an SPA.
        const idToken = await firebaseUser.getIdToken();
        setAuthToken(idToken);
        // Unlike authToken, this persists across logouts so that we can associate new users with their former anonymous data.
        // We check that there are no providers, rather than `firebaseUser.isAnonymous`, which appears to always be false.
        if (firebaseUser.providerData.length === 0) {
          setAnonymousUserInfo({
            firebaseUID: firebaseUser.uid,
            token: idToken,
          });
        }
      } else {
        setUserLoading(false);
      }
    });
  }, [user]);

  useEffect(() => {
    // Do nothing if the token has not been set yet.  Trying to look up a user
    // without an authentication token is guaranteed to fail (with a 401).
    if (!token) {
      return;
    }

    // Now that we have a (presumably valid) authentication token, we can request
    // user information from our `/graphql` endpoint.
    getOrCreateUser().then(({ data }) => {
      const result = parseData(data);
      const firebaseUser = getAuth(firebase).currentUser;
      // Only set the user if there's a valid firebase user _and_ a user exists in storage.
      if (firebaseUser && result?.uid) {
        const {
          displayName,
          email,
          photoURL,
          refreshToken,
          uid,
        } = firebaseUser;

        const warpUser: User = {
          displayName,
          email,
          photoURL,
          refreshToken,
          firebaseUID: result.uid,
          isOnboarded: !!result.isOnboarded,
          joinableTeams: result.workspaces[0].joinableTeams,
          isTelemetryEnabled: telemetryEnabled,
          anonymousUserType: result.anonymousUserInfo?.anonymousUserType,
          isAnonymous: !!result.anonymousUserInfo,
        };

        setUser(warpUser);

        if (!deletedAnonymousUser) {
          setDeletedAnonymousUser(result.deletedAnonymousUser);
        }

        // Remove the user from local storage as well so the wasm app has to reauth on load
        // We have to do this on sign in as well as logout because anonymous users never explicitly log out
        window.localStorage.removeItem('User');
        setUserLoading(false);

        const userProperties = {
          name: displayName,
          email,
          photoURL,
        };
        window.rudderanalytics.identify(firebaseUser.uid, userProperties);

        sentry.configureScope((scope: sentry.Scope) => {
          scope.setUser({
            id: uid,
            email: email || undefined,
          });
        });
      }
    });
  }, [
    token,
    referralCode,
    getOrCreateUser,
    telemetryEnabled,
    anonymousUserLinked,
    parseData,
    deletedAnonymousUser,
  ]);

  useEffect(() => {
    // If there is no user in the context, and we are in a view that allows us
    // to create an anonymous user, create one and sign in with it.
    if (token || !createAnonymousUserIfUnauthenticated || user || userLoading) {
      return;
    }

    createAnonymousUser().then(({ data }) => {
      const idToken = createAnonymousUserParseData(data);
      signInWithCustomToken(getAuth(firebase), idToken);
    });
  }, [
    token,
    createAnonymousUser,
    createAnonymousUserIfUnauthenticated,
    user,
    userLoading,
    createAnonymousUserParseData,
  ]);

  const logout = () => {
    const promise = getAuth(firebase)
      .signOut()
      .then((_result) => {
        setUser(undefined);
        setAuthToken('');
        // Remove the user from local storage as well so the wasm app has to reauth on load
        window.localStorage.removeItem('User');
      });

    // Remove all parameters from url:
    // 1) Get the base URL without parameters
    const baseUrl = window.location.origin + window.location.pathname;
    // 2) Replace the current URL with the base URL
    window.history.replaceState({}, document.title, baseUrl);

    return promise;
  };

  if (userError) {
    return <WarpError error="Oops! Sign In failed. Please try again later." />;
  }
  if (userLoading) {
    return <LoadingScreen />;
  }
  if (!allowAnonymous && user?.isAnonymous) {
    return (
      <Navigate to={createRedirectForLinking(user.refreshToken)} replace />
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AuthenticatedView user={user!} logout={logout}>
        {children({
          user,
          logout,
          setReferralCode,
          userLoading,
          userError,
          setAnonymousUserLinked,
          anonymousUserProvidedLoginToken:
            loginAnonymousUserWithTokenQueryParam &&
            !!queryParams.get(LOGIN_ANON_USER_QUERY_KEY),
          deletedAnonymousUser,
        })}
      </AuthenticatedView>
    </ApolloProvider>
  );
};

export const NoAuthApolloWrapper = ({ children }: any) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
