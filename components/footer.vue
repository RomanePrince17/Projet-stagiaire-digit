<template>
    <footer class="bg-gray-900 text-gray-300 py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        
        <!-- Logo / Nom -->
        <div class="mb-4 md:mb-0 text-white font-bold text-xl">
          WiseRead
        </div>
  
        <!-- Liens utiles -->
        <nav class="flex space-x-6 mb-4 md:mb-0">
          <NuxtLink to="/accueil" class="hover:text-white">Accueil</NuxtLink>
          <NuxtLink to="/exploiter" class="hover:text-white">Explorer</NuxtLink>
          <NuxtLink to="/historique" class="hover:text-white">Historique</NuxtLink>
          <NuxtLink to="/groupes" class="hover:text-white">Groupes</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-white">Contact</NuxtLink>
        </nav>
  
        <!-- Copyright -->
        <div class="text-sm">
          &copy; 2025 WiseRead. Tous droits réservés.
        </div>
  
      </div>
    </footer>
  </template>
  <script>
  export default{
    
    data(){

    }
  }
</script>