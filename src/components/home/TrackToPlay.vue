/* eslint-disable vue/valid-v-for */
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
    <div class="text-gray-500 font-bold text-sm pr-3">
      <span v-for="tag in track.tags" :key="tag.tagKey">
        <router-link
          :to="{
            name: 'track_tag',
            params: {
              book_id: track.bookKey,
              track_id: track.trackKey,
              tag_id: tag.tagKey
            }
          }"
        >
          <i
            v-if="tag.isBookmarked"
            :title="tag.displayName"
            class="fas fa-star pr-1 text-yellow-300"
          />
        </router-link>
      </span>
      <span class="pr-1" title="Общее количество закладок">{{
        this.bookmarks.length
      }}</span
      >|<span class="pl-1" title="Общее количество тегов">{{
        this.track.tags.length
      }}</span>
    </div>
    <!-- Example to navigate to hash (certain place on webpage)
      <div class="text-gray-600 text-lg">
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
  },
  computed: {
    bookmarks() {
      return this.track.tags.filter((t) => t.isBookmarked === true);
    }
  }
};
</script>
