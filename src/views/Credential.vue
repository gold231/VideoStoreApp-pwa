<template>
  <b-card class="col-xl-5 login">
    <b-card-body>
      <form>
        <p class="h2 text-center py-4">Sign in</p>
        <div class="text-left">
          <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="person-fill"></b-icon>
            </b-input-group-prepend>
            <b-form-input type="text" :placeholder="'UserName'" v-model="username">
            </b-form-input>
          </b-input-group>
          <label class="mb-3 message">{{ validation.firstError("username") }}</label>
          <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="lock-fill"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              type="password"
              :placeholder="'Password'"
              v-model="password"
            >
            </b-form-input>
          </b-input-group>
          <label class="mb-3 message">{{ validation.firstError("password") }}</label>
        </div>
        <div class="float-right">
          <b-link class="signup" href="#/signup">Create Account</b-link>
        </div>
        <div class="text-center py-4 mt-3">
          <b-button variant="success" @click="signinsubmit">Sign in</b-button>
        </div>
      </form>
    </b-card-body>
  </b-card>
</template>

<script>
import Vue from "vue";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
Vue.use(SimpleVueValidation);

import firebase from "firebase";
import { users } from "../firebase";

export default {
  name: "Credential",
  data() {
    return {
      username: "",
      password: "",
      admit: 0
    };
  },
  validators: {
    username: function(value) {
      return Validator.value(value)
        .required();
    },
    password: function(value) {
      return Validator.value(value).required();
    }
  },
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.username = "";
      this.password = "";
      this.admit = 0;
    },
    signinsubmit() {
      let vm = this;
      this.$validate().then(function(success) {
        if (success) {
          users
            .orderByChild("username")
            .equalTo(vm.username)
            .on("value", snap => {
              if (snap.val() == null && vm.username != "admin") {
                vm.$bvToast.toast("Username or Password is incorrect!", {
                  title: "Credential",
                  variant: "danger",
                  solid: true,
                  toaster: "b-toaster-top-right"
                });
                vm.init();
              } else {
                users
                  .orderByChild("password")
                  .equalTo(vm.password)
                  .on("value", snap => {
                    if (snap.val() == null && vm.password != "admin") {
                      vm.$bvToast.toast("Email or Password is incorrect!", {
                        title: "Credential",
                        variant: "danger",
                        solid: true,
                        toaster: "b-toaster-top-right"
                      });
                      vm.init();
                    } else {
                      if (vm.username == "admin") {
                        localStorage.setItem("username", vm.username);
                        vm.$router.push("/suggestion");
                      } else {
                        let admit;              
                        for (let key in snap.val()) {
                                          admit = snap.val()[key].admit;
                                        }
                        if (admit == 0) {
                          vm.$bvToast.toast("You are not alllowed!", {
                            title: "Credential",
                            variant: "danger",
                            solid: true,
                            toaster: "b-toaster-top-right"
                          });
                          vm.init();
                        } else {
                          localStorage.setItem("username", vm.username);
                          vm.$router.push("/suggestion");
                        }
                      }
                    }
                  });
              }
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  border: none !important;
}
.login {
  margin: auto;
  margin-top: 40px;
  background-color: rgba(255, 255, 255, 0.8) !important;
}
span.term {
  color: #007bff;
}
.termlink {
  text-decoration: underline;
}
button {
  padding: 10px 40px !important;
}
.fas {
  color: #9c27b0;
}
.input-group-text .b-icon.bi {
  color: #9c27b0;
}
.error,
.error:focus {
  border-color: #f66;
}
.message {
  color: #f66;
  display: block;
  text-align: left;
  margin-left: 40px;
}

$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669f2;

.google-btn {
  width: 184px;
  height: 42px;
  background-color: $google-blue;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
  margin: auto;
  margin-top: 40px;
  .google-icon-wrapper {
    position: absolute;
    margin-top: 1px;
    margin-left: 1px;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    background-color: $white;
  }
  .google-icon {
    position: absolute;
    margin-top: 11px;
    margin-left: -10px;
    width: 18px;
    height: 18px;
  }
  .btn-text {
    float: right;
    margin: 11px 11px 0 0;
    color: $white;
    font-size: 14px;
    letter-spacing: 0.2px;
    font-family: "Roboto";
  }
  &:hover {
    box-shadow: 0 0 6px $google-blue;
    cursor: pointer;
  }
  &:active {
    background: $button-active-blue;
  }
}
.signup {
  font-size: 12px;
}

@media (max-width: 767px) {
  .login {
    width: 90% !important;
  }
}
@media (min-width: 767px) and (max-width: 1200px) {
  .login {
    width: 80% !important;
  }
}
</style>
