import { createStore } from "vuex";
import axios from "axios";
import CryptoJS from "crypto-js";

export default createStore({
  // --------------------------------------------------------------------------------------------
  // state
  // --------------------------------------------------------------------------------------------
  state: {
    // utils
    errorMessage: "",
    modelUsername: "",
    modelEmail: "",
    modelPassword: "",
    confirmPassword: "",

    // messages
    messages: [],
    content: "",
    image: "",

    // users
    currentUserId: sessionStorage.userId,
    users: [],
    currentUsername: "",
    currentUserCreatedAt: "",
    currentUserUpdatedAt: "",
    currentUserIsAdmin: false,
    currentUserEmail: "",
    userId: "",
    username: "",
    createdAt: "",
    admin: false,
    adminMessage: "",
  },

  // --------------------------------------------------------------------------------------------
  // getters
  // --------------------------------------------------------------------------------------------
  getters: {
    // dateFormater: (state) => (date) => {
    //   let formatDate = new Date(state.currentUserCreatedAt);
    //   return formatDate.getDate() + "/" + formatDate.getMonth() + "/" + formatDate.getFullYear();
    // },

    currentUserCreatedAt: (state) => {
      let formatDate = new Date(state.currentUserCreatedAt);
      return formatDate.getDate() + "/" + formatDate.getMonth() + "/" + formatDate.getFullYear();
    },

    currentUserUpdatedAt: (state) => {
      let formatDate = new Date(state.currentUserUpdatedAt);
      return formatDate.getDate() + "/" + formatDate.getMonth() + "/" + formatDate.getFullYear();
    },

    createdAt: (state) => {
      let formatDate = new Date(state.createdAt);
      return formatDate.getDate() + "/" + formatDate.getMonth() + "/" + formatDate.getFullYear();
    },

    messages: (state) => {
      state.messages.forEach((message) => {
        let formatDate = new Date(message.createdAt);
        message.createdAt = formatDate.getDate() + "/" + formatDate.getMonth() + "/" + formatDate.getFullYear();
      });
      return state.messages;
    },

    adminMessage: (state) => {
      if (state.currentUserIsAdmin != true) {
        state.adminMessage = "";
      } else {
        state.adminMessage = "moderator profil";
      }
      return state.adminMessage;
    },
  },

  // --------------------------------------------------------------------------------------------
  // mutations
  // --------------------------------------------------------------------------------------------
  mutations: {
    // ---------------------- //
    // ------- utils ------- //

    //propriétés calculées bidirectionnelles
    CHANGE_CONTENT(state, content) {
      state.content = content;
    },

    CHANGE_MODEL_EMAIL(state, modelEmail) {
      state.modelEmail = modelEmail;
    },

    CHANGE_MODEL_USERNAME(state, modelUsername) {
      state.modelUsername = modelUsername;
    },

    CHANGE_MODEL_PASSWORD(state, modelPassword) {
      state.modelPassword = modelPassword;
    },

    CHANGE_CONFIRM_PASSWORD(state, confirmPassword) {
      state.confirmPassword = confirmPassword;
    },

    RESET_STATE(state) {
      state.content = "";
      state.image = "";
      state.errorMessage = "";
      state.modelEmail = "";
      state.modelUsername = "";
      state.modelPassword = "";
      state.confirmPassword = "";
    },

    ERROR_API(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
    // ------- fin utils ------- //

    // ------------------------------------- //
    // ------- contrôle des messages ------- //
    GET_MESSAGES(state, messages) {
      state.messages = messages;
    },

    POST_MESSAGE(state, message) {
      state.messages.push(message);
      // location.reload();
    },
    // ------- fin contrôle des messages ------- //

    // ------------------------------------------ //
    // ------- contrôle des utilisateurs ------- //
    LOGIN(state, data) {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userId", data.userId);
      window.location.hash = "/newswall";
    },

    GET_USERS(state, users) {
      state.users = users;
    },

    GET_USER(state, userFound) {
      state.userId = userFound.id;
      state.username = userFound.username;
      state.admin = userFound.admin;
      state.createdAt = userFound.createdAt;
    },

    GET_CURRENT_PROFILE(state, userFound) {
      const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
      const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

      let decrypted = CryptoJS.AES.decrypt(userFound.email, key, {
        iv: iv,
      });
      let decryptEmail = (userFound.email = decrypted.toString(CryptoJS.enc.Utf8));
      state.currentUsername = userFound.username;
      state.currentUserEmail = decryptEmail;
      state.currentUserCreatedAt = userFound.createdAt;
      state.currentUserIsAdmin = userFound.admin;
      state.currentUserUpdatedAt = userFound.updatedAt;
    },

    UPDATE_PROFILE(state, message) {
      alert(message);
      window.location.hash = "/newswall";
    },

    CHANGE_RIGHTS(state, message) {
      alert(message);
      location.reload();
    },
  },

  // --------------------------------------------------------------------------------------------
  // actions
  // --------------------------------------------------------------------------------------------
  actions: {
    // ---------------------- //
    // ------- utils ------- //

    // récupérer fichier
    processFile(event, file) {
      this.state.image = file.target.files[0];
    },

    // remmettre state à zéro
    resetState({ commit }) {
      commit("RESET_STATE");
    },
    // ------- fin utils ------- //

    // ------------------------------------- //
    // ------- contrôle des messages ------- //

    // chercher tous les messages
    getAllMessages({ commit }) {
      axios
        .get("http://localhost:3000/api/messages", {
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          commit("GET_MESSAGES", res.data);
        });
    },

    // poster un message
    postMessage({ commit }) {
      const formData = new FormData();

      if (this.state.content) {
        formData.append("content", this.state.content);
      }
      if (this.state.image) {
        formData.append("image", this.state.image);
      }
      axios
        .post("http://localhost:3000/api/messages", formData, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          commit("POST_MESSAGE", res.data);
          document.getElementById("post-message").style.display = "none";
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },

    // modifier un message
    updateMessage({ commit }, messageId) {
      const data = new FormData();
      if (this.state.content) {
        data.append("content", this.state.content);
      }
      if (this.state.image) {
        data.append("image", this.state.image);
      }
      axios
        .put(`http://localhost:3000/api/messages/${messageId}`, data, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then(() => {
          commit("RESET_STATE");
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },

    // supprimer un message
    deleteMessage({ commit }, messageId) {
      axios
        .delete(`http://localhost:3000/api/messages/${messageId}`, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },
    // ------- fin contrôle des messages ------- //

    // ------------------------------------------ //
    // ------- contrôle des utilisateurs ------- //

    // se connecter
    sendLogin({ commit }) {
      axios
        .post("http://localhost:3000/api/auth/login", {
          email: this.state.modelEmail,
          password: this.state.modelPassword,
        })
        .then((res) => {
          commit("LOGIN", res.data);
          commit("RESET_STATE");
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },

    // s'inscrire
    sendRegister({ commit }) {
      axios
        .post("http://localhost:3000/api/auth/register", {
          username: this.state.modelUsername,
          email: this.state.modelEmail,
          password: this.state.modelPassword,
          confirmPassword: this.state.confirmPassword,
        })
        .then(() => {
          axios
            .post("http://localhost:3000/api/auth/login", {
              email: this.state.modelEmail,
              password: this.state.modelPassword,
            })
            .then((res) => {
              commit("LOGIN", res.data);
              commit("RESET_STATE");
            });
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },

    // chercher membres réseau
    getAllUsers({ commit }) {
      axios
        .get("http://localhost:3000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          commit("GET_USERS", res.data);
        });
    },

    // voir le profile d'un utilisateur
    getUser({ commit }, userId) {
      axios
        .get(`http://localhost:3000/api/auth/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          commit("GET_USER", res.data.userFound);
          document.querySelector(".user-profil").style.display = "flex";
        });
    },

    // profil connecté
    getCurrentProfile({ commit }) {
      axios
        .get(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          commit("GET_CURRENT_PROFILE", res.data.userFound);
        });
    },

    // modifier le profil connecté
    updateProfile({ commit }) {
      const data = new URLSearchParams();

      if (this.state.modelUsername) {
        data.append("username", this.state.modelUsername);
      }

      if (this.state.modelEmail) {
        data.append("email", this.state.modelEmail);
      }

      if (this.state.modelPassword) {
        data.append("password", this.state.modelPassword);
        data.append("confirmPassword", this.state.confirmPassword);
      }

      axios
        .put(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`, data, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          commit("UPDATE_PROFILE", res.data.message);
          commit("RESET_STATE");
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },

    // changer les droits utilisateur(privilège modérateur)
    changeUserRights({ commit }, userId) {
      const data = new URLSearchParams();

      if (this.state.admin == false) {
        data.append("admin", true);
      } else {
        data.append("admin", false);
      }

      axios
        .put(`http://localhost:3000/api/auth/users/${userId}/moderator`, data, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          commit("CHANGE_RIGHTS", res.data.message);
          commit("RESET_STATE");
          document.querySelector(".user-profil").style.display = "none";
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },

    // supprimer profile(privilège modérateur)
    deleteProfile({ commit }, userId) {
      axios
        .delete(`http://localhost:3000/api/auth/users/${userId}`, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          commit("CHANGE_RIGHTS", res.data.message);
          commit("RESET_STATE");
          document.querySelector(".user-profil").style.display = "none";
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },

    // supprimer le profile
    deleteCurrentProfile({ commit }) {
      axios
        .delete(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then(() => {
          sessionStorage.clear();
        })
        .catch((err) => {
          commit("ERROR_API", err.response.data.error);
        });
    },
  },

  modules: {},
});
