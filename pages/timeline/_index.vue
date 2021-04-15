<template>
  <v-app>
    <v-card class="mx-auto" style="width:100%;">
      <v-card-title class="blue-grey white--text">
        <span class="title">SIP Calculator</span>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          dark
          depressed
          @click="clear()"
          style="margin-left:10px;"
        >
          Refresh
        </v-btn>
      </v-card-title>
      <v-card-text class="py-0">
        <v-icon @click="back()" style="margin-top:15px;zoom:1.5">
          mdi-chevron-double-left
        </v-icon>

        <v-checkbox
          v-model="checked"
          value
          indeterminate
          label="Manual Input"
        ></v-checkbox>

        <div v-if="checked">
          <v-text-field v-model="money" label="Money in Rs."> </v-text-field>
          <br />
          <v-text-field v-model="roi" label="ROI in percentage"></v-text-field>
          <br />
          <v-text-field
            v-model="month"
            label="Number of years in months"
          ></v-text-field>
          <v-btn
            :disabled="isDisable()"
            dark
            depressed
            @click="interval == null ? start() : stop()"
          >
            Calculate
          </v-btn>
        </div>

        <div v-if="!checked">
          <v-select
            v-model="money"
            :items="amounts"
            label="Paying Amount"
            required
            outlined
            clearable
            style="padding:20px; max-width:400px;"
          ></v-select>
          <v-select
            v-model="roi"
            :items="ROI"
            label="Rate of Interest(%)"
            required
            outlined
            clearable
            style="padding:20px; max-width:400px; margin-top:-40px;"
          >
          </v-select>
          <v-select
            v-model="month"
            :items="months"
            label="Number of months"
            required
            outlined
            clearable
            style="padding:20px; max-width:400px; margin-top:-40px;"
          ></v-select>
          <v-btn
            :disabled="isDisable()"
            dark
            depressed
            @click="interval == null ? start() : stop()"
          >
            Calculate
          </v-btn>
        </div>
        <br />
        <v-timeline dense>
          <v-slide-x-reverse-transition group hide-on-leave>
            <v-timeline-item
              v-for="item in items"
              :key="item.id"
              :color="item.color"
              small
              fill-dot
            >
              <v-alert
                id="alert"
                :value="true"
                :color="item.color"
                class="white--text"
              >
              </v-alert>
            </v-timeline-item>
          </v-slide-x-reverse-transition>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
const COLORS = [
  "warning",
  "error",
  "primary",
  "secondary",
  "green",
  "pink",
  "grey"
];

export default {
  data: () => ({
    interval: null,
    checked: false,
    items: [
      {
        id: 1,
        color: "info",
        icon: "mdi-information"
      }
    ],
    nonce: 2,
    totalAmt: 0,
    invested: 0,
    profit: 0,
    money: 0,
    amounts: [
      500,
      1000,
      2000,
      3000,
      4000,
      5000,
      6000,
      7000,
      8000,
      9000,
      10000,
      15000,
      30000,
      50000,
      80000,
      90000
    ],
    roi: 0,
    ROI: [1, 2, 3, 4, 5, 10, 15, 20],
    month: 0,
    months: [
      "12 (1 year)",
      "24 (2 year)",
      "36 (3 year)",
      "48 (4 year)",
      "60 (5 year)",
      "72 (6 year)",
      "84 (7 year)",
      "96 (8 year)",
      "108 (9 year)",
      "120 (10 year)",
      "132 (11 year)",
      "144 (12 year)",
      "156 (13 year)",
      "168 (14 year)",
      "180 (15 year)"
    ],
    sl: 0
  }),

  beforeDestroy() {
    this.stop();
  },

  methods: {
    isDisable() {
      if (this.sl > 0) return true;
      return false;
    },
    back() {
      this.$router.push("/home/index");
    },
    clear() {
      this.stop();
      location.reload();
    },
    addEvent() {
      let { color } = this.genAlert();

      const previousColor = this.items[0].color;

      while (previousColor === color) {
        color = this.genColor();
      }

      this.items.unshift({
        id: this.nonce++,
        color
      });

      if (
        this.nonce - 1 > (this.months.indexOf(this.month) + 1) * 12 &&
        this.checked == false
      ) {
        this.stop();
      }

      if (this.checked && parseInt(this.sl) == parseInt(this.month) - 1) {
        this.stop();
      }

      this.fun();
    },
    fun() {
      this.totalAmt = parseInt(this.totalAmt) + parseInt(this.money);
      this.totalAmt =
        this.totalAmt + (this.totalAmt * parseInt(this.roi)) / 100;
      this.sl++;
      this.invested += parseInt(this.money);
      this.totalAmt = parseInt(this.totalAmt);

      document.getElementById("alert").innerHTML = `
      Month : <strong> ${this.sl} </strong>
      <br>
      Total Amt : ₹<strong> ${this.totalAmt.toLocaleString()} </strong>
      <br>
      Inv. Amt : ₹<strong> ${this.invested.toLocaleString()} </strong>
      <br>
      Profit Amt : ₹<strong> ${(
        this.totalAmt - this.invested
      ).toLocaleString()} </strong>

      `;
    },
    genAlert() {
      const color = this.genColor();

      return {
        color
      };
    },
    genColor() {
      return COLORS[Math.floor(Math.random() * 7)];
    },
    start() {
      this.interval = setInterval(this.addEvent, 50);
    },
    stop() {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};
</script>
