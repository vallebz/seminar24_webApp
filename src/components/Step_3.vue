<template>
	<h2 style="text-align: center;">Step 3</h2><br />
	<p style="text-align: center;">Message from client's Solid Pod: "{{ textValueServer }}"</p>
	<p style="text-align: center;">Scan this QR-Code with your wallet application to present Verifiable Credentials.</p>
	<div style="text-align: center; margin-top: 50px;">
		<img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Generated QR Code" />
		<div v-else>
			<p>Waiting for QR-Code...</p>
			<p>Please start the Demo's localhost server on port 8080</p>
			<Button @click="getResServer">Try again</Button><br />
		</div>
		<div v-if="qrCodeUrl" style="text-align: center;">
			<Button @click="navigateToNextStep">Present Credentials</Button>
		</div>
	</div>
</template>

<script setup>
import QRCode from "qrcode";
import { useRouter } from 'vue-router';
import { onMounted } from "vue";
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import { parseLinkHeader } from "/src/lib/handleHeaders"

const router = useRouter();
const toast = useToast()
const qrCodeUrl = ref(null)
const textValueServer = ref("")

function navigateToNextStep() {
	router.push('/step_4');
}

async function getResServer() {
	const url = "http://localhost:8080/resource"
	const response = await fetch(url)
	textValueServer.value = await response.text()
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
	const firstLink = link[Object.keys(link)[0]]
	console.log('Link header:', firstLink)
	// textValueServer.value += "\n\n" + firstLink

	QRCode.toDataURL(firstLink)
      .then((url) => {
        qrCodeUrl.value = url;
      })
      .catch((err) => {
        console.error(err);
      });


	toast.add({
		severity: "error",
		detail: textValueServer.value,
		life: 8000,
	})
}

onMounted(() => {
	getResServer();
});

</script>