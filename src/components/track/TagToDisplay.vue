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
      //   console.log(this.tag);
      // ToDo: später edit dialog für die Tags
      this.$emit("tag-select", this.tag);
    }
  }
};
</script>
