<template>
	<div class="main">
		<p v-if="!showResBody">
			Welcome to the Demo. Please log in to your Solid Pod...
		</p>
		<div v-if="showResBody">
			<h2 style="text-align: center;">Add new file to Solid Pod</h2><br />
			<FloatLabel variant="in">
				<Textarea v-model="textValue" autoResize rows="5" cols="80" />
				<label>{{ labelText }}</label>
			</FloatLabel><br v-if="!isDisabledPost"/><br v-if="!isDisabledPost"/>
			<FloatLabel variant="in" v-if="!isDisabledPost">
				<InputText v-model="postUriValue" style="width: 100%;" />	
				<label>{{ labelURI }}</label>
			</FloatLabel><br />
			<div style="text-align: center;">
				<Button @click="addResPod" :disabled="isDisabledPost">Add Resource</Button>
			</div>
			<SolidFileTree @updateSelection="handleUpdateSelection" v-if="sessionInfo.isLoggedIn" :podUri="getBaseUri(sessionInfo.webId)" />
		</div>
		<div style="text-align: center;">
			<h2>HTTP localhost</h2>
			<Button @click="getResServer">HTTP GET</Button><br />
			<Textarea v-model="textValueServer" autoResize rows="5" cols="80" />
		</div>
		<div style="text-align: center; margin-top: 50px;">
			<img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Generated QR Code" />
			<p v-else>Waiting for QR-Code...</p>
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
import { parseLinkHeader } from "/src/lib/handleHeaders"
import QRCode from "qrcode";


const { sessionInfo } = useSolidSession()
const toast = useToast()

const showResBody = ref(false)
const selectedFile = ref(null)
const isParentNode = ref(false)
const isDisabledPost = ref(false)
const postUriValue = ref("")
const labelURI = ref("Enter URI:")
const textValue = ref("")
const labelText = ref("Enter content:")
const textValueServer = ref("")
const qrCodeUrl = ref(null)


async function getResServer() {
	const url = "http://localhost:8080/resource"
	const response = await fetch(url)
	textValueServer.value = await response.text()
	const linkHeader = response.headers.get('link')
	if (!linkHeader) {
		toast.add({
            severity: "error",
            summary: "Error",
            detail: "No link header.",
            life: 5000,
		})
		return
	}

	const link = await parseLinkHeader(linkHeader)
	const firstLink = link[Object.keys(link)[0]]
	console.log('Link header:', firstLink)
	textValueServer.value += "\n\n" + firstLink

	QRCode.toDataURL(firstLink)
      .then((url) => {
        qrCodeUrl.value = url;
      })
      .catch((err) => {
        console.error(err);
      });


	toast.add({
				severity: "success",
				detail: "Successfuly added resource.",
				life: 3000,
			})
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
	textValue.value = await getResource(selectedFile.value).then((resp) => resp.text())
}

/**
 * HTTP PUT request to create a new resource in User's Solid Pod
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
				life: 3000,
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

/**
 * Automated functions
 * 
 */

// Update the selected file
function handleUpdateSelection(data) {
	selectedFile.value = Object.keys(data)[0];
	isParentNode.value = Object.keys(data)[0].endsWith("/");
}

// Mount `sessionInfo.isLoggedIn`
onMounted(
	() => sessionInfo.isLoggedIn,
	(newVal) => {
		showResBody.value = newVal;
	}
);

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
		}
		else {
			textValue.value = "";
			labelText.value = "Enter the content of the file:";
			postUriValue.value = selectedFile.value;
			labelURI.value = "Complete URI with filename:";
			isDisabledPost.value = false;
		}
  }
);
</script>

<style lang="scss" scoped>

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