<template>
  <li
    class="
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
    <!-- Track info with link to track -->
    <router-link
      :to="{
        name: 'track',
        params: { book_id: track.bookKey, track_id: track.trackKey }
      }"
      class="font-bold block text-gray-600 tst-track-name"
    >
      <div class="md:flex">
        <div class="md:w-5/12 px-1">
          Глава {{ this.track.chapter }}: {{ title }}
        </div>
        <div class="md:w-4/12 px-1">
          {{ this.track.author }}
        </div>
        <div></div>

        <!-- Statistic area -->
        <div class="text-gray-400 pr-3 md:w-3/12 md:text-right">
          <span v-for="tag in track.tags" :key="tag.tagKey">
            <!-- Stars as link to tag -->
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
                class="fas fa-star pr-1 text-yellow-300 text-2xl"
              />
            </router-link>
          </span>
          <span v-if="anyTags" class="px-1" title="Общее количество закладок">{{
            this.bookmarks.length
          }}</span>
          <span v-if="anyTags">|</span>
          <span v-if="anyTags" class="px-1" title="Общее количество тегов">{{
            this.track.tags.length
          }}</span>
          <span class="bg-gray-400 text-white px-1 rounded-md text-center">
            {{ this.track.length }}
          </span>
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
      </div>
    </router-link>
  </li>
</template>

<script>
import helper from "@/includes/helper";

export default {
  name: "TrackToPlay",
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  computed: {
    bookmarks() {
      return this.track.tags.filter((t) => t.isBookmarked === true);
    },
    anyTags() {
      return this.track.tags.length > 0;
    },
    title() {
      return helper.stringLimiter(this.track.title, 55);
    }
  }
};
</script>
