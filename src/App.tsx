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
  Input,
  Center
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons'
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
      clientId: "b884ac0f-a666-4290-a477-0f47caf631d8",
      chain: "Goerli",
    });
    setPaper(paper);
  }, []);

  const fetchUserStatus = useCallback(async () => {
    if (!paper) {
      return;
    }

    const paperUser = await paper.getUser();
    // console.log("paperUser", paperUser);

    setUserDetails(paperUser);
  }, [paper]);

  useEffect(() => {
    if (paper && fetchUserStatus) {
      fetchUserStatus();
    }
  }, [paper, fetchUserStatus]);

  const logout = async () => {
    const response = await paper?.auth.logout();
    // console.log("logout response", response);
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
  // try {
  //   const domain: string = _email.split('@')[1];
  //   console.log(domain);

    // if (domain.endsWith('edu.com')) {
      // console.log('Email domain is a valid .edu domain. Sending request...');

      const options = {
        method: 'POST',
        url: 'https://verifyemailforpaper-production.up.railway.app/api/verifyEmail/',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer f38fd6a4-8ff0-47c2-a40c-e94e39fb80c7'
        },
        data: {
          _email
        }
    }
    axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      const openCheckout = () => renderPaperCheckoutLink({
        checkoutLinkUrl: response.data.checkoutLinkIntentUrl,
      });
      openCheckout();
    })
    .catch(function (error) {
      console.error(error);
      alert("An error occured, try again")
    })

    // } else {
    //   console.log('Email domain is not a valid .edu domain. Request not sent.');
    //   // Handle the case when the email is not a valid student email
    // }
  // } catch (error) {
  //   console.error('Error occurred during email verification:', error);
  //   // Handle any errors that occur during the verification process
  // }
}
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [placement, setPlacement] = useState('right')


  
  

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
            <HamburgerIcon/>
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
                {/* <Button className="color-blue" onClick={openCheckout}>Buy with Paper</Button> */}
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
          
          <form onSubmit={handleSubmit}>

                <Center>
                  <Input 
                    width="60%"
                    type="email"
                    id="email"
                    value={_email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                  <Box m={2}>
                    <Button type="submit">Submit</Button>
                  </Box>
                  
                </Center>
          </form>
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
