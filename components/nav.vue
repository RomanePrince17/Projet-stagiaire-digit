<template>
    <nav class="mt-4 relative">
      <ul class="flex text-lg ml-28 gap-140">
        <div class="text-blue-950 text-2xl font-bold">
          WiseRead
        </div>
        <div class="flex items-center gap-10">
          <li>
            <NuxtLink class="text-blue-950" to="/accueil">Accueil</NuxtLink>
          </li>
          <li>
            <NuxtLink class="text-blue-950" to="/exploiter">Explorer</NuxtLink>
          </li>
          <li>
            <NuxtLink class="text-blue-950" to="/historique">Historique</NuxtLink>
          </li>
          <li>
            <NuxtLink class="text-blue-950" to="/groupes">Groupes</NuxtLink>
          </li>
          <li>
            <NuxtLink class="text-blue-950" to="/contact">Contact</NuxtLink>
          </li>
  
          <!-- Icône utilisateur avec menu déroulant -->
          <li class="relative">
            <button @click="open = !open" class="rounded-sm focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                class="size-10 text-blue-950">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 
                    0a9 9 0 1 0-11.963 0m11.963 
                    0A8.966 8.966 0 0 1 12 21a8.966 
                    8.966 0 0 1-5.982-2.275M15 
                    9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
  
            <!-- Menu déroulant -->
            <div v-if="open" class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
              <ul class="py-2 text-gray-700">
                <li>
                  <NuxtLink to="/login" class="block px-4 py-2">Se connecter</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/logout" class="block px-4 py-2">Se déconnecter</NuxtLink>
                </li>
               
              </ul>
            </div>
          </li>
        </div>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const open = ref(false)
  
  // Ferme le menu si on clique en dehors
  const handleClickOutside = (event) => {
    if (!event.target.closest('nav')) {
      open.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  