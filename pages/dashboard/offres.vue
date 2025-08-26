<template>
  <div class="min-h-screen mt-9  text-white p-6">
    <div>
       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="(offre, index) in offres"
      :key="index"
      class="relative bg-[#29C5EE26] mb-15 rounded-lg shadow-lg overflow-hidden p-6"
    >
      <!-- Bande colorée -->
      <div
        class="absolute top-0 left-0 h-full w-2"
        :class="offre.couleur"
      ></div>

      <!-- Contenu de l’offre -->
      <h3 class="text-xl font-semibold mb-1">{{ offre.titre }}</h3>
      <p class="text-gray-400 mb-2">{{ offre.entreprise }}</p>
      <p class="text-sm mb-3">
        📍 {{ offre.lieu }} &nbsp; | &nbsp; ⏳ {{ offre.type }}
      </p>
      <p class="text-sm text-gray-300">
        {{ offre.description }}
      </p>
      <!-- Date ou autre info -->
      <div class="mt-4 text-sm text-indigo-400">
        Publié : {{ offre.date }}
      </div>
    </div>
  </div>
    </div>
    <h1 class="text-2xl font-bold mb-6">Liste des demandes de stage</h1>
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-700 rounded-lg">
        <thead class="bg-[#1F2937]">
          <tr>
            <th class="px-4 py-3 border-b border-gray-700 text-left">Photo</th>
            <th class="px-4 py-3 border-b border-gray-700 text-left">Nom</th>
            <th class="px-4 py-3 border-b border-gray-700 text-left">Établissement</th>
            <th class="px-4 py-3 border-b border-gray-700 text-left">Niveau</th>
            <th class="px-4 py-3 border-b border-gray-700 text-left">Type de stage</th>
            <th class="px-4 py-3 border-b border-gray-700 text-left">Durée</th>
            <th class="px-4 py-3 border-b border-gray-700 text-left">Date de début</th>
            <th class="px-4 py-3 border-b border-gray-700 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(demande, index) in demandes" :key="index" class="hover:bg-[#374151]">
            <td class="px-4 py-2 border-b border-gray-700">
              <img
                :src="demande.photo"
                alt="Photo candidat"
                class="w-10 h-10 rounded-full object-cover"
              />
            </td>
            <td class="px-4 py-2 border-b border-gray-700">{{ demande.nom }}</td>
            <td class="px-4 py-2 border-b border-gray-700">{{ demande.etablissement }}</td>
            <td class="px-4 py-2 border-b border-gray-700">{{ demande.niveau }}</td>
            <td class="px-4 py-2 border-b border-gray-700">{{ demande.typeStage }}</td>
            <td class="px-4 py-2 border-b border-gray-700">{{ demande.duree }} mois</td>
            <td class="px-4 py-2 border-b border-gray-700">{{ demande.dateDebut }}</td>
            <td class="px-4 py-2 border-b border-gray-700">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Voir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
const demandes = [
  {
    nom: 'Jean Doe',
    etablissement: 'Université XYZ',
    niveau: 'Troisième année',
    typeStage: 'Professionnel',
    duree: 3,
    dateDebut: '2025-08-01',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    nom: 'Alice Smith',
    etablissement: 'Institut ABC',
    niveau: 'Deuxième année',
    typeStage: 'Scolaire',
    duree: 2,
    dateDebut: '2025-09-15',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  // Ajoutez d'autres candidats avec champ photo ici
]
const offres = [
  {
    titre: 'Développeur Full Stack',
    entreprise: 'TechNova',
    lieu: 'Cotonou',
    type: 'Temps plein',
    description: 'Travaillez sur des applications web modernes avec Vue.js et Node.js.',
    date: 'Il y a 2 jours',
    couleur: 'bg-green-500',
  },
  {
    titre: 'UX/UI Designer',
    entreprise: 'DesignHub',
    lieu: 'Porto-Novo',
    type: 'Freelance',
    description: 'Conception d’interfaces utilisateur attrayantes pour applications mobiles.',
    date: 'Il y a 5 jours',
    couleur: 'bg-blue-500',
  },
  {
    titre: 'Chef de Projet IT',
    entreprise: 'InnoSolutions',
    lieu: 'Abomey-Calavi',
    type: 'Temps partiel',
    description: 'Coordination des équipes techniques et suivi de projets numériques.',
    date: 'Hier',
    couleur: 'bg-purple-500',
  },
   
]
</script>
<style scoped>
.stats-cards {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

.card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-grow: 1;
}

.card h3 {
  margin-top: 0;
  color: #34495e;
}

.card p {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}
</style>