<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <!-- Track display form -->
    <div v-show="!showEditForm">
      <h4 class="inline-block text-1xl font-bold">
        {{ track.track_modified_name }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteTrack"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="
          ml-1
          py-1
          px-2
          text-sm
          rounded
          text-white
          bg-blue-600
          float-right
        "
        @click.prevent="showEditForm = !showEditForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <!-- Alert area -->
    <div
      class="text white text-center font-bold p-5 mb-4"
      v-if="track_show_alert"
      :class="track_alert_variant"
    >
      {{ track_alert_message }}
    </div>
    <!-- Track edit form -->
    <div v-show="showEditForm">
      <vee-form
        :validation-schema="valSchema"
        @submit="updateTrack"
        :initial-values="initialTrackData"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="track_modified_name"
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
            "
            placeholder="Enter Song Title"
            @input="this.$emit('unsaved-data', true)"
          />
          <ErrorMessage class="text-red-600" name="track_modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
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
            "
            placeholder="Enter Genre"
            @input="this.$emit('unsaved-data', true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="track_in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="track_in_submission"
          @click.prevent="
            showEditForm = false;
            track_show_alert = false;
          "
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { tracks, storage } from "@/datamappers/firebase/firebase";

export default {
  name: "Track",
  data() {
    return {
      showEditForm: false,
      valSchema: {
        track_modified_name: "required|max:100",
        genre: "alpha_spaces"
      },
      initialTrackData: {
        track_modified_name: this.track.track_modified_name,
        genre: this.track.genre
      },
      track_in_submission: false,
      track_show_alert: false,
      track_alert_variant: "bg-blue-50",
      track_alert_message: "Please wait! Processing track update..."
    };
  },
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  methods: {
    // vee-form pass down the values
    async updateTrack(values) {
      console.log("Track.vue: Updating track in firebase db");

      this.track_show_alert = true;
      this.track_in_submission = true;
      this.track_alert_variant = "bg-blue-50";
      this.track_alert_message = "Please wait! Processing registration...";

      try {
        await tracks.doc(this.track.trackKey).update(values);
      } catch (error) {
        this.track_in_submission = false;
        this.track_alert_variant = "bg-red-50";
        this.track_alert_message = `Unexpected error during update... Error message: ${error.message}`;
        console.log(error);
        return;
      }

      this.track_alert_variant = "bg-green-50";
      this.track_alert_message = "Track was updated!";
      setTimeout(() => {
        this.track_in_submission = false;
        const modifiedTrackMeta = {
          // arrayId: this.track.arrayId, // ToDo: has to redisigned, when we need Upload at all
          ...values
        };
        this.$emit("track-updated", modifiedTrackMeta);
        this.$emit("unsaved-data", false);
      }, 1000);
    },
    async deleteTrack() {
      console.log("Track.vue: Deleting track in firebase db");
      // 1: delete track in the storage first
      const fileStorageRoot = storage.ref(); // Root of our firebase storage
      // const trackFileStorageRoot = storage.ref("audio"); // Root/audio directory
      const trackFileRef = fileStorageRoot.child(
        `audio/${this.track.track_original_name}`
      ); // Root/audio/filename
      await trackFileRef.delete(); // ==>>> delete file

      // 2: then delete meta data of the track
      await tracks.doc(this.track.trackKey).delete();

      // 3: at least remove this track item from the list
      this.$emit("track-remove", this.track.trackKey);
    }
  }
};
</script>
