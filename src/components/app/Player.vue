<template>
  <div
    class="
      fixed
      bottom-0
      left-0
      bg-white
      p-5
      pb-4
      text-left
      align-top
      w-full
      h-20
    "
  >
    <div class="relative">
      <div class="flex">
        <button id="play-next" type="button" @click.prevent="playPrevTrack">
          <i class="fa text-gray-500 text-xl fa-arrow-left pr-2" />
        </button>
        <button id="play-next" type="button" @click.prevent="playNextTrack">
          <i class="fa text-gray-500 text-xl fa-arrow-right pl-2" />
        </button>
      </div>
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button id="play-player" type="button" @click.prevent="togglePlaying">
          <i
            class="fa text-gray-500 text-xl"
            :class="{
              'fa-play': !trackIsPlaying,
              'fa-pause': trackIsPlaying
            }"
          />
        </button>
      </div>
      <!-- Current Position -->
      <div
        class="
          float-left
          w-7
          h-7
          leading-3
          text-gray-400
          mt-0
          text-lg
          w-14
          ml-5
          mt-1
        "
      >
        <span class="player-currenttime">{{ currentTrack.seek }}</span>
      </div>
      <!-- Progress and Meta -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div
          class="
            absolute
            left-0
            right-0
            text-lg text-center
            mx-auto
            player-song-info
          "
        >
          <span class="song-title">{{ currentTrack.meta.title }}</span>
          <span v-if="currentTrack.sound.playing"> | </span>
          <span class="song-artist">Глава {{ currentTrack.meta.chapter }}</span>
        </div>
        <!-- Progress: Container  -->
        <!--<<<< HIER we have to listen on Klick-events for track positioning   >>>>-->
        <span
          class="
            block
            w-full
            h-2
            rounded
            m-1
            mt-2
            bg-gray-200
            relative
            cursor-pointer
          "
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
      <div
        class="
          float-left
          w-7
          h-7
          leading-3
          text-gray-400
          mt-0
          text-lg
          w-14
          ml-8
          mt-1
        "
      >
        <span class="player-duration">{{ currentTrack.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  name: "Player",
  computed: {
    ...mapGetters(["trackIsPlaying"]),
    ...mapState(["currentTrack"])
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
