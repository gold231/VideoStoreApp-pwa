import Vue from "vue";
import VueRouter from "vue-router";
import Credential from "../views/Credential.vue"
import Content from "../views/Content.vue"
import Home from "../views/Home.vue"
import Signup from "../views/Signup.vue"
import Suggestion from "../views/Suggestion.vue"

Vue.use(VueRouter);

export default new VueRouter({
  routes:  [
    {
      path: "",
      name: "Home",
      component: Home
    },
    {
      path: "/signin",
      name: "Credential",
      component: Credential
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
    {
      path: "/suggestion",
      name: "Suggestion",
      component: Suggestion
    },
    {
      path: "/content",
      name: "Content",
      component: function() {
        if (localStorage.getItem("username") == null ) {
          document.location = "";
        }
        return import("../views/Content.vue");
      }
    },
    {
      path: "/content/:folderid",
      name: "Content",
      component: function() {
        if (localStorage.getItem("username") == null ) {
          document.location = "";
        }
        return import("../views/Content.vue");
      }
    }
  ],
});
