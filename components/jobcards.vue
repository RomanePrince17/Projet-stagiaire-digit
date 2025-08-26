<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition duration-300 space-y-2">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-white">{{ job.title }}</h3>
      <span class="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
        {{ job.experience }}
      </span>
    </div>
    <p class="text-gray-300">{{ job.location }}</p>
    <div class="text-sm text-gray-400">
      {{ job.applications }} applications
    </div>
    <button class="mt-2 text-indigo-400 hover:underline">View Details →</button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  job: {
    title: string
    location: string
    experience: string
    applications: number
  }
}>()
</script>
