<template>
  <v-card class="mx-auto" min-width="300px">
    <v-card-text>
      <div>Uploaded by {{ noteData.author }}</div>
      <p class="text--primary" style="font-size:15px;font-weight:bold">
        {{ noteData.time.toDate() }}
      </p>
      <div
        class="text--primary"
        style="font-weight:bold;color:green !important"
      >
        {{ stocksinfo }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="teal accent-4" @click="reveal = true">
        VIEW MORE
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ["noteData"],
  data: () => ({
    reveal: false,
    stocksinfo: ""
  }),
  created() {
    this.stocksinfo = this.noteData.stockinfo.toUpperCase();
  }
};
</script>
<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
