import relayServerConfig from "../constans/relay_server_config";

const RELAY_API_URL = relayServerConfig.relayServerUrl;

//验证pkp状态
const pollRequestUntilTerminalState = async (
  requestId,
  onSuccess,
  setStatusFn
) => {
  if (!requestId) {
    return;
  }
  const maxPollCount = 20;
  for (let i = 0; i < maxPollCount; i++) {
    setStatusFn(`Waiting for auth completion (poll #${i + 1})`);
    const getAuthStatusRes = await fetch(
      `${RELAY_API_URL}/auth/status/${requestId}`,
      {
        headers: {
          "api-key": "1234567890",
        },
      }
    );

    if (getAuthStatusRes.status < 200 || getAuthStatusRes.status >= 400) {
      console.warn(
        "Something wrong with the API call",
        await getAuthStatusRes.json()
      );
      setStatusFn("Uh oh, something's not quite right.");
      return;
    }

    const resBody = await getAuthStatusRes.json();
    console.log("Response OK", { body: resBody });

    if (resBody.error) {
      // exit loop since error
      console.warn("Something wrong with the API call", {
        error: resBody.error,
      });
      setStatusFn("Uh oh, something's not quite right.");
      return;
    } else if (resBody.status === "Succeeded") {
      // exit loop since success
      console.info("Successfully authed", { ...resBody });
      setStatusFn("Successfully authed and minted PKP!");
      onSuccess(resBody.pkpEthAddress, resBody.pkpPublicKey);
      return;
    }

    // otherwise, sleep then continue polling
    await new Promise((r) => setTimeout(r, 15000));
  }

  // at this point, polling ended and still no success, set failure status
  setStatusFn(`Hmm this is taking longer than expected...`);
};

export { pollRequestUntilTerminalState };
