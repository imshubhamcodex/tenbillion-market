<template>
  <v-app>
    <v-card class="mx-auto" style="width:100%;">
      <v-card-title class="blue-grey white--text">
        <span class="title">NOTES</span>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          dark
          depressed
          @click="home()"
          style="margin-left:10px;"
        >
          Home
        </v-btn>
      </v-card-title>
    </v-card>

    <v-card id="create">
      <v-container fluid>
        <v-row class="child-flex">
          <v-col cols="12" sm="12" md="12">
            <v-subheader
              style="display:flex;flex-direction:row;justify-content:space-evenly;"
            >
              <v-btn fab dark small color="green" @click="editnote()">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn fab dark small color="indigo" @click="addnote()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn fab dark small color="red" @click="deletenote()">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-subheader>
            <br />
            <v-radio-group v-model="radioGroup">
              <v-row no-gutters>
                <v-col v-for="(note, n) in notes" :key="n">
                  <v-card class="pa-2" outlined tile>
                    <v-radio :value="n" @click="clickedBox(n)"></v-radio>
                    <div @click="openSheet(n)">
                      <note v-bind:noteData="note" />
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <template>
      <div class="text-center">
        <v-bottom-sheet v-model="sheet" persistent scrollable>
          <v-sheet class="text-center">
            <v-btn class="mt-6" text color="error" @click="closeSheet()">
              close
            </v-btn>
            <v-btn
              class="mt-6"
              text
              color="success"
              @click="upload()"
              :disabled="isDisable()"
            >
              Save
            </v-btn>
            <div class="py-3">
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="stock"
                  label="Stock info"
                  outlined
                  style="fontsize:20px;font-weight:bold;"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-textarea
                  v-model="mainbody"
                  label="Reason"
                  outlined
                  style="fontsize:15px;"
                ></v-textarea>
              </v-col>
              <template>
                <div
                  class="d-flex flex-column justify-space-between align-center"
                >
                  <v-slider
                    v-model="width"
                    class="align-self-stretch"
                    min="200"
                    max="800"
                    step="1"
                  ></v-slider>

                  <v-img
                    :aspect-ratio="16 / 9"
                    :width="width"
                    :src="imgURL"
                    @click="openImg()"
                  ></v-img>
                  <template>
                    <v-file-input
                      v-model="photo"
                      accept="image/png, image/jpeg, image/bmp"
                      show-size
                      label="Select Image"
                    ></v-file-input>
                  </template>
                </div>
              </template>
              <br />
              <br />
              <v-col cols="12" sm="6" md="12">
                <v-textarea
                  label="Anything else wanna add.."
                  outlined
                  v-model="backbody"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="author"
                  label="Author name"
                  outlined
                ></v-text-field>
              </v-col>
            </div>
          </v-sheet>
        </v-bottom-sheet>
      </div>
    </template>
  </v-app>
</template>

