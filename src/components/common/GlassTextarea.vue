<script setup>
const model = defineModel()

defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 3 }
})
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-xs font-display font-bold text-morado uppercase tracking-wider">
      {{ label }}
    </label>
    <textarea
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      class="glass-input rounded-xl px-4 py-3 text-slate-800 font-sans text-sm placeholder:text-gris-lavanda resize-y"
    ></textarea>
  </div>
</template>
