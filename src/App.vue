<template>
  <header>
    <img src="./assets/images/icon-left-font.png" alt="groupomania" />

    <router-link to="/"><i title="sign out" @click="logout()" class="fas fa-sign-out-alt"></i></router-link>
  </header>

  <router-view />
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
}

header {
  position: fixed;
  background-color: white;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0;
  align-items: center;
  border-bottom: 1px solid #2c3e50;
  img {
    max-width: 200px;
    height: auto;
  }
}

i {
  font-size: 1.5rem;
  color: #fd2d01;
}

#form-user {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  input {
    max-width: 20rem;
    height: 1.5rem;
  }
}
</style>
