import { auth, users } from "@/datamappers/firebase/firebase";

export default {
  state: {
    authShowModal: false,
    userLoggedIn: false
  },
  getters: {
    // shortcut for function returns the value of state.authShowModal
    getAuthShowModal: state => state.authShowModal
  },
  mutations: {
    toggleAuthModal: state => {
      state.authShowModal = !state.authShowModal;
    },
    toggleUserLoggedIn: state => {
      state.userLoggedIn = !state.userLoggedIn;
    }
  },
  actions: {
    // store-object is not accesible in action!
    // it's passed down via ctx param => async registerUser(ctx, payload)
    // registerUser({ commit }... // grabs only commit fn, cause we do not need entire store object
    // ////
    // ///////////// USER Management
    async registerUser({ commit }, payload) {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );

      // difference of 'set': creates or upadtes
      // userCredentials.user.uid: we create(update) doc with doc-id = user.uid
      await users.doc(userCredentials.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country
      });

      // User Store has some additional infos
      await userCredentials.user.updateProfile({
        displayName: payload.name
      });

      commit("toggleUserLoggedIn");
    },
    async loginUser({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit("toggleUserLoggedIn");
    },
    async logoutUser({ commit }) {
      await auth.signOut();

      commit("toggleUserLoggedIn");
    },
    // Toggles User LoggedIn only if valid user object is present in:
    // Browsers Application->Storage/Speicher->IndexDB->FirebaseLocalStorage
    initLogin({ commit }) {
      const user = auth.currentUser;

      // auth.currentUser delivers null if current user is not authenticated
      if (user) {
        commit("toggleUserLoggedIn");
      }
    }
  }
};
