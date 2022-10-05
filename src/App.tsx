import { ChakraProvider, theme, Image } from "@chakra-ui/react";
import { WalletKitProvider } from "@gokiprotocol/walletkit";
import { FaucetProvider } from "providers";
import { Body } from "./Body";
import { SailProvider } from "@saberhq/sail";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const App = () => (
  <ChakraProvider theme={theme}>
    <WalletKitProvider
      defaultNetwork="devnet"
      app={{
        name: "Faucet",
        icon: <Image src="faucet.png" boxSize="48px" />,
      }}
      walletOptions={{
        network: WalletAdapterNetwork.Devnet, // Note: this field is unused by WalletKitProvider
        options: {
          relayUrl: "wss://relay.walletconnect.com",
          projectId: "b4ddefc8f85f4296e2c3b51491c8ba34",
          metadata: {
            name: "Mock USDC Faucet",
            description: "Mock USDC Faucet",
            url: "https://faucet-flax.vercel.app",
            icons: [
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb_yBt5wg2lMsHk2osCossv0W2TnQVQgB9Ig&usqp=CAU",
            ],
          },
        },
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
