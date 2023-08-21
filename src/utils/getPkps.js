import relayServerConfig from "../constans/relay_server_config";

const RELAY_API_URL = relayServerConfig.relayServerUrl;
const AUTH_GOOGLE_URL_PATH = relayServerConfig.authUrlOfGoogle;
const AUTH_DISCORD_URL_PATH = relayServerConfig.authUrlOfDiscord;
const AUTH_WEBAUTHN_URL_PATH = relayServerConfig.authUrlOfWebauthn;
const AUTH_WALLET_URL_PATH = relayServerConfig.authUrlOfWallet;

const getPkpsByGoogle = async (googleCredentialResponse) => {
  if (!googleCredentialResponse) {
    console.warn("GoogleCredentialResponse is null ");
    return;
  }
  const assets = await fetch(`${RELAY_API_URL + AUTH_GOOGLE_URL_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "1234567890",
    },
    body: JSON.stringify({
      idToken: googleCredentialResponse,
    }),
  });

  if (assets.status < 200 || assets.status >= 400) {
    console.warn(
      "Something wrong with the get pkps API call",
      await assets.json()
    );
    console.warn("Uh oh, something's not quite right.");
    return null;
  } else {
    const resBody = await assets.json();
    console.log("Response OK", { body: resBody });
    console.log("Successfully got assert");
    return resBody;
  }
};

const getPkpsByDiscord = async (accessToken) => {
  console.log(accessToken);
  if (!accessToken) {
    console.warn("AccessToken is null ");
    return;
  }
  const assets = await fetch(`${RELAY_API_URL + AUTH_DISCORD_URL_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "1234567890",
    },
    body: JSON.stringify({
      accessToken: accessToken,
    }),
  });

  if (assets.status < 200 || assets.status >= 400) {
    console.warn(
      "Something wrong with the get pkps API call",
      await assets.json()
    );
    console.warn("Uh oh, something's not quite right.");
    return null;
  } else {
    const resBody = await assets.json();
    console.log("Response OK", { body: resBody });
    console.log("Successfully got assert");
    return resBody;
  }
};

const getPkpsByWebauthn = async (rawId) => {
  console.log(rawId);
  if (!rawId) {
    console.warn("rawId is null ");
    return;
  }
  const assets = await fetch(`${RELAY_API_URL + AUTH_WEBAUTHN_URL_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "1234567890",
    },
    body: JSON.stringify({
      rawId: rawId,
    }),
  });

  if (assets.status < 200 || assets.status >= 400) {
    console.warn(
      "Something wrong with the get pkps API call",
      await assets.json()
    );
    console.warn("Uh oh, something's not quite right.");
    return null;
  } else {
    const resBody = await assets.json();
    console.log("Response OK", { body: resBody });
    console.log("Successfully got assert");
    return resBody;
  }
};

const getPkpsByWallet = async (authSig) => {
  console.log(authSig);
  if (!authSig) {
    console.warn("rawId is null ");
    return;
  }
  const assets = await fetch(`${RELAY_API_URL + AUTH_WALLET_URL_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "1234567890",
    },
    body: JSON.stringify(authSig),
  });

  if (assets.status < 200 || assets.status >= 400) {
    console.warn(
      "Something wrong with the get pkps API call",
      await assets.json()
    );
    console.warn("Uh oh, something's not quite right.");
    return null;
  } else {
    const resBody = await assets.json();
    console.log("Response OK", { body: resBody });
    console.log("Successfully got assert");
    return resBody;
  }
};

export {
  getPkpsByGoogle,
  getPkpsByDiscord,
  getPkpsByWebauthn,
  getPkpsByWallet,
};
