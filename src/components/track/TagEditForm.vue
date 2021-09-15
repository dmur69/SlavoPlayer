<template>
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Tag Edit form -->
        <span class="card-title"
          >Current tag: {{ this.currentTag.displayName }}</span
        >
        <!-- Close Button -->
        <div
          class="modal-close cursor-pointer z-50 float-right"
          @click.prevent="clickOnClose"
        >
          <i class="fas fa-times" />
        </div>
      </div>
      <div class="p-6">
        <textarea
          class="
            block
            w-full
            py-1.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none
            focus:border-black
            rounded
            mb-4
          "
          placeholder="Add your note to this tag here..."
        ></textarea>
        <button
          class="py-1.5 px-3 rounded text-white bg-green-600 block"
          @click.prevent="clickOnRemove"
        >
          Remove
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "TagEditForm",
  props: {
    currentTag: {
      type: Object, // Tag object
      required: true
    }
  },
  methods: {
    clickOnRemove() {
      console.log("clickOnRemove");
      this.$emit("tag-remove", this.currentTag);
    },
    clickOnClose() {
      console.log("clickOnClose");
      this.$emit("close-click");
    }
  },
  created() {
    console.log("created()");
    console.log(this.currentTag);
  }
};
</script>
