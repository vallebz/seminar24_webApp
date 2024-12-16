<template>
	<h2 style="text-align: center;">Step 1: Connect to your client's server</h2><br />
	<FloatLabel variant="in">
		<InputText v-model="podUriValue" style="width: 600px;" disabled />	
		<label>URI of your client's server</label>
	</FloatLabel><br />
	<p style="text-align: center;">Available files:</p>
	<SolidFileTree @updateSelection="handleUpdateSelection" :podUri="podUriValue" />
	<div style="text-align: center;">
		<Button @click="navigateToNextStep" :disabled="!selectedFile || isParentNode">Get file</Button>
	</div>
</template>

<script setup>
import SolidFileTree from "/src/components/SolidFileTree.vue"
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from "vue"

const router = useRouter();
const route = useRoute();

const selectedFile = ref(null)
const isParentNode = ref(false)
const podUriValue = ref("https://sme.solid.aifb.kit.edu/bookings/")
const sessionID = ref("")

// Update the selected file
function handleUpdateSelection(data) {
	selectedFile.value = Object.keys(data)[0];
	isParentNode.value = Object.keys(data)[0].endsWith("/");
}

function navigateToNextStep() {
	if (sessionID.value !== null) {
		router.push({ path: '/step_3', query: { selFile: selectedFile.value.replace("https://sme.solid.aifb.kit.edu/bookings/", ""), nonce: sessionID.value } });
	}
	else {
		router.push({ path: '/step_2', query: { selFile: selectedFile.value.replace("https://sme.solid.aifb.kit.edu/bookings/", "") } });
	}
}

// onMounted: Ordner auf Solid Pod erstellen falls noch nicht vorhanden
onMounted(() => {
	sessionID.value = route.query.nonce || null;
	selectedFile.value = route.query.selFile || null;
});
</script>

<style lang="scss">
</style>