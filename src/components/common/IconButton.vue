<script setup>
defineProps({
  action: { type: String, default: 'add' } // 'add' o 'remove'
})
</script>

<template>
  <button
    type="button"
    :class="[
      'flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer active:scale-90',
      action === 'add'
        ? 'bg-verde-suave text-jade hover:bg-[#b0f086]'
        : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
    ]"
  >
    <span v-if="action === 'add'" class="text-xl font-bold leading-none mb-0.5">+</span>
    <span v-else class="text-2xl font-bold leading-none mb-1">-</span>
  </button>
</template>
