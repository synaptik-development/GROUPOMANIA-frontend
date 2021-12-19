<template>
  <article class="card" v-for="message in messages" :key="message.id">
    <div class="post-info">
      <p>
        Posted on {{ message.createdAt }}
        <br />
        By {{ message.username }}
      </p>
      <p
        v-if="message.userId == currentUserId || currentUserIsAdmin"
        @click="openForm(message.id)"
        class="modify-message"
      >
        modify
      </p>
    </div>
    <img v-if="message.imageUrl != null" :src="message.imageUrl" alt="" />

    <!-- formulaire modifier un message -->
    <form :id="[`formUpdateMessage-${message.id}`]" class="form-update-message">
      <div class="management">
        <p @click="deleteMessage(message.id)">
          <i class="fas fa-trash-alt" title="delete message"></i>
        </p>
        <i @click="closeForm(message.id)" class="far fa-window-close"></i>
      </div>
      <div class="form-attachement">
        <input
          @change="processFile($event, $event.file)"
          type="file"
          id="attachement"
          name="attachement"
          title="choose attachement"
          accept=".png, .jpeg, .jpg, .gif"
        />
      </div>
      <textarea
        v-model="content"
        name="message"
        id="message"
        rows="1"
        placeholder="update content"
      ></textarea>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <SubmitButton @click="updateMessage(message.id)">UPDATE</SubmitButton>
    </form>
    <!-- fin formulaire modifier un message -->

    <strong>{{ message.content }}</strong>

    <Likes :likes="message.likes" :messageId="message.id" />

    <Comments :messageId="message.id" />
  </article>

  <!-- formulaire poster un message -->
  <form id="post-message">
    <i
      @click="
        closePostMessage();
        resetState();
      "
      class="far fa-window-close"
    ></i>
    <textarea
      v-model="content"
      name="message"
      id="message"
      rows="1"
      placeholder="edit message"
    ></textarea>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div class="form-attachement">
      <input
        @change="processFile($event, $event.file)"
        type="file"
        id="attachement"
        name="attachement"
        accept=".png, .jpeg, .jpg, .gif"
      />
      <i
        title="send message"
        class="fas fa-paper-plane"
        @click="postMessage()"
      ></i>
    </div>
  </form>
  <!-- fin formulaire poster un message -->
</template>

<script>
// imports
import Comments from "./Comments.vue";
import SubmitButton from "./SubmitButton.vue";
import Likes from "./Likes.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Messages",

  components: { Comments, SubmitButton, Likes },

  computed: {
    ...mapGetters(["messages"]),

    ...mapState(["currentUserId", "errorMessage", "currentUserIsAdmin"]),

    //propriétés calculées bidirectionnelles
    content: {
      get() {
        return this.$store.state.content;
      },
      set(value) {
        this.$store.commit("CHANGE_CONTENT", value);
      },
    },
  },

  methods: {
    ...mapActions([
      "getAllMessages",
      "postMessage",
      "processFile",
      "updateMessage",
      "deleteMessage",
      "resetState",
    ]),

    // fermer le formulaire pour poster un message
    closePostMessage() {
      document.getElementById("post-message").style.display = "none";
    },

    // ouvrir le formulaire "formUpdateMessage-${messageId}"
    openForm(messageId) {
      document.getElementById(`formUpdateMessage-${messageId}`).style.display =
        "flex";
    },

    // fermer le formulaire "formUpdateMessage-${messageId}"
    closeForm(messageId) {
      document.getElementById(`formUpdateMessage-${messageId}`).style.display =
        "none";
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
