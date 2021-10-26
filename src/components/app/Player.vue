<template>
  <section class="fixed bottom-0 left-0 bg-white pb-4 align-top w-full h-30">
    <div class="relative">
      <!-- Buttons -->
      <div class="flex justify-center text-gray-500 text-3xl m-5">
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
      <div class="md:flex">
        <!-- Current Position -->
        <div class="text-gray-500 text-lg text-center md:pl-5">
          <span class="player-currenttime">{{ currentTrack.seek }}</span>
        </div>
        <!-- Progress and Meta -->
        <div class="w-full my-5 pl-5 player-scrub">
          <!-- Progress: Container  -->
          <!--<<<< HIER we have to listen on Klick-events for track positioning   >>>>-->
          <span
            class="block w-full rounded bg-gray-200 relative cursor-pointer"
            @click.prevent="updateSeek"
          >
            <!-- Player Ball -->
            <span
              class="absolute top-neg-8 text-gray-800 text-lg"
              :style="{ left: currentTrack.seekPercentage }"
            >
              <i class="fas fa-circle" />
            </span>
            <!-- Player Progress Bar-->
            <span
              class="
                block
                h-2
                rounded
                bg-gradient-to-r
                from-green-500
                to-green-400
              "
              :style="{ width: currentTrack.seekPercentage }"
            />
          </span>
        </div>
        <!-- Duration -->
        <div class="hidden md:block text-gray-500 text-lg px-3">
          <span class="player-duration">{{ currentTrack.duration }}</span>
        </div>
      </div>
      <div class="text-lg text-center">
        <span class="song-title">{{ currentTrack.meta.title }}</span>
        <span v-if="currentTrack.sound.playing"> | </span>
        <span class="song-artist">Глава {{ currentTrack.meta.chapter }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  name: "Player",
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
