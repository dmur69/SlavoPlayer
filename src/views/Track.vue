<template>
  <div>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          id="play-main"
          type="button"
          class="
            z-50
            h-24
            w-24
            text-3xl
            bg-white
            text-black
            rounded-full
            focus:outline-none
          "
          @click.prevent="tryPlayNextTrack({ track, currentTag })"
        >
          <i
            class="fas"
            :class="{
              'fa-play': !myTrackIsPlaying,
              'fa-pause': myTrackIsPlaying
            }"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">
            {{ this.track.title }}
          </div>
          <div>{{ track.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Tag management area -->
    <app-track-tags :parentTrack="track" @update-track-tags="updateTrackTags" />
    <!-- Form for Comment can be used later for Notes-->
    <!-- Area below is still static mockup -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title"
            >Comments (15) / Area below is static mockup</span
          >
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <form>
            <textarea
              class="
                block
                w-full
                py-1.5
                px-3
                text-gray-800
                border border-gray-300
                transition
                duration-500
                focus:outline-none
                focus:border-black
                rounded
                mb-4
              "
              placeholder="Your comment here..."
            ></textarea>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Submit
            </button>
          </form>
          <!-- Sort Comments -->
          <select
            class="
              block
              mt-4
              py-1.5
              px-3
              text-gray-800
              border border-gray-300
              transition
              duration-500
              focus:outline-none
              focus:border-black
              rounded
            "
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments
    Fully skipped Comments handling with:
    Sorting on client side with sort()
    Save current Sort Order in Query Params
    -->
    <ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">Elaine Dreyfuss</div>
          <time>5 mins ago</time>
        </div>

        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium der doloremque laudantium.
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import TrackHandler from "@/handlerobj/track";
import { mapActions, mapState, mapGetters } from "vuex";
import AppTrackTags from "@/components/track/TrackTags.vue";

export default {
  name: "Track",
  data() {
    return {
      track: {},
      currentTag: {}
    };
  },
  components: { AppTrackTags },
  computed: {
    ...mapGetters(["trackIsPlaying", "currentTrackCollection"]),
    // ...mapGetters(["getCurrentPlayingtrackKey"]),
    // it's better to map entire object at once!
    ...mapState(["currentTrack"]),
    // Specific case: show play symbol to start next track
    // even if some other track is already running
    myTrackIsPlaying() {
      return (
        this.trackIsPlaying &&
        this.currentTrack.meta.trackKey === this.track.trackKey
      );
    }
  },
  methods: {
    // Play button on Track can be used for both
    // toggle playing (if user stays on the same track)
    // or start new track on change
    ...mapActions(["tryPlayNextTrack", "setStartPosition"]),
    updateTrackTags(newTag) {
      // Update UI
      this.track.tags.push(newTag);
      // Set as current tag
      this.currentTag = newTag;
      // Update in fsdb
      this.track.update(this.currentTrackCollection);
    }
  },
  async created() {
    try {
      // Handle route calls
      const trackHandler = new TrackHandler(); // with empty param just handler
      // get certain track on key
      this.track = await trackHandler.getOnKey(
        this.currentTrackCollection,
        this.$route.params.id
      ); // Getter methods always return full TrackHanlder objects: with meta and methods

      // Nothing found => redirect to home
      if (!this.track.trackKey) {
        console.log("Track not found!");
        this.$router.push({ name: "home" });
        return;
      }

      // Get tag from route
      const tagId = this.$route.params.tag_id;
      this.currentTag = this.track.tags
        ? this.track.tags.find((x) => x.tagKey === tagId)
        : {};

      // Nothing found => do nothing
      if (!this.currentTag) return;

      // open this tag and set start position
      // we cannot start playing on link-load because of browser restriction
      console.log(this.currentTag.displayName);
      // ToDo: toggle ManageTag UI
      this.setStartPosition({
        seek: this.currentTag.position,
        duration: this.track.length
      });
    } catch (error) {
      console.log(
        `Unexpected error during loading track... Error message: ${error.message}`
      );
    }
  }
};
</script>
