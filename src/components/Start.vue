<template>
	<Button @click="navigateToNextStep">Start Demo</Button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateToNextStep() {
	router.push('/step_1');
}

</script>

<style scoped>

</style>