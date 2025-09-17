<template>
  <div class="relative min-h-screen flex items-center bg-[url('/assets/images/monfond.jpg')] bg-cover bg-center justify-center px-4">
    
    <!-- Overlay sombre -->
    <div class="absolute inset-0 bg-black/70 z-10"></div>

    <!-- Formulaire admin -->
    <div class="relative z-20 w-full max-w-md backdrop-blur-md bg-transparent p-8 rounded-xl shadow-xl animate-fade-in border border-white/20">
      <h2 class="text-3xl font-bold text-center mb-6 text-white">Connexion Administrateur</h2>

      <form @submit.prevent="handleAdminLogin">
        <!-- Email -->
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-white">Email admin</label>
          <input
            type="email"
            v-model="form.email"
            class="w-full px-4 py-2 border border-white/50 rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="admin@example.com"
            required
          />
        </div>

        <!-- Mot de passe -->
        <div class="mb-6 relative">
          <label class="block mb-1 text-sm font-medium text-white">Mot de passe</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            class="w-full px-4 py-2 border border-white/50 rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="********"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute top-[38px] right-3 text-white/80 hover:text-white"
          >
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a10.05 10.05 0 01.175-.825M9.88 9.88a3 3 0 014.24 4.24M3 3l18 18"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z"
              />
            </svg>
          </button>
        </div>

        <!-- Bouton avec spinner -->
        <BaseButton type="submit" class="w-full flex items-center justify-center gap-2" :disabled="loading">
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span v-if="!loading">Se connecter</span>
        </BaseButton>
      </form>

      <p v-if="errorMessage" class="text-red-400 text-sm text-center mt-4">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../components/base/button.vue'

const form = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()

const handleAdminLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch('https://digit-cursus-backend.onrender.com/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password
      })
    })

    const responseText = await response.text()
    const data = JSON.parse(responseText)

    if (!response.ok) {
      throw new Error(data.message || 'Erreur de connexion')
    }

    // Vérifie si l'utilisateur a le rôle admin
    if (data.user?.role !== 'admin') {
      throw new Error("Accès réservé aux administrateurs.")
    }

    localStorage.setItem('auth_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('user', JSON.stringify(data.user))

    console.log('✅ Admin connecté')
    router.push('/admin/dashboard')
  } catch (err: any) {
    console.error('❌ Erreur de connexion admin :', err)
    errorMessage.value = err.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
</style>
