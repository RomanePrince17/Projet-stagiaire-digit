<template> 
  <div class="relative">
    <!-- Bouton déconnexion -->
    <button
      @click="logout"
      :class="['flex items-center gap-2 px-4 py-2 rounded transition w-full justify-start', btnClass, textClass]"
    >
      <!-- SVG de déconnexion -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
      </svg>
      <span>Se déconnecter</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{ theme: string }>()

// Classe conditionnelle selon le thème
const textClass = computed(() => props.theme === 'dark' ? 'text-white' : 'text-black')
const btnClass = computed(() => props.theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200')

// Reference pour localStorage côté client
const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

const logout = () => {
  if (!isClient.value) return // on s'assure qu'on est côté client
  if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
    localStorage.removeItem('token') // ou autre selon ton auth
    window.location.href = '/auth/login'
  }
}
</script>
