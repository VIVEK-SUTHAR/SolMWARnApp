import {PublicKey} from '@solana/web3.js';
import {
  Account as AuthorizedAccount,
  AuthorizationResult,
  AuthorizeAPI,
  AuthToken,
  Base64EncodedAddress,
  DeauthorizeAPI,
  ReauthorizeAPI,
} from '@solana-mobile/mobile-wallet-adapter-protocol';
import {toUint8Array} from 'js-base64';
import {useState, useCallback, useMemo, ReactNode} from 'react';
import React from 'react';

import {APP_METADATA, RPC_ENDPOINT} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Account = Readonly<{
  address: Base64EncodedAddress;
  label?: string;
  publicKey: PublicKey;
}>;

type Authorization = Readonly<{
  accounts: Account[];
  authToken: AuthToken;
  selectedAccount: Account;
}>;

function getAccountFromAuthorizedAccount(account: AuthorizedAccount): Account {
  return {
    ...account,
    publicKey: getPublicKeyFromAddress(account.address),
  };
}

function getAuthorizationFromAuthorizationResult(
  authorizationResult: AuthorizationResult,
  previouslySelectedAccount?: Account,
): Authorization {
  let selectedAccount: Account;
  if (
    previouslySelectedAccount == null ||
    !authorizationResult.accounts.some(
      ({address}) => address === previouslySelectedAccount.address,
    )
  ) {
    const firstAccount = authorizationResult.accounts[0];
    selectedAccount = getAccountFromAuthorizedAccount(firstAccount);
  } else {
    selectedAccount = previouslySelectedAccount;
  }
  return {
    accounts: authorizationResult.accounts.map(getAccountFromAuthorizedAccount),
    authToken: authorizationResult.auth_token,
    selectedAccount,
  };
}

function getPublicKeyFromAddress(address: Base64EncodedAddress): PublicKey {
  const publicKeyByteArray = toUint8Array(address);
  return new PublicKey(publicKeyByteArray);
}

export interface AuthorizationProviderContext {
  accounts: Account[] | null;
  authorizeSession: (wallet: AuthorizeAPI & ReauthorizeAPI) => Promise<Account>;
  deauthorizeSession: (wallet: DeauthorizeAPI) => void;
  onChangeAccount: (nextSelectedAccount: Account) => void;
  selectedAccount: Account | null;
}

const DEFAULT_AUTHORIZATION_PROVIDER_ERROR_MESSAGE =
  'AuthorizationProvider not initialized';

const AuthorizationContext = React.createContext<AuthorizationProviderContext>({
  accounts: null,
  authorizeSession: (_wallet: AuthorizeAPI & ReauthorizeAPI) => {
    throw new Error(DEFAULT_AUTHORIZATION_PROVIDER_ERROR_MESSAGE);
  },
  deauthorizeSession: (_wallet: DeauthorizeAPI) => {
    throw new Error(DEFAULT_AUTHORIZATION_PROVIDER_ERROR_MESSAGE);
  },
  onChangeAccount: (_nextSelectedAccount: Account) => {
    throw new Error(DEFAULT_AUTHORIZATION_PROVIDER_ERROR_MESSAGE);
  },
  selectedAccount: null,
});

function AuthorizationProvider(props: {children: ReactNode}) {
  const {children} = props;
  const [authorization, setAuthorization] = useState<Authorization | null>(
    null,
  );
  const handleAuthorizationResult = useCallback(
    async (
      authorizationResult: AuthorizationResult,
    ): Promise<Authorization> => {
      const nextAuthorization = getAuthorizationFromAuthorizationResult(
        authorizationResult,
        authorization?.selectedAccount,
      );
      setAuthorization(nextAuthorization);
      return nextAuthorization;
    },
    [authorization, setAuthorization],
  );

  const authorizeSession = useCallback(
    async (wallet: AuthorizeAPI & ReauthorizeAPI) => {
      const authorizationResult = await (authorization
        ? wallet.reauthorize({
            auth_token: authorization.authToken,
            identity: APP_METADATA,
          })
        : wallet.authorize({
            cluster: RPC_ENDPOINT,
            identity: APP_METADATA,
          }));
      return (await handleAuthorizationResult(authorizationResult))
        .selectedAccount;
    },
    [authorization, handleAuthorizationResult],
  );

  const reauthorizeSession = useCallback(
    async (wallet: ReauthorizeAPI) => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authorization?.authToken == null) {
        return;
      }
      const authorizationResult = await wallet.reauthorize({
        auth_token: authorization.authToken,
        identity: APP_METADATA,
      });
      await handleAuthorizationResult(authorizationResult);
    },
    [authorization, handleAuthorizationResult],
  );

  const deauthorizeSession = useCallback(
    async (wallet: DeauthorizeAPI) => {
      if (authorization?.authToken == null) {
        return;
      }
      await wallet.deauthorize({auth_token: authorization.authToken});
      setAuthorization(null);
    },
    [authorization, setAuthorization],
  );
  const onChangeAccount = useCallback(
    (nextSelectedAccount: Account) => {
      setAuthorization(currentAuthorization => {
        if (
          !currentAuthorization?.accounts.some(
            ({address}) => address === nextSelectedAccount.address,
          )
        ) {
          throw new Error(
            `${nextSelectedAccount.address} is not one of the available addresses`,
          );
        }
        return {
          ...currentAuthorization,
          selectedAccount: nextSelectedAccount,
        };
      });
    },
    [setAuthorization],
  );
  const value = useMemo(
    () => ({
      accounts: authorization?.accounts ?? null,
      authorizeSession,
      deauthorizeSession,
      onChangeAccount,
      reauthorizeSession,
      selectedAccount: authorization?.selectedAccount ?? null,
    }),
    [authorization, authorizeSession, deauthorizeSession, onChangeAccount],
  );

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
}

const useAuthorization = () => React.useContext(AuthorizationContext);

export {AuthorizationProvider, useAuthorization};
