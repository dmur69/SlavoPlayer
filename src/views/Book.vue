<template>
  <div>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-cover introduction-bg"
        style="background-image: url(/assets/img/song-header.png)"
      />
      <div class="container mx-auto">
        <div class="z-50 text-left ml-8">
          <!-- Book Info -->
          <div class="text-3xl md:text-5xl font-bold">
            Добротолюбие в переводе св. Феофана Затворника
          </div>
        </div>
      </div>
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
import { mapActions } from "vuex";
import TrackHandler from "@/handlerobj/track";
import AppTrackToPlay from "../components/home/TrackToPlay.vue";

export default {
  name: "Book",
  components: {
    AppTrackToPlay
  },
  props: [
    "book_id" // passt always from url
  ],
  data() {
    return {
      currentBook: "philokalia", // used as default book
      userTracksList: [],
      maxTracksPerPage: 40
    };
  },
  methods: {
    ...mapActions(["updatePlaylist"]),
    // ///// Function called on certain scroll position to infinite scroll on tracks
    async getTracks(collectionName) {
      let tracksMetaArray = [];
      try {
        const trackHandler = new TrackHandler(); // Create just handler object
        // console.log(
        //   `this.userTracksList.length: ${this.userTracksList.length}`
        // );
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
          console.log("Book1 - get first portion");
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
          // console.log("trackArrayItem added.");
          // console.log(trackArrayItem);
        });
      } catch (error) {
        console.log(
          `Error while quering tracks from database: ${error.message}`
        );
      }
      // Call action from state object
      this.updatePlaylist({
        meta: this.currentBook,
        trackArray: this.userTracksList
      });
      return tracksMetaArray.length;
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
        this.getTracks(this.currentBook);
      }
    }
  },
  // ///// Global vue life cycle functions
  // Used for quering database for user track list
  async created() {
    let count = 0;
    const currentBook = this.$route.params.book_id; // from Url
    // We try tom load with collection from url param
    if (currentBook) {
      // console.log("Try to load from collection1");
      count = await this.getTracks(currentBook);
    }
    console.log("Understand pros = true router feature");
    console.log(currentBook);
    console.log(this.book_id); // this.book_id = this.$route.params.book_id always!
    // If it fails, we load our default collection
    if (count < 1) {
      this.getTracks(currentBook);
    } else {
      // Chage only after validation
      this.currentBook = currentBook;
    }
    console.log(this.currentBook);
    window.addEventListener("scroll", this.handleTrackListScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleTrackListScroll);
  }
};
</script>
