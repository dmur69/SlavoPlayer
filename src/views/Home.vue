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
        <!-- <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{ userTracksList[5].bookTitle }}</span>
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl" />
        </div> -->
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
      maxTracksPerPage: 30
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
        console.log(
          `this.userTracksList.length: ${this.userTracksList.length}`
        );
        if (this.userTracksList.length) {
          const { trackKey } =
            this.userTracksList[this.userTracksList.length - 1];
          console.log(trackKey);
          tracksMetaArray = await trackHandler.get({
            source: collectionName,
            numberOfItems: this.maxTracksPerPage,
            startAfterKey: trackKey,
            sortOnColumn: "trackKey"
          }); // called with this 3 params gets next portion of tracks for infinite scroll
        } else {
          console.log("Home1 - get first portion");
          tracksMetaArray = await trackHandler.get({
            source: collectionName,
            numberOfItems: this.maxTracksPerPage,
            sortOnColumn: "trackKey"
          }); // called with only 2 params gets first portion of tracks for infinite scroll
          // ... starts from the beginning
        }
        console.log(tracksMetaArray);
        tracksMetaArray.forEach((trackMeta) => {
          const trackArrayItem = new TrackHandler({
            ...trackMeta
          });
          this.userTracksList.push(trackArrayItem);
          console.log("trackArrayItem added.");
          // console.log(trackArrayItem);
        });
      } catch (error) {
        console.log(
          `Error while quering tracks from database: ${error.message}`
        );
      }
    },
    // ///// Handler methods
    handleTrackListScroll() {
      // console.log("Entering handleTrackListScroll...");
      // Destructure browser windows & documentElement objects
      // for tracking current scroll pos
      const { innerHeight } = window;
      const { scrollTop, offsetHeight } = document.documentElement;
      // bottomOfWindow indicates the need for getting new portion of tracks
      const left = Math.round(scrollTop) + innerHeight;
      const right = offsetHeight;
      console.log(`left: ${left} right: ${right}`);
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight > offsetHeight - 5; // ToDo: why - 1 now necessary?
      if (bottomOfWindow) {
        console.log(
          "Bottom of page reached! Geting max number of tracks from firebase..."
        );
        this.getTracks(this.currentTrackCollection);
      }
    }
  },
  // ///// Global vue life cycle functions
  // Used for quering database for user track list
  async created() {
    this.getTracks(this.currentTrackCollection);
    window.addEventListener("scroll", this.handleTrackListScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleTrackListScroll);
  }
};
</script>
