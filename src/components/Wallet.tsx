import React from 'react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from '@chakra-ui/react';
import { useSolana } from '@gokiprotocol/walletkit';
import { useWalletKit } from '@gokiprotocol/walletkit';

export function WalletButton() {
  const { publicKey, connected, disconnect } = useSolana();
  const { connect } = useWalletKit();

  if (connected && publicKey) {
    const pubkey = publicKey.toString();
    const shortPubkey = pubkey.slice(0, 4) + '...' + pubkey.slice(-4);
    return (
      <Popover>
        <PopoverTrigger>
          <Button>{shortPubkey}</Button>
        </PopoverTrigger>
        <PopoverContent maxWidth={150}>
          <PopoverArrow />
          <Button onClick={disconnect}>Disconnect</Button>
        </PopoverContent>
      </Popover>
    );
  } else {
    return <Button onClick={connect}>Connect Wallet</Button>;
  }
}
