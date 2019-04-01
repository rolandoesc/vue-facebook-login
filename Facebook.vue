<template>
  <div class="facebook-login">
    <button @click="buttonClicked">
      <template v-if="!isConnected">
        <i class="fab fa-facebook-square" style="margin-right: 10px; font-size: 1.2rem"></i>
      </template>
      {{getButtonText}}
    </button>
  </div>
</template>

<script>
// Helpers
import { loadFbSdk, getFbLoginStatus, fbLogout, fbLogin } from "./helpers.js";

// Resources

export default {
  name: "facebook-login",
  props: {
    appId: {
      type: String,
      required: true
    },
    version: {
      type: String,
      default: "v2.9"
    },
    locale: {
      type: String,
      default: "en_US"
    },
    logoutLabel: {
      type: String,
      default: "Log out from Facebook"
    },
    loginLabel: {
      type: String,
      default: "Log in to Facebook"
    },
    loginOptions: {
      type: Object,
      default: function() {
        return {
          scope: "email"
        };
      }
    },
    unableLogout: {
      type: Boolean,
      default: false
    },
    isUpperCase: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isConnected: false
    };
  },
  mounted() {
    loadFbSdk(this.appId, this.version)
      .then(getFbLoginStatus)
      .then(response => {
        if (!this.unableLogout) {
          if (response.status === "connected") {
            this.isConnected = true;
          }
        }
      });
  },
  computed: {
    getButtonText() {
      switch (this.isConnected) {
        case true:
          return this.isUpperCase
            ? this.logoutLabel.toUpperCase()
            : this.logoutLabel;

        case false:
          return this.isUpperCase
            ? this.loginLabel.toUpperCase()
            : this.loginLabel;
        default:
          return "this is default";
      }
    }
  },
  methods: {
    buttonClicked() {
      this.$emit("click");
      if (this.isConnected) {
        this.logout();
      } else {
        this.login();
      }
    },
    login() {
      fbLogin(this.loginOptions).then(response => {
        if (response.status === "connected") {
          this.isConnected = true;
        } else {
          this.isConnected = false;
        }
        this.$emit("login", {
          response,
          FB: window.FB
        });
      });
    },
    logout() {
      fbLogout().then(response => {
        this.isConnected = false;
        this.$emit("logout", response);
      });
    }
  }
};
</script>

<style scoped>
.facebook-login {
  box-sizing: border-box;
}

.facebook-login * {
  box-sizing: inherit;
}

.facebook-login button {
  border: none;
  color: #fff;
  position: relative;
  line-height: 34px;
  /* background-color: #4267b2; */
}

.facebook-login .spinner {
  left: 5px;
  width: 30px;
  height: 90%;
  display: block;
  border-radius: 50%;
  position: absolute;
  border: 5px solid #f3f3f3;
  border-top-color: #3498db;
  animation: facebook-login-spin 2s linear infinite;
}

.facebook-login img {
  position: absolute;
  top: 3px;
  left: 10px;
  width: 30px;
}

@keyframes facebook-login-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
