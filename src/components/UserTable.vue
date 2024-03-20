<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default defineComponent({
  name: 'UserTable',
  setup() {
    const users = ref<User[]>([]);

    const fetchUsers = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      users.value = response.data;
    };

    const deleteUser = (userId: number) => {
      users.value = users.value.filter(user => user.id !== userId);
    };

    onMounted(fetchUsers);

    return { users, deleteUser };
  }
});

</script>

<template>
  <div class="container">
    <h1>Users</h1>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Username</th>
          <th scope="col">Email</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button class="btn btn-danger" @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
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