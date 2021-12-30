<template>
  <p class="like">
    <i class="fas fa-thumbs-up" v-bind:class="getIfAlreadyLiked" id="icon-like" @click="likeMessage()"></i>
    {{ likes }}
  </p>
</template>

<script>
// imports
import functionsUtils from "../Utils/Functions";

export default {
  name: "Likes",

  data() {
    return {
      likes: "",
      isliked: false,
      isActive: "active",
    };
  },

  props: {
    messageId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    // adapter couleur de l'icône "like"
    getIfAlreadyLiked() {
      let alreadyLiked;
      if (this.isliked == true) {
        alreadyLiked = { active: this.isActive };
      }
      return alreadyLiked;
    },
  },

  mounted() {
    this.getWhoLiked();
    this.getLikesAmount();
  },

  methods: {
    // voir si le message est déjà liké par l'utilisateur connecté
    async getWhoLiked() {
      try {
        const data = await functionsUtils.getHTTP(`http://localhost:3000/api/messages/${this.messageId}/likes`);
        if (data != null) {
          this.isliked = true;
        } else {
          this.isliked = false;
        }
      } catch (err) {
        console.log(err.response.data.error);
      }
    },

    // voir nombre de likes
    async getLikesAmount() {
      try {
        const data = await functionsUtils.getHTTP(`http://localhost:3000/api/messages/${this.messageId}`);
        this.likes = data.likes;
      } catch (err) {
        console.log(err.response.data.error);
      }
    },

    // liker/retirer-mention
    async likeMessage() {
      let urlData;
      if (this.isliked == true) {
        urlData = { like: 0 };
        try {
          const data = await functionsUtils.postHTTP(`http://localhost:3000/api/messages/${this.messageId}/likes`, urlData);
          console.log(data.message);
          this.isliked = false;
          this.likes--;
        } catch (err) {
          console.log(err.response.data.error);
        }
      } else {
        urlData = { like: 1 };
        try {
          const data = await functionsUtils.postHTTP(`http://localhost:3000/api/messages/${this.messageId}/likes`, urlData);
          console.log(data.message);
          this.isliked = true;
          this.likes++;
        } catch (err) {
          console.log(err.response.data.error);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.like {
  align-self: flex-end;
  &:hover {
    cursor: pointer;
  }
  i {
    font-size: 1rem;
    color: gray;
  }
  .active {
    color: orchid;
  }
}
</style>
