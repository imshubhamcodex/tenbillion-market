import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        type: 'text/javascript',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/gsap.min.js',
        body: true,
      },
      {
        type: 'text/javascript',
        src: 'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
        body: true,
      },
      {
        type: 'text/javascript',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/pace/1.2.4/pace.min.js',
        body: true,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyAWhYGjkz93bKeFyC2et_9HDQ7GnRbB9Wc',
          authDomain: 'data-auth-87e83.firebaseapp.com',
          databaseURL: 'https://data-auth-87e83.firebaseio.com',
          projectId: 'data-auth-87e83',
          storageBucket: 'data-auth-87e83.appspot.com',
          messagingSenderId: '573393779634',
          appId: '1:573393779634:web:2a217a6fcd27a100ba42ab',
          measurementId: 'G-LP82WPDJW1',
        },
        services: {
          auth: true,
          firestore: true,
          functions: true,
          storage: true,
        },
      },
    ],
  ],
  env: {
    FIRE_ENV: process.env.FIRE_ENV,
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
