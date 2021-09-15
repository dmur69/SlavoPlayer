<template>
  <span
    class="
      w-full
      py-0.0
      px-3
      text-gray-800
      border border-gray-300
      transition
      duration-500
      focus:outline-none
      focus:border-black
      rounded
    "
    @click.prevent="clickOnTagHandler"
  >
    {{ this.tag.displayName }}</span
  >
</template>

<script>
export default {
  name: "TagToDisplay",
  props: {
    tag: {
      type: Object, // Tag object
      required: true
    }
  },
  methods: {
    clickOnTagHandler() {
      // console.log(this.tag);
      // Let parent do handling
      this.$emit("tag-click", this.tag);
    }
  }
};
</script>
