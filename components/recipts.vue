<template>
  <div>
    <v-alert outlined type="success" text v-if="verified">
      <Strong>Successfull</Strong> transaction on
      <strong style="color: black">{{
        this.info.date.toString().substring(3, 15)
      }}</strong>
      of amount
      <strong style="color: black">₹ {{ this.info.amount }}</strong> as a/an
      <strong style="color: black">{{ this.info.type }}</strong> money. By user:
      <strong style="color: black">
        {{
          this.info.email.length > 25
            ? this.info.email.substring(0, 25) + '...'
            : this.info.email
        }}
      </strong>
      See photo ID:
      <strong @click="seePhoto()" style="cursor: pointer; color: black">
        {{ this.info.photo }} 💵
      </strong>
    </v-alert>
    <v-alert text prominent type="error" icon="mdi-cloud-alert" v-else>
      <v-row align="center">
        <v-col class="grow">
          <Strong>Successfull</Strong> transaction on
          <strong style="color: black">{{
            this.info.date.toString().substring(3, 15)
          }}</strong>
          of amount
          <strong style="color: black">₹ {{ this.info.amount }}</strong> as a/an
          <strong style="color: black">{{ this.info.type }}</strong> money. By
          user:
          <strong style="color: black"> {{ this.info.email }} </strong> See
          photo ID:
          <strong @click="seePhoto()" style="cursor: pointer; color: black">
            {{ this.info.photo }} 💵
          </strong>
        </v-col>
        <v-col class="shrink">
          <v-btn :id="this.id" @click="verify()">VERIFY</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import 'firebase/firestore'
export default {
  props: ['info'],
  data: () => ({
    id: '',
    uid: '',
    verified: true,
    transactionID: '',
    email: '',
  }),
  methods: {
    seePhoto() {
      firebase
        .storage()
        .ref(this.uid + '/' + this.id)
        .getDownloadURL()
        .then(function (url) {
          // console.log(url)
          window.open(url)
        })
    },
    verify() {
      // transaction  upload
      let accUID = prompt('Please Enter UID')
      if ('Sni50' === accUID) {
        this.$fireStore
          .collection(this.email)
          .doc(this.transactionID)
          .update({
            verified: true,
          })
          .then(() => {
            console.log('Verification Done')
            document.getElementById(this.id).classList += ' v-btn--disabled'
            alert('Verified')
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
      } else {
        alert('NOT Authorised!')
        return
      }
    },
  },
  mounted() {
    this.verified = this.info.verified
    this.id = this.info.photo
    this.uid = this.info.uid
    this.transactionID = this.info.transactionID
    this.email = this.info.email
  },
}
</script>
