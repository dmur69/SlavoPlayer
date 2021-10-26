<template>
  <div>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-cover introduction-bg"
        style="background-image: url(assets/img/song-header.png)"
      />
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-3xl mb-5">
            "Вникай в себя и в учение; занимайся сим постоянно..." 1.Тим.4,16
          </h1>
          <p class="w-full mx-auto px-2">
            Здесь Вы найдёте избранные аудио книги с замечательного
            православного ресурса azbyka.ru с расширенными возможностями поиска
            и структурирования душеполезной информации с помощью индивидуальных
            тематических тегов и закладок (ссылок на определённые места в аудио
            дорожке).
          </p>
          <a href="https://azbyka.ru/kak-pomoch?"
            >Cкажем спасибо сайту azbyka.ru!</a
          >
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <!-- <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{ userTracksList[5].bookTitle }}</span>
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl" />
        </div> -->
        <ol id="booklist">
          <app-book-to-play
            v-for="book in booksArray"
            :key="book.bookKey"
            :book="book"
          />
        </ol>
      </div>
    </section>
  </div>
</template>

<script>
import BookHandler from "@/handlerobj/book";
// import { mapGetters } from "vuex";
import AppBookToPlay from "../components/home/BookToPlay.vue";

export default {
  name: "Home",
  components: {
    AppBookToPlay
  },
  data() {
    return {
      booksArray: []
    };
  },
  // ///// Global vue life cycle functions
  // Used for quering database for user book list
  async created() {
    let booksMetaArray = [];
    try {
      const bookHandler = new BookHandler(); // Create just handler object
      console.log("Home1 - get books");
      booksMetaArray = await bookHandler.get({
        source: "books",
        sortOnColumn: "title"
      }); // called with only 2 params gets first portion of tracks for infinite scroll
      // ... starts from the beginning
      console.log(booksMetaArray);
      booksMetaArray.forEach((bookMeta) => {
        this.booksArray.push(bookMeta);
        console.log("bookArrayItem added.");
        // console.log(bookMeta);
      });
    } catch (error) {
      console.log(`Error while quering tracks from database: ${error.message}`);
    }
  }
};
</script>
