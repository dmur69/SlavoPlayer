// TrackHandler object
// CRUD und helper methods for working with  track objects
import TrackMapper from "@/datamappers/firebase/firestore/tracks";

class TrackHandler {
  constructor(tr) {
    console.log("Entering constructor");
    if (tr) {
      // See getMeta for details:
      this.trackKey = tr.trackKey;
      this.bookKey = tr.bookKey;
      this.bookTitle = tr.bookTitle;
      this.author = tr.author;
      this.subtitle = tr.subtitle;
      this.title = tr.title;
      this.initialTitle = tr.initialTitle;
      this.chapter = tr.chapter;
      this.nr = tr.nr;
      this.url = tr.url;
      this.length = tr.length;
      this.tags = tr.tags;
      this.searchKeywords = [];
    } else {
      this.trackKey = "";
      this.bookKey = "";
      this.bookTitle = "";
      this.author = "";
      this.subtitle = "";
      this.title = "";
      this.initialTitle = "";
      this.chapter = "";
      this.nr = 0;
      this.url = "";
      this.length = 0;
      this.tags = [];
      this.searchKeywords = [];

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
    }
    console.log("Track object created");
  }

  // Track's getMeta also returns Arrays directly
  getMeta() {
    return {
      trackKey: this.trackKey, // mp3 file name without file extention
      bookKey: this.bookKey, // e.g. "dobrotoljubie-tom-5";=>
      // web page file name without html extention
      bookTitle: this.bookTitle, // Z.B. Dobrotoljubie
      author: this.author, // parsed or manually set autor:book => n:1
      subtitle: this.subtitle, // Z.B. Tom 3
      title: this.title, // Parsed to pure title
      initialTitle: this.initialTitle, // full (unparsed) title containing Auhor and Chapter
      chapter: this.chapter, // chapter not always matches the title
      url: this.url, // url to mp3 file
      length: this.length, // parsed track length
      nr: this.nr, // Track order number in azbyka player
      tags: this.tags, // Array of Tags
      searchKeywords: this.searchKeywords // Array of Strings
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
