<template>
  <button
  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<script setup>
    defineProps({
        label: String
    })
        function handleclick(){
            alert('cliqué')

        };
    
    

</script>