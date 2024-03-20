<script lang="ts">
import { defineComponent } from 'vue';
import UserTable from './components/UserTable.vue';

export default defineComponent({
  name: 'App',
  components: {
    UserTable
  }
});
</script>

<template>
  <UserTable/>
</template>
