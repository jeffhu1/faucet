import {
  Image,
  VStack,
  Button,
  Container,
  Flex,
  Spacer,
  Text,
  Box,
  NumberInput,
  NumberInputField,
  useToast,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useSolana } from '@gokiprotocol/walletkit';
import { WalletButton } from './components/Wallet';
import { useFaucet } from 'providers';
import BN from 'bn.js';
import { useSail } from '@saberhq/sail';
import { TransactionEnvelope } from '@saberhq/solana-contrib';

const WAD = 1_000_000;

export const Body = () => {
  const { providerMut, publicKey } = useSolana();
  const { faucet, ata } = useFaucet();
  const { handleTX } = useSail();
  const toast = useToast();

  return (
    <Container mt={4} align="center">
      <Flex>
        <Spacer />
        <WalletButton />
      </Flex>
      <VStack spacing="20px" mt={8}>
        <Image src="faucet.png" />
        <Text fontSize="2xl">Mock USDC Faucet (devnet)</Text>
        <Text fontSize="2xl">
          Your Balance: {ata ? ata.accountInfo.data.amount.toNumber() / WAD : 0}{' '}
          mUSDC
        </Text>
        <Formik
          initialValues={{
            amt: '',
          }}
          onSubmit={async (values, actions) => {
            const amt = new BN(parseFloat(values.amt) * WAD);
            const [, createAssociatedTokenAccountIx, mintToIx] =
              await faucet!.createAssociatedTokenAccountAndMintToInstructions(
                publicKey!,
                amt
              );

            const ix = ata
              ? [mintToIx]
              : [createAssociatedTokenAccountIx, mintToIx];

            const tx = new TransactionEnvelope(providerMut!, ix, []);
            const ans = await handleTX(tx);
            if (ans.success) {
              toast({
                title: `Mint ${values.amt} mock USDC`,
                status: 'info',
                isClosable: true,
              });
            } else if (ans.errors) {
              toast({
                title: 'Transaction failed (try again later)',
                description: ans.errors[0].message,
                status: 'error',
                isClosable: true,
              });
            }
            actions.setSubmitting(false);
          }}
        >
          {(props) => {
            return (
              <Form>
                <Box align="center">
                  <NumberInput size="lg">
                    <NumberInputField
                      id="amt"
                      value={props.values.amt}
                      onChange={props.handleChange}
                    />
                  </NumberInput>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    type="submit"
                    isLoading={props.isSubmitting}
                    isDisabled={!faucet}
                    mt={4}
                  >
                    Drip 💦 💦 💦{' '}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </VStack>
      <Text color="gray.500" mt={96}>
        Mint Address: Doe9rajhwt18aAeaVe8vewzAsBk4kSQ2tTyZVUJhHjhY
      </Text>
    </Container>
  );
};
