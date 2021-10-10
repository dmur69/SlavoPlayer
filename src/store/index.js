/* eslint-disable indent */
// eslint-disable-next-line object-curly-newline
import { createStore } from "vuex";
import { Howl } from "howler";
import helper from "@/includes/helper";
import auth from "./modules/auth";

export default createStore({
  modules: {
    auth
  },
  state: {
    currentTrack: {
      meta: {}, // Track meta from DB
      sound: {}, // Howler sound object
      seek: 0, // Current postion in sec
      seekPercentage: "0%", // Current position in % for progres bar and ball
      duration: "00:00" // Track full duration
    },
    currentPlaylist: {
      meta: {},
      trackArray: [],
      seek: 0 // Index of currentTrack in trackArray
    }
  },
  mutations: {
    // For Track
    changeCurrentTrack: (state, payload) => {
      console.log(payload);
      console.log(state);
      state.currentTrack.meta = payload.track;
      console.log("Current track changed...?");
      state.currentTrack.sound = new Howl({
        src: [payload.track.url], // can contain an array of full urls to play
        html5: true
      });

      // Set current start playing position from position of the current tag
      if (payload.currentTag) {
        const seek = payload.currentTag.position;
        const duration = payload.track.length;
        state.currentTrack.seek = helper.formatSecToTimerValue(seek);
        state.currentTrack.duration = duration; // helper.formatSecToTimerValue();
        state.currentTrack.seekPercentage = `${(seek /
          helper.formatTimerValueToSec(duration)) *
          100}%`;
      }

      // Update also seek in playlist: search in trackArray for currentTrack's index
      const index = state.currentPlaylist.trackArray
        ? state.currentPlaylist.trackArray.findIndex(
            x => x.trackKey === state.currentTrack.meta.trackKey
          )
        : state.currentPlaylist.seek;
      // Change only if something found
      if (index > 0) {
        state.currentPlaylist.seek = index;
      }
      console.log(`state.currentPlaylist.seek: ${state.currentPlaylist.seek}`);
    },
    updateTrackPosition(state) {
      const seek = state.currentTrack.sound.seek();
      const duration = state.currentTrack.sound.duration();
      state.currentTrack.seek = helper.formatSecToTimerValue(seek);
      state.currentTrack.duration = helper.formatSecToTimerValue(duration);
      state.currentTrack.seekPercentage = `${(seek / duration) * 100}%`;
    },
    // For Playlist
    updateCurrentPlaylist: (state, payload) => {
      state.currentPlaylist.meta = payload.meta;
      console.log("Current playlist changed...");
      state.currentPlaylist.trackArray = payload.trackArray;
      console.log(state.currentPlaylist);
    }
  },
  getters: {
    currentTrackPosition: state => {
      let pos = 0;
      if (state.currentTrack.sound.playing) {
        pos = state.currentTrack.sound.seek();
      }
      return pos;
    },
    trackIsPlaying: state => {
      let playing = false;
      if (state.currentTrack.sound.playing) {
        playing = state.currentTrack.sound.playing();
      }
      return playing;
    },
    getNextTrack: state => {
      let track = state.currentTrack;
      const nextIndex = state.currentPlaylist.seek + 1;
      if (nextIndex < state.currentPlaylist.trackArray.length) {
        track = state.currentPlaylist.trackArray[nextIndex];
      }
      return track;
    },
    getPrevTrack: state => {
      let track = state.currentTrack;
      const prevIndex = state.currentPlaylist.seek - 1;
      if (prevIndex >= 0) {
        track = state.currentPlaylist.trackArray[prevIndex];
      }
      console.log(prevIndex);
      return track;
    }
  },
  // Action is part of Flux pattern (Facebook alternative to MVC)
  // https://ru.vuejs.org/v2/guide/state-management.html
  // https://madasamy.medium.com/flux-vs-mvc-design-pattern-de134dfaa12b
  // https://dev.to/durutheguru/implementing-the-flux-architecture-pattern-in-vuejs-57gp
  // Action is not a model, but "action based business logic"
  actions: {
    // ///////////// TRACK Play Management
    // >>>>>> The function where with Howl-object sound.play()
    // and events definition sound.on()
    async playCurrentTrack({ state, dispatch }) {
      state.currentTrack.sound.play(); // Start playing Howler.js object
      // from each url defined on object creation
      console.log("Start track...");

      // Listen to Howler play event
      state.currentTrack.sound.on("play", () => {
        requestAnimationFrame(() => {
          dispatch("playProgress"); // Kick-off tacking of play progress
        });
      });

      // Listen to Howler play event
      state.currentTrack.sound.on("end", () => {});
    },
    async changeTrack({ commit, dispatch, getters }, payload) {
      console.log("Action to change current track...");
      // Check if current song is already playing
      if (getters.trackIsPlaying) {
        dispatch("stopCurrentTrack"); // stop first
      }
      // ...then change track
      commit("changeCurrentTrack", payload);
    },
    async playNextTrack({ commit, dispatch, getters }) {
      // Check if current song is already playing
      if (getters.trackIsPlaying) {
        dispatch("stopCurrentTrack"); // stop first
      }
      // ...then change track and play
      const payload = { track: getters.getNextTrack };
      commit("changeCurrentTrack", payload);
      dispatch("playCurrentTrack");
      console.log("Start next track...");
    },
    async playPrevTrack({ commit, dispatch, getters }) {
      // Check if current song is already playing
      if (getters.trackIsPlaying) {
        dispatch("stopCurrentTrack"); // stop first
      }
      // ...then change track and play
      const payload = { track: getters.getPrevTrack };
      commit("changeCurrentTrack", payload);
      dispatch("playCurrentTrack");
      console.log("Start prev track...");
    },
    async togglePlaying({ dispatch, getters }) {
      // Check if current song is already playing
      if (getters.trackIsPlaying) {
        dispatch("pauseCurrentTrack");
      } else {
        dispatch("playCurrentTrack");
      }
    },
    async pauseCurrentTrack({ state }) {
      state.currentTrack.sound.pause(); // Start playing Howler.js object
      // from each url defined on object creation
      console.log("Pause track...");
    },
    async stopCurrentTrack({ state }) {
      state.currentTrack.sound.stop(); // Start playing Howler.js object
      state.currentTrack.seek = 0;
      state.currentTrack.duration = "00:00"; // helper.formatSecToTimerValue();
      state.currentTrack.seekPercentage = "0%";
      console.log("Stop track...");
    },
    // Constantly updates progress information: playing progress
    playProgress({ commit, state, dispatch }) {
      commit("updateTrackPosition"); // Mutation of state objects

      if (state.currentTrack.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch("playProgress"); // has to be recursive!
        });
      }
    },
    // Handling of jumps on mouse click during playing
    // Callen from event, >payload< object represents >event< obj
    // ...this is the default behaviour
    updateSeek({ state, dispatch }, payload) {
      if (!state.currentTrack.sound.playing) {
        return;
      }
      // payload = event in this case (callen from from click event)
      // Example:
      // Document width = 2000          |                           |
      // Timeline=Progress width = 1000      |                |
      // Start Doc to start Progress    < x >
      // Start Doc to click pos         < clientX >   ^
      // Click in the middle of progress reurns => clientX = 1000
      // ==>> we want the start of progress bar
      const clientx = payload.clientX;
      // current Target always returns the same object = this is safe!
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = clientx - x; // related to start of progress bar // see example above
      const clickInSeconds =
        (clickX / width) * state.currentTrack.sound.duration();
      state.currentTrack.sound.seek(clickInSeconds);

      // We've change the seek an know need to reflect this change in Progres Bar
      state.currentTrack.sound.once("seek", () => {
        dispatch("playProgress"); // runs when Howler seek-event was catched with "once"
      });
      // without this trick updating would stop after seek change
      // we kick it on one more time after a short stop
    },
    updatePlaylist({ commit }, payload) {
      commit("updateCurrentPlaylist", payload);
    }
  }
});
