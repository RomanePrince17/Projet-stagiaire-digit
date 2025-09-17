<template>
  <div class="relative min-h-screen flex bg-gray-100">
    <!-- Contenu principal -->
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-6">Tableau de bord</h1>
      <p class="text-gray-600 mb-4">Voici la zone principale de contenu.</p>

      <!-- Bouton ouvrir profil -->
      <button
        @click="openProfile = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Voir mon profil
      </button>
    </div>

    <!-- Overlay noir (mobile & desktop) -->
    <transition name="fade">
      <div
        v-if="openProfile"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="closeProfile"
      ></div>
    </transition>

    <!-- Modal profil côté droit -->
    <transition name="slide-left">
      <div
        v-if="openProfile"
        class="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl z-50 flex flex-col"
      >
        <!-- Header profil -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-xl font-bold">Mon Profil</h2>
          <button
            @click="closeProfile"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <!-- Contenu profil -->
        <div class="p-6 flex-1 overflow-y-auto">
          <div class="flex items-center mb-6">
            <img
              src="https://via.placeholder.com/80"
              alt="Photo de profil"
              class="w-20 h-20 rounded-full border"
            />
            <div class="ml-4">
              <h3 class="text-lg font-semibold">Romane Gbehoun</h3>
              <p class="text-sm text-gray-500">Développeur Web</p>
            </div>
          </div>

          <div>
            <h4 class="font-semibold mb-2">À propos</h4>
            <p class="text-gray-600 text-sm">
              Passionné par le développement web et la création de solutions
              modernes. Toujours prêt à apprendre et à évoluer.
            </p>
          </div>

          <div class="mt-6">
            <h4 class="font-semibold mb-2">Compétences</h4>
            <ul class="list-disc list-inside text-sm text-gray-600">
              <li>Vue.js & Nuxt.js</li>
              <li>Laravel & PHP</li>
              <li>TailwindCSS</li>
              <li>MySQL</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t">
          <button
            @click="closeProfile"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue"

const openProfile = ref(false)

const closeProfile = () => {
  openProfile.value = false
}
</script>

<style scoped>
/* Animation overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animation slide-in */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
