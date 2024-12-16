import { ref } from "vue";

const selectedFile = ref("");
const isParentNode = ref(false);

export function getItem(): Object | null {
  return { selectedFile, isParentNode };
}

export function setItem(fileURI: string, isPNode: boolean): void {
	selectedFile.value = fileURI;
	isParentNode.value = isPNode;
}