<script>
import note from "../../components/notesCard";
import { firebase } from "@firebase/app";
import "firebase/firestore";
export default {
  components: {
    note
  },
  data: () => ({
    radioGroup: 0,
    sheet: false,
    mainbody: "",
    backbody: "",
    author: "",
    notes: [],
    notesdocid: [],
    selected: 0,
    isEdit: false,
    editDocId: null,
    editDocTime: null,
    visitsheet: false,
    stock: "",
    width: 300,
    imgid: "",
    photo: null,
    imgURL: ""
  }),
  methods: {
    openImg() {
      window.open(this.imgURL);
    },
    closeSheet() {
      this.sheet = !this.sheet;
      this.isEdit = false;
      this.visitsheet = false;
    },
    home() {
      this.$router.push("/");
    },
    openSheet(n) {
      this.visitsheet = true;
      this.sheet = true;

      this.mainbody = this.notes[n].text;
      this.backbody = this.notes[n].moreinfo;
      this.author = this.notes[n].author;
      this.stock = this.notes[n].stockinfo.toUpperCase();

      firebase
        .storage()
        .ref()
        .child("imgStocks" + "/" + this.notes[n].imgid)
        .getDownloadURL()
        .then(url => {
          this.imgURL = url;
        });
    },
    clickedBox(n) {
      this.selected = n;
      this.visitsheet = false;
      this.imgid = this.notes[this.selected].imgid;
    },
    async deletenote() {
      console.log("deleted");
      this.visitsheet = false;
      await this.$fireStore
        .collection("notes")
        .doc(this.notesdocid[this.selected].id)
        .delete();
      // Deleting image
      await firebase
        .storage()
        .ref()
        .child("imgStocks" + "/" + this.notes[this.selected].imgid)
        .delete();

      location.reload();
    },
    addnote() {
      console.log("add");
      this.sheet = true;
      this.visitsheet = false;
      this.mainbody = "";
      this.backbody = "";
      this.author = "";
      this.stock = "";
    },
    editnote() {
      console.log("edit");
      this.isEdit = true;
      this.editDocId = this.notesdocid[this.selected].id;
      this.editDocTime = this.notes[this.selected].time;
      this.imgid = this.notes[this.selected].imgid;
      this.visitsheet = false;

      this.sheet = true;
      this.mainbody = this.notes[this.selected].text;
      this.backbody = this.notes[this.selected].moreinfo;
      this.author = this.notes[this.selected].author;
      this.stock = this.notes[this.selected].stockinfo;

      firebase
        .storage()
        .ref()
        .child("imgStocks" + "/" + this.notes[this.selected].imgid)
        .getDownloadURL()
        .then(url => {
          this.imgURL = url;
        });

      console.log(this.photo);
    },
    async upload() {
      this.sheet = false;

      if (this.isEdit == false) {
        if (this.photo == null) {
          alert("Select photo");
          return;
        }
        let photoName = Math.random()
          .toString(36)
          .substring(7);
        await this.$fireStore
          .collection("notes")
          .doc()
          .set({
            author: this.author,
            moreinfo: this.backbody,
            text: this.mainbody,
            time: firebase.firestore.Timestamp.fromDate(new Date()),
            stockinfo: this.stock,
            imgid: photoName
          });

        // image upload
        await firebase
          .storage()
          .ref()
          .child("imgStocks" + "/" + photoName)
          .put(this.photo)
          .then(() => {
            console.log("Uploaded  file!");
          })
          .catch(e => {
            console.log("Got Error in image upload" + e);
          });

        location.reload();
      } else {
        this.isEdit = false;
        await this.$fireStore
          .collection("notes")
          .doc(this.editDocId)
          .set({
            author: this.author,
            moreinfo: this.backbody,
            text: this.mainbody,
            time: this.editDocTime,
            stockinfo: this.stock,
            imgid: this.imgid
          });

        if (this.photo != null) {
          // image upload
          await firebase
            .storage()
            .ref()
            .child("imgStocks" + "/" + this.imgid)
            .put(this.photo)
            .then(() => {
              console.log("Uploaded  file!");
            })
            .catch(e => {
              console.log("Got Error in image upload" + e);
            });
        }

        location.reload();
      }
    },
    isDisable() {
      if (
        this.mainbody.length == 0 ||
        this.backbody.length == 0 ||
        this.author.length == 0
      ) {
        return true;
      } else if (this.visitsheet) {
        return true;
      } else {
        return false;
      }
    },
    async getNotes() {
      await this.$fireStore
        .collection("notes")
        .orderBy("time", "desc")
        .get()
        .then(res => {
          this.notesdocid = res.docs;
        });

      this.notesdocid.forEach(ele => {
        this.$fireStore
          .collection("notes")
          .doc(ele.id)
          .get()
          .then(res => {
            this.notes.push(res.data());
          });
      });
    }
  },
  async mounted() {
    this.getNotes();
  }
};
</script>
<style scoped>
/* This is for documentation purposes and will not be needed in your application */
#create .v-speed-dial {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}
.note {
  display: flex;
  flex-direction: row;
}
.v-sheet {
  overflow: auto;
}
</style>
