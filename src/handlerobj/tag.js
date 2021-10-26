// TagHandler object
// CRUD und helper methods for working with Tag objects
import TagMapper from "@/datamappers/firebase/firestore/tags";

class TagHandler {
  constructor(tag) {
    this.displayName = tag;
    this.tagKey = this.generateKeyFromTitle(tag);
    this.sysTag = true; // has to be explicetely unset if needed on the track level
    this.isBookmarked = true; // has to be explicetely unset if needed on the track level
    this.position = 0; // has to be explicetely set if needed on the track level
    this.tagMapper = new TagMapper(this.getMeta());
  }

  // DisplayName should be unique for any tag
  // eslint-disable-next-line class-methods-use-this
  generateKeyFromTitle(tag) {
    console.log("displayNameToKey");
    const key = String(tag);
    // .toUpperCase()
    // .replace(/\s/g, "");
    console.log(key);
    return key;
  }

  getMeta() {
    return {
      tagKey: this.tagKey,
      displayName: this.displayName,
      sysTag: this.sysTag,
      isBookmarked: this.isBookmarked,
      position: this.position
    };
  }

  // CRUD methods
  save() {
    this.tagMapper.save();
  }

  // Get methods
  // to get all: do not set any params
  // to start from beginning: set only first param
  async get(params) {
    const tags = await this.tagMapper.get(params);
    return tags;
  }
}

export default TagHandler;
