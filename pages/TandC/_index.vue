<template>
  <v-app>
    <div class="container">
      <v-alert border="bottom" colored-border type="info">
        <v-row align="center">
          <v-col class="grow">
            <h2 class="mt-n2">Terms and Conditions</h2>
          </v-col>
        </v-row>
      </v-alert>
      <div v-for="(term, index) in terms" :key="index">
        <v-alert class="alert" :icon="indexing(index)" prominent text type="info">
          <v-row align="center">
            <v-col class="grow" style="color: black">
              {{ term.text }}
            </v-col>
            <v-col class="shrink">
              <v-btn
                @click="agree(index)"
                :disabled="!term.show"
                color="black"
                v-if="term.show"
                >{{ term.agree }}</v-btn
              >
              <v-btn color="grey" v-else>
                <v-icon dark left> mdi-checkbox-marked-circle </v-icon>
                Agreed
                <span style="text-transform: lowercase">
                  on ({{ term.date }})</span
                ></v-btn
              >
            </v-col>
          </v-row>
        </v-alert>
      </div>
    </div>
    <v-dialog v-model="dialog" persistent max-width="600">
      <template>
        <v-card>
          <v-toolbar color="primary" dark>Sensetive Information</v-toolbar>
          <br />
          <v-card-text>
            <v-text-field
              v-model="email"
              outlined
              label="Your Email"
              clearable
              hint="This field is requried"
              autocomplete="off"
            ></v-text-field>
            <br />
            <v-text-field
              v-model="uid"
              outlined
              label="Your UID"
              clearable
              hint="This field is requried"
              type="password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn @click="fun()">Validate</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  middleware: 'auth_validator',
  data() {
    return {
      dialog: true,
      email: '',
      uid: '',
      validEmail: false,
      validUID: false,
      terms: [
        {
          text:
            'Ten year lock-in period (Effective from 01/04/2021 Till 31/03/2031)',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },

        {
          text:
            'Any type of withdrawal within lock-in period is not acceptable',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },
        {
          text:
            'Regular investment means the money deposited by any individual every month that is predecided by our team.It is mandatory to be deposited every month.',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },
        {
          text:
            'Lump-sum investment means the money deposited by any individual other than Regular investment.That is very helpful for achieving our goal sooner.There is no limit for Lump-sum investment.',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },
        {
          text:
            'The amount of Current value (Regular+Lump-sum+Return) shown in profile of individuals will be returned after lock-in period ends (i.e. 31/03/2031)',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },
        {
          text:
            'No one can blame any one for losses neither any person can claim any type of extra benefits',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },
        {
          text:
            'It is mandatory for all individuals to equally participate in research & Analysis and Give their recommendations on daily basis.',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },
        {
          text:
            'All issues and Future strategies are discussed in our MGM (Monthly General Meeting) i.e. scheduled on Last week of every month.',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },
        {
          text:
            'The investment & securities market are subjected to market risk , please read all T&C carefully.',
          agree: 'Agree',
          show: true,
          date: 'Today',
        },
      ],
      TandC: [],
      total: 0,
    }
  },
  methods: {
    indexing(index) {
      return 'mdi-numeric-' + (index+1)
    },
    async fun() {
      if (this.email !== '' && this.uid !== '') {
        await this.getTandC()

        if (this.validEmail) {
          this.dialog = false;
          let tl = gsap.timeline()
        tl.from(
          '.alert',
          {
            y: -30,
            opacity: 0,
            duration: 0.4,
            ease: 'power4',
            stagger: 0.1,
          },
        )
        } else {
          console.log('hi')
        }
      } else {
        alert('Input value')
      }
    },
    async getTandC() {
      let email = this.email
      await this.$fireStore
        .collection('allUsers')
        .doc(email)
        .get()
        .then((res) => {
          if (res.data() == undefined) {
            alert('Wrong Email')
            this.validEmail = false
          } else {
            this.validEmail = true

            this.TandC = res.data().TandC
            this.total = parseInt(res.data().total)

            res.data().TandC.forEach((ele) => {
              if (ele.index >= 0) {
                let date = ele.date.toDate()
                let mm = date.getMonth()
                let dd = date.getDate()
                let yyyy = date.getFullYear()

                date = dd + '/' + mm + '/' + yyyy
                this.terms[ele.index].date = date
                this.terms[ele.index].show = false
              }
            })
          }
        })
    },

    isDisable(indx) {},

    async agree(index) {
      await this.$fireStore
        .collection(this.email)
        .doc('info')
        .get()
        .then((res) => {
          if (res.data().uid === this.uid) {
            this.upload(index)
          } else {
            alert('Invalid UID')
            this.dialog = true
          }
        })
    },
    upload(index) {
      this.terms[index].show = false

      const dbRef = this.$fireStore.collection('allUsers').doc(this.email)
      this.TandC.push({
        index: parseInt(index),
        date: new Date(),
      })
      dbRef.set({
        TandC: this.TandC,
        total: parseInt(this.total) + 1,
      })
    },
  },
}
</script>
<style scoped>
#disable-id {
  background-color: red !important;
}
</style>
