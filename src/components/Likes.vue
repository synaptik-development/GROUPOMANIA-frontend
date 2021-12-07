<template>
  <p class="like">
    <i
      class="fas fa-thumbs-up"
      v-bind:class="getIfAlreadyLiked"
      id="icon-like"
      @click="likeMessage(messageId)"
    ></i>
    {{ islikedBy.length }}
  </p>
</template>

<script>
import axios from "axios";
export default {
  name: "Likes",

  data() {
    return {
      islikedBy: [],
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
      this.islikedBy.forEach((element) => {
        if (element == sessionStorage.userId) {
          alreadyLiked = { active: this.isActive };
        }
      });
      return alreadyLiked;
    },
  },

  beforeMount() {
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
          res.data.forEach((item) => {
            this.islikedBy.push(item.userId);
          });
        });
    },

    // liker/retirer-mention
    likeMessage(messageId) {
      let data;
      if (!this.islikedBy.includes(sessionStorage.userId)) {
        axios
          .post(`http://localhost:3000/api/messages/${messageId}/likes/like`, data, {
            headers: {
              authorization: `Bearer ${sessionStorage.token}`,
            },
          })
          .then(() => {
            this.islikedBy.push(sessionStorage.userId);
          })
          .catch(() => {
            axios
              .post(
                `http://localhost:3000/api/messages/${messageId}/likes/removelike`,
                data,
                {
                  headers: {
                    authorization: `Bearer ${sessionStorage.token}`,
                  },
                }
              )
              .then(() => {
                let user = this.islikedBy.indexOf(sessionStorage.userId);
                this.islikedBy.splice(user, 1);
              });
          });
      } else {
        axios
          .post(
            `http://localhost:3000/api/messages/${messageId}/likes/removelike`,
            data,
            {
              headers: {
                authorization: `Bearer ${sessionStorage.token}`,
              },
            }
          )
          .then(() => {
            let user = this.islikedBy.indexOf(sessionStorage.userId);
            this.islikedBy.splice(user, 1);
          });
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
