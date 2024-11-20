<template>
	<div class="main">
		<div>
			<h1>This is the main view</h1>
		</div><br />
		<p v-if="!showResBody">
			Welcome to the Demo. Please log in to your Solid Pod...
		</p>
		<div v-if="showResBody">
			<FloatLabel variant="in">
				<Textarea v-model="textValue" autoResize rows="5" cols="80" />
				<label>{{ labelText }}</label>
			</FloatLabel><br v-if="!isDisabledPost"/><br v-if="!isDisabledPost"/>
			<FloatLabel variant="in" v-if="!isDisabledPost">
				<InputText v-model="postUriValue" style="width: 100%;" />	
				<label>{{ labelURI }}</label>
			</FloatLabel>
			<div style="text-align: center;">
				<Button @click="addResPod" :disabled="isDisabledPost">Add Resource to Pod</Button>
			</div>
			<SolidFileTree @updateSelection="handleUpdateSelection" v-if="sessionInfo.isLoggedIn" :podUri="getBaseUriFromKnownUrl(sessionInfo.webId)" />
		</div>
	</div>
	<Toast position="bottom-right" />
</template>

<script setup>
import SolidFileTree from "/src/components/SolidFileTree.vue"

import { ref, reactive, onMounted, watch } from "vue"
import { useToast } from "primevue/usetoast"

import { useSolidSession } from "/src/composables/useSolidSession"
import { getResource, postResource, putResource, parseToN3 } from "/src/lib/solidRequests"

const { sessionInfo } = useSolidSession()
const toast = useToast()

const displayedWebId = ref("Nicht verfügbar.")

const showResBody = ref(false)

const selectedFile = ref(null)
const isParentNode = ref(false)

const postUriValue = ref("")
const labelURI = ref("Insert URI to post resource to:")

const textValue = ref("")
const labelText = ref("Insert text and post to path or select a file below to get its content:")

const isDisabledPost = ref(false)
const isDisabledGet = ref(false)

function handleUpdateSelection(data) {
	selectedFile.value = Object.keys(data)[0];
	isParentNode.value = Object.keys(data)[0].endsWith("/");
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

/**
 * HTTP GET request to retrieve selected resource from User's Solid Pod
 * @param URI: path of resource to retrieve
 * @returns body of retrieved resource
 */
async function getResPod() {
	// Check if user is logged in
	if (!sessionInfo.isLoggedIn) {
		toast.add({
            severity: "error",
            summary: "Error",
            detail: "Not logged in.",
            life: 5000,
		})
		return
	}
	// Check if a file is selected
	if (!selectedFile.value) {
		toast.add({
            severity: "error",
            summary: "Error",
            detail: "No file selected.",
            life: 5000,
		})
		return
	}

	labelText.value = selectedFile.value

	const resBody = await getResource(selectedFile.value).then((resp) => resp.text())
	textValue.value = resBody
	// showResBody.value = true

	toast.add({
		severity: "success",
		detail: "Successfuly requested resource.",
		life: 5000,
	})
}

/**
 * HTTP POST request to create a new resource in User's Solid Pod
 * @param URI: path of resource to create
 * @param body: content of resource to create
 * @returns status of request
 */

async function addResPod() {
	// Check if user is logged in
	if (!sessionInfo.isLoggedIn) {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Not logged in.",
			life: 5000,
		})
		return
	}
	// Check if a file is selected
	if (!selectedFile.value) {
		toast.add({
            severity: "error",
            summary: "Error",
            detail: "No file selected.",
            life: 5000,
		})
		return
	}

	await putResource(postUriValue.value, textValue.value).then((resp) => {
		if (resp.ok) {
			toast.add({
				severity: "success",
				detail: "Successfuly added resource.",
				life: 5000,
			})
		} else {
			toast.add({
				severity: "error",
				summary: "Error",
				detail: "Failed to add resource.",
				life: 5000,
			})
		}
	})

}

// Watch `sessionInfo.isLoggedIn`
watch(
  () => sessionInfo.isLoggedIn,
  (newVal) => {
	showResBody.value = newVal;
  }
);

// Watch `selectedFile.value`
watch(
  () => selectedFile.value,  (newVal) => {
		if (newVal && !isParentNode.value) {
			getResPod();
			isDisabledPost.value = true;
			isDisabledGet.value = false;
		}
		else {
			textValue.value = "";
			labelText.value = "Enter the content of the file:";
			postUriValue.value = selectedFile.value;
			labelURI.value = "Complete URI with filename:";
			isDisabledPost.value = false;
			isDisabledGet.value = true;
		}
  }
);
</script>

<style lang="scss">

.main {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 20px;
	padding-bottom: 20px;
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