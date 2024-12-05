<template lang="html">
	<router-link to="/">Restart Demo</router-link>
	<div class="main">
		<p v-if="!showResBody">
			Welcome to the Demo. Please log in to your Solid Pod...
		</p>
		<div v-if="showResBody">
			<router-view />
		</div>
	</div>
	<Toast position="bottom-right" />
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted, watch } from "vue"
import { useSolidSession } from "/src/composables/useSolidSession"

const { sessionInfo } = useSolidSession()

const showResBody = ref(false)

// // Mount `sessionInfo.isLoggedIn`
// onMounted(
// 	() => sessionInfo.isLoggedIn,
// 	(newVal) => {
// 		showResBody.value = newVal;
// 		console.log('New login status:', newVal);
// 	}
// );

// Watch `sessionInfo.isLoggedIn`
watch(
  () => sessionInfo.isLoggedIn,
  (newVal) => {
	  showResBody.value = newVal;
	console.log('New login status:', newVal);
  }
);

</script>

<style lang="scss">
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
}</style>