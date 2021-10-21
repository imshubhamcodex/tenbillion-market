<template>
  <div>
    <h3 style="display:block;text-align:center;margin-bottom:10px;">{{user.split('-')[2]}}</h3>
    <template>
      <div>
        <v-progress-circular
          :size="90"
          color="black"
          v-show="progressBar"
          indeterminate
          style="
            position: absolute;
            top: 50%;
            z-index: 9;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        ></v-progress-circular>
        <v-alert
          min="2020-10-10"
          v-show="alert"
          dismissible
          color="cyan"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-checkbox-marked-circle"
        >
          Transaction <strong>Succeed!</strong>
        </v-alert>
      </div>
    </template>

    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1"> Select Date </v-stepper-step>

      <v-stepper-content step="1">
        <v-row align="center">
          <v-date-picker
            :allowed-dates="allowedDates"
            id="data-picker"
            required
            elevation="10"
            :events="arrayEvents"
            event-color="green "
            v-model="date"
            full-width
            style="padding: 20px; margin: 20px; width: 800px"
          >
          </v-date-picker>
        </v-row>
        <v-btn id="continue-btn" color="primary" @click="e6 = 2">
          Continue
        </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">
        Choose Amount
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-select
          v-model="money"
          :items="items"
          label="Paying Amount"
          required
          outlined
          clearable
          style="padding: 20px; max-width: 400px"
        ></v-select>
        <template>
          <v-container class="px-3" fluid>
            <v-radio-group v-model="radioGroup">
              <v-radio :label="`Regular`"></v-radio>
              <v-radio :label="`Lumpsum`"></v-radio>
            </v-radio-group>
          </v-container>
        </template>
        <v-btn color="primary" @click="e6 = 3"> Continue </v-btn>
        <v-btn text @click="e6 = 1"> Back </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3">
        Upload Image
      </v-stepper-step>

      <v-stepper-content step="3">
        <template>
          <v-file-input
            v-model="photo"
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            label="Payment photo"
            style="padding: 20px; width: 300px"
            outlined
            required
          ></v-file-input>
          <v-col
            cols="12"
            sm="6"
            md="3"
            style="padding: 20px; margin-left: 30px; max-width: 200px"
          >
            <v-text-field
              label="UID"
              autocomplete="off"
              outlined
              v-model="uid"
              required
            ></v-text-field>
          </v-col>
        </template>
        <v-btn color="primary" type="submit" id="submit-btn" @click="submit()">
          submit
        </v-btn>
        <v-btn text @click="e6 = 2"> Back </v-btn>
      </v-stepper-content>
      <template>
        <div class="text-center ma-2">
          <v-btn v-show="false" dark @click="snackbar = true">
            Open Snackbar
          </v-btn>
          <v-snackbar v-model="snackbar">
            {{ text }}

            <template v-slot:action="{ attrs }">
              <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </div>
      </template>
    </v-stepper>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import 'firebase/firestore'
