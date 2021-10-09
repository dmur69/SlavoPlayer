<template>
  <!-- Track info area -->
  <div
    class="
      mx-auto
      bg-white
      shadow-md
      overflow-hidden
      bg-cover
      md:bg-contain
      music-bg
      text-white
      container
      items-center
    "
    style="background-image: url(/assets/img/song-header.png)"
  >
    <div class="md:flex">
      <div class="p-4 md:py-8 md:w-48 text-center relative">
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
          @click.prevent="tryPlaySelectedTrack({ track, currentTag })"
        >
          <i
            class="fas"
            :class="{
              'fa-play': !myTrackIsPlaying,
              'fa-pause': myTrackIsPlaying
            }"
          ></i>
        </button>
      </div>
      <div class="m-4 md:my-8 md:flex">
        <div class="z-50 text-left ml-4 text-lg">
          <!-- Song Info -->
          <div class="md:text-xl md:font-bold">
            {{ this.track.bookTitle }} | {{ this.track.subtitle }}
          </div>
          <div class="md:text-xl md:font-bold">
            {{ this.track.author }}
          </div>
          <div class="md:text-2xl font-bold">
            Глава {{ this.track.chapter }}: {{ this.track.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
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
  <!-- Expample: Card with defined width -->
  <!-- <div
      class="
        max-w-md
        mx-auto
        bg-white
        rounded-xl
        shadow-md
        overflow-hidden
        md:max-w-2xl
      "
    > -->
  <!-- Example: Pic and Text full with -->
  <!-- <div class="mx-auto bg-white shadow-md overflow-hidden">
      <div class="md:flex">
        <div class="md:flex-shrink-0">
          <img
            class="h-48 w-full object-cover md:h-full md:w-48"
            src="/assets/img/song-header.png"
            alt="Man looking at item at a store"
          />
        </div>
        <div class="p-8">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
      </div>
    </div> -->
  <!-- Example: Text and Text 50% 50% -->
  <!-- <div class="mx-auto bg-white shadow-md overflow-hidden">
      <div class="md:flex">
        <div class="p-8">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
        <div class="p-8">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
      </div>
    </div> -->
  <!-- Example: Text and Text mit Begrenzung der linken Spalte ab md -->
  <!-- <div class="mx-auto bg-white shadow-md overflow-hidden">
      <div class="md:flex">
        <div class="p-8 md:w-48">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
        <div class="p-8">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
      </div>
    </div> -->
  <!-- Example: Text and Text mit Begrenzung der linken Spalte ab md -->
  <!-- Form for Comment can be used later for Notes-->
  <!-- Area below is still static mockup -->
  <!-- <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
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
    </section> -->
  <!-- Comments
    Fully skipped Comments handling with:
    Sorting on client side with sort()
    Save current Sort Order in Query Params
    -->
  <!-- <ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200">
        <div class="mb-5">
          <div class="font-bold">Elaine Dreyfuss</div>
          <time>5 mins ago</time>
        </div>

        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium der doloremque laudantium.
        </p>
      </li>
    </ul> -->
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
    ...mapActions(["tryPlaySelectedTrack", "setStartPosition"]),
    addTag(newTag) {
      // Update UI
      this.track.tags.push(newTag);
      // Set as current tag
      this.currentTag = newTag;
      // Update in db
      this.track.update();
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
      await this.track.update();
      // Redirect to track page without tag ui after successful update
      this.$router.push({
        name: "track",
        params: { book_id: this.track.bookKey, track_id: this.track.trackKey }
      });
    },
    handleTagModeChange() {
      console.log("// ToDo: add and remove Bookmark objects");
      // console.log(this.currentTag);
      this.currentTag.isBookmarked = !this.currentTag.isBookmarked;

      // Update in db
      this.track.update();
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

      // Set currentTrack
      this.track = foundTrack;

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
