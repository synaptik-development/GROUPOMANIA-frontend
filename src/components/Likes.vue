<template>
  <p class="like">
    <i
      class="fas fa-thumbs-up"
      v-bind:class="getIfAlreadyLiked"
      id="icon-like"
      @click="likeMessage(messageId)"
    ></i>
    {{ likes }}
  </p>
</template>

<script>
// imports
import axios from "axios";

export default {
  name: "Likes",

  data() {
    return {
      isliked: "",
      isActive: "active",
    };
  },

  props: {
    likes: {
      type: Number,
      required: true,
    },
    messageId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    // voir si le message est déjà liké par l'utilisateur connecté
    getIfAlreadyLiked() {
      let alreadyLiked;
      if (this.isliked == sessionStorage.userId) {
        alreadyLiked = { active: this.isActive };
      }
      return alreadyLiked;
    },
  },

  mounted() {
    this.getWhoLiked(this.messageId);
  },

  methods: {
    // voir qui a liké le message
    getWhoLiked(messageId) {
      axios
        .get(`http://localhost:3000/api/messages/${messageId}/likes`, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          if (res.data) {
            this.isliked = res.data.userId;
          }
        });
    },

    // liker/retirer-mention
    likeMessage(messageId) {
      let data;
      if (this.isliked != sessionStorage.userId) {
        data = { like: 1 };
      } else {
        data = { like: 0 };
      }
      axios
        .post(`http://localhost:3000/api/messages/${messageId}/likes`, data, {
          headers: {
            authorization: `Bearer ${sessionStorage.token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
        });
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
