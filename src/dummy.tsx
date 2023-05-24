import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://withpaper.com/api/2022-08-12/checkout-link-intent',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'Bearer c068b34d-cc3e-42fa-8740-90735330cac7'
  },
  data: {
    contractId: 'f5b49e5b-2027-44c8-892c-911a17dffbea',
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
    email: 'string',
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


