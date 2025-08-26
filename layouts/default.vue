<template>
  <div class="min-h-screen bg-[#151515] text-white flex relative overflow-x-hidden">
    <!-- Overlay (mobile only) -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    ></div>
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-[#151515] w-64 p-6 space-y-4 border-r border-[#000000] fixed top-0 bottom-0 z-50 md:z-40 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:block'
      ]"
    >
      <h1 class="text-2xl border-b border-black/40 font-bold mb-12">DigitConsults App</h1>
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
        <DemandesToggle />
      </nav>
    </aside>
    <!-- Contenu principal -->
    <div :class="['flex flex-col flex-1 relative transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-0 md:ml-64']">
      <!-- Navbar -->
      <header
        :class="[
          'bg-[#151515] border-b border-[#000000] text-white px-4 md:px-8 py-4 flex justify-between  items-center fixed top-0 z-50 shadow transition-all duration-300',
          sidebarOpen ? 'left-64' : 'left-0 md:left-64', 'right-0'
        ]"
      >
        <!-- Gauche : Hamburger + search -->
        <div class="flex items-center gap-4 w-full max-w-md">
          <!-- Hamburger (mobile only) -->
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="md:hidden text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <!-- Search bar -->
          <input
            type="text"
            placeholder="Search for job, candidates and more..."
            class="sm:block px-4 py-2 sm:p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <!-- Droite : Actions -->
        <div class="flex items-center gap-5">
          <NuxtLink>
            <img class="w-6 h-6 object-contain" src="../assets/images/nav_img/setting.png" alt="Settings" />
          </NuxtLink>
          <NuxtLink>
            <img class="w-6 h-6 object-contain" src="../assets/images/nav_img/notif.png" alt="Notifications" />
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
                  <NuxtLink to="/auth/login" class="block px-4 py-2 hover:bg-gray-100 transition">
                    🚪 Se déconnecter
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/dashboard/profil" class="block px-4 py-2 hover:bg-gray-100 transition">
                    👤 Mon Profil
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenu dynamique -->
      <main class="p-4 pt-28 md:p-8 bg-[#151515] space-y-8 h-full overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

// Sidebar toggle
const sidebarOpen = ref(false)

// Dropdown menu toggle
const isOpen = ref(false)
const menuRef = ref(null)
onClickOutside(menuRef, () => {
  isOpen.value = false
})

// Composants personnalisés
import DemandesToggle from '@/components/demandetoggle.vue'
import DashboardIcon from '@/components/icons/dashboardicon.vue'

// Navigation
const navItems = [
  { name: 'Tableau de bord', path: '/dashboard/statistiques', icon: DashboardIcon },
]
</script>
