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
        <div class="mb-4 relative">
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
            <!-- Icône eye/eye-off -->
          </button>
        </div>

        <!-- Confirmation du mot de passe -->
        <div class="mb-6 relative">
          <label class="block mb-1 text-sm font-medium text-white">Confirmer le mot de passe</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password_confirm"
            class="w-full px-4 py-2 border border-white/50 rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="********"
            required
          />
        </div>

        <!-- Bouton d'inscription -->
        <BaseButton type="submit" class="w-full flex items-center justify-center gap-2" :disabled="loadingRegister">
          <svg v-if="loadingRegister" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          <span v-if="loadingRegister">Création...</span>
          <span v-else>S'inscrire</span>
        </BaseButton>
      </form>

      <p class="text-sm text-center mt-6 text-white/80">
        Déjà inscrit ?
        <NuxtLink to="/auth/login" class="text-white hover:underline font-medium">Se connecter</NuxtLink>
      </p>

      <!-- Bouton retour -->
      <div class="mt-6 text-center">
        <button
          @click="$router.back()"
          class="inline-flex items-center px-6 py-2 rounded-full border border-white/50 text-white hover:bg-white/10 transition font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
      </div>

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
const form = ref({
  username: '',
  email: '',
  password: '',
  password_confirm: ''
})
const showPassword = ref(false)
const loadingRegister = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  loadingRegister.value = true
  errorMessage.value = ''

  // Validation locale : vérifier si les mots de passe correspondent
  if (form.value.password !== form.value.password_confirm) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    loadingRegister.value = false
    return
  }

  try {
    const response = await axios.post(
      'https://digit-cursus-backend.onrender.com/api/auth/register/',
      {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        password_confirm: form.value.password_confirm
      },
      { headers: { 'Content-Type': 'application/json' } }
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
    loadingRegister.value = false
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
