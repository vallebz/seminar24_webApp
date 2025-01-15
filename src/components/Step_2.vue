<template>
	<div>
		<h3>Step 2: Access the file</h3>
		<Textarea v-model="txt" cols="100" rows="20" />
	</div>
</template>

<script setup>
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import { parseLinkHeader } from "/src/lib/handleHeaders"

const toast = useToast()

const props = defineProps(['fileURI']);
const emit = defineEmits(['authenticationRequired']);

const txt = ref("File loading...")

async function getResServer() {
	const response = await fetch(props.fileURI)
	if (response.ok) {
		toast.add({
			severity: 'success',
			summary: "" + response.status,
			detail: "" + response.statusText,
			life: 5000
		});
		txt.value = await response.text();
	} else {
		toast.add({
			severity: 'error',
			summary: "" + response.status,
			detail: "No Access.",
			life: 5000
		});
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
		const firstLink = link[Object.keys(link)[0]];
		emit('authenticationRequired', firstLink)
	}
}

getResServer()
</script>

<style scoped></style>