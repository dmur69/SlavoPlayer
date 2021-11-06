<template>
  <section class="container mx-auto mt-6" id="tags">
    <div class="md:grid md:grid-cols-4 md:gap-4">
      <!-- Drop-down with all available tags. Hidden on load. -->
      <div id="tagsDropdown" v-if="showTagDropdown" class="dropdown-content">
        <input
          type="text"
          placeholder="Search.."
          id="newTagInput"
          v-on:keyup.enter="createNewTag"
          v-on:keyup="filterTags"
        />
        <app-track-tag-to-select
          @tag-add="addNewTag"
          v-for="tag in allTags"
          :key="tag.tagKey"
          :tag="tag"
        />
      </div>
      <!-- List of already added tags with button to add new tag -->
      <div class="col-span-4 inline-block">
        <!-- Button to add new tag (toggle hidden drop-down) -->
        <i
          :title="
            showTagDropdown
              ? 'Схлопнуть лист тегов'
              : 'Добавить закладку или тег'
          "
          class="fa text-3xl px-5"
          :class="showTagDropdown ? 'fa-minus-circle' : 'fa-plus-circle'"
          @click="handleTagDropDownClick"
        ></i>
        <!-- List of tag buttons / current can be selected on click -->
        <app-track-tag-to-display
          v-for="tag in parentTrack.tags"
          :key="tag.tagKey"
          :tag="tag"
          :isCurrentTag="currentTagKey === tag.tagKey ? true : false"
          @tag-click="handleOnTagClick"
        />
      </div>
    </div>
  </section>
</template>

<script>
import AppTrackTagToSelect from "@/components/track/TrackTagToSelect.vue";
import AppTrackTagToDisplay from "@/components/track/TrackTagToDisplay.vue";
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
  name: "TrackTagsList",
  components: { AppTrackTagToSelect, AppTrackTagToDisplay },
  data() {
    return {
      savedTrackPosition: 0,
      tagSearchIsActive: false,
      allTags: [],
      currentTagKey: "",
      showTagDropdown: false
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
    // Opens area to edit tags and performs other actions
    handleOnTagClick(clickedTag) {
      console.log("handleOnTagClick(clickedTag)");

      this.$emit("tag-click"); // Forward event to grand parent
      // to evtl show tag edit form (initially closed)

      // No action if tag edit form for clicked tag is already open
      if (this.currentTagKey === clickedTag.tagKey) {
        return;
      }

      // Change current tag
      this.currentTagKey = clickedTag.tagKey;
      // and load matching TagEditForm via route call
      console.log("Loading TagEditForm via route call");
      this.$router.push({
        name: "track_tag",
        params: {
          book_id: this.parentTrack.bookKey,
          track_id: this.parentTrack.trackKey,
          tag_id: this.currentTagKey
        }
      });
    },
    // Toggles dropdown for adding new tags and performs other actions
    async handleTagDropDownClick() {
      this.showTagDropdown = !this.showTagDropdown;
      // document.getElementById("tagsDropdown").classList.toggle("show");

      this.savedTrackPosition = this.currentTrackPosition;

      // Load global tag list only on first click
      if (!this.tagSearchIsActive && !this.allTags[0]) {
        const tagHandler = new TagHandler(); // Without params just handler with no meta
        this.allTags = await tagHandler.get({ sortOnColumn: "displayName" }); // Without params gets all
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
      this.addNewTag(tagHandler.getMeta()); // Add to UI
    },
    addNewTag(tag) {
      console.log("addNewTag");
      const tagToAdd = tag;
      // console.log(tagToAdd);
      tagToAdd.position = this.currentTrackPosition;
      console.log(tagToAdd);
      this.$emit("add-tag", tagToAdd);
    }
  },
  async created() {
    console.log("TrackTags vue created");
    // console.log(this.currentTag);
    if (this.$route.params.tag_id) {
      this.currentTagKey = this.$route.params.tag_id;
    }
    console.log(this.currentTag);
  }
};
</script>
