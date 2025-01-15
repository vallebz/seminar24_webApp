<template>
	<div class="flex justify-content-center">
		<p v-if="!isLoggedIn">
			<span> Welcome to the Demo. Please log in to your Solid Pod... </span>
		</p>
		<div v-else>
			<div>
				<Step_1 v-if="stepRef == 1" :podUriValue="demoPodURI" @selectedFile="selectFile" />
				<Step_2 v-else-if="stepRef == 2" :fileURI="selectedFileURI"
					@authenticationRequired="displayRequestObjectLink" @success="endDemo" />
				<Step_3 v-else-if="stepRef == 3" :requestObjectLink="requestObjectLink" />
			</div>
			<div class="flex justify-content-center">
				<Button rounded @click="navigateToNextStep" v-if="!successfulAccess"
					:disabled="(stepRef > 0 && !selectedFileURI)">
					{{ stepRef == 0 ? "Start Demo" : "Next Step" }}
				</Button>
				<div v-else class="flex flex-column align-items-center justify-content-center">
					<Button severity="info" label="Success!" disabled />
					<div>
						Delete your cookies and reload the page if you want to try again!
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useSolidSession } from "/src/composables/useSolidSession"
import Step_1 from './Step_1.vue';
import Step_2 from './Step_2.vue';
import Step_3 from './Step_3.vue';


const { sessionInfo } = useSolidSession()
const isLoggedIn = ref(false)
watch(
	() => sessionInfo.isLoggedIn,
	(newVal) => {
		isLoggedIn.value = newVal;
		console.log('New login status:', newVal);
	}
);

const demoPodURI = "https://sme.solid.aifb.kit.edu/bookings/";

const stepRef = ref(0);
function navigateToNextStep() {
	stepRef.value++
	if (stepRef.value > 3) {
		stepRef.value = 1
	}
}

const selectedFileURI = ref();
function selectFile(uri) {
	selectedFileURI.value = uri;
}

const successfulAccess = ref(false);
function endDemo() {
	successfulAccess.value = true
}

const requestObjectLink = ref();
function displayRequestObjectLink(uri) {
	requestObjectLink.value = uri
}
</script>

<style lang="scss">
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