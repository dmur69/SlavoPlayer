class BookmarkHandler {
  constructor(track, tag) {
    this.bookmarkKey = track.meta.trackKey + tag.tagKey;
    this.author = track.meta.author;
    ...
  }
}

export default BookmarkHandler;
