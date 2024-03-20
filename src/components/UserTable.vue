<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import Modal from './Modal.vue'


interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export default defineComponent({
  name: 'UserTable',
  components: {
    Modal
  },
  setup() {
    const users = ref<User[]>([]);
    const isVisible = ref(false)

    const fetchUsers = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      users.value = response.data;
    };
    
    const deleteUser = (userId: number) => {
      users.value = users.value.filter(user => user.id !== userId);
    };

    onMounted(fetchUsers);

    return { users, deleteUser , isVisible};
  }
});

</script>

<template>
  <div class="container">
    <div class="wrapper" style="display: flex; justify-content: flex-end; width:100% ">
      <button type="button" class="btn btn-primary" @click="isVisible=true">
        <i class="fas fa-plus" style="margin-right: 5px;"></i> Create New User
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td style="justify-content: space-around;">
            <font-awesome-icon icon="pen" style="margin-right: 20px;" />
            <button class="btn delete" @click="deleteUser(user.id)" title="Delete">
              <font-awesome-icon icon="trash" @click="deleteUser(user.id)" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <Modal v-if="isVisible" :isVisible= "isVisible" @close="isVisible = false">
      AAA
    </Modal>
  </div>
</template>


<style scoped>
.container {
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

}


@media (max-height: 600px) {
  .container {
    padding: 10px; 
  }
}

@media (max-width: 400px) {
  .container {
    padding: 5px;
  }
}
</style>