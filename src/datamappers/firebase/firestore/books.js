import AbstractkMapper from "./abstract";

class BookMapper {
  constructor() {
    console.log("Enetring BookMapper constructor");
    // this.collectionName = "books";
    // this.book = book;
    // this.abstactMapper = new AbstractkMapper(
    //   this.collectionName,
    //   this.book,
    //   this.tag.bookKey
    // );
    this.abstactMapper = new AbstractkMapper();
  }

  // // CRUD methods create = save
  // save() {
  //   this.abstactMapper.createDoc();
  // }

  // Get methods
  // return back entity objects, caller can deal with
  async get(params) {
    const books = await this.abstactMapper.getDocs(params);
    return books;
  }
}

export default BookMapper;
