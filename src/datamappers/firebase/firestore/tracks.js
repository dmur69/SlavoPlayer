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
  async get(params) {
    console.log("get() from TrackMapper");
    console.log(params);
    const tracks = await this.abstactMapper.getDocs(params);
    return tracks;
  }

  async getOnKey(key) {
    console.log("get() from TrackMapper");
    const track = await this.abstactMapper.getDoc(key);
    return track;
  }
}

export default TrackMapper;
