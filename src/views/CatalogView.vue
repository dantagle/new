<script setup lang="ts">
import ExperienceCard from '@/components/ExperienceCard.vue'
import { useCatalogStore } from '@/stores/catalog'

const catalog = useCatalogStore()
</script>

<template>
  <main>
    <h1>Experiencias en Querétaro</h1>
    <!-- vs React: v-for replaces items.map(...). `:key` plays the same role as key in React. -->
    <section v-for="venue in catalog.venues" :key="venue.id">
      <h2>{{ venue.name }}</h2>
      <div class="grid">
        <ExperienceCard
          v-for="experience in catalog.experiencesAt(venue.id)"
          :key="experience.id"
          :experience="experience"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
</style>
