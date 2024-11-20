<script setup>
import MainView from './components/MainView.vue'
import HeaderBar from './components/standard/HeaderBar.vue'
</script>

<template>
  <HeaderBar style="z-index: 10;" />
  <MainView style="z-index: 1;" />
</template>

<style lang="scss">
html {
  width: 100vw;
  height: 100vh;
}

body {
  margin: 0px;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--surface-b);
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--text-color);
}

#app {
  height: 100%;
  width: 100%;
}

/* width */
::-webkit-scrollbar {
  // display: none; // but when I do, it looks sweet.
  background: var(--surface-d);
  height: 200px;
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--primary-color);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: cadetblue;
}
</style>
