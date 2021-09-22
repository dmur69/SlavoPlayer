<template>
  <div>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      />
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-3xl mb-5">
            "Вникай в себя и в учение; занимайся сим постоянно..." 1Тим.4,16
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
            suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
            pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{ $t("home.tracks") }}</span>
          <!-- Icon -->
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl" />
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <app-track-to-play
            v-for="track in userTracksList"
            :key="track.trackKey"
            :track="track"
          />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </div>
</template>

<script>
import TrackHandler from "@/handlerobj/track";
import { mapGetters } from "vuex";
import AppTrackToPlay from "../components/home/TrackToPlay.vue";

export default {
  name: "Home",
  components: {
    AppTrackToPlay
  },
  data() {
    return {
      userTracksList: [],
      maxTracksPerPage: 10
    };
  },
  computed: {
    ...mapGetters(["currentTrackCollection"])
  },
  methods: {
    // ///// Function called on certain scroll position to infinite scroll on tracks
    async getTracks(collectionName) {
      let tracksMetaArray = [];
      try {
        const trackHandler = new TrackHandler(); // Create just handler object
        if (this.userTracksList.length) {
          const { trackKey } =
            this.userTracksList[this.userTracksList.length - 1];
          console.log(trackKey);
          tracksMetaArray = await trackHandler.get(
            collectionName,
            this.maxTracksPerPage,
            trackKey
          ); // called with this 3 params gets next portion of tracks for infinite scroll
        } else {
          console.log("Home1");
          tracksMetaArray = await trackHandler.get(
            collectionName,
            this.maxTracksPerPage
          ); // called with only 2 params gets first portion of tracks for infinite scroll
          // ... starts from the beginning
          console.log("Home2");
        }
        console.log(tracksMetaArray);
        let i = 0;
        tracksMetaArray.forEach((trackMeta) => {
          const trackArrayItem = new TrackHandler({
            ...trackMeta
          }); // creates full objects (with helper functions) // ToDo: is it needed hier? Check!
          trackArrayItem.arrayId = i; // to TrackArrayItem object
          // ToDo: get rid of storing ArrayId in array itself

          this.addTrackToList(trackArrayItem);
          i += 1;
          console.log("trackArrayItem added.");
          console.log(trackArrayItem);
        });
      } catch (error) {
        console.log(
          `Error while quering tracks from database: ${error.message}`
        );
      }
    },
    // ///// Handler methods
    handleTrackListScroll() {
      // Destructure browser windows & documentElement objects
      // for tracking current scroll pos
      const { innerHeight } = window;
      const { scrollTop, offsetHeight } = document.documentElement;
      // bottomOfWindow indicates the need for getting new portion of tracks
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;
      if (bottomOfWindow) {
        console.log(
          "Bottom of page reached! Geting max number of tracks from firebase..."
        );
        this.getTracks(this.currentTrackCollection);
      }
    },
    // /////Helper methods
    addTrackToList(trackItemToAdd) {
      const trackListItem = trackItemToAdd;
      // ToDo: get rid of this sick logic
      // On call from Upload.vue - track was just added
      // we need to set arrayId
      if (trackListItem.arrayId === "track_added") {
        trackListItem.arrayId = this.userTracksList.length;
      }
      this.userTracksList.push(trackListItem);
    }
  },
  // ///// Global vue life cycle functions
  // Used for quering firebase for user track list
  async created() {
    this.getTracks(this.currentTrackCollection);
    window.addEventListener("scroll", this.handleTrackListScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleTrackListScroll);
  }
};
</script>
