<script setup>
import { ref, onMounted } from "vue";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "ethers";
import { mintPkp } from "../utils/mintPkp";
import relayServerConfig from "../constans/relay_server_config";
import { pollRequestUntilTerminalState } from "../utils/pollRequestUnitTerminalState";
import { getPkpsByWallet } from "../utils/getPkps";
const mintPkpUrlOfWallet = relayServerConfig.mintPkpUrlOfWallet;

const currentUser = ref();
const state = ref();
const pkpAddress = ref();
const pkpPublicKey = ref();
const pkps = ref([]);

const createNewPkp = async (setStateFn) => {
  checkUserInfo();
  const sig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
  const requestId = await mintPkp(sig, setStateFn, mintPkpUrlOfWallet);
  await pollRequestUntilTerminalState(
    requestId,
    (pkpAddr, pkpPublickey) => {
      pkpAddress.value = pkpAddr;
      pkpPublicKey.value = pkpPublickey;
    },
    setStateFn
  );
};

const connect = async () => {
  const sig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
  console.log(sig);
  checkUserInfo();
};

onMounted(() => {
  //   checkUserInfo();
});

function checkUserInfo() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // 使用 provider 获取用户的账户信息
  provider
    .listAccounts()
    .then((accounts) => {
      if (accounts.length > 0) {
        // 用户已连接到钱包，且至少有一个账户
        console.log("use has connected.");
        console.log("current user:", accounts[0]);
        currentUser.value = accounts[0];
      } else {
        // 用户未连接到钱包
        console.log("no connect");
      }
    })
    .catch((error) => {
      // 处理错误
      console.error(error);
    });
}

function setState(log) {
  state.value = log;
}

const recorveryAccount = async (setStateFn) => {
  const sig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
  setStateFn("Recorvering..");
  const responseBody = await getPkpsByWallet(sig);
  pkps.value = responseBody.pkps;
  console.log(pkps.value);
  setStateFn("Recorvered..");
};
</script>

<template>
  <div v-if="!currentUser">
    <button @click="connect()">Connect Wallet</button>
  </div>
  <div v-if="currentUser">
    <p style="font-weight: bold">UserAddress:{{ currentUser }}</p>
    <h1 style="color: red">{{ state }}</h1>

    <div v-if="pkpAddress && pkpPublicKey">
      <p style="font-weight: bold">New PKPAddress:{{ pkpAddress }}</p>
      <p style="font-weight: bold">New PKPPublicKey:{{ pkpPublicKey }}</p>
    </div>
    <button
      style="background-color: brown"
      @click="createNewPkp(setState, authSig)"
    >
      Mint a New PKP
    </button>
    <button
      style="background-color: rgb(94, 89, 89)"
      @click="recorveryAccount(setState, authSig)"
    >
      Recorvery PKPs
    </button>
  </div>

  <div>
    <!-- 示例列表 -->
    <ul>
      <li v-for="(pkp, index) in pkps" v-bind:key="index">
        <p class="p" ref="liCon">PKPEthAddress: {{ pkp.ethAddress }}</p>
        <p>PKPPublicKey: {{ pkp.publicKey }}</p>
        <p>PKPTokenId: {{ pkp.tokenId.hex }}</p>
      </li>
      <hr />
    </ul>
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
