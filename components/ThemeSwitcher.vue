<template>
  <div :class="['min-h-screen transition-colors duration-300', theme === 'dark' ? 'dark' : '']">
    <div class="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-6">
      <button @click="toggleTheme" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
        Passer en {{ theme === 'light' ? 'Dark' : 'Light' }}
      </button>
      <h1 class="mt-10 text-2xl">Bienvenue sur mon appli Nuxt {{ theme }} mode !</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  if (theme.value === 'dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
  localStorage.setItem('theme', theme.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
    if (savedTheme === 'dark') document.documentElement.classList.add('dark')
  }
})
</script>
