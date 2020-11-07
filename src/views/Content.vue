<template>
    <div>
      <div>
        <div class="col-md-10 m-auto pt-5 position-relative">
          <div class="overflow-auto text-left">
            <img
              src="../assets/folder_up.png"
              width="50px"
              @click="folderup"
              class="float-left m-4 upperimg"
            />
            <b-spinner
              variant="success"
              label="Spinning"
              v-if="spinning == true"
              class="mt-4"
            ></b-spinner>
            <b-button v-if="flag==false" class="float-right actbtn" @click="flag=true">Action</b-button>
            <b-button v-if="flag==true" variant="danger" class="float-right actbtn" @click="flag=false">Action</b-button>
            <input
              type="text"
              placeholder="Search"
              id="search"
              class="float-right form-control"
              v-model = "searchkey"
              @keyup = "searchdata"
            />
          </div>
          <div id="demo"  @click="openMenu($event)">
            <div v-for="(folder, key) in foldersArr" :key="key" :value="folder">
              <div
                :id="folder.folderkey"
                class="folder m-4"
                @click="openfolder(folder.folderkey)"
              >
                <img :title="folder.foldername" class="folderimg" src="../assets/folder.png" width="120" height="120">
                <p class="pname foldername">{{folder.foldername}}</p>
              </div>
            </div>
            <div v-for="(file, key) in filesArr" :key="'A'+key" :value="file">
              <div v-if="flag==false" class="file m-4">
                <a :id="file.filekey" :href="file.fileurl" target="blank" class="filelink">
                  <img :title="file.filename" v-if="ext.indexOf(file.filename.split('.')[1].toLowerCase()) == -1" class="fileimg" src="../assets/video.png" width="120" height="120">
                  <img :title="file.filename" v-else :class="'fileimg@'+file.filename.split('.')[1]" src="../assets/image.png" width="120" height="120">
                  <p :class="'pname filename@'+file.filename.split('.')[1]">{{file.filename}}</p>
                </a>
              </div>
              <div v-else class="file m-4">
                <a :id="file.filekey" href="#" class="filelink">
                  <img :title="file.filename" v-if="ext.indexOf(file.filename.split('.')[1].toLowerCase()) == -1" class="fileimg" src="../assets/video.png" width="120" height="120">
                  <img :title="file.filename" v-else :class="'fileimg@'+file.filename.split('.')[1]" src="../assets/image.png" width="120" height="120">
                  <p :class="'pname filename@'+file.filename.split('.')[1]">{{file.filename}}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <ul
          id="right-click-menu"
          tabindex="-1"
          v-if="viewMenu"
          class="m-0 p-0 position-absolute"
          v-bind:style="{ top:top, left:left }"
        >
          <li
            v-show="removefolderkey == '' && removefilekey == ''"
            @click="opennewfolder"
          >New Folder</li>
          <li
            v-show="removefolderkey == '' && removefilekey == ''"
            class="position-relative"
          >
            <input
              class="position-relative"
              type="file"
              accept="image/*, video/*"
              @change="uploadFile"
              @click="closeMenu" />
            <span class="position-absolute upload" >Upload File</span>
          </li>
          <li
            @click="opennewfolder"
            v-show="removefolderkey != ''"
          >Rename Folder</li>
          <li
            v-show="removefolderkey != ''"
            @click="removefolder"
          >Remove Folder</li>
          <li
            @click="opennewfile"
            v-show="removefilekey != ''"
          >Rename File</li>
          <li
            v-show="removefilekey != ''"
            @click="removefile"
          >Remove File</li>
          <li @click="openuser">User</li>
        </ul>
      </div>
      <b-modal id="newfolder" title="New Folder">
        <form v-on:submit.prevent>
            <b-input-group class="mt-4">
            <label class="mr-2">Folder Name:</label>
            <b-form-input type="text" v-model="newfoldername" />
            </b-input-group>
        </form>
        <template class="text-right">
            <b-button
              variant="primary"
              @click="$bvModal.hide('newfolder')"
              class="float-right mt-2"
            >
            Close
            </b-button>
            <b-button
              variant="success"
              @click="savefolder"
              class="float-right mr-2 mt-2"
              v-if="newfoldername != ''"
            >
            Save
            </b-button>
        </template>
      </b-modal>
      <b-modal id="newfile" title="Rename File">
        <form v-on:submit.prevent>
          <b-input-group class="mt-4">
           <label class="mr-2">File Name:</label>
           <b-form-input type="text" v-model="newfilename" />
          </b-input-group>
        </form>
        <template class="text-right">
          <b-button
            variant="primary"
            @click="$bvModal.hide('newfile')"
            class="float-right mt-2"
          >
          Close
          </b-button>
          <b-button
            variant="success"
            @click="savefile"
            class="float-right mr-2 mt-2"
            v-if="newfilename != ''"
          >
          Save
          </b-button>
        </template>
      </b-modal>
      <b-modal id="newuser" title="Create User">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">UserName</th>
              <th scope="col">Password</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, key) in usersArr" :key="key" :value="user">
              <td>{{ user.username }}</td>
              <td>{{ user.password }}</td>
              <td>
                <img v-if="user.admit==0" src="../assets/delete.png" width="30" @click="admitUser(user.userkey, user.admit)" />
                <img v-else src="../assets/add.png" width="30" @click="admitUser(user.userkey, user.admit)" />
              </td>
            </tr>
          </tbody>
        </table>
        <template class="text-right">
          <b-button
            variant="primary"
            @click="$bvModal.hide('newuser')"
            class="float-right mt-2"
          >
          Close
          </b-button>
        </template>
      </b-modal>
    </div>
