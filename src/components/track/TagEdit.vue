<!-- Name convention: TagEdit not TrackTag...
because it can be seen as DIRECT sub component of Track.vue | for Tag entity -->
<template>
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 border-b border-gray-200">
        <!-- Tag Edit form -->
        <span class="card-title"
          >Выбранный тег:
          <span class="font-bold">{{ this.currentTag.displayName }}</span>
        </span>
        <!-- Close Button -->
        <div
          class="modal-close cursor-pointer z-50 float-right"
          @click.prevent="clickOnClose"
          title="Закрыть форму редактироавния"
        >
          <i class="fas fa-times" />
        </div>
        <div class="cursor-pointer pt-3" @click.prevent="clickOnToggleMode">
          <!-- Tag/Bookmark mode switch -->
          <i
            v-if="currentTag.isBookmarked"
            class="fas fa-star pr-2 text-yellow-300"
          />
          <span
            class="card-title"
            title="Нажмите сюда для выбора режима работы: обычрый тег или закладка"
          >
            Режим работы (переключить):
            <span class="font-bold" v-if="currentTag.isBookmarked"
              >Закладка</span
            >
            <span class="font-bold" v-else>Обычный тег</span>
          </span>
        </div>
      </div>
      <div class="p-6">
        <textarea
          rows="3"
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
          placeholder="В режиме работы 'Закладка' тег запоминает актульную позицию звуковой дорожки
и отображается в Вашем центральном списке закладок. Нажмите на символ чтобы удалить эту
дополнительную информацию."
        ></textarea>
        <button
          class="py-1.5 px-3 rounded text-white bg-red-400 block"
          @click.prevent="clickOnRemoveTag"
        >
          Удалить тег
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "TagEdit",
  props: {
    currentTag: {
      type: Object, // Tag object
      required: true
    }
  },
  methods: {
    clickOnRemoveTag() {
      console.log("clickOnRemoveTag");
      this.$emit("tag-remove", this.currentTag);
    },
    clickOnToggleMode() {
      console.log("clickOnToggleMode");
      this.$emit("tag-toggle-mode");
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
