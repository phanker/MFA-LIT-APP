import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient({
  litNetwork: "serrano",
});

class Lit {
  constructor() {
    this.litNodeClient = client;
  }

  async connect() {
    // const sig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
    await this.litNodeClient.connect();
  }
}

export default new Lit();
