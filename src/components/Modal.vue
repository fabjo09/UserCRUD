<template>
    <div class="modal fade" :class="{ show: isVisible }" style="display: block;" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Modal Title</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"> 
            </button>
          </div>
          <div class="modal-body">
            <slot></slot> <!-- Use slot for modal body content -->
          </div>
          <div class="modal-footer">
            <button type="submit" color="white" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ show: isVisible }"></div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    name: 'Modal',
    props: {
      isVisible: {
        type: Boolean as PropType<boolean>,
        required: true
      }
    },
    emits: ['close']
  });
  </script>
  
  