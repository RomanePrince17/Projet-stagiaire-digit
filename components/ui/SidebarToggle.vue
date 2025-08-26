<!-- components/ui/SidebarToggle.vue -->
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from '#imports'

const props = defineProps({
  label: { type: String, required: true },
  icon: { type: [Object, Function], default: null }, // composant d'icône (Heroicons)
  items: { type: Array, default: () => [] },         // [{ label, to, icon?, count? }]
  modelValue: { type: Boolean, default: undefined }, // v-model (mode contrôlé)
  defaultOpen: { type: Boolean, default: false },    // mode non-contrôlé
  activeMatch: { type: String, default: 'startsWith' }, // 'startsWith' | 'exact'
  headerCount: { type: Number, default: undefined },    // badge du groupe
  showItemBadges: { type: Boolean, default: true },     // badges des sous-menus
})

const emit = defineEmits(['update:modelValue'])
const route = useRoute()

// Si modelValue est défini => contrôlé par le parent ; sinon état interne.
const isControlled = computed(() => props.modelValue !== undefined)
const internalOpen = ref(props.modelValue ?? props.defaultOpen)

watch(() => props.modelValue, (v) => {
  if (v !== undefined) internalOpen.value = v
})

function setOpen(next) {
  if (isControlled.value) emit('update:modelValue', next)
  else internalOpen.value = next
}
function toggle() { setOpen(!internalOpen.value) }

function isActivePath(path) {
  if (!path) return false
  return props.activeMatch === 'exact'
    ? route.path === path
    : route.path.startsWith(path)
}

const hasActiveChild = computed(() => props.items?.some(i => isActivePath(i.to)))

onMounted(() => {
  // Auto-ouvrir si une sous-route est active (ex: /admin/candidatures/ok)
  if (hasActiveChild.value) setOpen(true)
})

function itemClass(active) {
  return [
    'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
    active ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
  ]
}
</script>

<template>
  <div class="select-none">
    <!-- En-tête -->
    <button
      type="button"
      class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-left
             text-gray-200 hover:text-white hover:bg-white/5 transition-colors"
      :aria-expanded="internalOpen"
      @click="toggle"
    >
      <span class="flex items-center gap-2">
        <component v-if="icon" :is="icon" class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span class="font-medium">{{ label }}</span>

        <!-- Dot bleu si une sous-route active -->
        <span v-if="hasActiveChild" class="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-400" aria-hidden="true" />
      </span>

      <span class="ml-auto flex items-center gap-2">
        <!-- Badge global -->
        <span
          v-if="headerCount !== undefined"
          class="inline-flex min-w-5 justify-center px-1 text-xs rounded-full bg-white/10 text-gray-100"
        >{{ headerCount }}</span>

        <!-- Chevron -->
        <svg class="h-4 w-4 transition-transform" :class="internalOpen ? 'rotate-180' : ''"
             viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.136l3.71-2.906a.75.75 0 11.92 1.18l-4.17 3.27a.75.75 0 01-.92 0l-4.17-3.27a.75.75 0 01-.02-1.06z"
                clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <!-- Sous-menus (collapse) -->
    <div class="overflow-hidden transition-all duration-200" :class="internalOpen ? 'max-h-96 mt-1' : 'max-h-0'">
      <ul class="pl-2 border-l border-white/10 space-y-1">
        <li v-for="(it, idx) in items" :key="idx">
          <NuxtLink :to="it.to" :class="itemClass(isActivePath(it.to))">
            <component v-if="it.icon" :is="it.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{{ it.label }}</span>

            <!-- Badge sous-menu -->
            <span v-if="showItemBadges && it.count !== undefined"
                  class="ml-auto inline-flex min-w-5 justify-center px-1 text-xs rounded-full bg-white/10 text-gray-100">
              {{ it.count }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
