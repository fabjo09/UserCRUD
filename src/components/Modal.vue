<script lang="ts">
import { defineComponent, ref, watch, computed, PropType } from 'vue';
import { User } from '../common/types';

export default defineComponent({
  name: 'Modal',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object as PropType<User | null>,
      default: () => null
    }
  },
  emits: ['close', 'new-user'],
  setup(props, { emit }) {
    const user = ref<User>({
      id: 0,
      name: '',
      username: '',
      email: '',
      address: {
        street: '',
        city: '',
        zipcode: '',
        geo: {
          lat: '',
          lng: ''
        }
      },
      phone: '',
    });

    const errors = ref({
      name: '',
      username: '',
      email: '',
      street: '',
      city: '',
      zipcode: '',
      phone: '',
      lat: '',
      lng: '',
    });

    const useLocation = ref(false);

    const safeUser = computed(() => {
      return props.user || user.value;
    });

    let autocomplete;

    const initAutocomplete = () => {
      autocomplete = new google.maps.places.Autocomplete(document.getElementById('street'), { types: ['geocode'] });
      autocomplete.addListener('place_changed', fillInAddress);
    };
    

    const fillInAddress = () => {
      const place = autocomplete.getPlace();
      let address = { street: '', city: '', zipcode: '', geo: { lat: '', lng: '' } };

      for (const component of place.address_components) {
        const addressType = component.types[0];
        switch (addressType) {
          case 'route':
            address.street = component.long_name;
            break;
          case 'locality':
            address.city = component.long_name;
            break;
          case 'postal_code':
            address.zipcode = component.long_name;
            break;
        }
      }

      if (place.geometry) {
        address.geo.lat = place.geometry.location.lat().toString();
        address.geo.lng = place.geometry.location.lng().toString();
      }

      user.value.address = address;
    };

    watch(() => props.isVisible, (newValue) => {
      if (newValue && window.google && window.google.maps && useLocation.value) {
        initAutocomplete();
      }
    });
    

    watch(() => props.user, (newUser) => {
      if (newUser) {
        user.value = JSON.parse(JSON.stringify(newUser));
      } else {
        user.value = { id: 0, name: '', username: '', email: '', address: { street: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }, phone: '' };
      }
    }, { immediate: true });

    const validateForm = () => {
    const phoneRegex = /^[\d-]+$/;
    const zipcodeRegex = /^[\d-]+$/;

    errors.value = {
        name: safeUser.value.name ? '' : 'Full name is required.',
        username: safeUser.value.username ? '' : 'Username is required',
        email: safeUser.value.email && /\S+@\S+\.\S+/.test(safeUser.value.email) ? '' : 'Email is invalid.',
        street: safeUser.value.address.street ? '' : 'Address is required.',
        city: safeUser.value.address.city ? '' : 'City is required',
        zipcode: safeUser.value.address.zipcode && zipcodeRegex.test(safeUser.value.address.zipcode) ? '' : 'Zip Code is required and must be numeric',
        phone: safeUser.value.phone && phoneRegex.test(safeUser.value.phone) ? '' : 'Phone number is required and must be numeric',
        lat: useLocation.value && safeUser.value.address.geo?.lat && /^[+-]?([0-9]*[.])?[0-9]+$/.test(safeUser.value.address.geo.lat) ? '' : (useLocation.value ? 'Latitude is required and must be a valid number.' : ''),
        lng: useLocation.value && safeUser.value.address.geo?.lng && /^[+-]?([0-9]*[.])?[0-9]+$/.test(safeUser.value.address.geo.lng) ? '' : (useLocation.value ? 'Longitude is required and must be a valid number.' : ''),
    };

    const isValid = !Object.values(errors.value).some(error => error !== '');

    if (isValid) {
        emit('new-user', JSON.parse(JSON.stringify(safeUser.value)));
        emit('close');
    }
};
  
    return { safeUser, errors, validateForm, useLocation , initAutocomplete};
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
                  <input type="text" class="form-control" id="name" v-model="safeUser.name" placeholder="John Gonzales">
                  <div v-if="errors.name" class="invalid-feedback d-block">{{ errors.name }}</div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label for="addressCheckbox" class="form-check-label">Address</label>
                    <div class="d-flex align-items-center gap-1">
                      <input type="checkbox" class="form-check-input" id="addressCheckbox" v-model="useLocation">
                      <span class="me-2">Use Google Location</span>
                    </div>
                  </div>
                  <input type="text" class="form-control" id="street" v-model="safeUser.address.street" placeholder="River 43" @focus="initAutocomplete">
                  <div v-if="errors.street" class="invalid-feedback d-block">{{ errors.street }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" v-model="safeUser.username" placeholder="johngonzales123">
                  <div v-if="errors.username" class="invalid-feedback d-block">{{ errors.username }}</div>
                </div>
              </div>
              <div class="col">
                <div class="mb-3">
                  <label for="city" class="form-label">City</label>
                  <input type="text" class="form-control" id="city" v-model="safeUser.address.city" placeholder="Tirana">
                  <div v-if="errors.city" class="invalid-feedback d-block">{{ errors.city }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" v-model="safeUser.email" placeholder="johngonzales123@gmail.com">
                  <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
                </div>
              </div>
              <div class="col">
                <div class="mb-3">
                  <label for="zipCode" class="form-label">Zip Code</label>
                  <input type="zipCode" class="form-control" id="zipCode" v-model="safeUser.address.zipcode" pattern="[\d-]+" placeholder="1060">
                  <div v-if="errors.zipcode" class="invalid-feedback d-block">{{ errors.zipcode }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="mb-3 phone-max-width">
                  <label for="phone" class="form-label">Phone Number</label>
                  <input type="text" class="form-control" id="phone" v-model="safeUser.phone" pattern="[\d-]+" placeholder="Enter phone number">
                  <div v-if="errors.phone" class="invalid-feedback d-block">{{ errors.phone }}</div>
                </div>
              </div>
              <div class="col-6" v-if="useLocation">
                <div class="row">
                  <div class="col-6">
                    <div class="mb-3">
                      <label for="latitude" class="form-label">Latitude</label>
                      <input type="text" class="form-control" id="latitude" v-model="safeUser.address.geo.lat" placeholder="Latitude">
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="mb-3">
                      <label for="longitude" class="form-label">Longitude</label>
                      <input type="text" class="form-control" id="longitude" v-model="safeUser.address.geo.lng" placeholder="Longitude">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
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
  width: 100%;
}

</style>