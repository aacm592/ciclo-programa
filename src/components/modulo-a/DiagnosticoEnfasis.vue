<script setup>
import { useCicloStore } from '../../stores/cicloStore'
import GlassInput from '../common/GlassInput.vue'
import IconButton from '../common/IconButton.vue'

const store = useCicloStore()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- Columna Diagnóstico -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display font-bold text-morado tracking-wide">DIAGNÓSTICO</h4>
        <IconButton action="add" @click="store.agregarDiagnostico" />
      </div>
      <div class="space-y-3">
        <div
          v-for="(diag, index) in store.diagnosticos"
          :key="diag.id"
          class="flex gap-2 items-start"
        >
          <span class="mt-2.5 text-sm font-bold text-jade">{{ index + 1 }}.</span>
          <GlassInput v-model="diag.texto" placeholder="Problema detectado..." class="flex-1" />
          <IconButton
            v-if="store.diagnosticos.length > 3"
            action="remove"
            @click="store.eliminarDiagnostico(diag.id)"
            class="mt-1"
          />
        </div>
      </div>
    </div>

    <!-- Columna Énfasis -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display font-bold text-morado tracking-wide">ÉNFASIS</h4>
        <IconButton action="add" @click="store.agregarEnfasis" />
      </div>
      <div class="space-y-3">
        <div v-for="(enf, index) in store.enfasis" :key="enf.id" class="flex gap-2 items-start">
          <span class="mt-2.5 text-sm font-bold text-jade">{{ index + 1 }}.</span>
          <GlassInput
            v-model="enf.texto"
            placeholder="Acción para solucionarlo..."
            class="flex-1"
          />
          <IconButton
            v-if="store.enfasis.length > 3"
            action="remove"
            @click="store.eliminarEnfasis(enf.id)"
            class="mt-1"
          />
        </div>
      </div>
    </div>
  </div>
</template>
