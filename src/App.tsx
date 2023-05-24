import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  GridItem,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  GetUser,
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import { useCallback, useEffect, useState } from "react";
import { CodeSnippet } from "./CodeSnippet";
import { Login } from "./Login";
import { UserDetails } from "./snippets/UserDetails";
import { WalletFeatures } from "./WalletFeatures";
import { WalletInfo } from "./WalletInfo";
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"

function App() {
  const [paper, setPaper] = useState<PaperEmbeddedWalletSdk>();
  const [userDetails, setUserDetails] = useState<GetUser>();

  useEffect(() => {
    const paper = new PaperEmbeddedWalletSdk({
      clientId: "992d8417-9cd1-443c-bae3-f9eac1d64767",
      chain: "Mumbai",
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
  const openCheckout = () => renderPaperCheckoutLink({
    checkoutLinkUrl: "https://withpaper.com/checkout/d5969c08-7452-4b0c-a96e-1741833c2f8d",
    
  });
  

  return (
    <SimpleGrid columns={2}>
      {/* <GridItem colSpan={2} bg="blue.500" h={12}>
        <Flex w="full" h="full" align="center" justify="center" color="white">
          <Text fontSize="xl">
            For more information, check out{" "}
            <Link isExternal href="https://ews.withpaper.com" fontWeight="bold">
              the docs
            </Link>
          </Text>
        </Flex>
      </GridItem> */}

      <Box p={10} height="100vh">
        <Stack spacing={10}>
          {/* <Image src="/paper-logo-icon.svg" maxW={14} alt="logo" /> */}
          {/* <Stack spacing={0}>
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
          </Text> */}
          
          // oneCheckout Link

          <button onClick={openCheckout}>Buy with Paper</button>

          {!!userDetails && userDetails.status !== UserStatus.LOGGED_OUT && (
            <Button
              alignSelf="start"
              onClick={logout}
              colorScheme="blue"
              variant="outline"
            >
              Logout
            </Button>
          )}
        </Stack>
      </Box>

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
          <Stack spacing={10}>
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
        )}
        {/* {!!userDetails && (
          <Card mt={10} w="100%" bg="white">
            <CardBody>
              <CodeSnippet userDetails={userDetails} />
              <UserDetails userDetails={userDetails} />
            </CardBody>
          </Card>
        )} */}
      </Box>
    </SimpleGrid>
  );
}

export default App;
