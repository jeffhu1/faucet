import React, { createContext, useEffect, useState } from 'react';
import { useSolana } from '@saberhq/use-solana';
import { MockUSDCFaucet } from '@drift-labs/sdk';
import { PublicKey } from '@solana/web3.js';
import { getATAAddress } from '@saberhq/token-utils';
import {
  ParsedAccountDatum,
  useParsedAccountData,
  TOKEN_ACCOUNT_PARSER,
} from '@saberhq/sail';

const FaucetContext = createContext<null | FaucetContextValues>(null);

export function useFaucet(): FaucetContextValues {
  const context = React.useContext(FaucetContext);
  if (!context) {
    throw new Error('useFaucet must be used within a FaucetProvider');
  }
  return context;
}

type FaucetContextValues = {
  faucet: MockUSDCFaucet | null;
  ata: ParsedAccountDatum<any>;
};

const FAUCET_ADDRESS = new PublicKey(
  '2z2DLVD3tBWc86pbvvy5qN31v1NXprM6zA5MDr2FMx64'
);

const MOCK_USDC_MINT_ADDRESS = new PublicKey(
  'Doe9rajhwt18aAeaVe8vewzAsBk4kSQ2tTyZVUJhHjhY'
);

export function FaucetProvider({ children }: { children: React.ReactNode }) {
  const { provider, providerMut, publicKey } = useSolana();
  const [ataPK, setATAPK] = useState<PublicKey | null>(null);
  useEffect(() => {
    const loadATA = async () => {
      if (publicKey) {
        const ata = await getATAAddress({
          mint: MOCK_USDC_MINT_ADDRESS,
          owner: publicKey,
        });
        setATAPK(ata);
      }
    };
    loadATA();
  }, [provider, providerMut, publicKey]);

  const ata = useParsedAccountData(ataPK, TOKEN_ACCOUNT_PARSER).data;

  let faucet = null;
  if (providerMut) {
    faucet = new MockUSDCFaucet(
      providerMut.connection,
      providerMut.wallet,
      FAUCET_ADDRESS
    );
  }

  return (
    <FaucetContext.Provider value={{ faucet, ata }}>
      {children}
    </FaucetContext.Provider>
  );
}
