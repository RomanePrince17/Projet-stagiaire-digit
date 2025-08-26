<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex gap-2 w-full px-4 py-2 text-left  text-white rounded transition"
    >
    <DemandeIcon/>
       Demandes
    </button>
    <div v-if="isOpen" class="absolute left-0 mt-2 w-56 bg-gray-800 rounded shadow-lg z-50">
      <NuxtLink active-class="bg-[#6E3870]" to="/dashboard/demande-stage" class="block px-4 py-2 hover:bg-gray-700 text-white">🎓 Demander un Stage </NuxtLink>
      <!-- <NuxtLink active-class="bg-[#6E3870]" to="/dashboard/stage-professionnel" class="block px-4 py-2 hover:bg-gray-700 text-white">🎓 Stage Professionnel</NuxtLink> -->
      <!-- <NuxtLink to="/dashboard/demande-emploi" class="block px-4 py-2 hover:bg-gray-700 text-white">🧑‍💼 Emploi</NuxtLink> -->
      <NuxtLink to="/dashboard/liste-demandes" class="block px-4 py-2 hover:bg-gray-700 text-white">📋 Liste des demandes</NuxtLink>
    </div>
  </div>
</template>
<script lang="ts" setup>
import DemandeIcon from '../components/icons/demandeicon.Vue'
import { ref } from 'vue'
const isOpen = ref(false)
</script>
