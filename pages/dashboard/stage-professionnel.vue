<template>
  <div class="max-w-6xl mx-auto px-4 py-10 text-white">
    <h1 class="text-3xl font-bold mb-10 text-center">Demande de Stage Professionnel</h1>
    <form @submit.prevent="submitForm"
      class="bg-[#1f1f1f] p-8 rounded-2xl shadow-xl border border-gray-700 space-y-8">
      <!-- Grille principale -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-300">Compétences</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="exemple@domaine.com"
            class="w-full px-4 py-2 rounded-md bg-[#2d2d2d] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-300">Autre compétence</label>
          <input
            v-model="form.telephone"
            type="tel"
            required
            placeholder="+229 99 99 99 99"
            class="w-full px-4 py-2 rounded-md bg-[#2d2d2d] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-300">Durée</label>
          <input
            v-model="form.telephone"
            type="tel"
            required
            placeholder="+229 99 99 99 99"
            class="w-full px-4 py-2 rounded-md bg-[#2d2d2d] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-300">Date de disponibilité</label>
          <input
            v-model="form.telephone"
            type="tel"
            required
            placeholder="+229 99 99 99 99"
            class="w-full px-4 py-2 rounded-md bg-[#2d2d2d] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-300">CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            required
            class="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 bg-[#2d2d2d] text-white border border-gray-600 rounded-md"
          />
        </div>
      </div>

      <!-- Lettre de motivation sur toute la largeur -->
      <!-- Bouton -->
      <div class="text-center">
        <button
          type="submit"
          class="bg-[#6E38E0] hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-md transition duration-200"
        >
          Envoyer la demande
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Demande de stage',
  description: 'Page de soumission pour les demandes de stage'
})

const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  message: '',
})

function submitForm() {
  console.log('Formulaire soumis :', form)
  alert("Demande envoyée avec succès (simulation)")
}
</script>
