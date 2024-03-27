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
    const editableUser = ref<User | null>(null);
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

    const handleUserUpdate = (userFromModal: User) => {
      const index = users.value.findIndex(user => user.id === userFromModal.id);
      if (index !== -1) {
        users.value[index] = { ...userFromModal };
      } else {
        const newUser = { ...userFromModal, id: users.value.length + 1 };
        users.value.push(newUser);
        totalUsers.value += 1;
      }
      isVisible.value = false;
    };
    
    const openModalForEdit = (user: User) => {
      editableUser.value = { ...user };
      isVisible.value = true;
    };

    const openModalForNewUser = () => {
      editableUser.value = null; 
      isVisible.value = true;
    };

    const deleteUser = (userId: number) => {
      users.value = users.value.filter(user => user.id !== userId);
      totalUsers.value = users.value.length;
    };

    const changePage = (newPage: number) => {
      currentPage.value = newPage;
    };

    onMounted(fetchUsers);

     return { paginatedUsers,openModalForEdit,handleUserUpdate, openModalForNewUser, deleteUser, isVisible, changePage, currentPage, totalPages,editableUser };
  }
});

</script>

<template>
  <div class="container">
    <div class="wrapper" style="display: flex; justify-content: flex-end; width:100% ">
      <button type="button" class="btn btn-primary" @click="openModalForNewUser">
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
        <tr v-for="(user) in paginatedUsers" :key="user.id">
          <th scope="row">{{ user.id }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td style="justify-content: space-around;">
            <button class="btn" @click="openModalForEdit(user)">
              <font-awesome-icon icon="pen"/>
            </button>
            <button class="btn delete" @click="deleteUser(user.id)" title="Delete">
              <font-awesome-icon icon="trash" @click="deleteUser(user.id)" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="User pagination" v-if="totalPages > 1">
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
    <Modal v-if="isVisible" :isVisible="isVisible" :user="editableUser" @close="isVisible=false"  @new-user="handleUserUpdate"></Modal>
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

.table tbody tr {
  border: 1px solid black;
  margin-bottom: 15px;
}

.table {
  border-collapse: separate;
  border-spacing: 0 10px;
}

</style>