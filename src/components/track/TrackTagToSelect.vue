<!-- Name convention: TrackTag... because it's sub component from TrackTagsList.vue -->
<template>
  <a href="#" @click.prevent="clickOnTagHandler">{{ this.tag.displayName }}</a>
</template>

<script>
export default {
  name: "TrackTagToSelect",
  props: {
    tag: {
      type: Object, // Tag object
      required: true
    }
  },
  methods: {
    clickOnTagHandler() {
      console.log("clickOnTagHandler()");
      console.log(this.tag);
      this.$emit("tag-add", this.tag);
    }
  }
};
</script>
