<template>
	<h2 style="text-align: center;">Step 2</h2><br />
	<p style="text-align: center;">Select a file from your clients Solid Pod</p>
	<SolidFileTree @updateSelection="handleUpdateSelection" :podUri="getBaseUri(sessionInfo.webId)" />
	<div style="text-align: center;">
		<Button @click="navigateToNextStep" :disabled="!selectedFile || isParentNode">Download and Use File</Button>
	</div>
</template>

<script setup>
import SolidFileTree from "/src/components/SolidFileTree.vue"
import { useSolidSession } from "/src/composables/useSolidSession"
import { ref } from "vue"
import { useRouter } from 'vue-router';

const router = useRouter();
const { sessionInfo } = useSolidSession()

const selectedFile = ref(null)
const isParentNode = ref(false)

function navigateToNextStep() {
	router.push('/step_3');
}

/**
 * Extract the base URI of the Solid Pod from the WebID or any other known URL
 * @param url: known WebID URI of the Solid Pod
 * @returns base URI of the Solid Pod
 */
function getBaseUri(url) {
	try {
		// Create a URL object to manipulate the path
		const urlObj = new URL(url);
		
		// Remove any subdirectories and fragment by setting the pathname to "/" and hash to ""
		urlObj.pathname = "/";
		urlObj.hash = "";

		console.log("Solid Pod Base URI:\n" + urlObj.href);
		
		return urlObj.href;
	} catch (error) {
		console.error("Invalid URL provided:", error);
		return null;
	}
}

// Update the selected file
function handleUpdateSelection(data) {
	selectedFile.value = Object.keys(data)[0];
	isParentNode.value = Object.keys(data)[0].endsWith("/");
}
</script>