<script setup>
import { ref } from "vue";
import { getPkpsByGoogle } from "../utils/getPkps";

const google_response =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMzYWZlN2E5YmRhNDZiYWU2ZWY5N2U0NmM5NWNkYTQ4OTEyZTU5NzkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4OTIxMjM0MjA2ODAtOHQ4MTgwaHFrYzM3cWluNG4zZjRwZjQwazQwZTluZnIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4OTIxMjM0MjA2ODAtOHQ4MTgwaHFrYzM3cWluNG4zZjRwZjQwazQwZTluZnIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MTQ5MTA1NjI2MjE2MjEwMzMiLCJlbWFpbCI6InBhbjQyOTAwNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNjkyNDI5OTE2LCJuYW1lIjoia2luZyBwYW0iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0ZEFSS1p3eEdFUzk4WTNyd3RjYkN6VDNwRkhuSnZkZ2Y3LXVLdVZoVlhyPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ImtpbmciLCJmYW1pbHlfbmFtZSI6InBhbSIsImxvY2FsZSI6InpoLUNOIiwiaWF0IjoxNjkyNDMwMjE2LCJleHAiOjE2OTI0MzM4MTYsImp0aSI6IjAzZTU5MTQzZGFkODYzMGJkNDcxNzM0MmYwNjNiOTEyNDQ1OWU3MjIifQ.kEKkHQdfpAtlRwYqT6xuyEEKVm4eUWCdkaGPDvyJesAEriB02qSp4Afxng4I9VmCyaJ0nbPyRoQSvViVAtnQHHbScnmMqlM4kWR-zrIKYImmBAneHC_XgcgcjPl1PswfK2QC1GwGS1B-JmRuZE80j7gUaf4zdVQMFIkvCaKihInzZ8f2HOJVionBOG3spqudp_6dAnHo-ZMKGWCY-A1CUpIwvo56gZXmjU1WPKUpjrdpyTQGbcOWwrDWJWq96C5c6I8VUkeMuUfAD4jXmj6uX0MIM2VovD2DJkJ4Ailu60-Mr38iualua_lC21myFi27nundhJ3kGiPaGhxZYkWNRQ";
//   "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMzYWZlN2E5YmRhNDZiYWU2ZWY5N2U0NmM5NWNkYTQ4OTEyZTU5NzkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4OTIxMjM0MjA2ODAtOHQ4MTgwaHFrYzM3cWluNG4zZjRwZjQwazQwZTluZnIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4OTIxMjM0MjA2ODAtOHQ4MTgwaHFrYzM3cWluNG4zZjRwZjQwazQwZTluZnIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MTQ5MTA1NjI2MjE2MjEwMzMiLCJlbWFpbCI6InBhbjQyOTAwNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNjkyNDI4OTg1LCJuYW1lIjoia2luZyBwYW0iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0ZEFSS1p3eEdFUzk4WTNyd3RjYkN6VDNwRkhuSnZkZ2Y3LXVLdVZoVlhyPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ImtpbmciLCJmYW1pbHlfbmFtZSI6InBhbSIsImxvY2FsZSI6InpoLUNOIiwiaWF0IjoxNjkyNDI5Mjg1LCJleHAiOjE2OTI0MzI4ODUsImp0aSI6IjY5OGFjOTMyZTgwZmQwNjA3NDY5Yzc1Yzc4YjM3Nzk5YTJhOTg0YTQifQ.atxIUqmZ5LvXNSTSkyGRw_SyFewZUioHaZiVmPuqP-4IiiBJjtjnr3_sdDkOfLOxTFW9IhR3sKv_Rb5dAzzsqz6dIm-1yhgMeFbgnz6N1BeCXALvHv9TkBkPp5hV9uk5jO1nFL_yK65w_W_AyCNSFCTK7VlKrG6fRbI28VPLQ0UySrCCWfb6GMVPCUzY4ejZFLN-5o_ACJQzM2k18ApmT56ymeDbPq5cQCy8hyzroSEZ_5ibQqD3jraw0MbPFwBbx8JO4yzQCdrX7HpZKTmrb88Ddf1pNiSjj_ku_FMghQ87L43Pul6gZX0cbbelZF5ViC_ZS_ZLvIe6DENxb840cg";

const myAssets = ref([]);
const getMyAssert = async () => {
  const assets = await getPkpsByGoogle(google_response);
  console.log(assets);
  myAssets.value = assets;
};
</script>

<template>
  <div class="newslist">
    <ul>
      <li v-for="(pkp, index) in myAssets['pkps']" v-bind:key="index">
        <p class="p" ref="liCon">EthAddress: {{ pkp.ethAddress }}</p>
        <p>PublicKey: {{ pkp.publicKey }}</p>
        <p>TokenId: {{ pkp.tokenId.hex }}</p>
      </li>
    </ul>

    <button @click="getMyAssert()">Get Assets</button>
  </div>
</template>

<style lang="less">
.newslist ul li p {
  font-size: 14px;
  color: #555;
  line-height: 25px;
  height: 50px;
  overflow: hidden;
  transition: height 0.3s;
}
</style>
