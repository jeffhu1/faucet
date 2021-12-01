import { ChakraProvider, theme, Image } from '@chakra-ui/react';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import { FaucetProvider } from 'providers';
import { Body } from './Body';
import { SailProvider } from '@saberhq/sail';

export const App = () => (
  <ChakraProvider theme={theme}>
    <WalletKitProvider
      defaultNetwork="devnet"
      app={{
        name: 'Faucet',
        icon: <Image src="faucet.png" boxSize="48px" />,
      }}
    >
      <SailProvider>
        <FaucetProvider>
          <Body />
        </FaucetProvider>
      </SailProvider>
    </WalletKitProvider>
  </ChakraProvider>
);
