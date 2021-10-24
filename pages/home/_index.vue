<template>
  <v-app>
    <v-app-bar id="nav-bar-main" app clipped-left color="white">
      <v-app-bar-nav-icon @click="drawerfun()"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5">
        {{ headingsub1 }}&nbsp;
        <span class="font-weight-light">{{ headingsub2 }}</span>
      </span>
      <v-spacer></v-spacer>

      <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="10">
          <v-icon style="float: right; cursor: pointer" @click="gotoNotes()"
            >mdi-pencil</v-icon
          >
          <v-icon
            v-show="email"
            style="float: right; cursor: pointer; margin-right: 50px"
            @click="openSearchPanel()"
            >mdi-text-search</v-icon
          >
        </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer
      id="nav-drawer"
      v-model="drawer"
      app
      clipped
      color="white lighten-4"
    >
      <!-- <v-navigation-drawer permanent> -->
      <v-list-item class="drawer_options">
        <v-list-item-content>
          <v-list-item-title
            id="account-title"
            class="title"
            @click="showAccounts()"
            >Active Accounts ▼</v-list-item-title
          >
          <v-list-item-subtitle>{{ allUser.length }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="drawer_options">
        <v-list-item-content>
          <v-list-item-title class="title">Total Investment</v-list-item-title>
          <v-list-item-subtitle>₹ {{ totalAmount }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="drawer_options">
        <v-list-item-content>
          <v-list-item-title class="title">Return</v-list-item-title>
          <v-list-item-subtitle style="color: green"
            >₹ {{ profitAmt }} ({{ returnPercentage }} % )
            ▲</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="drawer_options">
        <v-list-item-content>
          <v-list-item-title class="title" @click="changeCurrAmt()"
            >Current Value</v-list-item-title
          >
          <v-list-item-subtitle style="color: green"
            >₹ {{ CurrentVal }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="drawer_options">
        <v-list-item-content>
          <v-list-item-title class="title">Next Month Target</v-list-item-title>
          <v-list-item-subtitle style="color: indigo"
            >₹ {{ CurrentVal * 0.1 }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>

      <!-- <v-list-item>
        <v-btn color="primary" @click="openTimeLine()">Watch Timeline</v-btn>
      </v-list-item> -->

      <v-divider class="drawer_options"></v-divider>

      <v-list dense nav v-if="rerenderUserList">
        <v-list-item
          v-for="item in items"
          :key="item.uid"
          link
          @click="selectedAccount(item.id)"
        >
          <v-list class="people" outlined style="margin-bottom: 30px">
            <span>
              <v-badge
                color="green"
                content="BIG BULL 🐮"
                style="position: absolute; top: 25px; right: 93px"
                v-show="bigbull(item.total)"
              ></v-badge>
            </span>

            <v-list-item class="px-2">
              <v-list-item-avatar>
                <v-img :src="sendImgURL(item.text)"></v-img>
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="title">
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-title>
                <v-list-item-title>{{ item.email }}</v-list-item-title>
                <v-divider></v-divider>
                <v-list-item-title class="overline"
                  >Regular:: ₹ {{ item.regular }}</v-list-item-title
                >
                <v-list-item-title class="overline"
                  >Lumpsum:: ₹ {{ item.extra }}</v-list-item-title
                >

                <v-list-item-title class="overline" style="color: green"
                  >Return:: ₹ {{ item.returnAmt }}</v-list-item-title
                >

                <v-list-item-title class="overline" style="color: green"
                  >Curr. value:: ₹
                  {{ item.total + item.returnAmt }}</v-list-item-title
                >

                <v-list-item-title
                  class="overline"
                  :class="{
                    'red-class': item.isDue,
                    'green-class': !item.isDue,
                  }"
                >
                  Payment Due:: {{ item.duePayment }}
                </v-list-item-title>

                <v-list-item-title
                  :class="{
                    'red-class': !item.isAccepted,
                    ['green-class overline']: item.isAccepted,
                  }"
                >
                  {{ item.acceptedTandC }}
                </v-list-item-title>

                <v-list-item-title class="overline">
                  <v-progress-linear
                    color="teal"
                    buffer-value="0"
                    :value="calcAmtPaidInPercentage(item.total)"
                    stream
                  ></v-progress-linear>
                </v-list-item-title>

                <br />
                <v-divider></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list-item>
      </v-list>

      <v-list dense nav class="drawer_options">
        <v-list-item style="padding-bottom: 50px">
          <!-- graph-->
          <h3
            id="loading-pie"
            style="
              position: absolute;
              transform: translate(-50%, -50%);
              left: 50%;
              top: 50%;
            "
          >
            Loading curve..⏳
          </h3>
          <h5
            style="
              position: absolute;
              transform: translate(-50%);
              left: 50%;
              bottom: 0px;
            "
          >
            Amount contributed
          </h5>
          <canvas id="myChartPie" height="300" width="300"></canvas>
          <br />
        </v-list-item>
      </v-list>

      <v-list dense nav class="drawer_options">
        <v-list-item style="padding-bottom: 10px; margin-top: 20px">
          <!-- graph-->
          <canvas id="overallinv" height="400" width="400"></canvas>
          <br />
        </v-list-item>
      </v-list>

      <v-list dense nav class="drawer_options">
        <v-list-item style="padding-bottom: 10px; margin-top: 10px">
          <!-- graph-->
          <canvas id="overallinvbar" height="400" width="400"></canvas>
          <br />
        </v-list-item>
      </v-list>

      <br />
      <br />
      <div
        class="drawer_options"
        style="
          margin-top: 20px;
          margin-bottom: 10px;
          display: block;
          width: 100%;
          bottom: 0;
          position: absolute;
        "
      >
        <v-btn
          color="cyan"
          style="
            width: 96%;
            color: white;
            display: block;
            margin-left: auto;
            margin-right: auto;
          "
          @click="logout()"
          >Log Out</v-btn
        >
      </div>
      <!-- </v-navigation-drawer> -->
    </v-navigation-drawer>
    <v-main>
      <v-container fluid class="grey lighten-4 fill-height">
        <v-row justify="center" align="center">
          <v-col class="shrink">
            <!-- this is content/calender -->
            <formInput v-if="showCalenderAll" v-bind:user="this.selectedUser" />
            <br />
            <v-alert v-show="showCalenderAll" dense type="info">
              <strong>Previous Transactions</strong>
            </v-alert>

            <v-container v-if="!showCalenderAll && showCards">
              <v-card
                class="tiles"
                style="position: relative; padding-top: 20px"
              >
                <div class="text-center">
                  <v-progress-circular
                    :rotate="360"
                    :size="200"
                    :width="16"
                    :value="overallProgress"
                    color="green"
                  >
                    <span style="font-weight: bold"
                      >{{ overallProgress }} % Done</span
                    >
                  </v-progress-circular>
                </div>
                <v-card-title class="title"> Overall Progress </v-card-title>
              </v-card>
              <br />

              <v-card
                class="tiles"
                @click="showUnverifiedRecipts()"
                style="position: relative"
              >
                <v-img
                  :src="require('@/assets/paid.png')"
                  height="250"
                  class="grey darken-4"
                ></v-img>
                <v-card-title class="title"> Unverified payments </v-card-title>
                <v-badge
                  color="red"
                  :content="no_of_unverifiedPayments"
                  style="position: absolute; top: 92%; right: 30%"
                >
                </v-badge>
              </v-card>
              <br />
              <v-card class="tiles" @click="openTimeLine()">
                <v-img
                  :src="require('@/assets/text.png')"
                  height="250"
                  class="grey darken-4"
                ></v-img>
                <v-card-title class="title"> SIP Calculator </v-card-title>
              </v-card>
              <br />
              <v-card class="tiles" @click="gotoNotes()">
                <v-img
                  :src="require('@/assets/notes.png')"
                  height="250"
                  class="grey darken-4"
                ></v-img>
                <v-card-title class="title">Author's Notes </v-card-title>
              </v-card>
              <br />
              <v-card class="tiles" @click="gotoTandC()">
                <v-img
                  :src="require('@/assets/tandc.png')"
                  height="250"
                  class="grey darken-4"
                ></v-img>
                <v-card-title class="title">Terms and Conditions </v-card-title>
              </v-card>
            </v-container>

            <v-list-item id="curve">
              <!-- graph-->
              <h3
                id="loading-curve"
                style="
                  position: absolute;
                  transform: translate(-50%, -50%);
                  left: 50%;
                  top: 50%;
                "
              >
                Loading curve..⏳
              </h3>
              <canvas id="myChart"></canvas>
              <div
                id="overlay"
                style="
                  height: 100%;
                  width: 93%;
                  background: rgba(0, 0, 0, 0);
                  z-index: 99;
                  position: absolute;
                  top: 0;
                "
              ></div>
              <br />
            </v-list-item>

            <v-container
              style="width: 100%; padding: 0;float left;"
              class="grey lighten-4 fill-height"
              v-if="showRecipt"
            >
              <v-icon
                @click="back()"
                style="margin-bottom:0;px;margin-left:-10px; zoom:2"
              >
                mdi-chevron-double-left
              </v-icon>
              <br />
              <br />
              <v-list-item v-for="trans in prevTransAll" :key="trans.photo">
                <unverified v-bind:info="trans" />
              </v-list-item>
            </v-container>

            <v-list-item v-for="trans in prevTrans" :key="trans.photo">
              <recipts v-bind:info="trans" />
            </v-list-item>

            <!-- Search -->
            <template>
              <v-row justify="center">
                <v-dialog
                  v-model="dialog"
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                  style="z-index: 99999"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      style="display: none"
                      id="open-search"
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      >Open search box</v-btn
                    >
                  </template>
                  <v-card style="padding: 40px">
                    <v-toolbar dark color="primary">
                      <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-toolbar-title>Search Payments</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <br />
                    <v-list three-line subheader>
                      <v-list-item>
                        <v-row justify="center">
                          <div style="margin: 30px auto; text-align: center">
                            <div class="subheading">
                              <strong>From:</strong>
                            </div>
                            <v-date-picker
                              v-model="date1"
                              elevation="15"
                              class="from-date"
                              header-color="green "
                            ></v-date-picker>
                          </div>
                          <v-spacer></v-spacer>
                          <div style="margin: 30px auto; text-align: center">
                            <div class="subheading">
                              <strong>TO:</strong>
                            </div>
                            <v-date-picker
                              v-model="date2"
                              elevation="15"
                              header-color="red"
                            ></v-date-picker>
                          </div>
                        </v-row>
                      </v-list-item>
                      <template>
                        <v-container class="px-3" fluid>
                          <v-radio-group v-model="searchBy">
                            <v-radio :label="`Your Transaction`"></v-radio>
                            <v-radio :label="`All Transaction`"></v-radio>
                          </v-radio-group>
                        </v-container>
                      </template>
                      <v-list-item>
                        <v-btn
                          class="mt-6"
                          text
                          color="error"
                          style="border: 1px solid red"
                          @click="search()"
                          >SEARCH</v-btn
                        >
                      </v-list-item>
                      <v-list-item>
                        <v-progress-circular
                          :size="50"
                          color="black"
                          v-show="progressBar"
                          indeterminate
                          style="z-index: 9; margin-left: 30px"
                        ></v-progress-circular>
                      </v-list-item>
                    </v-list>
                    <hr />
                    <br />
                    <v-list subheader>
                      <div id="recipt-div">
                        <v-list-item
                          v-for="trans in infoArr"
                          :key="trans.photo + Math.random()"
                        >
                          <recipts v-bind:info="trans" />
                        </v-list-item>
                      </div>
                    </v-list>
                  </v-card>
                </v-dialog>
              </v-row>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { firebase } from '@firebase/app'
import 'firebase/firestore'
import formInput from '../../components/contentCal.vue'
import recipts from '../../components/recipts'
import unverified from '../../components/unverified'
import Unverified from '../../components/unverified.vue'
export default {
  middleware: 'auth_validator',
  components: {
    formInput,
    recipts,
    unverified,
    Unverified,
  },
  data: () => ({
    date1: new Date().toISOString().substr(0, 10),
    date2: new Date().toISOString().substr(0, 10),
    CurrentVal: 0,
    progressBar: false,
    drawer: false,
    items: [],
    selectedUser: '',
    allUser: [],
    transID: [],
    prevTrans: [],
    email: null,
    userUID: '',
    dialog: false,
    queryData: [],
    infoArr: [],
    searchBy: 0,
    totalAmount: 0,
    maxAmount: 120000,
    rerenderUserList: false,
    returnPercentage: 0,
    showCalenderAll: false,
    prevTransAll: [],
    showRecipt: false,
    showCards: true,
    profitAmt: 0,
    headingsub1: 'Future',
    headingsub2: 'Billionaire',
    no_of_unverifiedPayments: 0,
    latestDateArr: [],
    overallProgress: 0,
    name: [
      {
        text: 'SHUBHAM KUMAR',
        url:
          'https://firebasestorage.googleapis.com/v0/b/data-auth-87e83.appspot.com/o/userImage%2FSHUBHAM%20KUMAR.png?alt=media&token=0d39a528-eca4-46f1-ab3d-f3cf4509dc41',
      },
      {
        text: 'MANISH KUMAR',
        url:
          'https://firebasestorage.googleapis.com/v0/b/data-auth-87e83.appspot.com/o/userImage%2FMANISH%20KUMAR.png?alt=media&token=bb359d4b-79f9-48ab-b512-0e1f2a656dbd',
      },
      {
        text: 'ALOK KUMAR',
        url:
          'https://firebasestorage.googleapis.com/v0/b/data-auth-87e83.appspot.com/o/userImage%2FALOK%20KUMAR.png?alt=media&token=40aefed8-5c56-4889-8ec0-8ebc1358cb69',
      },
      {
        text: 'SUNNY KUMAR',
        url:
          'https://firebasestorage.googleapis.com/v0/b/data-auth-87e83.appspot.com/o/userImage%2FSUNNY%20KUMAR.png?alt=media&token=2a2f5901-0f05-4d1d-86ff-c2ff5751139f',
      },
    ], // ALL USER NAME INFO.TEXT
  }),
  methods: {
    forceRerender() {
      this.showCalenderAll = false
      this.$nextTick().then(() => {
        this.showCalenderAll = true
      })
    },
    showAccounts() {
      if (this.rerenderUserList) {
        this.rerenderUserList = false
        document.getElementById('account-title').textContent =
          'Active Accounts ▼'
      } else {
        this.rerenderUserList = true
        document.getElementById('account-title').textContent =
          'Active Accounts ▲'
      }
    },
    showpaymentDue(email) {
      let Todaydate = new Date()

      let index = 0

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].email == email) {
          index = i
          break
        }
      }

      let lastPaymentDate = new Date(this.latestDateArr[index].toDate())

      if (Todaydate.getTime() === lastPaymentDate.getTime()) {
        console.log('Same date')
        this.items[index].duePayment = 'No'
        this.items[index].isDue = false
      } else if (Todaydate.getTime() < lastPaymentDate.getTime()) {
        console.log('lastPaymentDate is latest')
        this.items[index].duePayment = 'No'
        this.items[index].isDue = false
      } else {
        console.log('today is latest')
        this.items[index].duePayment = 'YES'
        this.items[index].isDue = true
      }
    },
    drawerfun() {
      this.drawer = !this.drawer
      if (this.drawer) {
        this.headingsub1 = 'Account'
        this.headingsub2 = 'Details'
      } else {
        this.headingsub1 = 'Future'
        this.headingsub2 = 'Billionaire'
      }
    },
    back() {
      this.showCards = true
      this.showRecipt = false
    },
    bigbull(amt) {
      if (parseInt(amt) >= parseInt(this.maxAmount)) return true

      return false
    },
    sendImgURL(name) {
      for (let i = 0; i < this.name.length; i++) {
        if (this.name[i].text == name && this.name[i].url != '') {
          return this.name[i].url
        }
      }
      return 'https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?ixid=MXwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTN8MTEzNDk2Nnx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    calcAmtPaidInPercentage(amount) {
      if (parseInt(amount) >= 120000) return 100
      else {
        let value = parseInt(amount) / 120000
        return value * 100
      }
    },
    gotoNotes() {
      this.$router.push('/takeNotes/index')
    },
    gotoTandC() {
      this.$router.push('/TandC/index')
    },
    changeCurrAmt() {
      let accUID = prompt('Please Enter UID')
      let uid = false
      for (let i = 0; i < this.items.length; i++) {
        if (
          this.items[i].text == 'SUNNY KUMAR' &&
          this.items[i].uid == accUID
        ) {
          console.log('got it')
          uid = true
          break
        }
      }
      if (uid) {
        let newVal = prompt('Please Enter new Value')
        if (newVal != null) {
          this.$fireStore.collection('currentVal').doc('amt').set({
            amount: newVal,
          })
          alert('Done !')
        }
      } else {
        alert('This UID does NOT support this operation')
      }
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(function () {
          // Sign-out successful.
        })
        .catch(function (error) {
          // An error happened.
        })
      // localStorage.setItem("account-email", null);
      // localStorage.setItem("account-password", null);
      localStorage.clear()
      this.$router.push('/')
    },
    selectedAccount(id) {
      this.selectedUser =
        this.items[id].uid +
        '-' +
        this.items[id].email +
        '-' +
        this.items[id].text
      this.userUID = this.items[id].uid
      this.email = this.items[id].email
      this.drawer = false
      this.forceRerender()

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
          document.getElementsByClassName('people')[i].classList += ' selected'
        } else {
          document
            .getElementsByClassName('people')
            [i].classList.remove('selected')
        }
      }
    },

    async search() {
      document.getElementById('recipt-div').innerHTML = ` `
      this.infoArr = []
      this.queryData = []
      this.progressBar = true

      var low = firebase.firestore.Timestamp.fromDate(new Date(this.date1))
      var high = firebase.firestore.Timestamp.fromDate(new Date(this.date2))

      console.log(this.searchBy)

      if (this.searchBy == 0) {
        await this.$fireStore
          .collection(this.email)
          .where('date', '<', high)
          .where('date', '>=', low)
          .orderBy('date', 'desc')
          .get()
          .then((res) => {
            var x = {
              email: this.email,
              uid: this.userUID,
              idArr: res.docs,
            }
            if (res.docs.length != 0) this.queryData.push(x)
          })
          .catch(function (error) {
            console.log(error.message)
          })
      } else {
        for (let i = 0; i < this.items.length; i++) {
          await this.$fireStore
            .collection(this.items[i].email)
            .where('date', '<', high)
            .where('date', '>=', low)
            .orderBy('date', 'desc')
            .get()
            .then((res) => {
              var x = {
                email: this.items[i].email,
                uid: this.items[i].uid,
                idArr: res.docs,
              }
              if (res.docs.length != 0) this.queryData.push(x)
            })
            .catch(function (error) {
              console.log(error.message)
            })
        }
      }

      if (this.queryData.length == 0) {
        document.getElementById(
          'recipt-div'
        ).innerHTML = `<strong id='no-payment'>No payment has been made!</strong> `
        document.getElementById('recipt-div').style.textAlign = 'center'
        document.getElementById('recipt-div').style.margin = '20px auto'
        document.getElementById('recipt-div').style.color = 'red'
      }

      for (let i = 0; i < this.queryData.length; i++) {
        for (let j = 0; j < this.queryData[i].idArr.length; j++) {
          await this.$fireStore
            .collection(this.queryData[i].email)
            .doc(this.queryData[i].idArr[j].id)
            .get()
            .then((res) => {
              var x = {
                amount: res.data().amount,
                type: res.data().type,
                date: res.data().date.toDate(),
                photo: res.data().photo,
                uid: this.queryData[i].uid,
                email: this.queryData[i].email,
              }

              this.infoArr.push(x)
            })
        }
      }
      this.progressBar = false
    },
    openSearchPanel() {
      document.getElementById('open-search').click()
    },

    async getUsers() {
      await this.$fireStore
        .collection('allUsers')
        .get()
        .then((res) => {
          this.allUser = res.docs //it conatins all user id
        })
        .catch(function (error) {
          console.log(error.message)
        })

      for (let i = 0; i < this.allUser.length; i++) {
        await this.$fireStore
          .collection(this.allUser[i].id)
          .doc('info')
          .get()
          .then((res) => {
            this.totalAmount =
              parseInt(res.data().total) + parseInt(this.totalAmount)

            var x = {
              text: res.data().text,
              id: i,
              uid: res.data().uid,
              email: res.data().email,
              regular: res.data().regular,
              extra: res.data().extra,
              total: res.data().total,
              duePayment: 'Null',
            }

            this.items.push(x) // all users info
          })
          .catch(function (error) {
            console.log(error.message)
          })
      }

      // over all progress
      this.overallProgress =
        (parseInt(this.CurrentVal.replace(/,/g, '')) * 100) / 500000000

      //Amount contribution
      this.amountContribution()

      // to set tandc

      await this.$fireStore
        .collection('allUsers')
        .get()
        .then((res) => {
          // let TandCArrLen = res.docs[0].data().TandC.length
          res.docs.forEach((ele) => {
            let TandCArrLen = ele.data().TandC.length
            let totalAccepted = ele.data().total
            let i = this.items.findIndex((x) => x.email == ele.id)

            if (TandCArrLen == 9) {
              this.items[i].acceptedTandC = 'Accepted all the T&C.'
              this.items[i].isAccepted = true
            } else {
              if (totalAccepted == 0) {
                this.items[i].acceptedTandC =
                  'No T&C NOT accepted! (' + totalAccepted + '/' + 9 + ')'
              } else {
                this.items[i].acceptedTandC =
                  'Few T&C NOT accepted! (' + totalAccepted + '/' + 9 + ')'
              }
              this.items[i].isAccepted = false
            }
          })
        })

      var currAmt = parseInt(this.CurrentVal.replace(/,/g, ''))

      for (let i = 0; i < this.items.length; i++) {
        let total = this.items[i].total
        let myContribution = parseInt(total) / parseInt(this.totalAmount)

        let predictedProfit =
          (currAmt - parseInt(this.totalAmount)) * myContribution

        let returnPercentage =
          (parseInt(predictedProfit) / parseInt(total)) * 100

        let indvAmt =
          (currAmt - parseInt(this.totalAmount)) / (this.items.length + 1)

        if (this.items[i].text == 'ALOK KUMAR')
          this.items[i].returnAmt = 2 * indvAmt
        else this.items[i].returnAmt = indvAmt

        this.items[i].returnPercentage = returnPercentage.toFixed(2)
      }
      this.rerenderUserList = false
      // console.log(this.items)
      this.returnPercentage = this.items[0].returnPercentage
      this.rerenderUserList = true
      this.showAccounts()

      this.profitAmt = currAmt - parseInt(this.totalAmount)
    },
    openTimeLine() {
      this.$router.push('/timeline/index')
    },
    async downloadImageURL() {
      for (let i = 0; i < this.name.length; i++) {
        await firebase
          .storage()
          .ref()
          .child('userImage' + '/' + this.name[i].text + '.png')
          .getDownloadURL()
          .then((url) => {
            let x = {
              text: this.name[i].text,
              url: url,
            }
            this.name[i] = x

            // console.log(x);
          })
          .catch((err) => {
            console.log('No photo got')
          })
      }
    },

    showUnverifiedRecipts() {
      this.showRecipt = true
      this.showCards = false
    },

    async getUnverifiedPayments() {
      let arrMail = []
      this.allUser.forEach((ele) => {
        arrMail.push(ele.id)
      })
      // console.log(arrMail);
      let temptransID = []
      this.prevTransAll = []

      for (let k = 0; k < arrMail.length; k++) {
        await this.$fireStore
          .collection(arrMail[k])
          .orderBy('date', 'desc')
          .limit(5)
          .get()
          .then((res) => {
            temptransID = res.docs
          })
          .catch(function (error) {
            console.log(error.message)
          })

        for (let i = 0; i < temptransID.length; i++) {
          if (temptransID[i].id != 'info') {
            await this.$fireStore
              .collection(arrMail[k])
              .doc(temptransID[i].id)
              .get()
              .then((res) => {
                if (!res.data().verified) {
                  var x = {
                    amount: res.data().amount,
                    type: res.data().type,
                    date: res.data().date.toDate(),
                    photo: res.data().photo,
                    uid: this.userUID,
                    email: arrMail[k],
                    verified: res.data().verified,
                    transactionID: temptransID[i].id,
                  }
                  this.prevTransAll.push(x)
                }
                if (i == 0) {
                  this.latestDateArr.push(res.data().date) // to get last paymentdate
                }
              })
              .catch(function (error) {
                console.log(error.message)
              })
          }
        }
        this.no_of_unverifiedPayments = this.prevTransAll.length
        this.showpaymentDue(arrMail[k])
      }
    },
    tilesAnimi() {
      let tl = gsap.timeline()
      tl.from(
        '.tiles',
        {
          y: 70,
          opacity: 0,
          duration: 0.5,
          ease: 'easeInOut',
          stagger: 0.1,
        },
        '+=0.5'
      )
    },
    generateGraph(bulkData) {
      let xcord = []
      let ycord = []

      for (let i = 0; i < bulkData.length && 30; i++) {
        let ele = bulkData[i]
        let month = ele.date.toString().substring(4, 7)
        let year = ele.date.toString().substring(11, 15)
        xcord.push(month + ' ' + year)
        ycord.push(ele.amount)
      }

      const labels = xcord.reverse()
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Investment Trend',
            data: ycord.reverse(),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.4,
          },
        ],
      }
      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
        },
      }

      document.getElementById('loading-curve').style.display = 'none' // hide placeholder
      new Chart(document.getElementById('myChart'), config)
      document.getElementById('myChart').style.display = 'block' // show chart
    },
    amountContribution() {
      let amounts = []
      this.items.forEach((ele) => {
        amounts.push(Number(ele.regular) + Number(ele.extra))
      })
      const data = {
        labels: ['Alok Kumar', 'Shubham Kumar', 'Manish Kumar', 'Sunny Kumar'],
        datasets: [
          {
            label: 'Amount Contributed',
            data: amounts,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'green',
            ],
            hoverOffset: 4,
          },
        ],
      }
      const config = {
        type: 'pie',
        data: data,
        responsive: false,
        maintainAspectRatio: false,
      }

      document.getElementById('loading-pie').style.display = 'none'
      new Chart(document.getElementById('myChartPie'), config)
    },
    plotBar(xcord,ycord){
      const labels = xcord
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Overall Investment Trend',
          data: ycord,
          backgroundColor: 'green',
          fill: false,
        },
      ],
    }
    const config = {
      type: 'bar',
      data: data,
    }

    new Chart(document.getElementById('overallinvbar'), config)
    }
  },
  async mounted() {
    this.tilesAnimi()
    await this.$fireStore
      .collection('currentVal')
      .doc('amt')
      .get()
      .then((res) => {
        this.CurrentVal = res.data().amount
      })

    await this.getUsers()

    this.getUnverifiedPayments()
    this.downloadImageURL()

    // Calculating overall investment trend
    let last_one_year_data = []
    let xcord = []
    let ycord = []
    for (let i = 0; i < this.allUser.length; i++) {
      let user = this.allUser[i].id
      const userInfo = this.$fireStore
        .collection(user)
        .orderBy('date', 'desc')
        .limit(12)
      const snapshot = await userInfo.get()
      snapshot.forEach((doc) => {
        let month_and_year =
          doc.data().date.toDate().toString().substring(4, 7) +
          ' ' +
          doc.data().date.toDate().toString().substring(11, 15)
        let obj = doc.data()
        obj.month_and_year = month_and_year
        last_one_year_data.push(obj)
      })
    }

    last_one_year_data.sort((a, b) =>
      a.date['seconds'] > b.date['seconds']
        ? 1
        : b.date['seconds'] > a.date['seconds']
        ? -1
        : 0
    )
    // last_one_year_data.forEach((ele) => {
    //   xcord.push(ele.date.toDate().toString().substring(4, 15))
    //   ycord.push(ele.amount)
    // })
    // let data_sum = []
    for (let i = 0; i < last_one_year_data.length; i++) {
      let amount = Number(last_one_year_data[i].amount)
      let data = last_one_year_data[i].month_and_year
      for (let j = i + 1; j < last_one_year_data.length; j++) {
        let set = last_one_year_data[j].month_and_year

        if (data === set && data !== null && set !== null) {
          amount += Number(last_one_year_data[j].amount)
          last_one_year_data[j].month_and_year = null
        }
      }
      if (last_one_year_data[i].month_and_year != null) {
        xcord.push(last_one_year_data[i].month_and_year)
        ycord.push(amount)
      }
    }

    const labels = xcord
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Overall Investment Trend',
          data: ycord,
          borderColor: 'red',
          fill: false,
        },
      ],
    }
    const config = {
      type: 'line',
      data: data,
    }

    new Chart(document.getElementById('overallinv'), config)

    this.plotBar(xcord,ycord)
  },
  watch: {
    selectedUser: async function () {
      document.getElementById('myChart').style.display = 'none' // hide chart
      document.getElementById('curve').style.display = 'block'
      document.getElementById('loading-curve').style.display = 'block' // show placeholder
      this.transID = []
      this.prevTrans = []
      await this.$fireStore
        .collection(this.email)
        .orderBy('date', 'desc')
        .get()
        .then((res) => {
          this.transID = res.docs
        })
        .catch(function (error) {
          console.log(error.message)
        })

      for (let i = 0; i < this.transID.length; i++) {
        if (this.transID[i].id != 'info') {
          await this.$fireStore
            .collection(this.email)
            .doc(this.transID[i].id)
            .get()
            .then((res) => {
              var x = {
                amount: res.data().amount,
                type: res.data().type,
                date: res.data().date.toDate(),
                photo: res.data().photo,
                uid: this.userUID,
                email: this.email,
                verified: res.data().verified,
                transactionID: this.transID[i].id,
              }
              this.prevTrans.push(x)
            })
            .catch(function (error) {
              console.log(error.message)
            })
        }
      }
      this.generateGraph(this.prevTrans)
    },
    drawer: function () {
      if (this.drawer) {
        let tl = gsap.timeline()
        tl.from(
          '.drawer_options',
          {
            y: -20,
            opacity: 0,
            duration: 0.2,
            ease: 'power4',
            stagger: 0.1,
          },
          '+=0.3'
        )
      } else {
        if (this.rerenderUserList) this.showAccounts()
      }
    },
  },
}
</script>

<style>
.pace {
  pointer-events: none;
  user-select: none;
  z-index: 2000;
  position: fixed;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  border: 0px;
  height: 1px;
  overflow: hidden;
  background: rgba(218, 211, 211, 0.767);
  padding: 2px;
}

.pace .pace-progress {
  box-sizing: border-box;
  transform: translate3d(0, 0, 0);
  max-width: 100%;
  position: fixed;
  z-index: 2000;
  display: block;
  position: absolute;
  top: 0;
  right: 100%;
  height: 100%;
  width: 100%;
  background: rgb(6, 231, 6);
}

#curve {
  display: none;
}
#overlay {
  display: none;
}
#nav-bar-main {
  z-index: 999;
}

.selected {
  background-color: #d5d8dc !important;
  border-radius: 5px !important;
}

.v-application .red-class {
  color: red;
  background: transparent !important;
}

.v-application .green-class {
  color: green;
  background: transparent !important;
}
@media (max-width: 1000px) {
  #nav-drawer {
    padding-top: 70px !important;
  }
}

@media (max-width: 420px) {
  .from-date {
    margin-left: 65px;
  }
  #overlay {
    display: block;
  }
}

@media (max-width: 360px) {
  .from-date {
    margin-left: 40px;
  }
}
</style>
