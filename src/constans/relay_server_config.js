const relayServerConfig = {
  relayServerUrl: "https://relay-server-staging.herokuapp.com",
  litprotcolRpcUrl: "https://chain-rpc.litprotocol.com/http",
  mintPkpUrlOfGoogle: "/auth/google",
  mintPkpUrlOfDiscord: "/auth/discord",
  mintPkpUrlOfWallet: "/auth/wallet",
  authUrlOfGoogle: "/auth/google/userinfo",
  authUrlOfDiscord: "/auth/discord/userinfo",
  authUrlOfWebauthn: "/auth/webauthn/userinfo",
  authUrlOfWallet: "/auth/wallet/userinfo",
  registrationUrlOfWebauthn: "/auth/webauthn/generate-registration-options",
  verifyAndMintOfWebauthn: "/auth/webauthn/verify-registration",
};
export default relayServerConfig;
