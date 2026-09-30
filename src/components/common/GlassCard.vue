<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})
</script>

<template>
  <div class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
    <header
      v-if="title || $slots.header"
      class="mb-4 flex items-center justify-between pb-3 border-b border-gris-lavanda/20"
    >
      <div>
        <h3 v-if="title" class="font-display font-bold text-lg text-morado tracking-wide">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-xs text-gris-lavanda mt-0.5">
          {{ subtitle }}
        </p>
      </div>
      <slot name="header-actions" />
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>
