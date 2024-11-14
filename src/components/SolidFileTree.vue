<template>
  <div>
	<h2 style="text-align: center;">Own Solid Pod Files</h2>
    <div v-if="isLoading">Loading files...</div>
    <div class="card" v-if="!isLoading">
      <Tree v-model:expandedKeys="expandedKeys" :value="treeNodes" selectionMode="single" v-model:selectionKeys="selectedKey" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getSolidDataset, getContainedResourceUrlAll, isContainer } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

// Define emit function
const emit = defineEmits(['updateSelection']);

// Props
const props = defineProps({
  podUri: {
    type: String,
    required: true,
  },
});

// Reactive variables
const treeNodes = ref([]);
const selectedKey = ref(null);
const expandedKeys = ref({});
const isLoading = ref(false);
const excludedSubfolders = ['profile', 'Settings', 'README']; // Subfolders to exclude



// Helper function to extract last subdirectory from URL
const getSubdirectoriesFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/').filter(segment => segment.length > 0);
    return segments.length > 0 ? segments[segments.length - 1] : '';
  } catch (error) {
    console.error("Invalid URL provided:", error);
    return '';
  }
};

// Recursive function to build the file tree
const fetchFileTree = async (url, depth = 0, parentNode = null) => {
  isLoading.value = true;
  try {
    const dataset = await getSolidDataset(url, { fetch: getDefaultSession().fetch });
    const containedResources = await getContainedResourceUrlAll(dataset);

    for (const resource of containedResources) {
      if (!excludedSubfolders.includes(getSubdirectoriesFromUrl(resource))) {
          const node = {
            key: resource,
            label: getSubdirectoriesFromUrl(resource),
            children: [],
          };
          if (parentNode) {
            parentNode.children.push(node);
          } else {
            treeNodes.value.push(node);
          }
          expandedKeys.value[node.key] = true;

          if (isContainer(resource)) {
            await fetchFileTree(resource, depth + 1, node);
          }
      }
    }
  } catch (error) {
    console.error("Error fetching file tree:", error);
  } finally {
    isLoading.value = false;
  }
};

// Load the file tree on component mount
onMounted(() => {
  fetchFileTree(props.podUri);
});

// Watch for changes in expandedKeys
watch(selectedKey, (newKey) => {
  emit('updateSelection', newKey);
});

</script>

<style scoped>
.card {
min-width: 500px;
}
ul {
/* list-style-type: disc; */
/* list-style-type: decimal; */
list-style-type: square;
/* list-style-type: none; */
/* list-style-type: lower-alpha; */
/* list-style-type: upper-alpha; */
/* list-style-type: lower-roman; */
/* list-style-type: upper-roman; */
/* list-style-type: decimal-leading-zero; */
/* list-style-type: georgian; */
/* list-style-type: armenian; */
/* list-style-type: hebrew; */
/* list-style-type: cjk-ideographic; */
/* list-style-type: hiragana; */
/* list-style-type: katakana; */
/* list-style-type: hiragana-iroha; */
/* list-style-type: katakana-iroha; */
}

.p-button {
  margin: 10px;
}
</style>