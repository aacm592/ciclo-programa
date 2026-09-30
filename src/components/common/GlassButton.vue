<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary' // primary (jade), secondary (morado), outline
  },
  type: { type: String, default: 'button' }
})
</script>

<template>
  <button
    :type="type"
    :class="[
      'px-5 py-2.5 rounded-xl font-display font-bold text-sm transition-all duration-200 cursor-pointer active:scale-95',
      variant === 'primary' ? 'bg-jade text-white shadow-md shadow-jade/30 hover:bg-[#057a54]' : '',
      variant === 'secondary'
        ? 'bg-morado text-white shadow-md shadow-morado/30 hover:bg-[#35307a]'
        : '',
      variant === 'outline'
        ? 'bg-transparent border-2 border-morado text-morado hover:bg-morado/5'
        : ''
    ]"
  >
    <slot />
  </button>
</template>
