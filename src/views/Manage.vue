<template>
  <div>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <app-file-upload @track-add="addTrackToList" />
        </div>
        <div class="col-span-2">
          <div
            class="
              bg-white
              rounded
              border border-gray-200
              relative
              flex flex-col
            "
          >
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">My Songs</span>
              <i
                class="fa fa-compact-disc float-right text-green-400 text-2xl"
              ></i>
            </div>
            <div class="p-6">
              <!-- Track list Items -->
              <!-- Solution 1 (Luis) for passing data child -> parent (via prop)
               :updateTrackInList="updateTrackInList" -->
              <div v-for="track in userTracksList" :key="track.trackKey">
                <!-- Alternative solution 2 (DM) for passing data child -> parent
                listening for customn event defined in child -->
                <app-track-to-manage
                  :track="track"
                  @track-updated="updateTrackInList"
                  @track-remove="removeTrackFromList"
                  @unsaved-data="updateUnsavedDataFlag"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import store from "@/store";
import AppFileUpload from "../components/manage/Upload.vue";
import AppTrackToManage from "../components/manage/TrackToManage.vue";
import { auth, tracks } from "../datamappers/firebase/firebase";

export default {
  name: "Manage",
  components: {
    AppFileUpload,
    AppTrackToManage
  },
  data() {
    return {
      userTracksList: [],
      unsavedDataFlag: false
    };
  },
  methods: {
    // 3 methods (custom event handler) to work with the list of tracks
    addTrackToList(trackItemToAdd) {
      const trackListItem = trackItemToAdd;
      // On call from Upload.vue - track was just added
      // we need to set arrayId
      // if (trackListItem.arrayId === "track_added") {
      //   trackListItem.arrayId = this.userTracksList.length;
      // }
      console.log(trackItemToAdd);
      this.userTracksList.push(trackListItem);
    },
    updateTrackInList(valuesToUpdate) {
      this.userTracksList[valuesToUpdate.arrayId].track_modified_name =
        valuesToUpdate.track_modified_name;
      this.userTracksList[valuesToUpdate.arrayId].genre = valuesToUpdate.genre;
    },
    removeTrackFromList(trackToRemoveId) {
      const arrayId = this.userTracksList.findIndex(
        (x) => x.trackKey === trackToRemoveId
      );
      this.userTracksList.splice(arrayId, 1); // array function to remove n elements
    },
    // Used for avoiding lost of data in the B
    updateUnsavedDataFlag(newValue) {
      this.unsavedDataFlag = newValue;
    }
  },
  // Global vue-router function
  // vue-router =  module imported & run in main.js / app.use(router);
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter Guard / defined in component vue");
    next();
  },
  // Logic to avoid the lost of data
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedDataFlag) {
      next(); // Allow to navigate if data saved or not changed
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leaveConfirmed = confirm(
        "Sie haben noch nicht gespeichert! Seite trotzdem verlassen?"
      );
      next(leaveConfirmed);
    }
  },
  // Global vue cycle function
  // Used for quering firebase for user track list
  async created() {
    console.log("Entering >created< lifecycle function in Manage");
    console.log("...quering firebase for user track list");

    // Query snapshot/array of track documents from firebase
    const tracksDocSnapshots = await tracks
      .where("user_uid", "==", auth.currentUser.uid)
      .get();

    // let i = 0;
    tracksDocSnapshots.forEach((trackDocSnapshot) => {
      // ///////////////////////////////////
      // Our TRACK or TrackList object
      const trackListItem = {
        // arrayId: i,
        ...trackDocSnapshot.data()
      };
      this.addTrackToList(trackListItem);
      // i += 1;
    });
  }
};
</script>
