<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { User } from '../common/types';

export default defineComponent({
  name: 'Modal',
  props: {
    isVisible: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  },
  emits: ['close', 'new-user'],
  setup(_props, {emit}) {
    const user = ref<User>({
      name: '',
      userName: '',
      email: '',
      address: {
        street: '',
        city: '',
        zipcode: '',
        geo: {
          lat: '' ,
          lng: ''
        }
      },
      phoneNumber: '',
    });

    const errors = ref({
      name: '',
      userName: '',
      email: '',
      street: '',
      city: '',
      zipcode: '',
      phoneNumber: '',
      lat: '',
      lng: '',
    });

    const useLocation = ref(false);

    const validateForm = () => {
      errors.value.name = user.value.name ? '' : 'Full name is required.';
      errors.value.street = user.value.address.street ? '' : 'Address is required.';
      errors.value.phoneNumber = user.value.phoneNumber && /^\d{10}$/.test(user.value.phoneNumber) ? '' : 'Phone number is invalid.';
      errors.value.userName = user.value.userName ? '' : 'Username is required';
      errors.value.city = user.value.address.city ? '' : 'City is required';
      errors.value.email = user.value.email && /\S+@\S+\.\S+/.test(user.value.email) ? '' : 'Email is invalid.';
      errors.value.zipcode = user.value.address.zipcode ? '' : 'Zip Code is required'

      const isValid = !Object.values(errors.value).some(error => error !=='')

    if (isValid) {
        emit('new-user', user.value);
        emit('close'); 
      }
      return isValid;
    };

    return { user, errors, validateForm, useLocation };
  },
 
});
</script>

<template>
  <div class="modal fade" :class="{ show: isVisible }" style="display: block;" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">New User Info</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="validateForm">
            <div class="row">
              <div class="col">
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="name" v-model="user.name" placeholder="John Gonzales">
                  <div v-if="errors.name" class="invalid-feedback d-block">{{ errors.name }}</div>
                </div>
              </div>
              <div class="col-12 col-md-6"> <!-- Adjusted for label, checkbox, and input layout -->
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2"> <!-- Flex container for horizontal alignment -->
                    <label for="addressCheckbox" class="form-check-label">Location</label>
                    <div class="d-flex align-items-center gap-1"> <!-- Inline container for checkbox and description -->
                      <input type="checkbox" class="form-check-input" id="addressCheckbox" v-model="useLocation">
                      <span class="me-2">Use Google Location</span> <!-- Description next to the checkbox -->
                    </div>
                  </div>
                  <input type="text" class="form-control" id="street" v-model="user.address.street" placeholder="River 43">
                  <div v-if="errors.street" class="invalid-feedback d-block">{{ errors.street }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="mb-3">
                  <label for="userName" class="form-label">Username</label>
                  <input type="text" class="form-control" id="userName" v-model="user.userName" placeholder="johngonzales123">
                  <div v-if="errors.userName" class="invalid-feedback d-block">{{ errors.userName }}</div>
                </div>
              </div>
              <div class="col">
                <div class="mb-3">
                  <label for="city" class="form-label">City</label>
                  <input type="text" class="form-control" id="city" v-model="user.address.city" placeholder="Tirana">
                  <div v-if="errors.city" class="invalid-feedback d-block">{{ errors.city }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" v-model="user.email" placeholder="johngonzales123@gmail.com">
                  <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
                </div>
              </div>
              <div class="col">
                <div class="mb-3">
                  <label for="zipCode" class="form-label">Zip Code</label>
                  <input type="zipCode" class="form-control" id="zipCode" v-model="user.address.zipcode" placeholder="1060">
                  <div v-if="errors.zipcode" class="invalid-feedback d-block">{{ errors.zipcode }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="mb-3 phone-max-width">
                  <label for="phoneNumber" class="form-label">Phone Number</label>
                  <input type="text" class="form-control" id="phoneNumber" v-model="user.phoneNumber" placeholder="Enter phone number">
                  <div v-if="errors.phoneNumber" class="invalid-feedback d-block">{{ errors.phoneNumber }}</div>
                </div>
              </div>
              <div class="col-6" v-if="useLocation"> <!-- Conditional rendering for both lat and lng -->
                <div class="row">
                  <div class="col-6">
                    <div class="mb-3">
                      <label for="latitude" class="form-label">Latitude</label>
                      <input type="text" class="form-control" id="latitude" v-model="user.address.geo.lat" placeholder="Latitude">
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="mb-3">
                      <label for="longitude" class="form-label">Longitude</label>
                      <input type="text" class="form-control" id="longitude" v-model="user.address.geo.lng" placeholder="Longitude">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">Close</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade" :class="{ show: isVisible }"></div>
</template>

<style scoped>
  .modal-dialog {
   max-width: 700px;
  }

  .form-control::placeholder {
   color: grey;
   opacity: 0.7;
  }

  .form-field-container {
   width: 100%; 
  }

  .form-control {
  width: 100%; /* Make the input take the full width of its container */
}

</style>