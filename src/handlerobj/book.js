// Audio book handler object
// No need at the moment to automate book creation
// => management directly over db
// => only get methods
import BookMapper from "@/datamappers/firebase/firestore/books";

class BookHandler {
  constructor() {
    console.log("Entering book constructor");
    // if (book) {
    //   // See getMeta for details:
    //   this.bookKey = book.bookKey; // set the same with collection (db table in common case) name
    //   this.title = book.bookTitle;
    //   this.author = book.author;
    // } else {
    //   this.bookKey = "";
    //   this.bookTitle = "";
    //   this.author = "";
    // }
    this.bookMapper = new BookMapper();
  }

  // Track's getMeta also returns Arrays directly
  //   getMeta() {
  //     return {
  //       bookKey: this.bookKey, // set the same with collection (db table in common case) name
  //       bookTitle: this.bookTitle, // Z.B. Dobrotoljubie
  //       author: this.author // parsed or manually set autor:book => n:1
  //     };
  //   }

  // CRUD methods
  //   save() {
  //     this.tagMapper.save();
  //   }

  // Get methods
  // to get all: do not set any params
  // to start from beginning: set only first param
  async get(params) {
    const books = await this.bookMapper.get(params);
    return books;
  }
}

export default BookHandler;
