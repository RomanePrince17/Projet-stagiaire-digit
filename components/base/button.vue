<template>
  <button
    :type="type"
    class="w-full bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white py-2 rounded-md hover:bg-gradient-to-b transition duration-300"
    @click="onClick"
  >
    <slot>S'inscrire</slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}>()
</script>
