<template>
  <div class="min-h-screen bg-dashboard text-white flex">
    <!-- Sidebar fixe -->
    <aside class="w-64 bg-[#151515] p-6 space-y-4 border-r border-[#000000] fixed top-0 bottom-0 z-40">
      <h1 class="text-2xl border-b border-black/40 font-bold mb-12">DigitConsults</h1>
      <hr>
      <nav class="space-y-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-2 hover:bg-gray-600 transition rounded"
        >
          <component :is="item.icon" class="w-5 h-5 text-white" />
          <span>{{ item.name }}</span>
        </NuxtLink>
    <!-- Offres (même composant, items différents) -->
        </nav>
    </aside>
    <!-- Wrapper contenu principal -->
    <div class="flex border-r border-[#000000] flex-col flex-1 ml-64 relative">
      <!-- Navbar -->
      <header
        class="bg-[#151515] border-r border-[#000000] text-white px-8 py-4 flex justify-between items-center fixed top-0 right-0 left-64 z-50 shadow"      >
        <div class="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search for job, candidates and more..."
            class="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
         <div class="ml-210 flex items-center gap-5">
          <!-- Avatar + menu déroulant -->
              <NuxtLink>
                 <img class="" src="../assets/images/nav_img/setting.png" alt="">
              </NuxtLink>
              <NuxtLink>
                  <img class="" src="../assets/images/nav_img/notif.png" alt="">
              </NuxtLink>
          <div ref="menuRef" class="relative">
            <button @click="isOpen = !isOpen" class="focus:outline-none">
              <img
                src="/assets/images/etudiant.jpg"
                alt="Avatar"
                class="w-10 h-10 rounded-full object-cover border-2 transition"
              />
            </button>
            <div
              v-if="isOpen"
              class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
            >
              <ul class="py-2 text-gray-700">
                <li>
                  <NuxtLink
                    to="/auth/login"
                    class="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    🚪 Se déconnecter
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/profile"
                    class="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    👤 Mon Profil
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
       </div>
        </div>
      </header>
      <!-- Zone de contenu -->
      <main class="p-8 pt-28 bg-[#151515] space-y-8 h-full overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SidebarToggle from '@/components/entreprise/sidebartoogle.vue'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

// Composants
import DashboardIcon from '@/components/icons/dashboardicon.vue'
import Supports from '@/components/entreprise/Supports.vue'
// Dropdown
const isOpen = ref(false)
const menuRef = ref(null)

onClickOutside(menuRef, () => {
  isOpen.value = false
})

// Menu de navigation
const navItems = [
  { name: 'Statistiques', path: '/dashboard_entreprise/statistiques', icon: DashboardIcon },
   { name: 'Demandes recus', path: '/dashboard_entreprise/candidatures/liste', icon: Supports },

]
</script>