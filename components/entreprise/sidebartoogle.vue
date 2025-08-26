<!-- components/dashboard/Sidebar.vue -->
<script setup>
import { ref, computed } from 'vue'
import SidebarToggle from '@/components/ui/SidebarToggle.vue' // ✅ corrige l'import
import {
  ClipboardDocumentListIcon, CalendarDaysIcon, CheckCircleIcon, XCircleIcon, UsersIcon,
  TagIcon, AdjustmentsHorizontalIcon
} from '@heroicons/vue/24/outline'

// Accordéon exclusif : une seule section ouverte
const openKey = ref('candidatures') // ou null

// Compteurs dynamiques (remplace par tes données store/API)
const counts = ref({
  candidatures: { total: 12, entretiens: 3, acceptes: 2, refuses: 4 },
  offres: { total: 7, brouillons: 2, publiees: 5 },
  skills: 18,
  scoring: 4
})

// Items avec badges dynamiques
const itemsCandidatures = computed(() => ([
     
  { label: 'En attente',  to: '/dashboard_entreprise/candidatures/liste',    icon: UsersIcon,         count: counts.value.candidatures.total },
  // { label: 'Acceptées',  to: '/dashboard_entreprise/candidatures/accepter', icon: CheckCircleIcon,   count: counts.value.candidatures.acceptes },
  // { label: 'Refusées',   to: '/dashboard_entreprise/candidatures/refuser', icon: XCircleIcon,       count: counts.value.candidatures.refuses },
]))

const itemsCrit = computed(() => ([
  { label: 'Compétences', to: '/admin/skills',  count: counts.value.skills },
  { label: 'Scoring',     to: '/admin/scoring', count: counts.value.scoring },
]))

// v-model pour accordéon exclusif
function bindOpen(key) {
  return {
    modelValue: openKey.value === key,
    'onUpdate:modelValue': (v) => {
      openKey.value = v ? key : (openKey.value === key ? null : openKey.value)
    }
  }
}
</script>

<template>
  <aside class="w-54 bg-[#1f1f1f] text-sm text-gray-200 p-4 space-y-4">
    <!-- Candidatures -->
    <SidebarToggle
      v-bind="bindOpen('candidatures')"
      label="Demandes recus"
      :icon="ClipboardDocumentListIcon"
      :items="itemsCandidatures"
      :headerCount="counts.candidatures.total"
    />
    

    <!-- Compétences & Critères -->
    
  </aside>
</template>
