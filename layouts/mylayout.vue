
<template>
  <div :class="['min-h-screen flex transition-colors duration-300', themeClass]">

    <!-- Sidebar -->
    <aside :class="['w-64 p-6 space-y-6 border-r fixed top-0 bottom-0 z-40 transition-colors duration-300', sidebarClass]">
      <h1 :class="['text-3xl font-bold mb-12 border-b pb-3', borderClass]">DigitConsults</h1>
      <nav class="space-y-3">
        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          :class="['flex items-center gap-4 px-4 py-3 rounded-lg transition', hoverClass, textClass]"
        >
          <component :is="item.icon" class="w-6 h-6" :class="textClass" />
          <span class="font-medium">{{ item.name }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Contenu principal -->
    <div class="flex flex-col flex-1 ml-64 border-r relative" :class="borderClass">

      <!-- Navbar -->
      <header :class="['px-8 py-4 flex justify-between items-center fixed top-0 right-0 left-64 z-50 shadow transition-colors duration-300', headerClass]">
        <input
          type="text"
          placeholder="Search for job, candidates and more..."
          :class="['px-4 py-2 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500', inputClass]"
        />
        <div class="ml-6 flex items-center gap-6">
          <button @click="toggleTheme" :class="['px-4 py-2 rounded-lg font-medium transition', toggleClass]">
            {{ theme === 'light' ? 'Dark' : 'Light' }}
          </button>
          <NuxtLink>
            <img :src="settingIcon" alt="Settings" class="w-8 h-8 object-contain hover:scale-110 transition"/>
          </NuxtLink>
          <NuxtLink>
            <img :src="notifIcon" alt="Notifications" class="w-8 h-8 object-contain hover:scale-110 transition"/>
          </NuxtLink>

          <!-- Menu utilisateur -->
           <!-- Menu utilisateur -->
          <div ref="menuRef" class="relative">
            <button @click="isOpen = !isOpen" class="focus:outline-none">
              <img :src="profile?.photo || '/assets/images/etudiant.jpg'" alt="Avatar"
                class="w-10 h-10 rounded-full object-cover border-2 transition" />
            </button>

            <div v-if="isOpen" :class="['absolute right-0 mt-2 w-48 shadow-lg rounded-lg z-50', menuBgClass]">
              <ul :class="['py-2', textClass]">
                <li>
                  <NuxtLink to="/auth/login" :class="['block px-4 py-2 rounded transition', hoverClass]">
                    🚪 Se déconnecter
                  </NuxtLink>
                </li>
                <li>
                  <button @click="openProfile = true; isOpen = false"
                    class="w-full text-left block px-4 py-2 rounded transition">
                    👤 Mon Profil
                  </button>
                </li>
              </ul>
            </div>
          
          </div>
        </div>
      </header>

      <!-- Overlay modal -->
      <transition name="fade">
        <div
          v-if="openProfile"
          @click="closeProfile"
          class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        ></div>
      </transition>

      <!-- Modal profil -->
      <transition name="slide-left">
        <div
          v-if="openProfile"
          :class="['fixed top-0 right-0 w-full sm:w-96 h-full shadow-2xl z-50 flex flex-col overflow-y-auto', profileBgClass]"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b">
            <h2 class="text-2xl font-bold">Mon Profil</h2>
            <button @click="closeProfile" class="text-gray-500 hover:text-gray-700 text-2xl transition-transform hover:scale-110">✕</button>
          </div>

          <!-- Contenu -->
          <div class="p-6 flex-1 space-y-6">

            <!-- ==== Profil Personnel ==== -->
            <div class="shadow-md rounded-lg p-4 transition hover:shadow-xl  dark:bg-gray-700">
              <h3 class="text-xl font-semibold mb-4">Profil Personnel</h3>
              <div class="flex flex-col items-center mb-4">
                <img :src="previewPhoto || profile?.photo || defaultAvatar" alt="Photo de profil" class="w-28 h-28 rounded-full border-2 border-indigo-500 mb-4 object-cover hover:scale-105 transition-transform"/>
                <h4 class="text-lg font-semibold">{{ profile?.first_name }} {{ profile?.last_name }}</h4>
                <p class="text-gray-500">Âge : {{ profile?.age }} ans</p>
                <p class="text-gray-500">📍 {{ profile?.quartier }}</p>
              </div>

              <div v-if="!isEditing">
                <button @click="startEditingPersonal" class="px-4 py-2 rounded-lg text-white font-semibold bg-[#5a2fc4] hover:bg-indigo-700 transition">
                  ✏️ Modifier
                </button>
              </div>
              <form v-else @submit.prevent="updateProfile" class="space-y-4">
                <div><label>Prénom</label><input v-model="form.first_name" type="text" class="w-full px-3 py-2 rounded border"/></div>
                <div><label>Nom</label><input v-model="form.last_name" type="text" class="w-full px-3 py-2 rounded border"/></div>
                <div><label>Âge</label><input v-model.number="form.age" type="number" class="w-full px-3 py-2 rounded border"/></div>
                <div><label>Sexe</label>
                  <select v-model="form.sex" class="w-full px-3 py-2 bg-gray-800 rounded border"><option value="M">M</option><option value="F">F</option></select>
                </div>
                <div><label>Téléphone</label><input v-model="form.phone_number" type="text" class="w-full px-3 py-2 rounded border"/></div>
                <div><label>Quartier</label><input v-model="form.quartier" type="text" class="w-full px-3 py-2 rounded border"/></div>
                <div><label>Photo</label><input @change="onPhotoChange" type="file"/></div>

                <div class="flex justify-between items-center">
                  <button type="submit" class="px-4 py-2 bg-[#5a2fc4] text-white rounded flex items-center gap-2" :disabled="loadingPersonal">
                    <svg v-if="loadingPersonal" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                    </svg>
                    Sauvegarder
                  </button>
                  <button type="button" @click="cancelEditingPersonal" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                </div>
                <p v-if="updateMessage" :class="updateSuccess ? 'text-green-600' : 'text-red-600'">{{ updateMessage }}</p>
              </form>
            </div>

            <!-- ==== Profil Professionnel ==== -->
            <div class="shadow-md rounded-lg p-4 transition hover:shadow-xl  dark:bg-gray-700">
              <h3 class="text-xl font-semibold mb-4">Profil Professionnel</h3>
              <div v-if="professionalProfile && !isEditingProfessional">
                <p><strong>École :</strong> {{ professionalProfile.school }}</p>
                <p><strong>Diplôme :</strong> {{ professionalProfile.degree }}</p>
                <p><strong>Expérience :</strong> {{ professionalProfile.experience }}</p>
                <p><strong>CV :</strong>  <a  target="_blank" download
                 class="bg-[#5a2fc4]  text-white px-3 py-1 rounded text-sm">
                Voir
              </a></p>
                <p><strong>Compétences :</strong> {{ professionalProfile.skills.join(', ') }}</p>
                <button @click="startEditingProfessionalProfile" class="px-4 py-2 rounded-lg text-white font-semibold bg-[#5a2fc4] hover:bg-indigo-700 transition mt-3">
                  ✏️ Modifier
                </button>
              </div>

              <form v-else @submit.prevent="updateProfessionalProfile" class="space-y-4">
                <div><label>École</label><input v-model="formProfessional.school" class="w-full px-3 py-2 rounded border"/></div>
                <div><label>Diplôme</label><input v-model="formProfessional.degree" class="w-full px-3 py-2 rounded border"/></div>
                <div><label>Expérience</label><input v-model="formProfessional.experience" class="w-full px-3 py-2 rounded border"/></div>
                <div><label>CV (fichier)</label><input type="file" @change="onCVChange" /></div>
                <div v-if="cvPreview"><p>Fichier sélectionné: {{ cvPreview.name }}</p></div>
                <div><label>Compétences (séparées par une virgule)</label><input v-model="formProfessional.skillsString" class="w-full px-3 py-2 rounded border"/></div>

                <div class="flex justify-between items-center">
                  <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2" :disabled="loadingProfessional">
                    <svg v-if="loadingProfessional" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                    </svg>
                    Sauvegarder
                  </button>
                  <button type="button" @click="cancelEditingProfessionalProfile" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </transition>

      <!-- Zone de contenu -->
      <main :class="['p-8 pt-28 space-y-8 h-full overflow-y-auto transition-colors duration-300', mainClass]">
        <slot />
      </main>

    </div>

    <!-- Toasts -->
    <transition name="fade">
      <div v-if="toastMessage" class="fixed top-4 right-4 z-50 bg-green-100 text-green-700 px-4 py-2 rounded shadow flex items-center gap-2">
        ✅ {{ toastMessage }}
      </div>
      
    </transition>

  </div>
</template>


<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import DashboardIcon from '@/components/icons/dashboardicon.vue'
import Supports from '@/components/entreprise/Supports.vue'
import notifIcon from '@/assets/images/nav_img/notif.png'
import settingIcon from '@/assets/images/nav_img/setting.png'

/* ==== Sidebar & Navbar ==== */
const isOpen = ref(false)
const menuRef = ref(null)
onClickOutside(menuRef, () => { isOpen.value = false })

const navItems = [
  { name: 'Statistiques', path: '/dashboard_entreprise/statistiques', icon: DashboardIcon },
  { name: 'Demandes reçues', path: '/dashboard_entreprise/candidatures/liste', icon: Supports },
]

/* ==== Thème ==== */
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  if (process.client) localStorage.setItem('theme', theme.value)
}
onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('theme')
    if (saved) theme.value = saved
  }
})

