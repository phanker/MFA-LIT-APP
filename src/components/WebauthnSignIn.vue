<script setup>
import { ref } from "vue";
import relayServerConfig from "../constans/relay_server_config";
import { pollRequestUntilTerminalState } from "../utils/pollRequestUnitTerminalState";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { computeAddress } from "ethers/lib/utils";
import Lit from "../utils/lit";
import { ethers, utils } from "ethers";
import base64url from "base64url";
import { getDomainFromOrigin } from "../utils/string";
import { mintPkp } from "../utils/mintPkp";
import { getPkpsByWebauthn } from "../utils/getPkps";

const registrationUrlOfWebauthn = relayServerConfig.registrationUrlOfWebauthn;
const authUrlOfWebauthn = relayServerConfig.authUrlOfWebauthn;
const rpcUrl = relayServerConfig.litprotcolRpcUrl;
const verifyAndMintOfWebauthn = relayServerConfig.verifyAndMintOfWebauthn;
const RELAY_API_URL = relayServerConfig.relayServerUrl;

const pkpEthAddress = ref();
const pkpPublicKey = ref();
const authenticatedPkpPublicKey = ref();
const authenticatedPkpEthAddress = ref();
const status = ref();

const authSig = ref();

let pkps;

let opts;

let userName;

function setStatus(log) {
  status.value = log;
}

const setPkpProp = ({ pkpAddress, pkpPublickey }) => {
  console.log(pkpAddress, pkpAddress);
  pkpEthAddress.value = pkpAddress;
  pkpPublicKey.value = pkpPublickey;
};

const handleWebAuthnRegister = async (username, setStatusFn, onSuccess) => {
  console.log(username);
  let url = `${RELAY_API_URL}${registrationUrlOfWebauthn}`;

  // Handle optional username
  if (username !== "") {
    url += `?username=${encodeURIComponent(username)}`;
  }
  const resp = await fetch(url, { headers: { "api-key": "1234567890" } });

  let attResp;
  try {
    opts = await resp.json();
    // Require a resident key for this demo
    opts.authenticatorSelection.residentKey = "required";
    opts.authenticatorSelection.requireResidentKey = true;
    opts.extensions = {
      credProps: true,
    };
    console.log("opts", { opts });
    //使用webauthn进行注册
    attResp = await startRegistration(opts);
  } catch (error) {
    // TODO: Handle error
    throw error;
  }
  console.log("attResp", { attResp });
  // Verify and mint PKP.
  setStatusFn("Verifying WebAuthn registration...");
  //   credentialResponse, setStatusFn, mintPkpUrl;
  const mintRequestId = await mintPkp(
    { credential: attResp },
    setStatusFn,
    verifyAndMintOfWebauthn
  );
  await pollRequestUntilTerminalState(mintRequestId, onSuccess, setStatusFn);
};

const recorveryAccount = async (setStatusFn) => {
  // Fetch latest blockHash
  setStatusFn("Fetching latest block hash...");
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const block = await provider.getBlock("latest");
  const blockHash = block.hash;

  // Turn into byte array.
  const blockHashBytes = ethers.utils.arrayify(blockHash);
  console.log(
    "blockHash",
    blockHash,
    blockHashBytes,
    base64url(Buffer.from(blockHashBytes))
  );
  // Construct authentication options.
  const rpId = getDomainFromOrigin(window.location.origin);
  console.log("Using rpId: ", { rpId });
  const authenticationOptions = {
    challenge: base64url(Buffer.from(blockHashBytes)),
    timeout: 60000,
    userVerification: "required",
    rpId,
  };
  // Authenticate with WebAuthn.
  setStatusFn("Authenticating with WebAuthn...");
  const authenticationResponse = await startAuthentication(
    authenticationOptions
  );
  console.log("authenticationResponse", { authenticationResponse });

  setStatusFn("Fetching own Pkps...");
  pkps = await getPkpsByWebauthn(authenticationResponse.rawId);
  setStatusFn("Fetched");
  console.log(pkps);
};
</script>

<template>
  <h1 style="color: red">{{ status }}</h1>

  <div>
    <input
      type="text"
      v-model="userName"
      style="height: 40px"
      placeholder="Enter UserName"
    /><br />
    <div v-show="pkpEthAddress && pkpPublicKey">
      <h5>New PKP Eth Address:{{ pkpEthAddress }}</h5>
      <h5>New PKP Eth PublicKey:{{ pkpPublicKey }}</h5>
    </div>
    <button
      type="submit"
      @click="
        handleWebAuthnRegister(
          userName,
          setStatus,
          (pkpAddress, pkpPublickey) => {
            setPkpProp({ pkpAddress, pkpPublickey });
          }
        )
      "
    >
      Mint a New Account
    </button>

    <button type="submit" @click="recorveryAccount(setStatus)">
      Recorvery Account
    </button>
  </div>
  <div v-if="pkps && pkps.pkps.length > 0">
    <p>PKP Address: {{ pkps.pkps[0].ethAddress }}</p>
    <p>PKP PublicKey: {{ pkps.pkps[0].publicKey }}</p>
    <p>PKP TokenId_Hex: {{ pkps.pkps[0].tokenId.hex }}</p>
  </div>
</template>

<style lang="less"></style>
