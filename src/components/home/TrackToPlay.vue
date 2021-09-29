<template>
  <li
    class="
      flex
      justify-between
      items-center
      p-2
      pl-6
      cursor-pointer
      transition
      duration-300
      hover:bg-gray-50
    "
  >
    <div>
      <router-link
        :to="{
          name: 'track',
          params: { book_id: book, track_id: track.trackKey }
        }"
        class="font-bold block text-gray-600 tst-track-name"
      >
        Глава {{ this.track.chapter }}: {{ this.track.title }} |
        {{ this.track.author }}
        <span class="text-gray-500 text-sm"
          >({{ this.track.length }} | {{ this.track.nr }})</span
        >
      </router-link>
    </div>
    <!-- <div class="text-gray-600 text-lg">
      <router-link
        custom
        :to="{
          name: 'track',
          params: { id: track.trackKey },
          hash: '#comments'
        }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600" />
          {{ this.track.comment_count }}
        </span>
      </router-link>
    </div> -->
  </li>
</template>

<script>
export default {
  name: "TrackToPlay",
  props: {
    track: {
      type: Object,
      required: true
    },
    book: {
      type: String,
      required: true
    }
  }
};
</script>
