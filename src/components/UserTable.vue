<script lang="ts">
import { defineComponent, onMounted, ref, Ref , computed} from 'vue';
import axios from 'axios';
import Modal from './Modal.vue'
import {User} from '../common/types'


export default defineComponent({
  name: 'UserTable',
  components: {
    Modal
  },
  setup() {
    const users: Ref<User[]> = ref([]);
    const isVisible: Ref<boolean> = ref(false);
    const currentPage: Ref<number> = ref(1);
    const pageSize: Ref<number> = ref(7);
    const totalUsers: Ref<number> = ref(0);

    const totalPages = computed(() => {
      return Math.ceil(totalUsers.value / pageSize.value);
    });

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return users.value.slice(start, start + pageSize.value);
    });

    const fetchUsers = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      users.value = response.data;
      totalUsers.value = response.data.length
    };
    
    const addUser = (newUser: User) => {
      users.value.push({ ...newUser, id: users.value.length + 1 });
    };

    const deleteUser = (userId: number) => {
      users.value = users.value.filter(user => user.id !== userId);
    };

    const changePage = (newPage: number) => {
      currentPage.value = newPage;
    };

    onMounted(fetchUsers);

     return { paginatedUsers, addUser, deleteUser, isVisible, changePage, currentPage, totalPages };
  }
});

</script>

<template>
  <div class="container">
    <div class="wrapper" style="display: flex; justify-content: flex-end; width:100% ">
      <button type="button" class="btn btn-primary" @click="isVisible=true">
        <font-awesome-icon icon="plus" /> Create New User
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
        <tr v-for="(user, index) in paginatedUsers" :key="user.id">
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
    <nav aria-label="User pagination">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
        </li>
      </ul>
    </nav>
    <Modal v-if="isVisible" :isVisible="isVisible" @close="isVisible=false" @new-user="addUser"></Modal>
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