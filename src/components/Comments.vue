<template>
  <!-- formulaire poster un commentaire -->
  <div class="comment-edit">
    <form class="form-comment">
      <textarea v-model="content" name="comment" id="comment" placeholder="post a comment"></textarea>
      <i title="send comment" class="fas fa-paper-plane post-comment" @click.prevent="postComment()"></i>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
  <!-- fin formulaire poster un commentaire -->

  <!-- lien voir commentaires -->
  <p v-if="comments[0]" class="get-all-comments" @click="showComments()">view comments</p>
  <p v-else>No comments</p>
  <!-- lien voir commentaires -->

  <!-- commentaires  -->
  <div v-if="!isEmpty" id="all-comments">
    <div class="comment-info" :key="comment" v-for="comment in comments">
      <p v-if="comment.userId == currentUserId || currentUserIsAdmin" class="modify-comment" title="modify comment" @click="openForm(comment.id)">modify</p>
      <strong>{{ comment.username }}</strong>
      <br />
      <span class="comment-content">{{ comment.content }}</span>

      <!-- formulaire modifier un commentaire -->
      <form :id="[`formUpdateComment-${comment.id}`]" class="form-update-comment">
        <div class="management">
          <i @click.prevent="deleteComment(comment.id)" class="fas fa-trash-alt" title="delete comment"></i>
          <i @click="closeForm(comment.id)" class="far fa-window-close"></i>
        </div>
        <textarea v-model="newContent" name="comment" id="comment" :placeholder="[`${comment.content}`]"></textarea>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <SubmitButton @click.prevent="updateComment(comment.id)">UPDATE</SubmitButton>
      </form>
      <!-- fin formulaire modifier un commentaire -->
    </div>
  </div>
  <!-- fin commentaires  -->
</template>

<script>
// imports
import SubmitButton from "./SubmitButton.vue";
import functionsUtils from "../Utils/Functions";
import { mapState } from "vuex";

export default {
  components: { SubmitButton },
  name: "Comments",

  data() {
    return {
      comments: [],
      isEmpty: true,
      newContent: "",
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

  mounted() {
    this.getAllComments();
  },

  methods: {
    // chercher tous les commentaires
    async getAllComments() {
      try {
        const data = await functionsUtils.getHTTP(`http://localhost:3000/api/messages/${this.messageId}/comments`);
        this.comments = data;
      } catch (err) {
        console.log(err.response.data.error);
      }
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
    async postComment() {
      const urlData = { content: this.content };

      try {
        const data = await functionsUtils.postHTTP(`http://localhost:3000/api/messages/${this.messageId}/comments`, urlData);
        this.comments.unshift(data);
        this.content = "";
      } catch (err) {
        this.errorMessage = err.response.data.error;
      }
    },

    // modifier un commentaire
    async updateComment(commentId) {
      const urlData = { content: this.newContent };

      try {
        const data = await functionsUtils.putHTTP(`http://localhost:3000/api/messages/${this.messageId}/comments/${commentId}`, urlData);
        const comment = this.comments.findIndex((element) => element.id == commentId && element.messageId == this.messageId);
        this.comments.splice(comment, 1, data);
        this.content = "";
      } catch (err) {
        this.errorMessage = err.response.data.error;
      }
    },

    // supprimer un commentaire
    async deleteComment(commentId) {
      try {
        await functionsUtils.deleteHTTP(`http://localhost:3000/api/messages/${this.messageId}/comments/${commentId}`);
        const comment = this.comments.findIndex((element) => element.id == commentId && element.messageId == this.messageId);
        this.comments.splice(comment, 1);
      } catch (err) {
        this.errorMessage = err.response.data.error;
      }
    },

    // ouvrir le formulaire "formUpdateComment-:commentId"
    openForm(commentId) {
      document.getElementById(`formUpdateComment-${commentId}`).style.display = "flex";
      this.errorMessage = "";
    },

    // fermer le formulaire "formUpdateComment-:commentId"
    closeForm(commentId) {
      document.getElementById(`formUpdateComment-${commentId}`).style.display = "none";
      this.errorMessage = "";
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
    box-shadow: 0 0 2px #2c3e50;
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
    box-shadow: 0 0 2px #2c3e50;
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

#all-comments {
  position: relative;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 1rem;
  .comment-info {
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
    strong {
      font-size: 0.8rem;
    }
    .comment-content {
      font-size: 0.8rem;
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
