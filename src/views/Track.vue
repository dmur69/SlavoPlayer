<template>
  <!-- Track info area -->
  <section
    class="
      mx-auto
      bg-white
      shadow-md
      overflow-hidden
      bg-cover
      md:bg-contain
      music-bg
      text-gray-300
      container
      items-center
    "
    style="background-image: url(/assets/img/song-header.png)"
  >
    <div class="lg:flex">
      <!-- Player -->
      <div class="p-4 md:py-8 text-center lg:w-1/2">
        <app-track-player @change-track="handleChangeTrack" />
      </div>
      <!-- Song Info -->
      <div class="m-4 md:my-8 lg:w-1/2">
        <div class="z-50 text-left ml-4 text-lg">
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
  </section>
  <!-- Tag management area -->
  <app-track-tags-list
    :parentTrack="track"
    @tag-click="this.showTagEditForm = true"
    @add-tag="addTag"
  />
  <app-tag-edit
    v-show="showTagEditForm"
    :currentTag="currentTag"
    @close-click="showTagEditForm = false"
    @tag-remove="removeTag"
    @tag-toggle-mode="handleTagModeChange"
  />
  <!-- BlockUI while getting track data -->
  <div v-if="trackIsLoading" class="sp-block-ui"></div>
</template>

<script>
import TrackHandler from "@/handlerobj/track";
import TagHandler from "@/handlerobj/tag";
import { mapActions, mapGetters } from "vuex";
import AppTrackTagsList from "@/components/track/TrackTagsList.vue";
// eslint-disable-next-line import/no-unresolved
import AppTagEdit from "@/components/track/TagEdit.vue";
import AppTrackPlayer from "@/components/track/TrackPlayer.vue";

export default {
  name: "Track",
  data() {
    return {
      track: new TrackHandler(),
      currentTag: new TagHandler(),
      showTagEditForm: false
    };
  },
  components: { AppTrackTagsList, AppTagEdit, AppTrackPlayer },
  computed: {
    ...mapGetters(["trackIsPlaying", "trackIsLoading"]),
    fullTitle() {
      return `${this.track.bookTitle} | ${this.track.subtitle} | Глава ${this.track.chapter}: ${this.track.title}`;
    }
  },
  methods: {
    ...mapActions(["changeTrack", "togglePlaying", "stopCurrentTrack"]),
    addTag(newTag) {
      this.track.tags.push(newTag); // Update UI
      this.currentTag = newTag; // Set as current tag
      this.track.update(); // Update in db
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

      await this.track.update(); // Update in db
      // Redirect to track page without tag UI after successful update
      this.$router.push({
        name: "track",
        params: { book_id: this.track.bookKey, track_id: this.track.trackKey }
      });
    },
    handleChangeTrack(newTrack) {
      this.track = newTrack;
      console.log(`newTrack in Track.vue handleChangeTrack:${newTrack}`);
      document.title = this.fullTitle;
      // Redirect to track page without tag UI after successful update
      this.$router.push({
        name: "track",
        params: { book_id: this.track.bookKey, track_id: this.track.trackKey }
      });
    },
    async handleTagModeChange() {
      console.log("// ToDo: add and remove Bookmark objects");
      this.currentTag.isBookmarked = !this.currentTag.isBookmarked;

      // Reset start track position
      console.log("Reset start track position");
      if (this.currentTag.isBookmarked) {
        this.changeTrack({
          track: this.track,
          currentTag: this.currentTag
        });
      } else {
        this.stopCurrentTrack();
      }

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
      document.title = this.fullTitle;

      // Get tag from route and search in TrackTags on it
      const foundTag = this.track.tags
        ? this.track.tags.find((x) => x.tagKey === this.$route.params.tag_id)
        : {};

      // Nothing found => do nothing
      if (!foundTag) {
        this.changeTrack({ track: this.track });
        return;
      }

      // Set current tag
      this.currentTag = foundTag;
      console.log("// Set current tag");
      console.log(this.currentTag.tagKey);
      this.showTagEditForm = true;

      // open this tag and set start position
      // we cannot start playing on link-load because of browser restriction
      // User interaction is needed
      this.changeTrack({
        track: this.track,
        currentTag: this.currentTag
      });
    } catch (error) {
      console.log(
        `Unexpected error during loading track... Error message: ${error.message}`
      );
      this.$router.push({ name: "home" });
    }
  },
  mounted() {
    // this.fullTitle;
  }
};
</script>
