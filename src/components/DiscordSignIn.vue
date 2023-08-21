<script setup>
import { ref, onMounted } from "vue";
import { getPkpsByDiscord } from "../utils/getPkps";
import { mintPkp } from "../utils/mintPkp";
import relayServerConfig from "../constans/relay_server_config";
import { pollRequestUntilTerminalState } from "../utils/pollRequestUnitTerminalState";
const tokenType = ref("");
const accessToken = ref("");
const name = ref("");
const profilePic = ref("");

const VITE_MINT_PKP_DISCORD_URL_PATH = relayServerConfig.mintPkpUrlOfDiscord;

onMounted(async () => {
  const urlSearchParams = new URLSearchParams(window.location.hash.slice(1));
  tokenType.value = urlSearchParams.get("token_type");
  accessToken.value = urlSearchParams.get("access_token");
  console.log(tokenType.value);
  console.log(accessToken.value);

  function setStatusFn(log) {
    console.log(log);
  }
  if (tokenType && accessToken) {
    fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${tokenType.value} ${accessToken.value}`,
      },
    })
      .then((result) => result.json())
      .then((response) => {
        console.log(response);
        const { username, discriminator, avatar, id } = response;
        //set the welcome username string
        console.log(`name = ${username} & discriminator=${discriminator}`);
        name.value = ` ${username}#${discriminator}`;
        //set the avatar image by constructing a url to access discord's cdn
        // document.getElementById(
        //   "avatar"
        // ).src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg`;
        profilePic.value = `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg`;
      })
      .catch(console.error);
    await getPkpsByDiscord(accessToken.value);
  }
});
const createNewPkp = async (setStatusFn) => {
  const requestId = await mintPkp(
    {
      accessToken: accessToken.value,
    },
    setStatusFn,
    VITE_MINT_PKP_DISCORD_URL_PATH
  );

  //   requestId, onSuccess, setStatusFn;
  await pollRequestUntilTerminalState(
    requestId,
    (pkpAddr, pkpPublickey) => {
      pkpAddress.value = pkpAddr;
      pkpPublicKey.value = pkpPublickey;
    },
    setState
  );
};

const state = ref();

function setState(log) {
  state.value = log;
}

const pkpAddress = ref();
const pkpPublicKey = ref();
const pkps = ref([]);
const recorveryAccount = async (setStateFn) => {
  setStateFn("Recorvering..");
  const responseBody = await getPkpsByDiscord(accessToken.value);
  pkps.value = responseBody.pkps;
  console.log(pkps.value);
  setStateFn("Recorvered..");
};
</script>

<template>
  <div>
    <h1 style="color: #da1616">{{ state }}</h1>
  </div>
  <div v-if="!tokenType && !accessToken">
    <div
      class="items-center justify-center h-screen bg-discord-gray text-white"
    >
      <a
        id="login"
        href="https://discord.com/api/oauth2/authorize?client_id=1142669767161950218&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fdiscord&response_type=token&scope=identify"
        class="bg-discord-blue text-x2 px-5 py-3 font-bold items-center space-x-4 hover:bg-gray-600 transition duration-75"
      >
        <i class="fa-brands fa-discord text-2xl"></i>
        <span>Login with Discord</span>
      </a>
    </div>
  </div>

  <div v-if="tokenType && accessToken">
    <img :src="profilePic" />
    <p>Name: {{ name }}</p>
    <p>Token Type: {{ tokenType }}</p>
    <p>Access Token: {{ accessToken }}</p>
  </div>
  <div class="custom-divider"></div>
  <div v-if="pkpAddress && pkpPublicKey">
    <p>New PKPAddress:{{ pkpAddress }}</p>
    <p>New PKPPublicKey:{{ pkpPublicKey }}</p>
  </div>
  <div v-if="tokenType && accessToken">
    <button style="background-color: brown" @click="createNewPkp(setState)">
      Mint a New PKP
    </button>
    <button
      style="background-color: rgb(94, 89, 89)"
      @click="recorveryAccount(setState)"
    >
      Recorvery PKPs
    </button>
  </div>
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
</template>

<style lang="less"></style>

<style scoped>
@import "../assets/public/global.css";
@import "../assets/public/output.css";
.custom-divider {
  border-top: 1px solid #000; /* 自定义分割线的样式 */
  margin: 10px 0; /* 可以调整分割线与内容的间距 */
}
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
