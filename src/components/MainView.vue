<template>
	<div class="main">
		<h1>Main View</h1>
		<p>Hier kommen irgendwann mal tolle Sachen hin.</p>
		<Button @click="getWebID">Display WebID</Button>
		<p v-if="isDisplayingWebId">WebID: {{ displayedWebId }}</p>
	</div>
</template>

<script setup>
import { useSolidSession } from "/src/composables/useSolidSession";
const { sessionInfo } = useSolidSession();
import { ref } from 'vue';

const displayedWebId = ref("Nicht verfügbar.");
const isDisplayingWebId = ref(false);

const getWebID = () => {

	if (sessionInfo.webId) {
		displayedWebId.value = sessionInfo.webId;
	} else {
		displayedWebId.value = "Nicht verfügbar.";
	}

	if (isDisplayingWebId.value) {
		isDisplayingWebId.value = false;
		return;
	}

	isDisplayingWebId.value = true;
}
</script>

<style lang="scss">

.main {
	margin: 20px;
}
</style>