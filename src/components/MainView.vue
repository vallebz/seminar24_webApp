<template>
	<div class="main">
		<div>
			<h1>Main View</h1>
		</div>
		<div>
			<Button @click="getWebID">Display WebID</Button>
		</div>
		<div>
			<p v-if="showWebId">WebID: {{ displayedWebId }}</p>
		</div>
		<div>
			<BlockUI v-if="showResBody">
				<Panel :header="displayedResURI">
					<p class="m-1">{{ displayedResBody }}</p>
				</Panel>
			</BlockUI>
		</div>
		<SolidFileTree @updateSelection="handleUpdateSelection" v-if="sessionInfo.isLoggedIn" :podUri="getBaseUriFromKnownUrl(sessionInfo.webId)" />
		<div>
			<Button @click="getResPod">Get Resource from Pod</Button>
			<Button @click="">Post Resource to Pod</Button>
		</div>
	</div>
	<Toast position="bottom-right" />
</template>

<script setup>
import SolidFileTree from "/src/components/SolidFileTree.vue"

import { ref, reactive, onMounted } from "vue"
import { useToast } from "primevue/usetoast"

import { useSolidSession } from "/src/composables/useSolidSession"
import { getResource, postResource, putResource, parseToN3 } from "/src/lib/solidRequests"


const { sessionInfo, authFetch } = useSolidSession()
const toast = useToast()

const displayedWebId = ref("Nicht verfügbar.")
const displayedResBody = ref()
const displayedResURI = ref()

const showWebId = ref(false)
const showResBody = ref(false)

const selectedFile = ref(null)

function handleUpdateSelection(data) {
	selectedFile.value = Object.keys(data)[0];
}

function getBaseUriFromKnownUrl(url) {
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


function getWebID() {

	if (sessionInfo.webId) {
		displayedWebId.value = sessionInfo.webId
	} else {
		displayedWebId.value = "Nicht verfügbar."
	}

	if (showWebId.value) {
		showWebId.value = false
		return
	}

	showWebId.value = true
}

/**
 * HTTP GET request to retrieve selected resource from User's Solid Pod
 * @param URI: path of resource to retrieve
 * @returns body of retrieved resource
 */
async function getResPod() {
	// Check if user is logged in
	if (!sessionInfo.webId) {
		toast.add({
            severity: "error",
            summary: "Error",
            detail: "Not logged in.",
            life: 5000,
		})
		return
	}

	const resURI = selectedFile.value
	displayedResURI.value = resURI

	const resBody = await getResource(resURI).then((resp) => resp.text())
	displayedResBody.value = resBody
	showResBody.value = true

	toast.add({
		severity: "success",
		detail: "Successfuly requested resource.",
		life: 5000,
	})
}
</script>

<style lang="scss" scoped>

.main {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 20px;
}

.p-button {
  margin: 10px;
}

.p-panel {
	margin: 10px;
}

.p-blockUI {
	margin: 10px;
}
</style>