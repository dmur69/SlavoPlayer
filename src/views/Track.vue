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
          <div class="text-xl font-bold">
            {{ this.track.bookTitle }} | {{ this.track.subtitle }}
          </div>
          <div class="text-xl font-bold">
            {{ this.track.author }}
          </div>
          <div class="text-2xl font-bold">
            Глава {{ this.track.chapter }}: {{ this.track.title }}
          </div>
        </div>
      </div>
    </section>
    <!-- Tag management area -->
    <app-track-tags
      :parentTrack="track"
      @tag-click="this.showTagEditForm = true"
      @add-tag="addTag"
    />
    <app-tag-edit-form
      v-show="showTagEditForm"
      :currentTag="currentTag"
      @close-click="showTagEditForm = false"
      @tag-remove="removeTag"
      @tag-toggle-mode="handleTagModeChange"
    />
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
import TagHandler from "@/handlerobj/tag";
import { mapActions, mapState, mapGetters } from "vuex";
import AppTrackTags from "@/components/track/TrackTagListEdit.vue";
import AppTagEditForm from "@/components/track/TagSingleEdit.vue";

export default {
  name: "Track",
  data() {
    return {
      book: "",
      track: new TrackHandler(),
      currentTag: new TagHandler(),
      showTagEditForm: false
    };
  },
  components: { AppTrackTags, AppTagEditForm },
  computed: {
    ...mapGetters(["trackIsPlaying"]),
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
    addTag(newTag) {
      // Update UI
      this.track.tags.push(newTag);
      // Set as current tag
      this.currentTag = newTag;
      // Update in db
      this.track.update(this.book);
      // ToDo: create and save Bookmark
      // Author: TrackTitle (BookTitle, SubTitle, Chapter)
      // All new tags will be automatically bookmarked
    },
    async removeTag(tagToRemove) {
      console.log("removing Tag");
      console.log(tagToRemove);
      // Update UI
      const arrayId = this.track.tags.findIndex(
        (tag) => tag.tagKey === tagToRemove.tagKey
      );
      if (arrayId > -1) {
        this.track.tags.splice(arrayId, 1);
      }
      // ToDo: if tagToRemove.isBookmarked => remove Bookmark
      // TagBookmarkKey (also id in DB) will be trackKey+Tagkey => simple to find
      // ToDo: user can also remove tag bookmark without removing tag

      // Update in db
      await this.track.update(this.book);
      // Redirect to track page without tag ui after successful update
      this.$router.push({
        name: "track",
        params: { book_id: this.book, track_id: this.track.trackKey }
      });
    },
    handleTagModeChange() {
      console.log("// ToDo: add and remove Bookmark objects");
      // console.log(this.currentTag);
      this.currentTag.isBookmarked = !this.currentTag.isBookmarked;

      // Update in db
      this.track.update(this.book);
    }
  },
  async created() {
    try {
      // Handle route calls
      const trackHandler = new TrackHandler(); // with empty param just handler
      // get certain track on key
      const foundTrack = await trackHandler.getOnKey(
        this.$route.params.book_id,
        this.$route.params.track_id
      ); // Getter methods always return full TrackHanlder objects: with meta and methods

      // Nothing found => redirect to home
      if (!foundTrack.trackKey) {
        console.log("Track not found!");
        this.$router.push({ name: "home" });
        return;
      }

      // Set currentTrack and book
      this.track = foundTrack;
      this.book = this.$route.params.book_id;

      // Get tag from route and search in TrackTags on it
      const foundTag = this.track.tags
        ? this.track.tags.find((x) => x.tagKey === this.$route.params.tag_id)
        : {};

      // Nothing found => do nothing
      if (!foundTag) return;

      // Set current tag
      this.currentTag = foundTag;
      console.log("// Set current tag");
      console.log(this.currentTag.tagKey);
      this.showTagEditForm = true;

      // open this tag and set start position
      // we cannot start playing on link-load because of browser restriction
      this.setStartPosition({
        seek: this.currentTag.position,
        duration: this.track.length
      });
    } catch (error) {
      console.log(
        `Unexpected error during loading track... Error message: ${error.message}`
      );
      this.$router.push({ name: "home" });
    }
  }
};
</script>
