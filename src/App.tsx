import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  GridItem,
  Heading,
  Image,
  Link,
  SimpleGrid,
  SliderTrack,
  Spinner,
  Stack,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react';
// import { Radio, RadioGroup } from '@chakra-ui/react'
import {
  GetUser,
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import { useCallback, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { CodeSnippet } from "./CodeSnippet";
import { Login } from "./Login";
import { UserDetails } from "./snippets/UserDetails";
import { WalletFeatures } from "./WalletFeatures";
import { WalletInfo } from "./WalletInfo";
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"
import axios from 'axios';

function App() {
  const [paper, setPaper] = useState<PaperEmbeddedWalletSdk>();
  const [userDetails, setUserDetails] = useState<GetUser>();

  useEffect(() => {
    const paper = new PaperEmbeddedWalletSdk({
      clientId: "3789bfae-a711-47eb-b0e8-f269ad25cd8a",
      chain: "Goerli",
    });
    setPaper(paper);
  }, []);

  const fetchUserStatus = useCallback(async () => {
    if (!paper) {
      return;
    }

    const paperUser = await paper.getUser();
    console.log("paperUser", paperUser);

    setUserDetails(paperUser);
  }, [paper]);

  useEffect(() => {
    if (paper && fetchUserStatus) {
      fetchUserStatus();
    }
  }, [paper, fetchUserStatus]);

  const logout = async () => {
    const response = await paper?.auth.logout();
    console.log("logout response", response);
    await fetchUserStatus();
  };
  
  const [_email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyStudentEmail(_email);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  async function verifyStudentEmail(_email: string): Promise<void> {
  try {
    const domain: string = _email.split('@')[1];
    console.log(domain);

    if (domain.endsWith('edu.com')) {
      console.log('Email domain is a valid .edu domain. Sending request...');

      const options = {
      method: 'POST',
      url: 'https://withpaper.com/api/2022-08-12/checkout-link-intent',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer f38fd6a4-8ff0-47c2-a40c-e94e39fb80c7'
      },
      data: {
        contractId: '4299ccb3-7918-4b21-9913-09a1992ddbff',
        title: 'Mumbai Example',
        description: 'Describe your project *with Markdown!*',
        imageUrl: 'https://unsplash.it/240/240',
        expiresInMinutes: 15,
        limitPerTransaction: 5,
        redirectAfterPayment: false,
        sendEmailOnCreation: false,
        requireVerifiedEmail: true,
        quantity: 1,
        metadata: {},
        mintMethod: {
          name: 'claimTo',
          args: {_to: '$WALLET', _quantity: '$QUANTITY', _tokenId: 0},
          payment: {currency: 'MATIC', value: '0.001 * $QUANTITY'}
        },
        eligibilityMethod: {args: {METHOD_ARG_NAME: 'Unknown Type: mixed type'}, name: 'string'},
        feeBearer: 'BUYER',
        hideNativeMint: false,
        hidePaperWallet: false,
        hideExternalWallet: false,
        hidePayWithCard: false,
        hidePayWithCrypto: false,
        hidePayWithIdeal: true,
        sendEmailOnTransferSucceeded: true,
        twitterHandleOverride: 'string',
        successCallbackUrl: 'string',
        cancelCallbackUrl: 'string',
        walletAddress: 'string',
        email: _email,
        contractArgs: 'string'
      }
    };
    axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
    } else {
      console.log('Email domain is not a valid .edu domain. Request not sent.');
      // Handle the case when the email is not a valid student email
    }
  } catch (error) {
    console.error('Error occurred during email verification:', error);
    // Handle any errors that occur during the verification process
  }
}
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [placement, setPlacement] = useState('right')


    const openCheckout = () => renderPaperCheckoutLink({
      checkoutLinkUrl: "https://withpaper.com/checkout/94bc669f-e023-4ef6-a115-2b1f551445e7",
    });
  

  return (
    <SimpleGrid columns={1}>
      
      <Box
        bg="blue.200"
        boxShadow="-2px 0px 2px #6294b4"
        p={10}
        height="100vh"
        overflowY="auto"
      >
        {!userDetails ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="full"
          >
            <Spinner size="md" color="white" />
          </Box>
        ) : userDetails.status === UserStatus.LOGGED_OUT ? (
          <Login paper={paper} onLoginSuccess={fetchUserStatus} />
        ) : (
          <><>
      
          <Button colorScheme='blue' onClick={onOpen}>
            Open
          </Button>
          <Drawer onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth='1px'>Menu</DrawerHeader>
              <DrawerBody>
              <Button colorScheme='blue' variant='solid'>
                Sign In
              </Button>  
              <Button colorScheme='blue' variant='solid'>
                checkout
              </Button>
                <Button className="color-blue" onClick={openCheckout}>Buy with Paper</Button>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
          <SimpleGrid columns={2}>
          <Box p={10} height="100vh">
          <Stack spacing={10}>
          <Image src="/paper-logo-icon.svg" maxW={14} alt="logo" />
          <Stack spacing={0}>
            <Heading>Wallets & Auth demo</Heading>
            <Text size="sm" fontStyle="italic" color="gray.500">
              by Paper
            </Text>
          </Stack>
          <Text maxW={400}>
            Welcome to Paper's Embedded Wallet Service (EWS) Alpha Sample App.
            <br />
            <br />
            With this alpha sample app, you can explore the various features of
            our EWS platform and get a feel for how it can benefit your own
            project
          </Text>
        </Stack>
      </Box>
      <Stack spacing={10} >
            <WalletInfo
              email={userDetails.authDetails.email}
              walletAddress={userDetails.walletAddress}
            />
            <WalletFeatures
              user={
                userDetails.status === UserStatus.LOGGED_IN_WALLET_INITIALIZED
                  ? userDetails
                  : undefined
              }
            />

            <form onSubmit={handleSubmit}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={_email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                  <button type="submit">Submit</button>
                </form>
          </Stack>
          </SimpleGrid>
          </>
        )}
        {
            !!userDetails && userDetails.status !== UserStatus.LOGGED_OUT && (
            <Button
              alignSelf="start"
              onClick={logout}
              colorScheme="blue"
              variant="outline"
            >
              Logout
            </Button>
          )}
      </Box>
    </SimpleGrid>
  );
}

export default App;
