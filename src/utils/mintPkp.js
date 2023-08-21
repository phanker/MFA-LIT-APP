// const RELAY_API_URL = import.meta.env.VITE_RELAY_API_URL;
import relayServerConfig from "../constans/relay_server_config";
const RELAY_API_URL = relayServerConfig.relayServerUrl;
const mintPkp = async (credentialResponse, setStatusFn, mintPkpUrl) => {
  setStatusFn("Minting PKP with relayer...");
  // 1.Request to a relay lit server to mint a pkp
  const mintRes = await fetch(`${RELAY_API_URL + mintPkpUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "1234567890",
    },
    body: JSON.stringify(credentialResponse),
  });

  if (mintRes.status < 200 || mintRes.status >= 400) {
    console.warn("Something wrong with the API call", await mintRes.json());
    console.warn("Uh oh, something's not quite right.");
    return null;
  } else {
    const resBody = await mintRes.json();
    console.log("Response OK", { body: resBody });
    console.log("Successfully initiated minting PKP with relayer.");
    return resBody.requestId;
  }
};
export { mintPkp };
