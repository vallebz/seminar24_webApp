<template>
  <Toolbar>
    <template #start>
      <Avatar v-if="img" :image="img" shape="circle" />
      <a :href="webId">
        <span>{{ name }}</span>
      </a>
    </template>
    <template #end>
      <LoginButton v-if="!isLoggedIn" />
      <LogoutButton v-if="isLoggedIn" />
    </template>
  </Toolbar>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch } from "vue";
import LoginButton from "./buttons/LoginButton.vue";
import LogoutButton from "./buttons/LogoutButton.vue";
import { useSolidSession } from "/src/composables/useSolidSession";
import { getResource, parseToN3 } from "/src/lib/solidRequests";
import { VCARD } from "/src/lib/namespaces";

export default defineComponent({
  name: "HeaderBar",
  components: {
    LoginButton,
    LogoutButton,
  },
  setup() {
    const { sessionInfo, authFetch } = useSolidSession();
    const { isLoggedIn, webId } = toRefs(sessionInfo);
    let name = ref();
    let img = ref();

    async function getPersonalData(webId) {
      const parsedN3 = await getResource(webId, authFetch.value)
        .then((resp) => resp.text())
        .then((respText) => parseToN3(respText, webId));
      let query = parsedN3.store.getObjects(webId, VCARD("hasPhoto"), null);
      const i = query.length > 0 ? query[0].value : undefined;
      query = parsedN3.store.getObjects(webId, VCARD("fn"), null);
      const n = query.length > 0 ? query[0].value : undefined;
      return { n, i };
    }

    if (webId !== undefined)
      watch(webId, () => {
        if (webId.value !== undefined) {
          getPersonalData(webId.value).then((pd) => {
            name.value = pd.n;
            img.value = pd.i;
          });
        } else {
          name.value = undefined;
          img.value = undefined;
        }
      });

    return { isLoggedIn, webId, name, img };
  },
});
</script>

<style lang="scss" scoped>
.p-toolbar {
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  height: 75px;
  border: 0;
  box-shadow: 0 0 10px -5px black;
}

.p-toolbar-group-left {
  span {
    margin-left: 10px;
    margin-right: 10px;
    font-size: 150%;
    max-width: 59.5vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .p-avatar {
    width: 2.357rem;
    height: 2.357rem;
  }

  a {
    color: inherit;
    /* blue colors for links too */
    text-decoration: inherit;
    /* no underline */
  }
}
</style>