const themeClass = computed(() => theme.value === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black')
const sidebarClass = computed(() => theme.value === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200')
const headerClass = computed(() => theme.value === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-black')
const mainClass = computed(() => theme.value === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black')
const inputClass = computed(() => theme.value === 'dark' ? 'bg-gray-700 text-white placeholder-gray-300' : 'bg-gray-200 text-black placeholder-gray-500')
const toggleClass = computed(() => theme.value === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black')
const hoverClass = computed(() => theme.value === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
const borderClass = computed(() => theme.value === 'dark' ? 'border-gray-700' : 'border-gray-200')
const menuBgClass = computed(() => theme.value === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black')
const profileBgClass = computed(() => theme.value === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black')

/* ==== Modals et overlay ==== */
const openProfile = ref(false)
const closeProfile = () => {
  openProfile.value = false
  cancelEditingPersonal()
  cancelEditingProfessionalProfile()
}

/* ==== Toast ==== */
const toastMessage = ref('')
const showToast = (message: string) => {
  toastMessage.value = message
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

/* ==== Profil Personnel ==== */
const profile = ref<any>(null)
const defaultAvatar = '/assets/images/etudiant.jpg'
const form = reactive({
  first_name:'', last_name:'', age:null, sex:'M', phone_number:'', quartier:'', photo:null
})
const previewPhoto = ref('')
const isEditing = ref(false)
const loadingPersonal = ref(false)
const updateMessage = ref('')
const updateSuccess = ref(false)

const fetchProfile = async () => {
  if (!process.client) return
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const res = await fetch('https://digit-cursus-backend.onrender.com/api/profiles/personal/', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`)
    const data = await res.json()
    profile.value = data
    Object.assign(form, { 
      first_name: data.first_name, last_name: data.last_name, age: data.age,
      sex: data.sex, phone_number: data.phone_number, quartier: data.quartier, photo: null 
    })
  } catch (err) { console.error('Erreur API Profil :', err) }
}

const startEditingPersonal = () => {
  isEditing.value = true
  updateMessage.value = ''
  // Fermer l'édition pro si ouverte
  cancelEditingProfessionalProfile()
}

const cancelEditingPersonal = () => {
  isEditing.value = false
  previewPhoto.value = ''
  if (profile.value) Object.assign(form, { 
    first_name: profile.value.first_name, last_name: profile.value.last_name, age: profile.value.age,
    sex: profile.value.sex, phone_number: profile.value.phone_number, quartier: profile.value.quartier, photo: null
  })
}

const onPhotoChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) { form.photo = files[0]; previewPhoto.value = URL.createObjectURL(files[0]) }
}

const updateProfile = async () => {
  if (!process.client) return
  loadingPersonal.value = true
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const payload = new FormData()
    if(form.first_name) payload.append('first_name', form.first_name)
    if(form.last_name) payload.append('last_name', form.last_name)
    if(form.age) payload.append('age', String(form.age))
    if(form.sex) payload.append('sex', form.sex)
    if(form.phone_number) payload.append('phone_number', form.phone_number)
    if(form.quartier) payload.append('quartier', form.quartier)
    if(form.photo) payload.append('photo', form.photo)
    const res = await fetch('https://digit-cursus-backend.onrender.com/api/profiles/personal/', {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: payload
    })
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`)
    profile.value = await res.json()
    updateMessage.value = 'Profil mis à jour avec succès !'
    updateSuccess.value = true
    showToast('Profil personnel mis à jour avec succès !')
    isEditing.value = false
    previewPhoto.value = ''
  } catch (err) {
    console.error('Erreur mise à jour:', err)
    updateMessage.value = 'Erreur lors de la mise à jour.'
    updateSuccess.value = false
    showToast('Erreur lors de la mise à jour du profil personnel.')
  } finally {
    loadingPersonal.value = false
  }
}

/* ==== Profil Professionnel ==== */
const professionalProfile = ref<any>(null)
const formProfessional = reactive({ school:'', degree:'', experience:'', cv:null as File | null, skillsString:'' })
const isEditingProfessional = ref(false)
const loadingProfessional = ref(false)
const cvPreview = ref<File | null>(null)

const fetchProfessionalProfile = async () => {
  if (!process.client) return
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const res = await fetch('https://digit-cursus-backend.onrender.com/api/profiles/professional/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`)
    const data = await res.json()
    professionalProfile.value = { ...data, cv_name: data.cv?.split('/').pop() }
    Object.assign(formProfessional, {
      school: data.school,
      degree: data.degree,
      experience: data.experience,
      cv: null,
      skillsString: data.skills.join(', ')
    })
  } catch(err){ console.error('Erreur API Profil pro :', err) }
}

const startEditingProfessionalProfile = () => {
  isEditingProfessional.value = true
  cancelEditingPersonal() // ferme personnel si ouvert
}

const cancelEditingProfessionalProfile = () => {
  isEditingProfessional.value = false
  cvPreview.value = null
  if (professionalProfile.value) Object.assign(formProfessional, {
    school: professionalProfile.value.school,
    degree: professionalProfile.value.degree,
    experience: professionalProfile.value.experience,
    cv: null,
    skillsString: professionalProfile.value.skills.join(', ')
  })
}

const onCVChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) { formProfessional.cv = files[0]; cvPreview.value = files[0] }
}

const updateProfessionalProfile = async () => {
  if (!process.client) return
  loadingProfessional.value = true
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    const payload = new FormData()
    if(formProfessional.school) payload.append('school', formProfessional.school)
    if(formProfessional.degree) payload.append('degree', formProfessional.degree)
    if(formProfessional.experience) payload.append('experience', formProfessional.experience)
    if(formProfessional.cv) payload.append('cv', formProfessional.cv)
    // Skills comme champs multiples
    formProfessional.skillsString.split(',').map(s=>s.trim()).forEach(skill => payload.append('skills', skill))

    const res = await fetch('https://digit-cursus-backend.onrender.com/api/profiles/professional/', {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: payload
    })

    if (!res.ok) throw new Error(`Erreur API: ${res.status}`)
    const data = await res.json()
    professionalProfile.value = { ...data, cv_name: data.cv?.split('/').pop() }
    isEditingProfessional.value = false
    cvPreview.value = null
    showToast('Profil professionnel mis à jour avec succès !')

  } catch(err){
    console.error('Erreur mise à jour pro:', err)
    showToast('Erreur lors de la mise à jour du profil professionnel.')
  } finally {
    loadingProfessional.value = false
  }
}

/* ==== Ouverture profil ==== */
const openProfileSection = () => { openProfile.value = true; cancelEditingPersonal(); cancelEditingProfessionalProfile() }

/* ==== Mounted ==== */
onMounted(() => { fetchProfile(); fetchProfessionalProfile() })

</script>


