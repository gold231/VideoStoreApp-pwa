<template>
  <b-card class="col-xl-5 login">
    <b-card-body>
      <form>
        <p class="h2 text-center py-4">Sign up</p>
        <div class="text-left">
          <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="person-fill"></b-icon>
            </b-input-group-prepend>
            <b-form-input type="text" :placeholder="'Username'" v-model="username" />
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
            />
          </b-input-group>
          <label class="mb-3 message">{{ validation.firstError("password") }}</label>
          <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="lock-fill"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              type="password"
              :placeholder="'Confirm Password'"
              v-model="confirm_password"
            >
            </b-form-input>
          </b-input-group>
          <label class="mb-3 message">{{ validation.firstError("confirm_password") }}</label>
          <p class="float-right signin">You have account already? <b-link href="#/signin"> Sign in</b-link></p>
        </div>        
        <div class="text-center py-4 mt-5">
          <b-button variant="success" @click="signupsubmit">Sign up</b-button>
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
      admit: 0,
      confirm_password: ""
    };
  },
  validators: {
    username: function(value) {
      return Validator.value(value)
        .required()
    },
    password: function(value) {
      return Validator.value(value).required();
    },
    "confirm_password, password": function(value, password) {     
        return Validator.value(value)
          .required()
          .match(password);
      }
  },
  components: {},
  mounted() {
    localStorage.setItem("location", "");
    this.init();
  },
  methods: {
    init() {
      this.username = "";
      this.password = "";
      this.confirm_password = "";
    },  
    signupsubmit() {
      let vm = this;
      this.$validate().then(function(success) {
        if (success) {
          let data = {
            username: vm.username,
            password: vm.password,
            admit: 0
          };
          users
            .orderByChild("username")
            .equalTo(vm.username)
            .once("value", snap => {
              if (snap.val() != null) {
                vm.$bvToast.toast("This username was used already", {
                  title: "Credential",
                  variant: "danger",
                  solid: true,
                  toaster: "b-toaster-top-right"
                });
              } else {
                users.push(data);                
                vm.$bvToast.toast("Registered successfully", {
                  title: "Credential",
                  variant: "success",
                  solid: true,
                  toaster: "b-toaster-top-right"
                });
                // localStorage.setItem("username", vm.fullname);
                localStorage.setItem("username", vm.username);
                vm.$router.push("/signin");           
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
.signin {
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