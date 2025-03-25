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
          name: 'book',
          // to keep only as an example for later use of props = true feature of router:
          params: {
            book_id: book.bookKey, // passed always because also url param
          }
        }"
        class="font-bold block text-gray-600 tst-track-name"
      >
        {{ this.book.title }} |
        {{ this.book.author }}
        <span class="text-gray-500 text-sm">(Кол. дорожек: 234)</span>
      </router-link>
    </div>
  </li>
</template>

<script>
export default {
  name: "BookToPlay",
  props: {
    book: {
      type: Object,
      required: true
    }
  }
};
</script>
