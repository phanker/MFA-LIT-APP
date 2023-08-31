
# Project's Description
Following the protocol of Lit Action to develop application.Which supports multiple ways of OAuth2 to login in,such as Google,Discord and Webauthn.Of cource it supports Digtial Wallet to login in as well.

# Quick Start

create a .env and refer to the [.env_example](https://github.com/phanker/MFA-LIT-APP/blob/main/.env.example) file to configure your [VITE_GOOGLE_CLIENT_ID](https://github.com/phanker/MFA-LIT-APP/blob/main/.env.example#L=1) for google oauth2 login,because only in the development environment of google supports specific accounts to login.So I separately configure [VITE_GOOGLE_CLIENT_ID](https://github.com/phanker/MFA-LIT-APP/blob/main/.env.example#L=1) for those who want to dynamicly configure their own client id of google.  

# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
