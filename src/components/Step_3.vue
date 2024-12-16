<template>
	<div style="text-align: center;">
		<h1>Step 3: Display the file</h1>
		<Textarea v-model="httpResponse" cols="100" rows="20"/>
	</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast()

const selectedFile = ref(null)
const sessionID = ref("")
const httpResponse = ref("")

async function getResServer() {
	const url = `http://localhost:8080/getResource/${selectedFile.value}?nonce=${sessionID.value}`;
	const response = await fetch(url)
	httpResponse.value = await response.text()
	if (response.ok) {
		toast.add({
			severity: 'success',
			summary: 'Success',
			detail: 'File loaded successfully',
			life: 5000
		});
	} else {
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'Failed to load file',
			life: 5000
		});
	}
}

// function navigateToNextStep() {
// 	router.push('/step_4');
// }

onMounted(() => {
	selectedFile.value = route.query.selFile || null;
	sessionID.value = route.query.nonce || null;
	httpResponse.value = "File loading...";
	setTimeout(() => {
		getResServer();
	}, 1500);
});
</script>

<style scoped>
</style>