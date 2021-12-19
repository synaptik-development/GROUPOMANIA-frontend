<template>
  <!-- formulaire poster un commentaire -->
  <div class="comment-edit">
    <form class="form-comment">
      <textarea
        v-model="content"
        name="comment"
        id="comment"
        placeholder="post a comment"
      ></textarea>
      <i
        title="send comment"
        class="fas fa-paper-plane post-comment"
        @click="postComment()"
      ></i>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
  <!-- fin formulaire poster un commentaire -->

  <!-- lien voir commentaires -->
  <p v-if="comments[0]" class="get-all-comments" @click="showComments()">
    view comments
  </p>
  <p v-else>No comments</p>
  <!-- lien voir commentaires -->

  <!-- commentaires  -->
  <div v-if="!isEmpty" class="all-comments">
    <div class="comment-info" :key="item.id" v-for="item in comments">
      <p
        v-if="item.userId == currentUserId || currentUserIsAdmin"
        class="modify-comment"
        @click="openForm(item.id)"
      >
        modify
      </p>
      <span>{{ item.username }}</span>
      <br />
      <span class="comment-content">{{ item.content }}</span>

      <!-- formulaire modifier un commentaire -->
      <form :id="[`formUpdateComment-${item.id}`]" class="form-update-comment">
        <div class="management">
          <i
            @click="deleteComment(item.id)"
            class="fas fa-trash-alt"
            title="delete comment"
          ></i>
          <i @click="closeForm(item.id)" class="far fa-window-close"></i>
        </div>
        <textarea
          v-model="content"
          name="comment"
          id="comment"
          :placeholder="[`${item.content}`]"
        ></textarea>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <SubmitButton @click="updateComment(item.id)">UPDATE</SubmitButton>
      </form>
      <!-- fin formulaire modifier un commentaire -->
    </div>
  </div>
  <!-- fin commentaires  -->
</template>

<script>
// imports
import axios from "axios";
import SubmitButton from "./SubmitButton.vue";
import { mapState } from "vuex";

export default {
  components: { SubmitButton },
  name: "Comments",

  data() {
    return {
      comments: [],
      isEmpty: true,
      content: "",
      errorMessage: "",
    };
  },

  computed: {
    ...mapState(["currentUserId", "currentUserIsAdmin"]),
  },
  props: {
    messageId: {
      type: Number,
      required: true,
    },
  },

  beforeMount() {
    this.getAllComments();
  },

  methods: {
    // chercher tous les commentaires
    getAllComments() {
      axios
        .get(`http://localhost:3000/api/messages/${this.messageId}/comments`, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          res.data.forEach((comment) => {
            this.comments.push(comment);
          });
        });
    },

    // voir les commentaires
    showComments() {
      if (this.isEmpty == true) {
        return (this.isEmpty = false);
      } else {
        return (this.isEmpty = true);
      }
    },

    // poster un commentaire
    postComment() {
      const data = { content: this.content };
      axios
        .post(
          `http://localhost:3000/api/messages/${this.messageId}/comments`,
          data,
          {
            headers: {
              authorization: `Bearer ${sessionStorage.token}`,
            },
          }
        )
        .then(() => {
          location.reload();
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
    },

    // modifier un commentaire
    updateComment(commentId) {
      const data = { content: this.content };
      axios
        .put(
          `http://localhost:3000/api/messages/${this.messageId}/comments/${commentId}`,
          data,
          {
            headers: {
              authorization: `Bearer ${sessionStorage.token}`,
            },
          }
        )
        .then(() => {
          alert("comment successfully updated");
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
    },

    // supprimer un commentaire
    deleteComment(commentId) {
      axios
        .delete(
          `http://localhost:3000/api/messages/${this.messageId}/comments/${commentId}`,
          {
            headers: {
              authorization: `Bearer ${sessionStorage.token}`,
            },
          }
        )
        .then(() => {
          alert("comment deleted successfully");
        })
        .catch((error) => {
          this.errorMessage = error.response.data.error;
        });
    },

    // ouvrir le formulaire "formUpdateComment-:commentId"
    openForm(commentId) {
      let form = document.getElementById(`formUpdateComment-${commentId}`);

      axios
        .get(
          `http://localhost:3000/api/messages/${this.messageId}/comments/${commentId}`,
          {
            headers: {
              authorization: `Bearer ${sessionStorage.token}`,
            },
          }
        )
        .then(() => {
          form.style.display = "flex";
        });
    },

    // fermer le formulaire "formUpdateComment-:commentId"
    closeForm(commentId) {
      let form = document.getElementById(`formUpdateComment-${commentId}`);
      form.style.display = "none";
    },
  },
};
</script>

<style lang="scss">
.comment-edit {
  padding-top: 1rem;
  border-top: 1px solid gray;
  .form-comment {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    border: 1px solid gray;
    box-shadow: 1px 1px 2px #2c3e50;
    textarea {
      resize: none;
      border: none;
      width: 100%;
      &:focus {
        border: none;
        outline: none;
      }
    }
    .post-comment {
      align-self: flex-end;
      margin-right: 5px;
      margin-top: auto;
      margin-bottom: auto;
      color: orchid;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .error-message {
    color: red;
  }
}

.form-update-comment {
  width: 100%;
  display: none;
  flex-direction: column;
  border: 1px solid #2c3e50;
  border-radius: 5px;
  textarea {
    resize: none;
    border: none;
    width: 90%;
    box-shadow: 1px 1px 2px #2c3e50;
    align-self: center;
    &:focus {
      border: none;
      outline: none;
    }
  }
  .error-message {
    align-self: flex-start;
    margin-left: 30px;
    color: red;
    font-size: 0.8rem;
  }
  .management {
    display: flex;
    justify-content: space-between;
    padding: 0.8rem;
    i {
      font-size: 0.8rem;
      color: black;
      &:hover {
        cursor: pointer;
        color: orchid;
      }
    }
  }
  .btn {
    font-size: 0.8rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
}

.all-comments {
  position: relative;
  border: 1px solid gray;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 1rem;
  box-shadow: 1px 1px 2px #2c3e50;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f2f2f2;

  .comment-info {
    background-color: white;
    position: relative;
    display: block;
    border-radius: 0.5rem;
    padding: 0.2rem 1rem 0.2rem 1rem;
    .modify-comment {
      position: absolute;
      right: 8px;
      top: -8px;
      font-size: 0.7rem;
      &:hover {
        cursor: pointer;
        color: orchid;
      }
    }
    span {
      font-size: 0.8rem;
      color: #2c3e50;
    }
    .comment-content {
      color: black;
      font-size: 1rem;
    }
  }
}

.get-all-comments {
  text-decoration: underline;
  &:hover {
    cursor: pointer;
    color: orchid;
  }
}
</style>
