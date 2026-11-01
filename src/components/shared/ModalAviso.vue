<!-- Modal de aviso reutilizable: sin dirigentes / sin ciclo -->
<script setup>
defineProps({ modal: Object })
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modal.show"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div class="bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center">
        <div class="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold">!</div>
        <h3 class="text-lg font-bold font-display text-morado dark:text-white">{{ modal.titulo }}</h3>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{{ modal.texto }}</p>
        <div class="pt-2 flex flex-col gap-2">
          <button type="button" @click="modal.btnHandler"
            class="w-full py-3 px-4 rounded-xl bg-jade hover:bg-jade/90 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >{{ modal.btnLabel }}</button>
          <button type="button" @click="$emit('close')"
            class="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 py-1.5 cursor-pointer"
          >Cancelar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

