<template>
  <section class="container mx-auto mt-6" id="tags">
    <div class="md:grid md:grid-cols-4 md:gap-4">
      <div class="col-span-1">
        <input
          type="text"
          class="
            block
            w-full
            py-2.5
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none
            focus:border-black
            rounded
          "
          placeholder="Add Tag"
        />
        <div id="tagsDropdown" class="dropdown-content">
          <input
            type="text"
            placeholder="Search.."
            id="newTagInput"
            v-on:keyup.enter="createNewTag"
            v-on:keyup="filterTags"
          />
          <app-tag-to-select
            @tag-add="addNewTag"
            v-for="tag in allTags"
            :key="tag.tagKey"
            :tag="tag"
          />
        </div>
      </div>
      <!-- <div class="dropdown" TODO: remove classes from main.css>
          <button @click="myFunction" class="dropbtn">Dropdown</button>
        </div> -->
      <div class="col-span-3">
        <span
          class="
            w-full
            py-0.0
            px-3
            text-gray-800
            border border-gray-300
            transition
            duration-500
            focus:outline-none
            focus:border-black
            rounded
          "
          @click="handleTagDropDownClick"
          >+</span
        >
        <app-tag-to-display
          v-for="tag in parentTrack.tags"
          :key="tag.tagKey"
          :tag="tag"
          @tag-edit="handleOnTagClick"
        />
      </div>
    </div>
  </section>
</template>

<script>
import AppTagToSelect from "@/components/track/TagToSelect.vue";
import AppTagToDisplay from "@/components/track/TagToDisplay.vue";
import TagHandler from "@/handlerobj/tag";
import { mapGetters } from "vuex";

/*
Becomes trackKey as param
Gets it's current tags from db/state
displays them in the ui
On adding a new one handles update of db/state
both (on track and the global list of tags in db)
TODO: edit,delete,user tags, system tags
*/
export default {
  name: "TrackTags",
  components: { AppTagToSelect, AppTagToDisplay },
  data() {
    return {
      savedTrackPosition: 0,
      tagSearchIsActive: false,
      allTags: []
    };
  },
  props: {
    // Track object can be used to manipulate the object in DB
    parentTrack: {
      type: Object, // Track object
      required: true
    }
  },
  computed: {
    ...mapGetters(["currentTrackPosition"])
  },
  methods: {
    // Toggles area to edit tags and performs other actions
    handleOnTagClick() {
      console.log("Toggling Tag edit");
    },
    // Toggles dropdown for adding new tags and performs other actions
    async handleTagDropDownClick() {
      document.getElementById("tagsDropdown").classList.toggle("show");

      this.savedTrackPosition = this.currentTrackPosition;

      // Load global tag list only on first click
      if (!this.tagSearchIsActive && !this.allTags[0]) {
        const tagHandler = new TagHandler(); // Without params just handler with no meta
        this.allTags = await tagHandler.get(); // Without params gets all
        console.log("Global tag list loaded:");
        this.allTags.forEach((tag) => {
          console.log(tag.displayName);
        });
      }
      this.tagSearchIsActive = !this.tagSearchIsActive;
    },
    // Fiters tgags using vanila js.
    // Algorithm: listens on keyup-event
    // gets all items of a dropdown
    // sets display or not based on indexOf() return value
    // for current tipped in set of chars in "input"
    filterTags() {
      const input = document.getElementById("newTagInput");
      const filter = input.value.toUpperCase();
      const div = document.getElementById("tagsDropdown");
      const a = div.getElementsByTagName("a");
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < a.length; i++) {
        const txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          a[i].style.display = "";
        } else {
          a[i].style.display = "none";
        }
      }
    },
    // Adds a new Tag and initiates update of the global Tag list
    createNewTag() {
      console.log("createNewTag");
      const input = document.getElementById("newTagInput");
      const newTagCandidate = input.value;
      console.log(newTagCandidate);
      // ToDo: check it tag is unique before creating
      // We already have the global tag list on client
      const tagHandler = new TagHandler(newTagCandidate); // With param stores tag meta data
      tagHandler.save(); // Try to save this tag meta data to db
    },
    addNewTag(tag) {
      console.log("addNewTag");
      const tagToAdd = tag;
      console.log(tagToAdd);
      tagToAdd.position = this.currentTrackPosition;
      console.log(tagToAdd);
      this.$emit("add-tag", tagToAdd);
    }
  }
};
</script>
