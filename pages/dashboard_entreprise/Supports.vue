<template>
  <div class="min-h-screen  text-white p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-center">Mes documents</h1>

    <div class="space-y-6">
      <div v-for="(doc, index) in documents" :key="index" class="bg-[#1f2937] p-4 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold">{{ doc.nom }}</h2>
          <p class="text-gray-300">{{ doc.description }}</p>
        </div>
        <a
          :href="doc.url"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Voir / Télécharger
        </a>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout:'mylayout'
})
const documents = [
  {
    nom: "CV",
    description: "Curriculum Vitae au format PDF",
    url: "/documents/cv_jean_doe.pdf",
  },
  {
    nom: "Lettre de motivation",
    description: "Lettre de motivation envoyée avec la candidature",
    url: "/documents/lettre_motivation_jean_doe.pdf",
  },
  {
    nom: "Attestation de stage",
    description: "Attestation délivrée après la fin du stage",
    url: "/documents/attestation_stage_jean_doe.pdf",
  },
  // Ajoute ici d'autres documents si besoin
]
</script>
