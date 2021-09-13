// TrackHandler object
// CRUD und helper methods for working with  track objects
import TrackMapper from "@/datamappers/firebase/firestore/tracks";

class TrackHandler {
  constructor(tr) {
    console.log("Entering constructor");
    if (tr) {
      this.trackKey = tr.trackKey;
      this.nr = tr.nr;
      this.title = tr.title;
      this.url = tr.url;
      this.length = tr.length;
      this.tags = tr.tags;
      this.searchKeywords = []; // ToDo:
      this.bookKey = tr.bookKey;
    } else {
      this.trackKey = "";
      this.nr = 0;
      this.title = "No title jet";
      this.url = "";
      this.length = 0;
      this.tags = []; // Array of Tags
      this.searchKeywords = []; // Array of Stings
      // ToDo: implement update on adding removing tags
      // Perfect to use with fbdb functions:
      // const col = firestore.collection('carts');
      // const query = col.where('items', 'array-contains', 'fruit loops')
      // const query = col.where('items', 'array-contains-any', ['fruit loops', 'nuts'])
      // use also!!!
      // const arrayRemove = firebase.firestore.FieldValue.arrayRemove; // remove
      // const arrayRemove = firebase.firestore.FieldValue.arrayUnion; // add
      // const doc = firestore.doc('carts/abc');
      // doc.update({
      //     items: arrayRemove('chex')
      // });
      // doc.update({
      //   items: arrayUnion('coco puffs')
      // });
      this.bookKey = "";
    }
    console.log("Track object created");
  }

  // Track's getMeta also returns Arrays directly
  getMeta() {
    return {
      trackKey: this.trackKey,
      nr: this.nr,
      title: this.title,
      url: this.url,
      length: this.length,
      tags: this.tags,
      searchKeywords: this.searchKeywords,
      bookKey: this.bookKey
    };
  }

  // Creates new Track
  save(destination) {
    const trackMapper = new TrackMapper(destination, this.getMeta());
    trackMapper.save();
  }

  // Updates existing Track
  update(destination) {
    const trackMapper = new TrackMapper(destination, this.getMeta());
    // if (propsToUpdate) {
    //   trackMapper.update(propsToUpdate);
    // } else {
    trackMapper.update();
    // }
  }

  // Get methods
  // to get all: set only source param
  // to start from beginning: set also numberOfTracks param
  // eslint-disable-next-line class-methods-use-this
  async get(source, numberOfTracks, startAfterKey) {
    console.log("get() from Track");
    const trackMapper = new TrackMapper(source);
    console.log("Track1");
    const tracksMeta = await trackMapper.get(numberOfTracks, startAfterKey);
    const tracksArray = [];
    tracksMeta.forEach(trackMeta => {
      tracksArray.push(new TrackHandler(trackMeta));
    });
    console.log("Track2");
    return tracksArray;
  }

  // eslint-disable-next-line class-methods-use-this
  async getOnKey(source, key) {
    console.log("getOnKey() from Track");
    const trackMapper = new TrackMapper(source);
    console.log("Track1");
    const trackMeta = await trackMapper.getOnKey(key);
    console.log("Track2");
    return new TrackHandler(trackMeta);
  }
}

export default TrackHandler;
