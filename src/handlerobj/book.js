// Audio book handler object
// No need at the moment to automate book creation
// => management directly over db
// => only get methods
import CollectionMapper from "@/datamappers/firebase/firestore/fsmapper";

class BookHandler {
  constructor() {
    console.log("Entering constructor in BookHandler");
    this.bookMapper = new CollectionMapper();
  }

  // to get all: do not set any params
  // to start from beginning: set only first param
  async get(params) {
    console.log("get() in BookHandler");
    const books = await this.bookMapper.get(params);
    return books;
  }
}

export default BookHandler;
