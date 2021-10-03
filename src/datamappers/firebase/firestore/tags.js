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
  async get(params) {
    const tags = await this.abstactMapper.getDocs(params);
    return tags;
  }
}

export default TagMapper;
