<template>
	<h3 style="text-align: center;">Step 1: Connect to your customer's Pod</h3><br />
	<FloatLabel variant="in">
		<InputText v-model="containerURI" style="width: 600px;" disabled />
		<label>URI of your customer's booking data</label>
	</FloatLabel><br />
	<p style="text-align: center;">Available files</p>
	<SolidFileTree @updateSelection="selectFile" :podUri="podUriValue" />
</template>

<script setup>
import SolidFileTree from "/src/components/SolidFileTree.vue"
import { ref } from "vue"

const emits = defineEmits(['selectedFile']);
const props = defineProps(['podUriValue']);
const containerURI = ref(props.podUriValue);

function selectFile(data) {
	emits('selectedFile', Object.keys(data)[0])
}
</script>

<style lang="scss"></style>