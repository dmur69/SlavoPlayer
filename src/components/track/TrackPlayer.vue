<template>
  <div class="flex justify-center">
    <!-- Buttons -->
    <div class="flex text-gray-300 text-3xl m-5 space-x-5">
      <!-- Play/Pause -->
      <button
        id="play-next"
        v-if="currentPlaylist.seek"
        type="button"
        @click.prevent="playPrevTrack"
      >
        <i class="fa fa-fast-backward" />
      </button>
      <!-- Back Button -->
      <button id="play-player" type="button" @click.prevent="togglePlaying">
        <i
          class="fa px-5"
          :class="{
            'fa-play': !trackIsPlaying,
            'fa-pause': trackIsPlaying
          }"
        />
      </button>
      <!-- Next Button -->
      <button
        id="play-next"
        v-if="currentPlaylist.seek"
        type="button"
        @click.prevent="playNextTrack"
      >
        <i class="fa fa-fast-forward" />
      </button>
    </div>
    <!-- Seek ticker for mobile-->
    <div class="md:hidden text-gray-300 font-bold text-xl pt-6">
      <span class="player-currenttime">{{ currentTrack.seek }}</span>
    </div>
  </div>
  <!-- Progress and duration -->
  <div class="md:flex text-xl justify-center">
    <!-- Seek ticker for desktop -->
    <div class="hidden md:block text-gray-300 pl-5">
      <span class="player-currenttime">{{ currentTrack.seek }}</span>
    </div>
    <!-- Progress bar -->
    <div class="w-full pt-3 pl-5 player-scrub">
      <!-- Progress: Container  -->
      <!--<<<< HIER we have to listen on Klick-events for track positioning   >>>>-->
      <span
        class="block w-full rounded bg-gray-500 relative cursor-pointer"
        @click.prevent="updateSeek"
      >
        <!-- Player Ball -->
        <span
          class="absolute top-neg-8 text-gray-300 text-lg"
          :style="{ left: currentTrack.seekPercentage }"
        >
          <i class="fas fa-circle" />
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: currentTrack.seekPercentage }"
        />
      </span>
    </div>
    <!-- Duration -->
    <div class="hidden md:block text-gray-300 px-3">
      <span class="player-duration">{{ currentTrack.duration }}</span>
    </div>
  </div>
  <!-- ToDo Idea: show some status info while playing -->
  <div class="text-lg text-center mt-3">
    <span v-if="currentTrack.sound.playing"> </span>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  name: "TrackPlayer",
  computed: {
    ...mapGetters(["trackIsPlaying"]),
    ...mapState(["currentTrack", "currentPlaylist"])
  },
  methods: {
    ...mapActions([
      "togglePlaying",
      "updateSeek",
      "playNextTrack",
      "playPrevTrack"
    ])
  }
};
</script>