export default {
  props: ['user', 'transaction'],
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    progressBar: false,
    alert: false,
    e6: 1,
    radioGroup: 0,
    uid: null,
    snackbar: false,
    text: 'UID Mismatch !',
    money: null,
    photo: null,
    extra: 0,
    regular: 0,
    total: 0,
    email: '',
    timeStamp: null,
    last_paid_date: null,
    items: [
      '1000',
      '1500',
      '2000',
      '2500',
      '3000',
      '4000',
      '5000',
      '7000',
      '10000',
      '12000',
    ],
    rules: [
      (value) =>
        !value ||
        value.size < 3000000 ||
        'Photo size should be less than 3 MB!',
    ],
    arrayEvents: null,
  }),
  methods: {
    allowedDates(val) {
      if (
        this.last_paid_date <=
        firebase.firestore.Timestamp.fromDate(new Date(val))
      ) {
        return true
      } else return false
    },
    async submit() {
      let userInfo = this.user.toString().split('-')
      this.email = userInfo[1]
      if (this.uid == userInfo[0]) {
        if (this.money == null) {
          // if money null return
          this.text = 'Invalid Amount'
          this.snackbar = true
          return
        } else {
          if (this.photo == null) {
            // if image null return
            this.text = 'Choose Payment Photo'
            this.snackbar = true
            return
          }

          document.getElementById('submit-btn').classList += ' v-btn--disabled'
          this.overlay = true
          this.progressBar = true

          let paymentType
          if (this.radioGroup == 1) {
            paymentType = 'extra'
            this.extra = parseInt(this.extra) + parseInt(this.money)
          } else {
            paymentType = 'regular'
            this.regular = parseInt(this.regular) + parseInt(this.money)
          }

          this.total = parseInt(this.extra) + parseInt(this.regular)

          // info upload
          this.$fireStore
            .collection(this.email)
            .doc('info')
            .set({
              email: userInfo[1],
              extra: this.extra,
              regular: this.regular,
              total: this.total,
              text: userInfo[2],
              uid: userInfo[0],
            })
            .catch(function (error) {
              var errorMessage = error.message
              console.log(errorMessage)
            })

          this.timeStamp = firebase.firestore.Timestamp.fromDate(
            new Date(this.date)
          )
          let photoName = Math.random().toString(36).substring(7)

          // transaction  upload
          this.$fireStore
            .collection(this.email)
            .doc()
            .set({
              amount: this.money,
              photo: photoName,
              type: paymentType,
              date: this.timeStamp,
              verified: false,
            })
            .then(() => {
              console.log('Document written ')
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })

          // image upload
          firebase
            .storage()
            .ref()
            .child(this.uid + '/' + photoName)
            .put(this.photo)
            .then(() => {
              console.log('Uploaded  file!')
              this.progressBar = false
              this.alert = true
              this.e6 = 1
              document
                .getElementById('submit-btn')
                .classList.remove('v-btn--disabled')

              var sunny =
                'dk9-7r3CXCebmfYIleTQIH:APA91bHi2FdLOs2pE7wBTq9I37mVswqczWGBEaw8GCy5s5nm5reB3ByUWFTtJiY7eUkiyEYSko4pWFEog6dG7hB39DwuOoTuecngKDMsG8skelpGZWEVLyCqdiomXcV-y9HTgpAess_C'
              this.notify(sunny)
              var manish =
                'eS0d4GbsLcMVO732eoER1n:APA91bFdcwuIcmo4gtIzXl0HTSJAsB7ZdEqaxKcNYAHo6H5HNFrX3CKn6cHwliwpD6wwWL-DfhTQZ2fPj4Of4D2c7AIcg6YWX7_LbHUpCCuHIMSAPY7fxDkYV3PwP6vGqUo7hyLxQOOG'
              this.notify(manish)

              setTimeout(() => {
                this.alert = false
              }, 6000)
            })
            .catch((e) => {
              console.log('Got Error in image upload' + e)
            })
        }
      } else {
        this.snackbar = true
        return
      }
    },
    notify(val) {
      var key =
        'AAAAhYDuu7I:APA91bHvRCWoeMs8oyPAQtCsaz8YsT0oIthbTgeg4nvk-MIbcZOp1SKTHXHwrnakjIj9ruhaApRWV3MFIOs5FwiKU98NHPvj1L3VTeq2UDNN90tNlUyrg-Jh5M9C9WIZK5akYYNT9U3e'
      // var to = 'dk9-7r3CXCebmfYIleTQIH:APA91bHi2FdLOs2pE7wBTq9I37mVswqczWGBEaw8GCy5s5nm5reB3ByUWFTtJiY7eUkiyEYSko4pWFEog6dG7hB39DwuOoTuecngKDMsG8skelpGZWEVLyCqdiomXcV-y9HTgpAess_C';
      var to = val
      let userInfo = this.user.toString().split('-')

      var notification = {
        title: 'Transaction has been made!',
        body:
          'Transaction has been proceeded by ' +
          userInfo[2] +
          ' of amount ' +
          '₹' +
          this.money +
          ' on date ' +
          this.timeStamp.toDate().toISOString().substr(0, 10) +
          ' email: ' +
          userInfo[1],
        icon: 'firebase-logo.png',
      }

      fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          Authorization: 'key=' + key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification: notification,
          to: to,
        }),
      })
        .then(function (response) {
          console.log('Notification sent')
        })
        .catch(function (error) {
          console.error(error)
        })
    },
  },
  watch: {
    user: async function () {
      let userInfo = this.user.toString().split('-')
      this.email = userInfo[1]
      this.uid = userInfo[0]
      document
        .getElementById('continue-btn')
        .classList.remove('v-btn--disabled')
      this.$fireStore
        .collection(this.email)
        .doc('info')
        .get()
        .then((res) => {
          // console.log()
          this.extra = res.data().extra
          this.regular = res.data().regular
          this.total = res.data().total
        })
        .catch(function (error) {
          var errorMessage = error.message
          console.log(errorMessage)
        })
    },
  },
  async mounted() {
    this.uid = this.user.toString().split('-')[0]
    if (this.uid === null) {
      document.getElementById('continue-btn').classList += ' v-btn--disabled'
    } else {
      document.getElementById('continue-btn').classList.remove('v-btn--disabled')
    }
    // console.log(this.user)
    // console.log(this.uid)

    let arrUser = this.user.split('-')

    await this.$fireStore
      .collection(arrUser[1])
      .orderBy('date', 'desc')
      .limit(1)
      .get()
      .then((res) => {
        this.last_paid_date = res.docs[0].data().date
      })
      .catch(function (error) {
        console.log(error.message)
      })
  },
}
</script>

<style>
@media (max-width: 480px) {
  #data-picker {
    width: 400px !important;
  }
}
</style>
