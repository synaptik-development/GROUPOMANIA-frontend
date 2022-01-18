<template>
  <div class="home">
    <div class="login-window">
      <img src="../assets/images/icon-left-font-monochrome-black.png" alt="logo groupomania" />
      <h1>THE SOCIAL NETWORK</h1>
      <div v-if="!isLoggedIn">
        <h2 v-if="!formRegister">login</h2>
        <h2 v-if="formRegister">create new account</h2>

        <!-- formulaire de connexion / inscription -->
        <form id="form-user">
          <input v-model="modelEmail" type="email" name="email" id="email" placeholder="email" />
          <input v-if="formRegister" v-model="modelUsername" type="text" name="username" id="username" placeholder="username" />
          <input v-model="modelPassword" type="password" name="password" id="password" placeholder="password" />
          <input v-if="formRegister" v-model="confirmPassword" type="password" name="confirm-password" id="confirm-password" placeholder="confirm password" />
          <p class="error-message" v-if="errorMessage != null">
            {{ errorMessage }}
          </p>
        </form>
        <!-- fin formulaire de connexion / inscription -->

        <SubmitButton v-if="!formRegister" @click="login()">LOGIN</SubmitButton>
        <SubmitButton v-if="formRegister" @click="register()">REGISTER</SubmitButton>
        <p>or</p>
        <a
          @click="
            showFormRegister();
            resetState();
          "
          v-if="formRegister"
          >login</a
        >
        <a
          @click="
            showFormRegister();
            resetState();
          "
          v-if="!formRegister"
          >create account</a
        >
      </div>

      <div v-else>
        <h2>Welcome {{ currentUsername }}</h2>
        <router-link to="/newswall"><SubmitButton>go newswall</SubmitButton></router-link>
      </div>
    </div>
  </div>
</template>

<script>
// imports
import SubmitButton from "../components/SubmitButton.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Home",

  data() {
    return {
      formRegister: false,
    };
  },

  computed: {
    ...mapState(["errorMessage", "currentUsername"]),
    ...mapGetters(["isLoggedIn"]),

    //propriétés calculées bidirectionnelles
    modelEmail: {
      get() {
        return this.$store.state.modelEmail;
      },
      set(value) {
        this.$store.commit("CHANGE_MODEL_EMAIL", value);
      },
    },

    modelUsername: {
      get() {
        return this.$store.state.modelUsername;
      },
      set(value) {
        this.$store.commit("CHANGE_MODEL_USERNAME", value);
      },
    },

    modelPassword: {
      get() {
        return this.$store.state.modelPassword;
      },
      set(value) {
        this.$store.commit("CHANGE_MODEL_PASSWORD", value);
      },
    },

    confirmPassword: {
      get() {
        return this.$store.state.confirmPassword;
      },
      set(value) {
        this.$store.commit("CHANGE_CONFIRM_PASSWORD", value);
      },
    },
  },

  components: { SubmitButton },

  methods: {
    ...mapActions(["login", "register", "resetState"]),

    // révéler le formulaire d'inscription
    showFormRegister() {
      if (this.formRegister == true) {
        return (this.formRegister = false);
      } else {
        return (this.formRegister = true);
      }
    },
  },
};
</script>

<style lang="scss">
.home {
  height: 950px;
  background-image: url("../assets/images/pexels-fauxels-3184418.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  .login-window {
    background-color: #f2f2f2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 400px;
    height: auto;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 0 2px #2c3e50;
    margin-top: 5rem;
    margin-left: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    img {
      max-width: 200px;
      object-fit: cover;
    }
    a {
      color: orchid;
      &:hover {
        text-decoration: underline;
      }
    }
    @media screen and (max-width: 720px) {
      margin-top: 0;
      margin-left: auto;
      margin-right: auto;
      width: auto;
      background-color: transparent;
      box-shadow: none;
      h1,
      h2,
      p,
      a {
        text-align: center;
        color: #f2f2f2;
      }
    }
    h2 {
      font-size: 1.5rem;
      text-shadow: 1px 1px 2px #2c3e50;
    }
  }
  .error-message {
    color: red;
  }
  @media screen and (max-width: 720px) {
    background-size: 250%;
  }
}
</style>
