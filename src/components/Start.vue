<template>
	<div class="container">
		<!-- <p>Please make sure the demo's localhost server is running on port 8080</p> -->
		<Button @click="navigateToNextStep">Start Demo</Button>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateToNextStep() {
	router.push('/step_1');
}
</script>

<style scoped>
.container {
	text-align: center;
}
</style>