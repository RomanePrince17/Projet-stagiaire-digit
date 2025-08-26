<template>
  <div class="max-w-5xl mx-auto  text-white px-4">
    <h1 class="text-3xl font-bold text-center mb-10">Demande d'emploi</h1>

    <form @submit.prevent="submitJobRequest"
      class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#1f1f1f] p-8 rounded-xl border border-gray-700">

      <!-- Poste -->
      <div>
        <label class="block text-sm mb-2">Poste souhaité</label>
        <input v-model="form.poste" type="text" :class="inputClasses" required placeholder="Ex : Développeur Fullstack" />
      </div>

      <!-- Contrat -->
      <div>
        <label class="block text-sm mb-2">Type de contrat</label>
        <select v-model="form.contrat" :class="inputClasses" required>
          <option value="" disabled>Sélectionner</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Freelance">Freelance</option>
          <option value="Stage Professionnel">Stage Professionnel</option>
        </select>
      </div>

      <!-- Diplôme -->
      <div>
        <label class="block text-sm mb-2">Diplôme le plus élevé</label>
        <input v-model="form.diplome" type="text" :class="inputClasses" required placeholder="Ex : Licence Informatique" />
      </div>

      <!-- CV -->
      <div>
        <label class="block text-sm mb-2">CV (PDF)</label>
        <input type="file" accept=".pdf" :class="inputClasses" required />
      </div>

      <!-- Ajout de compétence -->
      <div class="sm:col-span-2">
        <label class="block text-sm mb-2">Ajouter une compétence</label>
        <div class="flex gap-2">
          <input v-model="newSkill" type="text" :class="inputClasses" placeholder="Ex : React.js" />
          <button type="button" @click="addSkill"
            class="bg-[#6E38E0] hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
            Ajouter
          </button>
        </div>
      </div>

      <!-- Compétences sélectionnées -->
      <div class="sm:col-span-2">
        <label class="block text-sm mb-2">Compétences techniques sélectionnées</label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label v-for="(skill, index) in allSkills" :key="index">
            <input type="checkbox" :value="skill" v-model="form.skills" class="mr-2" />
            {{ skill }}
          </label>
        </div>
      </div>

      <!-- Expérience -->
      <div class="sm:col-span-2">
        <label class="block text-sm mb-2">Expériences professionnelles</label>
        <textarea v-model="form.experience" rows="4" :class="inputClasses" required></textarea>
      </div>

      
      <!-- Bouton -->
      <div class="sm:col-span-2 text-center mt-4">
        <button type="submit"
          class="bg-[#6E38E0] hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md transition duration-200">
          Envoyer la candidature
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  poste: '',
  contrat: '',
  diplome: '',
  skills: [] as string[],
  experience: '',
  motivation: '',
})

const newSkill = ref('')
const allSkills = ref<string[]>([])

function addSkill() {
  const skill = newSkill.value.trim()
  if (skill && !allSkills.value.includes(skill)) {
    allSkills.value.push(skill)
    newSkill.value = ''
  }
}

function submitJobRequest() {
  console.log('Formulaire envoyé :', form)
  alert('Candidature envoyée avec succès (simulation) 🎉')
}

const inputClasses =
  'w-full px-4 py-2 rounded-md border border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
</script>
