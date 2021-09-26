import AbstractkMapper from "./abstract";

class TrackMapper {
  constructor(collection, track) {
    console.log("TrackManager constructor");
    console.log(track);
    // ToDo:
    // if(!collection) this.collectionName = bookKey else
    this.collectionName = collection;
    this.track = track;
    this.abstactMapper = new AbstractkMapper(
      collection,
      this.track,
      this.track ? this.track.trackKey : ""
    );
  }

  save() {
    console.log("TrackMapper: create.");
    this.abstactMapper.createDoc();
  }

  update() {
    console.log("TrackMapper: update.");
    this.abstactMapper.updateDoc();
  }

  // Get methods
  // return back entity objects, caller can deal with
  async get(numberOfDocs, startAfterKey) {
    console.log("get() from TrackMapper");
    console.log("TrackMapper1");
    const tracks = await this.abstactMapper.getDocs(
      numberOfDocs,
      startAfterKey
    );
    console.log("TrackMapper2");
    return tracks;
  }

  async getOnKey(key) {
    console.log("get() from TrackMapper");
    console.log("TrackMapper1");
    const track = await this.abstactMapper.getDoc(key);
    console.log("TrackMapper2");
    return track;
  }
}

export default TrackMapper;
