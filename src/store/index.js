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
      seek: "00:00", // Current postion in sec
      seekPercentage: "0%", // Current position in % for progres bar and ball
      duration: "00:00" // Track full duration
    },
    currentTrackCollection: "philokalia",
    defaultTrackCollection: "tracks"
  },
  mutations: {
    setStartTrackPosition(state, payload) {
      state.currentTrack.seek = helper.formatSecToTimerValue(payload.seek);
      state.currentTrack.duration = payload.duration; // helper.formatSecToTimerValue();
      state.currentTrack.seekPercentage = `${(payload.seek /
        helper.formatTimerValueToSec(payload.duration)) *
        100}%`;
    },
    changeCurrentTrack: (state, payload) => {
      state.currentTrack.meta = payload.track;
      console.log("Current track changed...");
      console.log(payload);
      state.currentTrack.sound = new Howl({
        src: [payload.track.url], // can contain an array of full urls to play
        html5: true
      });
      // Start playing from position of the current tag
      if (payload.currentTag) {
        state.currentTrack.sound.seek(payload.currentTag.position);
      }
      console.log(state.currentTrack);
    },
    updateTrackPosition(state) {
      const seek = state.currentTrack.sound.seek();
      const duration = state.currentTrack.sound.duration();
      state.currentTrack.seek = helper.formatSecToTimerValue(seek);
      state.currentTrack.duration = helper.formatSecToTimerValue(duration);
      state.currentTrack.seekPercentage = `${(seek / duration) * 100}%`;
    }
  },
  getters: {
    currentTrackCollection: state => state.currentTrackCollection,
    trackIsPlaying: state => {
      let playing = false;
      if (state.currentTrack.sound.playing) {
        playing = state.currentTrack.sound.playing();
      }
      return playing;
    }
  },
  // Action is part of Flux pattern (Facebook alternative to MVC)
  // https://ru.vuejs.org/v2/guide/state-management.html
  // https://madasamy.medium.com/flux-vs-mvc-design-pattern-de134dfaa12b
  // https://dev.to/durutheguru/implementing-the-flux-architecture-pattern-in-vuejs-57gp
  // Action is not a model, but "action based business logic"
  actions: {
    // ///////////// TRACK Play Management
    async setStartPosition({ commit }, payload) {
      console.log("Setting new start position of a track...");
      // commit("changeCurrentTrack", payload);
      commit("setStartTrackPosition", payload); // Mutation of state objects
    },
    // eslint-disable-next-line object-curly-newline
    async tryPlayNextTrack({ commit, state, dispatch, getters }, payload) {
      console.log("Action called to change playing track...");
      console.log(payload.currentTag);

      // Nothing to change. User just wants to toggle playing
      if (state.currentTrack.meta.trackKey === payload.track.trackKey) {
        dispatch("togglePlaying");
        return;
      }

      // Check if current song is already playing
      if (getters.trackIsPlaying) {
        dispatch("stopCurrentTrack"); // stop first
      }
      // ...then change track and play
      commit("changeCurrentTrack", payload);
      dispatch("playCurrentTrack");
    },
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
    },
    async pauseCurrentTrack({ state }) {
      state.currentTrack.sound.pause(); // Start playing Howler.js object
      // from each url defined on object creation
      console.log("Pause track...");
    },
    async stopCurrentTrack({ state }) {
      state.currentTrack.sound.stop(); // Start playing Howler.js object
      // from each url defined on object creation
      console.log("Stop track...");
    },
    async togglePlaying({ dispatch, getters }) {
      // Check if current song is already playing
      if (getters.trackIsPlaying) {
        dispatch("pauseCurrentTrack");
      } else {
        dispatch("playCurrentTrack");
      }
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
    }
  }
});
