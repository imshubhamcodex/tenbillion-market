import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)


export const state = () => ({
    authorised:false
})

export const mutations = {
  authorised(state) {
    state.authorised = true;
  }
}