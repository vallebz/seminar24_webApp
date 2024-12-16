<template>
	<h2 style="text-align: center;">Step 2: Provide your credentials</h2><br />
	<div style="text-align: center; margin-top: 50px;">
		<div style="display: grid; grid-template-columns: 0.5fr 0.35fr 1fr; place-items: center;">
			<div>
				<p style="text-align: center;">Scan this QR-Code with a wallet application to present your Verifiable Credentials.</p>
				<img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Generated QR Code" />
				<div v-else>
					<p>Waiting for QR-Code...</p>
					<p>Please start the Demo's localhost server on port 8080</p>
				</div>
			</div>
			<p><strong>or</strong></p>
			<div style="width: 100%;">
				<div v-if="qrCodeUrl" style="text-align: center;">
				<p style="text-align: center;">Present Credentials manually without wallet application</p>
					<FloatLabel variant="in" style="margin-top: 40px;">
						<Textarea v-model="shape" style="width: 100%;" rows="8" disabled/>
						<label>Credential shape</label>
					</FloatLabel>
					<FloatLabel variant="in" style="margin-top: 40px;">
						<Textarea v-model="presentation" style="width: 100%;" rows="8" disabled />
						<label>Verifiable Credential Presentation</label>
					</FloatLabel>
					<Button @click="navigateToNextStep">Present Credentials</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import QRCode from "qrcode";
import exampleVP from '/src/data/verifiablePresentations/example_vp.txt';
import exampleShape from '/src/data/shapes/example_vp_shape.txt';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from "vue";
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import { parseLinkHeader } from "/src/lib/handleHeaders"

const route = useRoute();
const router = useRouter();
const toast = useToast()
const qrCodeUrl = ref(null)
const httpResponse = ref("")
const selectedFile = ref(null)
const shape = ref("")
const presentation = ref("")
const sessionID = ref("")

fetch(exampleShape)
  .then(response => response.text())
  .then(text => {
	shape.value = text;
  });

fetch(exampleVP)
  .then(response => response.text())
  .then(text => {
	presentation.value = text;
  });


async function getResServer() {
	const url = `http://localhost:8080/getResource/${selectedFile.value}`;
	const response = await fetch(url)
	httpResponse.value = await response.text()
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
	const urlParams = new URLSearchParams(firstLink);
	const nonce = urlParams.get('nonce');
	sessionID.value = nonce;
	console.log('Link header:', firstLink)
	console.log('QP file:', encodeURIComponent(selectedFile.value))
	console.log('Session ID:', sessionID.value)
	
	QRCode.toDataURL(firstLink)
	.then((url) => {
		qrCodeUrl.value = url;
	})
	.catch((err) => {
		console.error(err);
	});
	
	
	toast.add({
		severity: "error",
		detail: httpResponse.value,
		life: 8000,
	})
}

async function presentServer() {
	const url = `http://localhost:8080/auth/present?nonce=${sessionID.value}`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
		},
		body: presentation.value
	})
	httpResponse.value = await response.text()
	if (response.ok) {
		toast.add({
			severity: "success",
			summary: "Success",
			detail: httpResponse.value,
			life: 5000,
		});
	} else {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: httpResponse.value,
			life: 5000,
		});
	}
}

function navigateToNextStep() {
	presentServer();
	setTimeout(() => {
		router.push({ path: '/step_1', query: { selFile: selectedFile.value, nonce: sessionID.value } });
	}, 1500);
}
	

onMounted(() => {
	selectedFile.value = route.query.selFile || null;
	getResServer();
});
</script>