<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i
        class="fas fa-upload float-right text-green-400 text-2xl"
        @click="savePlaylistFromJson"
      ></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="
          w-full
          px-10
          py-20
          rounded
          text-center
          cursor-pointer
          border border-dashed border-gray-400
          text-gray-400
          transition
          duration-500
          hover:text-white
          hover:bg-green-400
          hover:border-green-400 hover:border-solid
        "
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <!-- Interates for all members in uploads array -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>
          <i :class="upload.cancel_icon" @click="cancelAllUploads"> </i
          >{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
import azbyka from "@/fakedata/azbyka-tracks";
import trackImportSource from "@/fakedata/dobrotoljubie-tom-5.json";
// import trackImportSource from "@/fakedata/tomX???.json";
import TrackHandler from "@/handlerobj/track";
import { storage, auth, tracks } from "@/datamappers/firebase/firebase";

export default {
  name: "Upload",
  data() {
    return {
      destinationCollection: "philokalia",
      is_dragover: false,
      uploads: []
    };
  },
  methods: {
    // Manages audio file upload / called on event
    upload($event) {
      this.is_dragover = false;

      const filesToUpload = [...$event.dataTransfer.files]; // convert to array to use forEach

      // Process MULTIPLE files (but only audio with mpeg type)
      filesToUpload.forEach((file) => {
        if (file.type === "audio/mpeg") {
          // const storageRoot = storage.ref(); // Root of our firebase storage
          const trackFileStorageRoot = storage.ref("audio"); // Root/audio directory of our firebase storage
          const trackFileRef = trackFileStorageRoot.child(`${file.name}`); // Root/audio/filename
          const task = trackFileRef.put(file); // ==>>> uploads file

          // // // Progressbars handling
          // Create array to manage progressbars
          const fileArrayIndex =
            this.uploads.push({
              task,
              current_progress: 0,
              name: file.name,
              variant: "bg-blue-400",
              icon: "fas fa-spinner fa-spin",
              cancel_icon: "fas fa-window-close",
              text_class: ""
            }) - 1;

          // Setup event handler to calculate
          task.on(
            "state_changed",
            // Called from firebase to handle update
            (snap) => {
              // Update the current_progress property of current upload
              this.uploads[fileArrayIndex].current_progress =
                (snap.bytesTransferred / snap.totalBytes) * 100;
            },
            // Called on error
            (error) => {
              this.uploads[fileArrayIndex].variant = "bg-red-400";
              this.uploads[fileArrayIndex].icon = "fas fa-times";
              this.uploads[fileArrayIndex].text_class = "text-red-400";
              console.log(error);
            },
            // Called on success
            async () => {
              const track = {
                user_uid: auth.currentUser.uid,
                user_name: auth.currentUser.displayName,
                track_original_name: task.snapshot.ref.name,
                track_modified_name: task.snapshot.ref.name,
                genre: "",
                comment_count: 0
              };

              track.url = await task.snapshot.ref.getDownloadURL();
              const trackDocRef = await tracks.add(track); // add (id will be auto generated)
              console.log(
                `Upload.vue: Uploaded track to firebase: ${track.track_original_name}`
              );

              this.uploads[fileArrayIndex].variant = "bg-green-400";
              this.uploads[fileArrayIndex].icon = "fas fa-check";
              this.uploads[fileArrayIndex].text_class = "text-green-400";

              // Update the list in Manage.vue
              // trackListItem expects firebase document Snapshot not a Reference
              const trackDocSnapshot = await trackDocRef.get();

              // ///////////////////////////////////
              // Our TRACK or TrackList object ToDo: separate model
              const trackListItem = {
                // arrayId: "track_added", // ToDo: has to redisigned, when we need Upload at all
                trackKey: trackDocSnapshot.id,
                ...trackDocSnapshot.data()
              };
              this.$emit("track-add", trackListItem);
            }
          );
        }
      });
    },
    // Manages audio file upload / called on button click
    savePlaylistFakeData() {
      azbyka.defaultPlaylist().forEach((item) => {
        const trackHandler = new TrackHandler(item); // Create with track meta data
        trackHandler.save(this.destinationCollection); // Tries to save this track meta to db
        // TrackHandler has to know collection z.B "philokalia" save in
      });
    },
    savePlaylistFromJson() {
      trackImportSource.forEach((item) => {
        const trackHandler = new TrackHandler(item); // Create with track meta data
        trackHandler.save(this.destinationCollection); // Tries to save this track meta to db
        // TrackHandler has to know collection z.B "philokalia" save in
      });
    },
    cancelAllUploads() {
      // Iterates through all running uploads to cancel uploads
      this.uploads.forEach((upload) => {
        upload.task.cancel(); // task object contains cancel method
      });
    },
    // LifeCycle function from vue / called from vue life cycle management
    // Best place to cancel uploads, if user navigates away during upload
    beforeUnmount() {
      this.cancelAllUploads();
    }
  }
};
</script>
