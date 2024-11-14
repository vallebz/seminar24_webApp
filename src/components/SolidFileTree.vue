<template>
  <div>
	<h2 style="text-align: center;">Own Solid Pod Files</h2>
    <div v-if="isLoading">Loading files...</div>
    <ul v-if="!isLoading">
      <li v-for="item in uris" :key="item.url" :style="{ marginLeft: item.depth * 20 + 'px' }">
        {{ getSubdirectoriesFromUrl(item.url) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getSolidDataset, getContainedResourceUrlAll, isContainer } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

function getSubdirectoriesFromUrl(url) {
	try {
		// Create a URL object to manipulate the path
		const urlObj = new URL(url);
		
		// Split the pathname into segments and filter out empty segments
		const segments = urlObj.pathname.split('/').filter(segment => segment.length > 0);
		
		// Return the last subdirectory
		return segments.length > 0 ? segments[segments.length - 1] : '';
	} catch (error) {
		console.error("Invalid URL provided:", error);
		return '';
	}
}


export default {
  name: "SolidFileTree",
  props: {
    podUri: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const uris = ref([]);            // Reactive array to hold file/folder uris
    const isLoading = ref(false);     // Loading state

    // Recursive function to fetch file tree structure
    const fetchFileTree = async (url, depth = 0) => {
      isLoading.value = true;
      try {
        const dataset = await getSolidDataset(url, { fetch: getDefaultSession().fetch });
        const containedResources = await getContainedResourceUrlAll(dataset);

        for (const resource of containedResources) {
          uris.value.push({ url: resource, depth });

          if (isContainer(resource)) {
            await fetchFileTree(resource, depth + 1);
          }
        }
      } catch (error) {
        console.error("Error fetching file tree:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Load the file tree when the component is mounted
    onMounted(() => {
      fetchFileTree(props.podUri);
    });

    return { uris, isLoading, getSubdirectoriesFromUrl };
  },
};
</script>

<style scoped>
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
</style>