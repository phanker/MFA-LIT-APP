// router.js

import { createRouter, createWebHistory } from "vue-router";

// 导入需要的组件
import GoogleSignIn from "./components/GoogleSignIn.vue";
import DiscordSignIn from "./components/DiscordSignIn.vue";
import WebauthnSignIn from "./components/WebauthnSignIn.vue";
import AddressSignIn from "./components/AddressSignIn.vue";
// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // { path: "/", component: Home },
    { path: "/google", component: GoogleSignIn },
    { path: "/discord", component: DiscordSignIn },
    { path: "/webauthn", component: WebauthnSignIn },
    { path: "/wallet", component: AddressSignIn },
  ],
});

export default router;
