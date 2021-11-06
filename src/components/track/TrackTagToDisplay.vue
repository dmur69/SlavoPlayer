<template>
  <div
    class="
      inline-block
      px-3
      mx-1
      mb-2
      text-gray-800
      bg-gray-200
      transition
      duration-500
      focus:outline-none focus:border-black
      rounded
      border
      cursor-pointer
    "
    title="Открыть закладку или тег для прослушивания и редактирования"
    :class="isCurrentTag ? 'border-yellow-400' : 'border-gray-300'"
    @click.prevent="clickOnTagHandler"
  >
    <i v-if="tag.isBookmarked" class="fas fa-star pr-1 text-yellow-300" />
    {{ this.tag.displayName }}
  </div>
</template>

<script>
export default {
  name: "TrackTagToDisplay",
  props: {
    tag: {
      type: Object, // Tag object
      required: true
    },
    isCurrentTag: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    clickOnTagHandler() {
      // console.log(this.tag);
      // Let parent do handling
      this.$emit("tag-click", this.tag);
    }
  },
  async created() {
    console.log("Tag to display created");
    console.log(this.isCurrentTag);
  }
};
</script>
