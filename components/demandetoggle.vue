<template>
  <div class="relative">
    <!-- Bouton principal -->
    <button
      @click="isOpen = !isOpen"
      :class="['flex gap-2 w-full px-4 py-2 text-left rounded transition', btnClass, textClass]"
    >
      <DemandeIcon />
      Demandes
    </button>

    <!-- Menu déroulant -->
    <div v-if="isOpen" :class="['absolute left-0 mt-2 w-56 rounded shadow-lg z-50', dropdownClass]">
      <NuxtLink
        to="/dashboard/demande-stage"
        :class="[
          'block px-4 py-2 rounded transition',
          hoverClass,
          textClass,
          route.path === '/dashboard/demande-stage' ? 'bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white font-semibold' : ''
        ]"
      >
        🎓 Demander un Stage
      </NuxtLink>

      <NuxtLink
        to="/dashboard/liste-demandes"
        :class="[
          'block px-4 py-2 rounded transition',
          hoverClass,
          textClass,
          route.path === '/dashboard/liste-demandes' ? 'bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white font-semibold' : ''
        ]"
      >
        📋 Liste des demandes
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import DemandeIcon from '../components/icons/demandeicon.vue'

const props = defineProps<{ theme: string }>()

const isOpen = ref(false)
const route = useRoute()

// Classes conditionnelles selon le thème
const textClass = computed(() => props.theme === 'dark' ? 'text-white' : 'text-black')
const btnClass = computed(() => props.theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200')
const dropdownClass = computed(() => props.theme === 'dark' ? 'bg-gray-800' : 'bg-white')
const hoverClass = computed(() => props.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
</script>
