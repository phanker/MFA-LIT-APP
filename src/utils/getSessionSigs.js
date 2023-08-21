import * as LitJsSdk_authHelpers from "@lit-protocol/auth-helpers";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
const getSessionSigs = async (
  litNodeClient,
  encryptedSymmetrickey,
  authMethod,
  requestedPkpPublicKey
) => {
  // this will be fired if auth is needed. we can use this to prompt the user to sign in
  const authNeededCallback = async ({ resources, expiration, statement }) => {
    console.log("authNeededCallback fired");

    // Generate authMethod.
    const authMethods = [authMethod];

    // Get AuthSig
    const { authSig, pkpPublicKey } = await litNodeClient.signSessionKey({
      pkpPublicKey: requestedPkpPublicKey,
      authMethods,
      statement,
      expiration:
        expiration || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
      resources: resources || [],
    });
    console.log("got session sig from node and PKP: ", {
      authSig,
      pkpPublicKey,
    });

    return authSig;
  };

  const hashedencryptedSymmetrickeyStr = await hashBytes({
    bytes: new Uint8Array(encryptedSymmetrickey),
  });

  // Construct the LitResource
  const litResource =
    new LitJsSdk_authHelpers.LitAccessControlConditionResource(
      hashedencryptedSymmetrickeyStr
    );

  // Get the session sigs
  const sessionSigs = await litNodeClient.getSessionSigs({
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    chain: "ethereum",
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability:
          LitJsSdk_authHelpers.LitAbility.AccessControlConditionDecryption,
      },
    ],
    switchChain: false,
    authNeededCallback,
  });
  console.log("sessionSigs: ", sessionSigs);

  return {
    sessionSigs,
  };
};

async function hashBytes({ bytes }) {
  const hashOfBytes = await crypto.subtle.digest("SHA-256", bytes);
  const hashOfBytesStr = LitJsSdk.uint8arrayToString(
    new Uint8Array(hashOfBytes),
    "base16"
  );
  return hashOfBytesStr;
}

export { getSessionSigs, hashBytes };
