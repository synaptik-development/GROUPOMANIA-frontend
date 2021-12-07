<template>
  <article class="card" :key="item.id" v-for="item in messages">
    <div class="post-info">
      <p>
        Posted on {{ dateFormater(item.createdAt) }}
        <br />
        By {{ item.username }}
      </p>
      <p v-if="item.userId == currentUserId || admin == true" @click="openForm(item.id)" class="modify-message">modify</p>
    </div>
    <img v-if="item.imageUrl != null" :src="item.imageUrl" alt="" />

    <!-- formulaire modifier un message -->
    <form :id="[`formUpdateMessage-${item.id}`]" class="form-update-message">
      <div class="management">
        <p @click="deleteMessage(item.id)"><i class="fas fa-trash-alt" title="delete message"></i></p>
        <i @click="closeForm(item.id)" class="far fa-window-close"></i>
      </div>
      <div class="form-attachement">
        <input @change="processFile($event)" type="file" id="attachement" name="attachement" title="choose attachement" accept=".png, .jpeg, .jpg, .gif" />
      </div>
      <textarea v-model="content" name="message" id="message" rows="1" placeholder="update content"></textarea>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <SubmitButton @click="updateMessage(item.id)">UPDATE</SubmitButton>
    </form>
    <!-- fin formulaire modifier un message -->

    <strong>{{ item.content }}</strong>

    <Likes :likes="item.likes" :messageId="item.id" />

    <Comments :messageId="item.id" :admin="admin" />
  </article>

  <!-- formulaire poster un message -->
  <form id="post-message">
    <i @click="closePostMessage" class="far fa-window-close"></i>
    <textarea v-model="content" name="message" id="message" rows="1" placeholder="edit message"></textarea>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div class="form-attachement">
      <input @change="processFile($event)" type="file" id="attachement" name="attachement" accept=".png, .jpeg, .jpg, .gif" />
      <i title="send message" class="fas fa-paper-plane" @click="postMessage"></i>
    </div>
  </form>
  <!-- fin formulaire poster un message -->
</template>

<script>
import axios from "axios";
import Comments from "./Comments.vue";
import SubmitButton from "./SubmitButton.vue";
import Likes from "./Likes.vue";
export default {
  name: "Messages",

  components: { Comments, SubmitButton, Likes },

  data() {
    return {
      currentUserId: sessionStorage.userId,
      errorMessage: "",
      messages: [],
      content: "",
      image: "",
    };
  },

  props: {
    admin: {
      type: Boolean,
      require: true,
    },
  },

  created() {
    this.getAllMessages();
  },

  methods: {
    // chercher tous les messages
    getAllMessages() {
      axios
        .get("http://localhost:3000/api/messages", {
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          res.data
            .forEach((message) => {
              this.messages.push(message);
            })
            .catch((error) => {
              console.log(error.response.data.error);
            });
        });
    },

    // poster un message
    postMessage() {
      if (!this.content && !this.image) {
        return (this.errorMessage = "*nothing to post");
      }
      const data = new FormData();
      data.append("content", this.content);
      data.append("image", this.image);
      axios
        .post("http://localhost:3000/api/messages", data, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          this.messages.push(res.data);
          this.closePostMessage();
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
    },

    // fermer le formulaire pour poster un message
    closePostMessage() {
      document.getElementById("post-message").style.display = "none";
    },

    // ouvrir le formulaire "formUpdateMessage-${messageId}"
    openForm(messageId) {
      document.getElementById(`formUpdateMessage-${messageId}`).style.display = "flex";
    },

    // fermer le formulaire "formUpdateMessage-${messageId}"
    closeForm(messageId) {
      document.getElementById(`formUpdateMessage-${messageId}`).style.display = "none";
    },

    // mettre en forme la date
    dateFormater(date) {
      return new Date(date).toISOString().replace(/T.+/, "");
    },

    // récupérer le nom du fichier
    processFile(event) {
      this.image = event.target.files[0];
    },

    // modifier un message
    updateMessage(messageId) {
      const data = new FormData();
      if (!this.content && !this.image) {
        return (this.errorMessage = "*nothing to update");
      }
      if (this.content) {
        data.append("content", this.content);
      }
      if (this.image) {
        data.append("image", this.image);
      }
      axios
        .put(`http://localhost:3000/api/messages/${messageId}`, data, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then(() => {
          this.closeForm(messageId);
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
    },

    // supprimer un message
    deleteMessage(messageId) {
      axios
        .delete(`http://localhost:3000/api/messages/${messageId}`, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then(() => {
          this.closeForm(messageId);
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
    },
  },
};
</script>

<style lang="scss">
.card {
  width: 800px;
  height: auto;
  margin: auto;
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  border-radius: 1rem;
  box-shadow: 1px 1px 2px #2c3e50;
  border: 1px solid #2c3e50;
  padding: 1rem;
  position: relative;
  .form-update-message {
    display: none;
    flex-direction: column;
    background-color: white;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 1px 1px 2px #2c3e50;
    border: 1px solid #2c3e50;
    gap: 1rem;
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 1;
    .error-message {
      color: red;
    }
    .management {
      display: flex;
      justify-content: space-between;
      i {
        color: black;
        &:hover {
          cursor: pointer;
          color: orchid;
        }
      }
    }
    textarea {
      resize: none;
      overflow: hidden;
      min-height: 50px;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
    .form-attachement {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      i {
        color: orchid;
        font-size: 1.5rem;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .post-info {
    display: flex;
    justify-content: space-between;
    .modify-message {
      width: fit-content;
      height: fit-content;
      &:hover {
        cursor: pointer;
        color: orchid;
      }
    }
  }
  p {
    color: gray;
    font-size: 0.8rem;
  }

  img {
    object-fit: cover;
    max-width: 600px;
    height: auto;
    box-shadow: 1px 1px 2px #2c3e50;
    align-self: center;
  }

  strong {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

#post-message {
  position: fixed;
  top: 100px;
  width: 1000px;
  height: auto;
  margin: auto;
  display: none;
  flex-direction: column;
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 1px 1px 2px #2c3e50;
  border: 1px solid #2c3e50;
  .error-message {
    color: red;
  }
  .fa-window-close {
    align-self: flex-end;
    margin-bottom: 1rem;
    color: black;
    &:hover {
      cursor: pointer;
      color: orchid;
    }
  }
  textarea {
    resize: none;
    overflow: hidden;
    min-height: 50px;
    width: 100%;
    &:focus {
      outline: none;
    }
  }
  .form-attachement {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    i {
      color: orchid;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