</template>

<script>
import Vue from "vue";
import firebase from "firebase";
import { videofolders, videos, users } from "../firebase";

import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);


export default {
    name: "Content",
    data() {
        return {
          param: "",
          viewMenu: false,
          top: "0px",
          left: "0px",
          foldersArr: [],
          filesArr: [],
          folder: "",
          newfoldername: "",
          newfilename: "",
          removefolderkey: "",
          removefilekey: "",
          spinning: false,
          fileext: "",
          ext: ["png","jpg","jpeg","bmp","gif","tif","tiff","eps","raw","cr2","nef","orf","sr2"],
          usersArr: [],
          username: "",
          userpassword: "",
          admit: 0,
          searchkey: "",
          flag: false
        }
    },
    components: {},
    mounted() {
       this.param = (this.$route.params.folderid != undefined) ? this.$route.params.folderid : "";
       this.deployFolder();
       this.deployFile();
       this.deployUser();
    },
    methods: {
      searchdata() {
        if (this.searchkey != "") {
          let vm = this;
          videos.once("value", snap => {
              vm.filesArr = [];
              let value = snap.val();
                for (let key in value) {
                  if (value[key]["filename"].toLowerCase().indexOf(vm.searchkey.toLowerCase()) != -1) {
                    vm.filesArr.push({
                      filekey: key,
                      filename: value[key]["filename"],
                      fileurl: value[key]["fileurl"]
                    });
                  }
                }
              })
          videofolders.once("value", snap => {
            vm.foldersArr = [];
            let value = snap.val();
            for (let key in value) {
              if (value[key]["foldername"].toLowerCase().indexOf(vm.searchkey.toLowerCase()) != -1) {
                vm.foldersArr.push({
                  folderkey: key,
                  foldername: value[key]["foldername"]
                })
              }
            }
          })
        } else {
          this.deployFolder();
          this.deployFile();
        }
      },
      setMenu(top, left) {
        this.top = top + "px";
        this.left = left + "px";
      },
      closeMenu() {
        this.viewMenu = false;
      },
      openMenu(e) {
        if (this.flag == true) {
          this.removefolderkey = "";
          this.removefilekey = "";
          this.fileext = "";
          if (e.target.className.indexOf("folder") != -1) {
            this.removefolderkey = e.target.parentElement.id;
          } else if (e.target.className.indexOf("file") != -1) {
            this.fileext = e.target.className.split("@")[1];
            this.removefilekey = e.target.parentElement.id;
          }
          this.viewMenu = true;
          this.setMenu(e.y, e.x);
          e.preventDefault();
        } else {
          this.closeMenu();
        }
      },
      openuser() {
        this.closeMenu();
        this.$bvModal.show("newuser");
      },
      saveuser() {
        let data = {
          username: this.username,
          password: this.userpassword,
          admit: this.admit
        };
        users.push(data);
        this.username = "";
        this.userpassword = "";
        this.admit = 0;
        this.deployUser();
      },
      deployUser() {
        let vm=this;
        users.once("value", snap => {
          vm.usersArr = [];
          let value = snap.val();
            for (let key in value) {
              vm.usersArr.push({
                userkey: key,
                username: value[key]["username"],
                password: value[key]["password"],
                admit: value[key]["admit"]
              });
            }
          })
      },
      admitUser(userkey, admit) {   
        let updateadmit = (admit==1) ? 0 : 1;     
        let data={
          admit: updateadmit
        };
        users.child(userkey).update(data);
        this.deployUser();
      },
      deployFile() {
        let vm = this;
        videos
          .orderByChild("foldername")
          .equalTo(`${vm.param}`)
          .once("value", snap => {
            vm.filesArr = [];
            let value = snap.val();
              for (let key in value) {
                vm.filesArr.push({
                  filekey: key,
                  filename: value[key]["filename"],
                  fileurl: value[key]["fileurl"]
                });
              }
            })
      },
      uploadFile(event) {
        var vm = this;
        this.spinning = true;
        const file = event.target.files[0];
        const storageRef = firebase
          .storage()
          .ref(`file/${file.name}`)
          .put(file);
        storageRef.on(
          `state_changed`,
          snapshot => {
            this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          error => {
            console.log(error.message);
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then(url => {
              vm.spinning = false;
              let data = {
                foldername: vm.param,
                filename: file.name,
                fileurl: url
              };
              videos.push(data);
              vm.deployFile()
            });
          }
        );
      },
      opennewfile() {
        this.closeMenu();
        this.$bvModal.show("newfile");
      },
      savefile() {
        let vm = this;
        let data = {
          filename: this.newfilename + "." + this.fileext
        };
        videos.child(vm.removefilekey).update(data);
        vm.deployFolder();
        vm.deployFile();
        vm.newfilename = "";
        this.$bvModal.hide("newfile");
      },
      removefile() {
        let vm = this;
        this.closeMenu();
        this.$confirm("Are you sure to delete this file?").then(() => {
          vm.spinning = true;
          videos
            .orderByKey()
            .equalTo(vm.removefilekey)
            .once("value", snap => {
              let value = snap.val();
              for (let key in value) {
                firebase.storage().refFromURL(value[key]["fileurl"]).delete()
                  .then(function() {
                    console.log("deleted");
                    vm.spinning = false;
                    videos.child(vm.removefilekey).remove();
                    vm.deployFolder();
                    vm.deployFile();
                  })
                  .catch(function(error){
                    console.log(error);
                  });
              }
            })
        });
      },
      deployFolder() {
        let vm = this;
        videofolders
          .orderByChild("upperfolder")
          .equalTo(`${vm.param}`)
          .once("value", snap => {
            vm.foldersArr = [];
            let value = snap.val();
            for (let key in value) {
              vm.foldersArr.push({
                folderkey: key,
                foldername: value[key]["foldername"]
              })
            }
          })
      },
      opennewfolder() {
        this.closeMenu();
        this.$bvModal.show("newfolder");
      },
      openfolder(folderkey) {
        if (this.flag == false) {
          this.param = folderkey;
          const path = `/content/${folderkey}`;
          this.deployFolder();
          this.deployFile();
          this.searchkey = "";
          if (this.$route.path !== path) this.$router.push(path);
        }
      },
      folderup() {
        this.param = "";
        let vm = this;
        videofolders
          .orderByChild("upperfolder")
          .equalTo(`${vm.param}`)
          .once("value", snap => {
            let value = snap.val();
            for (let key in value) {
               vm.param = value[key]["upperfolder"];
            }
          });
        const path = `/content/${vm.param}`;
        this.deployFolder();
        this.deployFile();
        if (this.$route.path !== path) this.$router.push(path);
      },
      savefolder() {
        let vm = this;
        let data = {
          upperfolder: this.param,
          foldername: this.newfoldername
        };
        if (this.removefolderkey == "") {
          videofolders
            .orderByChild("upperfolder")
            .equalTo(vm.param)
            .once("value", snap => {
              if (snap.val() != null) {
                videofolders
                  .orderByChild("foldername")
                  .equalTo(vm.newfoldername)
                  .once("value", snap1 => {
                    if (snap1.val() == null) {
                      videofolders.push(data);
                      vm.deployFolder();
                      vm.deployFile();
                      vm.newfoldername = "";
                    } else {
                      vm.$bvToast.toast("The folder name exists already", {
                        title: "Warning",
                        variant: "danger",
                        solid: true,
                        toaster: "b-toaster-top-right"
                      });
                    }
                  })
              } else {
               videofolders.push(data);
               vm.deployFolder();
               vm.deployFile();
               vm.newfoldername = "";
              }
            })
        } else {
           videofolders.child(vm.removefolderkey).update(data);
           vm.deployFolder();
           vm.deployFile();
           vm.newfoldername = "";
        }
        this.$bvModal.hide("newfolder");
      },
      removefolder() {
        this.closeMenu();
        let vm = this;
        this.$confirm("Are you sure to delete this folder?").then(() => {
          videofolders.child(vm.removefolderkey).remove();
          videos
            .orderByChild("foldername")
            .equalTo(vm.removefolderkey)
            .once("value", snap => {
              let value = snap.val();
              for (let key in value) {
                firebase.storage().refFromURL(value[key]["fileurl"]).delete()
                  .then(function() {
                    console.log("deleted");
                    vm.spinning = false;
                    videos.child(key).remove();
                  })
                  .catch(function(error){
                    console.log(error);
                  });
              }
            })
          vm.deployFolder();
          vm.deployFile();
        });
      }
    }
}
</script>
<style lang="scss" scoped>
a {
  color: #2c3e50;
}
#search {
  width: 130px;
  position: relative;
  top: 30px;
}
#demo {
    width: 100%;
    height: 100vh;
}
#right-click-menu{
    background: #FAFAFA;
    border: 1px solid #BDBDBD;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 150px;
    z-index: 999999;
}

#right-click-menu li {
    border-bottom: 1px solid #E0E0E0;
    margin: 0;
    padding: 5px 0;
}

#right-click-menu li:last-child {
    border-bottom: none;
}

#right-click-menu li:hover {
    background: #1E88E5;
    color: #FAFAFA;
}
#right-click-menu {
  input {
    opacity: 0;
    z-index: 10;
    width: 100%;
  }
}
.upperimg {
    &:hover {
        cursor: pointer;
    }
}
.upload {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-top: 6px;
    z-index: 2;
}
.folder {
  float: left;
  width: 116px;
  &:hover {
    cursor: pointer;
  }
}
.file {
  float: left;
  width: 116px;
  &:hover {
    cursor: pointer;
  }
}
.actbtn {
  position: relative;
  top: 30px;
  margin-left: 20px;
}
.pname {
  display: block;
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
