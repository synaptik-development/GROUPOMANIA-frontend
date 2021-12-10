import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    currentUserId: sessionStorage.userId,
    messages: [],
    content: "",
    image: "",
    errorMessage: "",
  },

  mutations: {
    GET_MESSAGES(state, messages) {
      state.messages = messages;
    },

    POST_MESSAGE(state, message) {
      state.messages.push(message);
    },

    //propriétés calculées bidirectionnelles pour récupérer
    //la valeur de content et errorMessage
    CHANGE_CONTENT(state, content) {
      state.content = content;
    },

    CHANGE_ERROR_MESSAGE(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
  },

  actions: {
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

      console.log(this.state.image)
      
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
        .catch((error) => {
          this.state.errorMessage = error.response.data.error;
        });
    },

    // récupérer le nom du fichier
    processFile(event, file) {
      return this.state.image = file.target.files[0].name;
    },
  },

  modules: {},
});
