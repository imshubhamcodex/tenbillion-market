<template>
  <div>
    <v-alert text prominent type="error" icon="mdi-cloud-alert">
      <v-row align="center">
        <v-col class="grow">
          Successfull transaction on <strong>{{ this.info.date }}</strong> of
          amount <strong>₹ {{ this.info.amount }}</strong> as a/an
          <strong>{{ this.info.type }}</strong> money. By user:
          <strong> {{ this.info.email }} </strong> See photo ID:
          <strong @click="seePhoto()" style="cursor:pointer">
            {{ this.info.photo }} </strong
          >
        </v-col>
        <v-col class="shrink">
          <v-btn :id="this.id" @click="verify()">Verify</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "firebase/firestore";
export default {
  props: ["info"],
  data: () => ({
    id: "",
    uid: "",
    verified: true,
    transactionID: "",
    email: ""
  }),
  methods: {
    seePhoto() {
      firebase
        .storage()
        .ref(this.uid + "/" + this.id)
        .getDownloadURL()
        .then(function(url) {
          // console.log(url)
          window.open(url);
        });
    },
    verify() {
      // transaction  upload
      let accUID = prompt("Please Enter UID");
      if ("Sni50" === accUID) {
        this.$fireStore
          .collection(this.email)
          .doc(this.transactionID)
          .update({
            verified: true
          })
          .then(() => {
            console.log("Verification Done");
            document.getElementById(this.id).classList += " v-btn--disabled";
            alert("Verified");
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      } else {
        alert("NOT Authorised!");
        return;
      }
    }
  },
  mounted() {
    this.verified = this.info.verified;
    this.id = this.info.photo;
    this.uid = this.info.uid;
    this.transactionID = this.info.transactionID;
    this.email = this.info.email;
  }
};
</script>
