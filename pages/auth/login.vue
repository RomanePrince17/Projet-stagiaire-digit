<template>
  <div class="relative min-h-screen flex items-center justify-center bg-[url('/assets/images/monfond.jpg')] bg-cover bg-center px-4 overflow-hidden">
    <!-- Overlay sombre -->
    <div class="absolute inset-0 bg-black/70 z-10"></div>

    <!-- Toast en haut à droite (hors du flux du formulaire) -->
    <transition name="toast">
      <div
        v-if="popupMessage"
        :class="[ 
          'fixed top-6 right-6 w-96 max-w-full p-4 rounded-lg shadow-lg text-white z-50 overflow-hidden flex items-center gap-3',
          popupType === 'error' ? 'bg-red-400 animate-shake' : 'bg-green-500'
        ]"
      >
        <!-- Icône -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-.01-10a9 9 0 110 18 9 9 0 010-18z"/>
        </svg>

        <!-- Message -->
        <p class="flex-1 font-medium">{{ popupMessage }}</p>

        <!-- Bouton fermeture -->
        <button @click="popupMessage = ''" class="ml-2 text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Barre de progression -->
        <div class="absolute bottom-0 left-0 w-full h-1 bg-white/30">
          <div
            class="h-1 bg-white transition-all duration-100 ease-linear"
            :style="{ width: progressBar + '%' }"
          ></div>
        </div>
      </div>
    </transition>

    <!-- Formulaire centré et figé -->
    <div class="relative z-20 w-full max-w-md backdrop-blur-md bg-transparent p-8 rounded-xl shadow-xl animate-fade-in border border-white/20">
      <h2 class="text-3xl font-bold text-center mb-6 text-gray-200">Connexion</h2>
      <h3 class="text-sm font-bold text-center mb-6 text-gray-300">
        Connectez-vous à votre compte pour accéder au dashboard
      </h3>

      <form @submit.prevent="handleLogin">
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
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a10.05 10.05 0 01.175-.825M9.88 9.88a3 3 0 014.24 4.24M3 3l18 18"/>
            </svg>
          </button>
        </div>

        <!-- Bouton avec spinner -->
        <BaseButton type="submit" class="w-full flex items-center justify-center gap-2" :disabled="loading">
          <template v-if="loading">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <span>Connexion...</span>
          </template>
          <template v-else>
            <span>Se connecter</span>
          </template>
        </BaseButton>
      </form>

      <p class="text-sm text-center mt-6 text-white/80">
        Pas encore de compte ?
        <NuxtLink to="/auth/register" class="text-white hover:underline font-medium">S'inscrire</NuxtLink>
      </p>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../components/base/button.vue'

const form = ref({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const router = useRouter()

// Toast state
const popupMessage = ref('')
const popupType = ref<'success' | 'error'>('success')
const progressBar = ref(100)
let timer: NodeJS.Timeout | null = null

const showPopup = (message: string, type: 'success' | 'error') => {
  popupMessage.value = message
  popupType.value = type
  progressBar.value = 100

  if (timer) clearInterval(timer)

  timer = setInterval(() => {
    progressBar.value -= 2
    if (progressBar.value <= 0) {
      popupMessage.value = ''
      clearInterval(timer!)
    }
  }, 100) // 5s
}

const handleLogin = async () => {
  loading.value = true

  try {
    const response = await fetch('https://digit-cursus-backend.onrender.com/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    const data = await response.json()
    if (!response.ok) throw new Error() // on ne passe plus le message du serveur

    // Sauvegarde des tokens
    localStorage.setItem('auth_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('user', JSON.stringify(data.user))

    showPopup('Connexion réussie ', 'success')

    // Redirection
    setTimeout(() => {
      switch (data.user.role) {
        case 'intern': router.push('/dashboard/statistiques'); break
        case 'admin': router.push('/dashboard_entreprise/candidatures/liste'); break
        case 'collaborator': router.push('/dashboard_entreprise/candidatures/liste'); break
        default: router.push('/')
      }
    }, 1500)
  } catch (err: any) {
    console.error('❌ Erreur de connexion :', err)
    showPopup('Email ou Mot de passe incorrect', 'error')
  } finally {
    loading.value = false
  }
}


definePageMeta({ layout: false })
</script>

<style scoped>
/* Animation toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Shake pour erreurs */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.4s;
}

/* Fade-in formulaire */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
</style>
