<script setup>
import { ref } from "vue";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import Lit from "../utils/lit";
import { getSessionSigs } from "../utils/getSessionSigs";
import { mintPkp } from "../utils/mintPkp";
import * as LitJsSdk_blsSdk from "@lit-protocol/bls-sdk";
import relayServerConfig from "../constans/relay_server_config";
import { pollRequestUntilTerminalState } from "../utils/pollRequestUnitTerminalState";
import { ethers, utils } from "ethers";
import { getPkpsByGoogle } from "../utils/getPkps";
const RELAY_API_URL = relayServerConfig.relayServerUrl;

const VITE_MINT_PKP_GOOGLE_URL_PATH = relayServerConfig.mintPkpUrlOfGoogle;

const googleCredentialResponse = ref();
const processState = ref();
const pkpEthAddress = ref();
const pkpPublicKey = ref();
const encryptedStr = ref();
const encryptedSymmetricKey = ref();
const authenticatedPkpEthAddress = ref();
const authenticatedPkpPublicKey = ref();

const isShowDIV = ref(false);
const callback = (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  console.log("Handle the response", response);
  //this is the response of logining google with Oauth
  googleCredentialResponse.value = response;
  if (
    googleCredentialResponse.value &&
    googleCredentialResponse.value.credential
  ) {
    isShowDIV.value = true;
  }
};

//hanleMint
const handleMintPkpUsingGoogleAuth = async (
  credentialResponse,
  onSuccess,
  setStatusFn
) => {
  setStatusFn("Minting PKP...");

  const requestId = await mintPkp(
    {
      idToken: credentialResponse.credential,
    },
    setStatusFn,
    VITE_MINT_PKP_GOOGLE_URL_PATH
  );
  console.log(`Received RequestId is ${requestId}`);
  await pollRequestUntilTerminalState(requestId, onSuccess, setStatusFn);
};

const setPkpProp = ({ pkpAddress, pkpPubKey }) => {
  console.log(pkpAddress, pkpAddress);
  pkpEthAddress.value = pkpAddress;
  pkpPublicKey.value = pkpPubKey;
};

// ----------------------------------------------------------------------------------

const setStatusFn = (processMsg) => {
  processState.value = processMsg;
};

//让多个节点存储oauth 登录google 后的验证信息信息
const handleStoreEncryptionConditionNodes = async (
  setStatusFn,
  googleCredentialResponse,
  registeredPkpPublicKey
) => {
  setStatusFn("Storing encryption condition with the network...");
  //等待Lit客户端节点的链接
  await Lit.connect();
  // get the user a session with it
  const litNodeClient = Lit.litNodeClient;

  //随机加密一条msg
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    "this is a secret message"
  );

  //hash 加密后的msg
  // key parameter - encrypt symmetric key then hash it
  const encryptedSymmetrickey = LitJsSdk_blsSdk.wasmBlsSdkHelpers.encrypt(
    LitJsSdk.uint8arrayFromString(litNodeClient.subnetPubKey, "base16"),
    symmetricKey
  );
  // get the session sigs
  const { sessionSigs } = await getSessionSigs(
    litNodeClient,
    encryptedSymmetrickey,
    litNodeClient.generateAuthMethodForGoogleJWT(
      googleCredentialResponse.credential
    ),
    registeredPkpPublicKey
  );

  //将公钥加密成地址
  const pkpEthAddress = publicKeyToAddress(registeredPkpPublicKey);

  //
  const unifiedAccessControlConditions =
    getUnifiedAccessControlConditions(pkpEthAddress);
  console.log(
    "unifiedAccessControlConditions: ",
    unifiedAccessControlConditions
  );

  // store the decryption conditions
  await litNodeClient.saveEncryptionKey({
    unifiedAccessControlConditions,
    symmetricKey,
    encryptedSymmetricKey: encryptedSymmetrickey,
    sessionSigs, // Not actually needed for storing encryption condition.
    chain: "mumbai",
  });
  console.log("encryptedSymmetrickey: ", encryptedSymmetrickey);
  console.log("Condition stored.  Now to retrieve the key and decrypt it.");

  encryptedStr.value = encryptedString;
  encryptedSymmetricKey.value = encryptedSymmetrickey;
  authenticatedPkpEthAddress.value = publicKeyToAddress(registeredPkpPublicKey);
  authenticatedPkpPublicKey.value = registeredPkpPublicKey;
};

function publicKeyToAddress(publicKey) {
  return utils.computeAddress(`${publicKey}`);
}

function getUnifiedAccessControlConditions(pkpEthAddress) {
  return [
    {
      conditionType: "evmBasic",
      contractAddress: "",
      standardContractType: "",
      chain: "mumbai",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: pkpEthAddress || "0x3c3CA2BFFfffE532aed2923A34D6c1F9307F8076",
      },
    },
  ];
}

