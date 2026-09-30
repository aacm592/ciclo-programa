<script setup>
import EncabezadoForm from './EncabezadoForm.vue'
import DiagnosticoEnfasis from './DiagnosticoEnfasis.vue'
import SeleccionActividades from './SeleccionActividades.vue'
</script>

<template>
  <div class="space-y-10">
    <section><EncabezadoForm /></section>
    <hr class="border-gris-lavanda/20" />
    <section><DiagnosticoEnfasis /></section>
    <hr class="border-gris-lavanda/20" />
    <section><SeleccionActividades /></section>
  </div>
</template>