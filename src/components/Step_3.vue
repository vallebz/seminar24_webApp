<template>
	<h3 style="text-align: center;">Step 3: Provide your credentials</h3><br />
	<div style="text-align: center; margin-top: 50px;">
		<div style="display: grid; grid-template-columns: 0.5fr 0.35fr 1fr; place-items: center;">
			<div>
				<p style="text-align: center;">
					Scan this QR-Code with a
					<a href="https://oassi-wallet.solid.aifb.kit.edu">
						wallet application
					</a>
					to present your Verifiable
					Credentials.
				</p>
				<img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Generated QR Code" />
				<div v-else>
					<p>Waiting for QR-Code...</p>
				</div>
			</div>
			<p><strong>or</strong></p>
			<div style="width: 100%;">
				<div v-if="qrCodeUrl" style="text-align: center;">
					<p style="text-align: center;">Present Credentials manually without wallet application</p>
					<FloatLabel variant="in" style="margin-top: 40px;">
						<Textarea v-model="shape" style="width: 100%;" rows="8" disabled />
						<label>Credential shape</label>
					</FloatLabel>
					<FloatLabel variant="in" style="margin-top: 40px;">
						<Textarea v-model="presentation" style="width: 100%;" rows="8" disabled />
						<label>Verifiable Credential Presentation</label>
					</FloatLabel>
					<Button severity="info" @click="presentServer();">Present Credentials</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import QRCode from "qrcode";
import exampleVP from '/src/data/verifiablePresentations/example_vp.txt';
import exampleShape from '/src/data/shapes/example_vp_shape.txt';
import { useToast } from "primevue/usetoast"
import { ref } from "vue"


const toast = useToast()

const shape = ref("")
const presentation = ref("")

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

const props = defineProps(['requestObjectLink']);

const qrCodeUrl = ref(null)
QRCode.toDataURL(props.requestObjectLink)
	.then((url) => {
		qrCodeUrl.value = url;
	})
	.catch((err) => {
		console.error(err);
	});

const urlParams = new URLSearchParams(props.requestObjectLink);
const sessionID = ref(urlParams.get('nonce'));

async function presentServer() {
	// TODO get from link header of request object, ie. actually make the fetch to request object
	const url = `https://sme.solid.aifb.kit.edu/auth/present?nonce=${sessionID.value}`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/turtle',
		},
		body: presentation.value
	})
	if (response.ok) {
		toast.add({
			severity: "success",
			summary: "Success",
			detail: "That did work!",
			life: 5000,
		});
	} else {
		toast.add({
			severity: "error",
			summary: "Something went wrong",
			detail: "Shoot us an email!",
			life: 5000,
		});
	}
}
</script>