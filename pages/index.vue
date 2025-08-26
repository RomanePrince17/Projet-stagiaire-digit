<template> 
<div class="relative h-screen bg-[url('/assets/images/monfond.jpg')] bg-cover bg-center">
    <!-- Header -->
    <header class="fixed top-0 left-0 w-full backdrop-blur-md text-white shadow z-50">
      <div class="container mx-auto flex items-center justify-between py-4 px-6">
        <div class="text-xl font-bold">
          <div class="relative z-10 text-center gap-2 flex animate-fadeInUp">
            <div>
              <img src="/assets/images/digit.jpg" class="h-15 w-15" alt="">
            </div>
            <div class="mt-3">
              <h2 class="text-3xl font-bold mb-6">
                <em class="-mt-20 font-serif text-blue-400">Digit</em> Consults
              </h2>
            </div>
          </div>         
        </div>
        <nav class="space-x-4 hidden md:flex">
          <NuxtLink 
            to="/" 
            class="border border-blue-300 text-blue-300 px-3 py-2 rounded-none hover:bg-blue-400 hover:text-white transition"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="auth/register" 
            class="border-2 border-yellow-400 text-yellow-400 px-4 py-2 rounded-none hover:bg-yellow-400 hover:text-black transition"
          >
            S'inscrire
          </NuxtLink>
          <NuxtLink 
            to="auth/login" 
            class="border-2 border-yellow-400 text-yellow-400 px-4 py-2 rounded-none hover:bg-yellow-400 hover:text-black transition"
          >
            Se connecter
          </NuxtLink>
        </nav>
      </div>
    </header>

   
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
</script>
