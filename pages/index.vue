<template>
  <v-app>
    <v-alert
      v-if="err"
      type="error"
      id="err-box"
      style="
        position: absolute;
        top: 2%;
        width: 90%;
        left: 50%;
        transform: translateX(-50%);
      "
    >
      Invalid Credentials
    </v-alert>
    <div id="login">
      <div id="description">
        <h1>Login</h1>
        <p>Beware three(3) wrong attemps may block this portal for 24 hr.</p>
      </div>
      <div id="form">
        <form @submit.prevent="doLogin">
          <label for="email">Email</label>
          <input
            type="text"
            v-model="email"
            placeholder="me@gmail.com"
            autocomplete="off"
          />

          <label for="password"
            >Password
            <v-icon
              style="
                float: right;
                background: none;
                color: white;
                width: 5px;
                height: 5px;
                margin-top: 5px;
              "
              @click="hidePassword = !hidePassword"
            >
              mdi-eye</v-icon
            ></label
          >&nbsp;
          <input
            :type="passwordType"
            v-model="password"
            placeholder="**********"
          />
          <button type="submit" style="color: black">Log in</button>
        </form>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      hidePassword: true,
      err: false,
    }
  },
  computed: {
    passwordType() {
      return this.hidePassword ? 'password' : 'text'
    },
    passwordIcon() {
      return this.hidePassword ? 'fa-eye' : 'fa-eye-slash'
    },
  },
  methods: {
    async doLogin() {
      await this.$fireAuth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(async () => {
          console.log('Authorised')
          localStorage.setItem('account-email', this.email)
          localStorage.setItem('account-password', this.password)

          this.$store.commit('authorised')
          this.$router.push('/home/index')
        })
        .catch((error) => {
          // Handle Errors here.
          let errorCode = error.code
          console.log(errorCode)
          // ...
          this.err = true
          setTimeout(() => {
            this.err = false
          }, 3000)
        })
    },
  },
  mounted() {
    if (localStorage.getItem('account-email') !== null) {
      this.email = localStorage.getItem('account-email')
      this.password = localStorage.getItem('account-password')
      this.doLogin()
    }
  },
  created() {
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/gsap.min.js'
    head.appendChild(script)

    let script1 = document.createElement('script')
    script1.type = 'text/javascript'
    script1.src = "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
    head.appendChild(script1)
    
  },
}
</script>

<style scoped>
div#app {
  width: 100%;
  height: 100%;
}

div#app div#login {
  align-items: center;
  background-color: #e2e2e5;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

div#app div#login div#description {
  background-color: #ffffff;
  width: 280px;
  padding: 35px;
}

div#app div#login div#description h1,
div#app div#login div#description p {
  margin: 0;
}

div#app div#login div#description p {
  font-size: 0.8em;
  color: #95a5a6;
  margin-top: 10px;
}

div#app div#login div#form {
  background-color: #34495e;
  border-radius: 5px;
  box-shadow: 0px 0px 30px 0px #666;
  color: #ecf0f1;
  width: 260px;
  padding: 35px;
}

div#app div#login div#form label,
div#app div#login div#form input {
  outline: none;
  width: 100%;
}

div#app div#login div#form label {
  color: #95a5a6;
  font-size: 0.8em;
}

div#app div#login div#form input {
  background-color: transparent;
  border: none;
  color: #ecf0f1;
  font-size: 1em;
  margin-bottom: 20px;
}

div#app div#login div#form ::placeholder {
  color: #ecf0f1;
  opacity: 1;
}

div#app div#login div#form button {
  background-color: #ffffff;
  cursor: pointer;
  border: none;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  width: 100%;
}

div#app div#login div#form button:hover {
  background-color: #eeeeee;
}

@media screen and (max-width: 600px) {
  div#app div#login {
    align-items: unset;
    background-color: unset;
    display: unset;
    justify-content: unset;
  }

  div#app div#login div#description {
    margin: 0 auto;
    max-width: 350px;
    width: 100%;
  }

  div#app div#login div#form {
    border-radius: unset;
    box-shadow: unset;
    width: 100%;
  }

  div#app div#login div#form form {
    margin: 0 auto;
    max-width: 280px;
    width: 100%;
  }
}
</style>
