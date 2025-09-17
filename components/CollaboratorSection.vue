<!-- SidebarCollaborateurs.vue -->
<template>
  <div class="relative">
    <!-- Bouton principal -->
    <button
      @click="isOpen = !isOpen"
      :class="['flex gap-2 w-full px-4 py-2 text-left rounded transition', btnClass, textClass]"
    >
      <CollaboratorIcon />
      Collaborateurs
    </button>

    <!-- Menu déroulant -->
    <div v-if="isOpen" :class="['absolute left-0 mt-2 w-56 rounded shadow-lg z-50', dropdownClass]">
      <button @click="$emit('select','create')" :class="itemClass('/create')">➕ Créer</button>
      <button @click="$emit('select','list')" :class="itemClass('/list')">📋 Liste</button>
      <button @click="$emit('select','reports')" :class="itemClass('/reports')">📊 Rapports</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import CollaboratorIcon from '@/components/icons/collaboratoricon.vue'

const props = defineProps<{ theme: string, active?: string }>()
const isOpen = ref(false)

const textClass = computed(() => props.theme === 'dark' ? 'text-white' : 'text-black')
const btnClass = computed(() => props.theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200')
const dropdownClass = computed(() => props.theme === 'dark' ? 'bg-gray-800' : 'bg-white')
const hoverClass = computed(() => props.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200')

const itemClass = (path: string) => {
  return [
    'block px-4 py-2 rounded transition w-full text-left',
    hoverClass,
    textClass,
    props.active === path ? 'bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white font-semibold' : ''
  ]
}
</script>
