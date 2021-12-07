<template>
  <div class="home">
    <div class="login-window">
      <img src="../assets/images/icon-left-font-monochrome-black.png" alt="logo groupomania" />
      <h1>THE SOCIAL NETWORK</h1>

      <!-- formulaire de connexion -->
      <form id="form-user">
        <input v-model="email" type="email" name="email" id="email" placeholder="email" />
        <input v-model="password" type="password" name="password" id="password" placeholder="password" />
        <p class="error-message" v-if="errorMessage != null">{{ errorMessage }}</p>
        <br />
      </form>
      <!-- fin formulaire de connexion -->

      <SubmitButton @click="sendLogin">LOGIN</SubmitButton>
      <p>or</p>
      <router-link to="/register">create account</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SubmitButton from "../components/SubmitButton.vue";

export default {
  name: "Home",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: null,
    };
  },
  components: { SubmitButton },
  methods: {
    // se connecter
    sendLogin() {
      axios
        .post("http://localhost:3000/api/auth/login", {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("userId", res.data.userId);
          window.location.hash = "/newswall";
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
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
    max-width: 400px;
    height: auto;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 1px 1px 2px #2c3e50;
    margin-top: 5rem;
    margin-left: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    img {
      max-width: 200px;
      object-fit: cover;
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
