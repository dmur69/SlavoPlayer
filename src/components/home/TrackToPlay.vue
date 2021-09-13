<template>
  <li
    class="
      flex
      justify-between
      items-center
      p-3
      pl-6
      cursor-pointer
      transition
      duration-300
      hover:bg-gray-50
    "
  >
    <div>
      <router-link
        :to="{ name: 'track', params: { id: track.trackKey } }"
        class="font-bold block text-gray-600 tst-track-name"
      >
        {{ this.track.title }}
      </router-link>
      <router-link
        :to="{
          name: 'track_tag_link',
          params: { id: track.trackKey, tag_id: tag.tagKey }
        }"
        class="font-bold block text-gray-600 tst-track-name"
      >
        <span class="text-gray-500 text-sm">{{ this.track.length }}</span>
      </router-link>
    </div>
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
    </div>
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
    tag: {
      type: Object,
      required: true
    }
  }
};
</script>
