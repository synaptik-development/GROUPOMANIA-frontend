import { createStore } from "vuex";
import CryptoJS from "crypto-js";
import functionsUtils from "../Utils/Functions";

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
    token: sessionStorage.getItem("token") || "",

    // messages
    messages: [],
    content: "",
    image: "",

    // utilisateurs
    users: [],
    userId: "",
    username: "",
    createdAt: "",
    admin: false,
    adminMessage: "",

    // utilisateur connecté
    currentUserId: sessionStorage.userId,
    currentUsername: "",
    currentUserCreatedAt: "",
    currentUserUpdatedAt: "",
    currentUserIsAdmin: false,
    currentUserEmail: "",
  },

  // --------------------------------------------------------------------------------------------
  // getters
  // --------------------------------------------------------------------------------------------
  getters: {
    // retourner les dates au bon format
    currentUserCreatedAt: (state) => {
      return new Date(state.currentUserCreatedAt).toLocaleDateString();
    },

    currentUserUpdatedAt: (state) => {
      return new Date(state.currentUserUpdatedAt).toLocaleDateString();
    },

    createdAt: (state) => {
      return new Date(state.createdAt).toLocaleDateString();
    },

    // vérifier l'authentification
    isLoggedIn: (state) => !!state.token,

    // supprimer l'utilisateur connecté de la liste des utilisateurs visibles dans la sidebar
    users: (state) => {
      const user = state.users.findIndex((user) => user.id == sessionStorage.userId);
      state.users.splice(user, 1);
      return state.users;
    },

    // générer un message si l'utilisateur est connecté avec un profil modérateur
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

    DELETE_MESSAGE(state, messageId) {
      const message = state.messages.findIndex((message) => message.id === messageId);
      state.messages.splice(message, 1);
    },
    // ------- fin utils ------- //

    // ------------------------------------- //
    // ------- contrôle des messages ------- //
    GET_MESSAGES(state, messages) {
      state.messages = messages;
    },

    POST_MESSAGE(state, message) {
      state.messages.unshift(message);
    },

    UPDATE_MESSAGE(state, messageUpdated) {
      const message = state.messages.findIndex((element) => element.id == messageUpdated.id);
      state.messages.splice(message, 1, messageUpdated);
    },
    // ------- fin contrôle des messages ------- //

    // ------------------------------------------ //
    // ------- contrôle des utilisateurs ------- //
    LOGIN(state, data) {
      state.token = data.token;
      state.userId = data.userId;
      state.currentUsername = data.username;
    },

    LOGOUT(state) {
      state.token = "";
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

    CHANGE_RIGHTS(state) {
      if (state.admin == false) {
        state.admin = true;
      } else {
        state.admin = false;
      }
    },
    // ------- fin contrôle des utilisateurs ------- //
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
    async getAllMessages({ commit }) {
      try {
        const data = await functionsUtils.getHTTP("http://localhost:3000/api/messages");
        commit("GET_MESSAGES", data);
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // poster un message
    async postMessage({ commit }) {
      const formData = new FormData();

      if (this.state.content) {
        formData.append("content", this.state.content);
      }
      if (this.state.image) {
        formData.append("image", this.state.image);
      }
      try {
        const data = await functionsUtils.postHTTP("http://localhost:3000/api/messages", formData);
        commit("POST_MESSAGE", data);
        commit("RESET_STATE");
        document.getElementById("post-message").style.display = "none";
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // modifier un message
    async updateMessage({ commit }, messageId) {
      const formData = new FormData();
      if (this.state.content) {
        formData.append("content", this.state.content);
      }
      if (this.state.image) {
        formData.append("image", this.state.image);
      }
      try {
        const data = await functionsUtils.putHTTP(`http://localhost:3000/api/messages/${messageId}`, formData);
        document.getElementById(`formUpdateMessage-${messageId}`).style.display = "none";
        commit("UPDATE_MESSAGE", data);
        commit("RESET_STATE");
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // supprimer un message
    async deleteMessage({ commit }, messageId) {
      try {
        await functionsUtils.deleteHTTP(`http://localhost:3000/api/messages/${messageId}`);
        commit("DELETE_MESSAGE", messageId);
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },
    // ------- fin contrôle des messages ------- //

    // ------------------------------------------ //
    // ------- contrôle des utilisateurs ------- //

    // se connecter
    async login({ commit }) {
      try {
        const urlData = { email: this.state.modelEmail, password: this.state.modelPassword };
        const data = await functionsUtils.postLogin("http://localhost:3000/api/auth/login", urlData);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.userId);
        commit("LOGIN", data);
        commit("RESET_STATE");
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // s'inscrire
    async register({ commit }) {
      try {
        const urlData = { username: this.state.modelUsername, email: this.state.modelEmail, password: this.state.modelPassword, confirmPassword: this.state.confirmPassword };
        await functionsUtils.postLogin("http://localhost:3000/api/auth/register", urlData);
        try {
          const urlData = { email: this.state.modelEmail, password: this.state.modelPassword };
          const data = await functionsUtils.postLogin("http://localhost:3000/api/auth/login", urlData);
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userId", data.userId);
          commit("LOGIN", data);
          commit("RESET_STATE");
        } catch (err) {
          commit("ERROR_API", err.response.data.error);
        }
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    //se déconnecter
    logout({ commit }) {
      sessionStorage.clear();
      commit("LOGOUT"), commit("RESET_STATE");
    },

    // chercher membres réseau
    async getAllUsers({ commit }) {
      try {
        const data = await functionsUtils.getHTTP("http://localhost:3000/api/auth/users");
        commit("GET_USERS", data);
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // voir le profile d'un utilisateur
    async getUser({ commit }, userId) {
      try {
        const data = await functionsUtils.getHTTP(`http://localhost:3000/api/auth/users/${userId}`);
        commit("GET_USER", data);
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // profil connecté
    async getCurrentProfile({ commit }) {
      try {
        const data = await functionsUtils.getHTTP(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`);
        commit("GET_CURRENT_PROFILE", data);
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // modifier le profil connecté
    async updateProfile({ commit }) {
      const urlData = new URLSearchParams();

      if (this.state.modelUsername) {
        urlData.append("username", this.state.modelUsername);
      }

      if (this.state.modelEmail) {
        urlData.append("email", this.state.modelEmail);
      }

      if (this.state.modelPassword) {
        urlData.append("password", this.state.modelPassword);
        urlData.append("confirmPassword", this.state.confirmPassword);
      }

      try {
        const data = await functionsUtils.putHTTP(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`, urlData);
        commit("GET_CURRENT_PROFILE", data);
        commit("RESET_STATE");
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // changer les droits utilisateur(privilège modérateur)
    async changeUserRights({ commit }, userId) {
      const urlData = new URLSearchParams();

      if (this.state.admin == false) {
        urlData.append("admin", true);
      } else {
        urlData.append("admin", false);
      }

      try {
        await functionsUtils.putHTTP(`http://localhost:3000/api/auth/users/${userId}/moderator`, urlData);
        commit("CHANGE_RIGHTS");
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // supprimer profile(privilège modérateur)
    async deleteProfile({ commit }, userId) {
      try {
        const data = await functionsUtils.deleteHTTP(`http://localhost:3000/api/auth/users/${userId}`);
        commit("CHANGE_RIGHTS", data);
        commit("RESET_STATE");
        document.querySelector(".user-profil").style.display = "none";
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },

    // supprimer le profile
    async deleteCurrentProfile({ commit }) {
      try {
        await functionsUtils.deleteHTTP(`http://localhost:3000/api/auth/users/${sessionStorage.userId}`);
        sessionStorage.clear();
        window.location.hash = "/";
      } catch (err) {
        commit("ERROR_API", err.response.data.error);
      }
    },
    // ------- fin contrôle des utilisteurs ------- //
  },
});
