import AbstractkMapper from "./abstract";

class TagMapper {
  constructor(tag) {
    this.collectionName = "tags";
    this.tag = tag;
    this.abstactMapper = new AbstractkMapper(
      this.collectionName,
      this.tag,
      this.tag.tagKey
    );
  }

  // CRUD methods create = save
  save() {
    this.abstactMapper.createDoc();
  }

  // Get methods
  // return back entity objects, caller can deal with
  async get(numberOfDocs, startAfterKey) {
    const tags = await this.abstactMapper.getDocs(numberOfDocs, startAfterKey);
    return tags;
  }
}

export default TagMapper;
