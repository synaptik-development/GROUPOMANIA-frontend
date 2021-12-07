<template>
  <div class="user-profile">
    <h1>MY PROFILE</h1>
    <main class="edit-profile">
      <div class="management">
        <strong @click="confirmDelete">delete profile</strong>
        <router-link to="/newsWall"><i class="far fa-window-close"></i></router-link>
        <router-view />
      </div>

      <!-- section username (formulaire caché) -->
      <div>
        <h3>USERNAME</h3>
        {{ username }}
        <span @click="showUsernameInput">edit</span>
        <input v-if="editUsername" v-model="newUsername" type="text" name="username" id="username" placeholder="username" />
      </div>
      <!-- fin section username  -->

      <!-- section email (formulaire caché) -->
      <div>
        <h3>EMAIL</h3>
        {{ email }}
        <span @click="showEmailInput">edit</span>
        <input v-if="editEmail" v-model="newEmail" type="email" name="email" id="email" placeholder="email" />
      </div>
      <!-- fin section email  -->

      <!-- section password (formulaire caché) -->
      <div>
        <h3>PASSWORD</h3>
        ********
        <span @click="showPasswordInput">edit</span>
        <input v-if="editPassword" v-model="newPassword" type="password" name="password" id="password" placeholder="password" /><br />
        <input v-if="editPassword" v-model="confirmPassword" type="password" name="confirm-password" id="confirm-password" placeholder="confirm password" />
      </div>
      <!-- fin section password  -->

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <SubmitButton @click="sendModif">VALIDATE</SubmitButton>
    </main>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import axios from "axios";
import SubmitButton from "../components/SubmitButton.vue";
export default {
  name: "UserProfile",

  components: { SubmitButton },

  data() {
    return {
      username: "",
      email: "",
      newUsername: "",
      newEmail: "",
      newPassword: "",
      confirmPassword: "",
      errorMessage: "",
      editUsername: false,
      editEmail: false,
      editPassword: false,
    };
  },

  // voir le profile
  beforeCreate() {
    const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
    const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
    axios
      .get(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      })
      .then((res) => {
        let decrypted = CryptoJS.AES.decrypt(res.data.userFound.email, key, { iv: iv });
        let decryptEmail = (res.data.userFound.email = decrypted.toString(CryptoJS.enc.Utf8));
        this.username = res.data.userFound.username;
        this.email = decryptEmail;
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  },

  methods: {
    // révéler le formulaire changer de nom
    showUsernameInput() {
      if (this.editUsername == true) {
        return (this.editUsername = false);
      } else {
        return (this.editUsername = true);
      }
    },

    // révéler le formulaire changer d'email
    showEmailInput() {
      if (this.editEmail == true) {
        return (this.editEmail = false);
      } else {
        return (this.editEmail = true);
      }
    },

    // révéler le formulaire changer de mot de passe
    showPasswordInput() {
      if (this.editPassword == true) {
        return (this.editPassword = false);
      } else {
        return (this.editPassword = true);
      }
    },

    // modifier le profile
    sendModif() {
      const data = new URLSearchParams();

      if (this.newUsername) {
        data.append("username", this.newUsername);
      }

      if (this.newEmail) {
        data.append("email", this.newEmail);
      }

      if (this.newPassword) {
        data.append("password", this.newPassword);
        data.append("confirmPassword", this.confirmPassword);
      }

      axios
        .put(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`, data, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then(() => {
          alert("user profile updated successfully");
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
    },

    // confirmer la suppression du profile
    confirmDelete() {
      if (confirm(`your profile will be deleted. Do you want to continue ?`)) {
        this.deleteProfile();
      } else {
        window.location.hash = "/profile";
      }
    },

    // supprimer le profile
    deleteProfile() {
      axios
        .delete(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          if (res.ok) {
            sessionStorage.clear();
            window.location.hash = "/home";
          }
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
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
  box-shadow: 1px 1px 2px #f2f2f2;
  background-color: #2c3e50;
  margin: auto;
  margin-top: 2rem;
  margin-bottom: 1rem;
  gap: 1rem;
  position: relative;
  color: white;
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
      &:hover {
        cursor: pointer;
        color: #fd3004;
        border-color: #fd3004;
      }
    }
    i {
      color: white;
      &:hover {
        color: orchid;
        cursor: pointer;
      }
    }
  }
  // i {
  //   position: absolute;
  //   right: 1rem;
  //   top: 1rem;
  //   color: white;
  //   &:hover {
  //     color: orchid;
  //     cursor: pointer;
  //   }
  // }
  .error-message {
    color: red;
  }
  .btn {
    color: black;
    background-color: #ffd7d7;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
      height: 30px;
      width: 250px;
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