//---------------------------------------------------------------------------------------

const handleRetrieveSymmetricKeyNodes = async (
  setStatusFn,
  encryptedSymmetrickey,
  encryptedString,
  googleCredentialResponse,
  pkpEthAddress
) => {
  setStatusFn("Retrieving symmetric key...");
  await Lit.connect();
  const litNodeClient = Lit.litNodeClient;
  // get the session sigs
  const { sessionSigs } = await getSessionSigs(
    litNodeClient,
    encryptedSymmetrickey,
    litNodeClient.generateAuthMethodForGoogleJWT(
      googleCredentialResponse.credential
    )
  );
  console.log(`sessionSigs=${sessionSigs}`);
  console.log(`pkpEthAddress=${pkpEthAddress}`);
  // get the ACC
  const unifiedAccessControlConditions =
    getUnifiedAccessControlConditions(pkpEthAddress);
  console.log(
    "unifiedAccessControlConditions: ",
    unifiedAccessControlConditions
  );

  const retrievedSymmKey = await litNodeClient.getEncryptionKey({
    unifiedAccessControlConditions,
    toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetrickey, "base16"),
    chain: "ethereum",
    sessionSigs,
  });
  const decryptedString = await LitJsSdk.decryptString(
    encryptedString,
    retrievedSymmKey
  );
  console.log("decrypted string", decryptedString);
};

const pkps = ref([]);
const recorveryAccount = async (setStateFn, credentialResponse) => {
  setStateFn("Recorvering..");
  const responseBody = await getPkpsByGoogle(credentialResponse.credential);
  pkps.value = responseBody.pkps;
  console.log(pkps.value);
  setStateFn("Recorvered..");
};
</script>

<template>
  <GoogleLogin :callback="callback" v-if="!isShowDIV" />
  <h3 style="color: #e43939">{{ processState }}</h3>
  <!-- <h2>Step 2: Use Google Credential to Mint PKP.</h2> -->
  <div v-if="isShowDIV">
    <button
      @click="
        handleMintPkpUsingGoogleAuth(
          googleCredentialResponse,
          (pkpAddress, pkpPubKey) => {
            setPkpProp({ pkpAddress, pkpPubKey });
          },
          setStatusFn
        )
      "
      type="submit"
    >
      Mint a New PKP
    </button>

    <div v-show="pkpEthAddress && pkpPublicKey">
      <h5>New PKP Eth Address:{{ pkpEthAddress }}</h5>
      <h5>New PKP Eth PublicKey:{{ pkpPublicKey }}</h5>
    </div>

    <button
      style="background-color: rgb(94, 89, 89)"
      @click="recorveryAccount(setStatusFn, googleCredentialResponse)"
    >
      Recorvery PKPs
    </button>

    <div>
      <!-- 示例列表 -->

      <ul>
        <li v-for="(pkp, index) in pkps" v-bind:key="index">
          <p class="p" ref="liCon">EthAddress: {{ pkp.ethAddress }}</p>
          <p>PublicKey: {{ pkp.publicKey }}</p>
          <p>TokenId: {{ pkp.tokenId.hex }}</p>
        </li>
        <hr />
      </ul>
    </div>

    <!-- <h2>
    Step 3: Generate auth sigs from Lit Nodes, then generate session sigs for
    storing an encryption condition.
  </h2> -->

    <!-- <button
      @click="
        handleStoreEncryptionConditionNodes(
          setStatusFn,
          googleCredentialResponse,
          pkpPublicKey
        )
      "
    >
      Authenticate + Encrypt with Lit
    </button>
    <div v-show="authenticatedPkpEthAddress">
      <h5>Authenticated PKP Eth Address: {{ authenticatedPkpEthAddress }}</h5>
    </div>

    <h2>Step 4: Retrieve the decrypted symmetric key from Lit Nodes.</h2>
    <button
      variant="contained"
      @click="
        handleRetrieveSymmetricKeyNodes(
          setStatusFn,
          encryptedSymmetricKey,
          encryptedStr,
          googleCredentialResponse,
          authenticatedPkpEthAddress
        )
      "
    >
      Decrypt
    </button> -->
  </div>
</template>

<style lang="less">
ul {
  list-style-type: none; /* 移除默认的列表标记 */
  padding: 0; /* 移除默认的内边距 */
  margin: 0; /* 移除默认的外边距 */
}

/* 样式列表项 */
li {
  margin-bottom: 10px; /* 列表项之间的垂直间距 */
  padding: 10px; /* 列表项的内边距 */
  background-color: #f2f2f2; /* 列表项的背景颜色 */
  border-radius: 5px; /* 列表项的圆角边框 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 列表项的阴影效果 */
}
button {
  padding: 10px 20px; /* 按钮内边距 */
  margin-right: 10px; /* 右边按钮的外边距，用于创建间隔 */
}
</style>
