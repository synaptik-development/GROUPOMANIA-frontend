<template>
  <div class="home">
    <div class="login-window">
      <h1>THE SOCIAL NETWORK</h1>
      <h2>create new account</h2>
      <main>
        <!-- formulaire d'inscription -->
        <form id="form-user">
          <input v-model="email" type="email" name="email" id="email" placeholder="email" />
          <input v-model="username" type="text" name="username" id="username" placeholder="username" />
          <input v-model="password" type="password" name="password" id="password" placeholder="password" />
          <input v-model="confirmPassword" type="password" name="confirm-password" id="confirm-password" placeholder="confirm password" />
          <p class="error-message" v-if="errorMessage != null">{{ errorMessage }}</p>
          <br />
        </form>
        <!-- fin formulaire d'inscription -->

        <SubmitButton @click="sendRegister">VALIDATE</SubmitButton>
      </main>
    </div>
  </div>
</template>

<script>
import SubmitButton from "../components/SubmitButton.vue";
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      errorMessage: null,
    };
  },
  components: { SubmitButton },
  methods: {
    // inscription + connexion
    sendRegister() {
      axios
        .post("http://localhost:3000/api/auth/register", {
          username: this.username,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
        })
        .then(() => {
          axios
            .post("http://localhost:3000/api/auth/login", {
              email: this.email,
              password: this.password,
            })
            .then((res) => {
              sessionStorage.setItem("token", res.data.token);
              sessionStorage.setItem("userId", res.data.userId);
              window.location.hash = "/newswall";
            });
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
    },
  },
};
</script>
