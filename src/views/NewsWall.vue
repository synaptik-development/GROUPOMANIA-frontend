<template>
  <!-- sidebar  -->
  <nav id="sidebar" class="sidebar">
    <img src="../assets/images/icon-left-font-monochrome-white.png" alt="logo groupomania" />

    <!-- profil connecté -->
    <div class="current-profile">
      <h3>MY PROFILE</h3>
      <strong>{{ currentUsername }}</strong>
      <span>{{ adminMessage }}</span>
      <div>
        <p>
          profile edited on <span>{{ currentUserCreatedAt }}</span>
        </p>
        <p>
          last modification on <span>{{ currentUserUpdatedAt }}</span>
        </p>
      </div>
    </div>
    <!-- fin profil connecté -->

    <!-- liens utiles (voir profil, ouvrir formulaire postMessage) -->
    <div class="action">
      <router-link to="/profile"><i title="edit my profile" class="fas fa-id-card-alt"></i></router-link>
      <i title="send a message" @click="openPostMessage()" class="fas fa-envelope-open-text"></i>
    </div>
    <!-- fin liens utiles  -->

    <!-- membres du réseau (liens pour voir le profil) -->
    <div class="members">
      <h3>MEMBERS</h3>
      <a
        :key="user"
        v-for="user in users"
        @click="
          getUser(user.id);
          openUserProfile();
        "
        >{{ user.username }}</a
      >
    </div>
    <!-- fin membres du réseau -->
  </nav>
  <!-- fin sidebar  -->

  <!-- boutons de contrôle de la sidebar  -->
  <div class="sidebar-control">
    <a><i class="far fa-window-close" id="close-nav" @click="closeNav()"></i></a>
    <a><i class="fa fa-bars" id="open-nav" @click="openNav" aria-hidden="true"></i></a>
  </div>
  <!-- fin boutons de contrôle -->

  <!-- mur d'actualités  -->
  <main class="news-wall">
    <h1>NEWS WALL</h1>

    <Messages />

    <!-- fenêtre profile de l'utilisateur sélectionné -->
    <div class="user-profil">
      <i class="far fa-window-close" id="close-nav" @click="closeUserProfile()"></i>
      <p>
        <strong>User n°{{ userId }}</strong>
      </p>
      <p>
        Username : <strong>{{ username }}</strong>
      </p>
      <p>
        Edited on : <strong>{{ createdAt }}</strong>
      </p>
      <p>
        Moderator profil : <strong>{{ admin }}</strong>
      </p>
      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <!-- liens utiles(réservé profils modérateurs) -->
      <div v-if="currentUserIsAdmin" class="management">
        <a
          @click="
            closeUserProfile();
            changeUserRights(userId);
          "
          >change rights</a
        >
        <a @click="deleteProfile(userId)">delete user</a>
      </div>
      <!-- fin liens utiles  -->
    </div>
    <!-- fin fenêtre profile de l'utilisateur sélectionné -->
  </main>
  <!-- fin mur d'actualités  -->
</template>

<script>
// imports
import Messages from "../components/Messages.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "NewsWall",

  components: { Messages },

  computed: {
    ...mapGetters(["users", "currentUserCreatedAt", "currentUserUpdatedAt", "createdAt", "adminMessage", "messages"]),

    ...mapState(["currentUsername", "currentUserIsAdmin", "userId", "username", "admin", "errorMessage"]),
  },

  mounted() {
    this.getAllUsers();
    this.getCurrentProfile();
    this.getAllMessages();
  },

  methods: {
    ...mapActions(["getAllUsers", "getUser", "changeUserRights", "deleteProfile", "getCurrentProfile", "getAllMessages"]),

    // ouvrir formulaire poster un message
    openPostMessage() {
      document.getElementById("post-message").style.display = "flex";
    },

    // ouvrir sidebar
    openNav() {
      document.getElementById("sidebar").style.transform = "translateX(0)";
      document.getElementById("open-nav").style.visibility = "hidden";
      document.getElementById("close-nav").style.visibility = "visible";
    },
    // fermer sidebar
    closeNav() {
      document.getElementById("sidebar").style.transform = "translateX(-300px)";
      document.getElementById("close-nav").style.visibility = "hidden";
      document.getElementById("open-nav").style.visibility = "visible";
    },

    // ouvrir fenêtre profil utilisateur
    openUserProfile() {
      document.querySelector(".user-profil").style.display = "flex";
    },

    // fermer fenêtre profil utilisateur
    closeUserProfile() {
      document.querySelector(".user-profil").style.display = "none";
    },
  },
};
</script>

<style lang="scss">
.sidebar {
  color: white;
  height: 100%;
  width: 300px;
  position: fixed;
  top: 70px;
  left: 0;
  background-color: #2c3e50;
  overflow: hidden;
  transition: 0.5s;
  padding-top: 3.75rem;
  transform: translateX(-300px);
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 2px #2c3e50;
  img {
    margin: 0.5rem;
    margin-bottom: 1rem;
  }
  a,
  i {
    color: white;
    text-decoration: none;
    &:hover {
      cursor: pointer;
      color: yellowgreen;
    }
  }
  .current-profile,
  .members {
    margin-right: 1rem;
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    h3 {
      font-size: 1.2rem;
      align-self: center;
    }
  }
  .current-profile {
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    padding-bottom: 1rem;
    p {
      font-size: 1rem;
    }
    span {
      color: gray;
    }
  }
  .action {
    display: flex;
    justify-content: space-around;
    margin: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid white;
  }
}

.sidebar-control {
  z-index: 1;
  i {
    position: fixed;
    top: 90px;
    left: 20px;
    display: block;
    &:hover {
      cursor: pointer;
    }
  }
  #close-nav {
    visibility: hidden;
    color: white;
  }
  #open-nav {
    color: #2c3e50;
  }
}

//---------------------------------
.news-wall {
  transition: margin-left 0.5s;
  padding: 1rem;
  width: calc(max-content + 0.5rem);
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 2rem;
  h1 {
    padding-top: 1rem;
    text-shadow: 1px 1px 2px #2c3e50;
  }
  .user-profil {
    position: fixed;
    top: 100px;
    width: 500px;
    padding: 1rem;
    box-shadow: 1px 1px 2px #2c3e50;
    border: 1px solid #2c3e50;
    background-color: white;
    color: black;
    display: none;
    flex-direction: column;
    align-items: center;
    i {
      color: black;
      align-self: flex-end;
      &:hover {
        color: orchid;
        cursor: pointer;
      }
    }
    .management {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 1rem;
      a {
        background-color: orchid;
        color: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
        &:hover {
          background-color: #fd2d01;
        }
      }
    }
  }
}
</style>
