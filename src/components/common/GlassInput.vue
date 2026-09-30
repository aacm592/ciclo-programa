<script setup>
const model = defineModel()

defineProps({
  label: { type: String, default: '' },
  type: { type: String, default: 'text' } /* text, number, date */,
  placeholder: { type: String, default: '' }
})
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-xs font-display font-bold text-morado uppercase tracking-wider">
      {{ label }}
    </label>
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="glass-input rounded-xl px-4 py-2.5 text-slate-800 font-sans text-sm placeholder:text-gris-lavanda"
    />
  </div>
</template>
