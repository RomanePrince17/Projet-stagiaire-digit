<template>
  <div class="relative min-h-screen flex items-center bg-[url('/assets/images/monfond.jpg')] bg-cover bg-center justify-center px-4">
    

    <!-- Overlay sombre -->
    <div class="absolute inset-0 bg-black/70 z-10"></div>

    <!-- Formulaire -->
    <div class="relative z-20 w-full max-w-md backdrop-blur-md bg-transparent p-8 rounded-xl shadow-xl animate-fade-in border border-white/20">
      <h2 class="text-3xl font-bold text-center mb-6 text-white">Créer un compte</h2>

      <form @submit.prevent="handleRegister">
        <!-- Nom complet -->
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-white">Nom complet</label>
          <input
            type="text"
            v-model="form.username"
            class="w-full px-4 py-2 border border-white/50 rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Jean Dupont"
            required
          />
        </div>
        <!-- Email -->
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-white">Email</label>
          <input
            type="email"
            v-model="form.email"
            class="w-full px-4 py-2 border border-white/50 rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="email@example.com"
            required
          />
        </div>

        <!-- Mot de passe avec visibilité -->
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
            <!-- Place ici ton icône eye ou eye-off -->
          </button>
        </div>

        <!-- Bouton d'inscription -->
        <BaseButton type="submit" class="w-full" :disabled="loading">
          <span v-if="loading">Création...</span>
          <span v-else>S'inscrire</span>
        </BaseButton>
      </form>

      <p class="text-sm text-center mt-6 text-white/80">
        Déjà inscrit ?
        <NuxtLink to="/auth/login" class="text-white hover:underline font-medium">Se connecter</NuxtLink>
      </p>

      <p v-if="errorMessage" class="text-red-400 text-sm text-center mt-4">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import BaseButton from '../components/base/button.vue'

const router = useRouter()
const form = ref({ username: '', email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.post(
      'https://digit-cursus-backend.onrender.com/api/auth/register/',
      {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )

    console.log('✅ Inscription réussie', response.data)
    router.push('/auth/login')
  } catch (error: any) {
    console.error('Erreur complète du serveur :', error.response?.data)
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.data?.detail) {
      errorMessage.value = error.response.data.detail
    } else if (error.response?.data) {
      const firstError = Object.values(error.response.data)[0]
      errorMessage.value = Array.isArray(firstError) ? firstError[0] : firstError
    } else {
      errorMessage.value = 'Une erreur est survenue. Veuillez réessayer plus tard.'
    }
  } finally {
    loading.value = false
  }
}

definePageMeta({ layout: false })
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
</style>
