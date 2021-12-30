<template>
  <div class="user-profile">
    <h1>MY PROFILE</h1>
    <main class="edit-profile">
      <div class="management">
        <strong @click="confirmDelete()">delete profile</strong>
        <router-link to="/newsWall" @click="resetState()"><i class="far fa-window-close"></i></router-link>
        <router-view />
      </div>

      <!-- section username (formulaire caché) -->
      <div>
        <h3>USERNAME</h3>
        {{ currentUsername }}
        <span @click="showInput(`username`)">edit</span>
        <input v-model="modelUsername" type="text" name="username" id="username" placeholder="username" />
      </div>
      <!-- fin section username  -->

      <!-- section email (formulaire caché) -->
      <div>
        <h3>EMAIL</h3>
        {{ currentUserEmail }}
        <span @click="showInput(`email`)">edit</span>
        <input v-model="modelEmail" type="email" name="email" id="email" placeholder="email" />
      </div>
      <!-- fin section email  -->

      <!-- section password (formulaire caché) -->
      <div>
        <h3>PASSWORD</h3>
        ********
        <span
          @click="
            showInput(`password`);
            showInput(`confirm-password`);
          "
          >edit</span
        >
        <input v-model="modelPassword" type="password" name="password" id="password" placeholder="password" /><br />
        <input v-model="confirmPassword" type="password" name="confirm-password" id="confirm-password" placeholder="confirm password" />
      </div>
      <!-- fin section password  -->

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <SubmitButton @click="updateProfile()">VALIDATE</SubmitButton>
    </main>
  </div>
</template>

<script>
// imports
import SubmitButton from "../components/SubmitButton.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "UserProfile",

  components: { SubmitButton },

  computed: {
    ...mapState(["currentUsername", "currentUserCreatedAt", "currentUserUpdatedAt", "currentUserIsAdmin", "currentUserEmail", "errorMessage"]),

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

  mounted() {
    this.getCurrentProfile();
  },

  methods: {
    ...mapActions(["updateProfile", "resetState", "deleteCurrentProfile", "getCurrentProfile"]),

    // révéler le formulaire
    showInput(target) {
      let input = document.getElementById(target);
      if (getComputedStyle(input).display != "none") {
        input.style.display = "none";
      } else {
        input.style.display = "block";
      }
    },

    // confirmer la suppression du profile
    confirmDelete() {
      if (confirm(`your profile will be deleted. Do you want to continue ?`)) {
        this.deleteCurrentProfile();
        window.location.hash = "/";
      } else {
        window.location.hash = "/profile";
      }
    },
  },
};
</script>

<style lang="scss">
.user-profile {
  height: 100%;
  h1 {
    text-align: center;
    color: white;
    margin-top: 10px;
    font-size: 1.5rem;
    text-shadow: 1px 1px 2px #f2f2f2;
  }
}

.edit-profile {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 800px;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 1px 1px 2px #2c3e50;
  background-color: #f2f2f2;
  margin: auto;
  margin-top: 2rem;
  margin-bottom: 1rem;
  gap: 1rem;
  position: relative;
  .management {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    strong {
      align-self: flex-end;
      border: 1px solid orchid;
      color: orchid;
      padding: 0.5rem;
      border-radius: 0.5rem;
      -webkit-transition: 0.5s ease-in-out;
      transition: 0.5s ease-in-out;
      &:hover {
        cursor: pointer;
        color: #fd3004;
        border-color: #fd3004;
      }
    }
    i:hover {
      color: orchid;
      cursor: pointer;
    }
  }

  .error-message {
    color: red;
  }
  .btn {
    -webkit-transition: 0.5s ease-in-out;
    transition: 0.5s ease-in-out;
    &:hover {
      opacity: 0.8;
    }
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
      height: 30px;
      width: 250px;
      display: none;
    }
    span {
      color: royalblue;
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
