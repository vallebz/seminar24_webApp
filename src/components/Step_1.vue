<template>
	<h2 style="text-align: center;">Step 1</h2><br />
	<FloatLabel variant="in">
		<InputText v-model="podUriValue" style="width: 600px;" />	
		<label>Input URI of your clients server</label>
	</FloatLabel><br />
	<div style="text-align: center;">
		<Button @click="navigateToNextStep">Connect</Button>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from "vue"

const router = useRouter();

const podUriValue = ref("https://uxuxe.solid.aifb.kit.edu/")

function navigateToNextStep() {
	router.push('/step_2');
}

// onMounted: Ordner auf Solid Pod erstellen falls noch nicht vorhanden
</script>

<style lang="scss">
</style>