<script setup>
import { computed } from 'vue'
import { useCicloStore } from '../../stores/cicloStore'

const store = useCicloStore()

// Reutilizamos la agrupación de meses del Módulo B para la impresión
const mesesAgrupados = computed(() => {
  const grupos = []
  store.cronograma.forEach((sabado) => {
    let grupo = grupos.find((g) => g.mes === sabado.mes)
    if (!grupo) {
      grupo = { mes: sabado.mes, sabados: [] }
      grupos.push(grupo)
    }
    grupo.sabados.push(sabado)
  })
  return grupos
})
</script>

<template>
  <!-- Contenedor maestro oculto con ancho fijo de hoja A4 -->
  <div class="bg-white text-black font-sans w-full p-2">
    <!-- ================= PÁGINA 1: MÓDULO A ================= -->
    <div class="mb-8">
      <h2 class="text-center font-bold text-xl mb-4 border-b-2 border-black pb-2">
        CICLO DE PROGRAMA
      </h2>

      <table class="w-full text-sm border-collapse border border-black mb-6">
        <tbody>
          <tr>
            <td class="border border-black p-2 font-bold w-1/4">DISTRITO:</td>
            <td class="border border-black p-2 w-1/4">{{ store.encabezado.distrito }}</td>
            <td class="border border-black p-2 font-bold w-1/4">TROPA/UNIDAD:</td>
            <td class="border border-black p-2 w-1/4">{{ store.encabezado.tropa }}</td>
          </tr>
          <tr>
            <td class="border border-black p-2 font-bold">GRUPO:</td>
            <td class="border border-black p-2">{{ store.encabezado.grupo }}</td>
            <td class="border border-black p-2 font-bold">CICLO N°:</td>
            <td class="border border-black p-2">{{ store.encabezado.cicloNumero }}</td>
          </tr>
          <tr>
            <td class="border border-black p-2" colspan="2"></td>
            <td class="border border-black p-2 font-bold">FECHAS:</td>
            <td class="border border-black p-2">
              {{ store.encabezado.fechaInicio }} hasta {{ store.encabezado.fechaFin }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <h3 class="font-bold border-b border-black text-center mb-2">DIAGNÓSTICO</h3>
          <ul class="list-decimal pl-4 space-y-1">
            <li v-for="diag in store.diagnosticos" :key="diag.id">{{ diag.texto }}</li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold border-b border-black text-center mb-2">ÉNFASIS</h3>
          <ul class="list-decimal pl-4 space-y-1">
            <li v-for="enf in store.enfasis" :key="enf.id">{{ enf.texto }}</li>
          </ul>
        </div>
      </div>

      <h3 class="font-bold text-sm bg-gray-200 border border-black p-1">
        SELECCIÓN DE ACTIVIDADES
      </h3>
      <table class="w-full text-sm border-collapse border border-black mb-4">
        <tbody>
          <tr>
            <td class="border border-black p-2 font-bold w-1/4 align-top">JUEGO DEMOCRÁTICO:</td>
            <td class="border border-black p-2 text-justify">{{ store.juegoDemocratico }}</td>
          </tr>
          <tr>
            <td class="border border-black p-2 font-bold align-top">ACTIVIDADES SELECCIONADAS:</td>
            <td class="border border-black p-2">
              <span v-for="(act, i) in store.actividadesSeleccionadas" :key="i">
                {{ act }}<span v-if="i < store.actividadesSeleccionadas.length - 1">, </span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Salto de Página -->
    <div class="page-break"></div>

    <!-- ================= PÁGINA 2: MÓDULO B ================= -->
    <div class="mb-8">
      <h2 class="text-center font-bold text-xl mb-4 border-b-2 border-black pb-2">
        CRONOGRAMA DE ACTIVIDADES
      </h2>
      <div class="grid grid-cols-4 gap-2 text-sm">
        <div v-for="grupo in mesesAgrupados" :key="grupo.mes" class="border border-black">
          <h3 class="font-bold text-center bg-gray-200 p-1 border-b border-black">
            MES: {{ grupo.mes }}
          </h3>
          <div
            v-for="sabado in grupo.sabados"
            :key="sabado.fecha"
            class="border-b border-gray-300 p-2 last:border-0 h-24 overflow-hidden"
          >
            <div :class="sabado.cancelado ? 'line-through text-gray-500' : ''">
              <span class="font-bold text-xs">{{ sabado.fecha }}</span
              ><br />
              <span v-if="sabado.cancelado" class="text-xs italic"
                >Cancelado: {{ sabado.motivoCancelacion }}</span
              >
              <span v-else class="text-xs">{{ sabado.actividad }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= PÁGINA 3+: MÓDULO C ================= -->
    <div v-for="(reunion, index) in store.reunionesValidas" :key="reunion.fecha">
      <div class="page-break"></div>

      <h2 class="text-center font-bold text-lg mb-4 border-b-2 border-black pb-1">
        PROGRAMA DE REUNIÓN N° {{ index + 1 }}
      </h2>

      <table class="w-full text-xs border-collapse border border-black mb-4">
        <tbody>
          <tr>
            <td class="border border-black p-1.5 font-bold w-1/4">FECHA:</td>
            <td class="border border-black p-1.5 w-1/4">{{ reunion.fecha }}</td>
            <td class="border border-black p-1.5 font-bold w-1/4">RESPONSABLES:</td>
            <td class="border border-black p-1.5 w-1/4">
              {{
                Array.isArray(reunion.programa.responsables)
                  ? reunion.programa.responsables.join(', ')
                  : reunion.programa.responsables
              }}
            </td>
          </tr>
          <tr>
            <td class="border border-black p-1.5 font-bold">OBJETIVO:</td>
            <td class="border border-black p-1.5" colspan="3">{{ reunion.programa.objetivo }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Horario -->
      <table class="w-full text-xs border-collapse border border-black mb-4 text-center">
        <thead class="bg-gray-200 font-bold">
          <tr>
            <th class="border border-black p-1">HORA</th>
            <th class="border border-black p-1">DUR.</th>
            <th class="border border-black p-1 text-left">ACTIVIDAD</th>
            <th class="border border-black p-1 text-left">MATERIALES</th>
            <th class="border border-black p-1">RESPONSABLES</th>
            <th class="border border-black p-1 text-left">OBSERVACIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fila in reunion.programa.horario" :key="fila.id">
            <td class="border border-black p-1">{{ fila.hora }}</td>
            <td class="border border-black p-1">{{ fila.duracion }}m</td>
            <td class="border border-black p-1 text-left">{{ fila.actividad }}</td>
            <td class="border border-black p-1 text-left">{{ fila.materiales }}</td>
            <td class="border border-black p-1">{{ fila.responsables }}</td>
            <td class="border border-black p-1 text-left">{{ fila.observaciones }}</td>
          </tr>
        </tbody>
      </table>

      <div class="text-xs border border-black p-2 mb-4">
        <strong>NOTA:</strong> {{ reunion.programa.nota }}
      </div>

      <!-- Objetivos Educativos -->
      <h3 class="font-bold text-xs bg-gray-200 border border-black border-b-0 p-1">
        CONTRIBUYE A LOS SIGUIENTES OBJETIVOS EDUCATIVOS:
      </h3>
      <table class="w-full text-xs border-collapse border border-black mb-4 text-center">
        <thead class="font-bold bg-gray-100">
          <tr>
            <th class="border border-black p-1 w-[15%]">ÁREA</th>
            <th class="border border-black p-1 w-[42%]">INFANCIA MEDIA</th>
            <th class="border border-black p-1 w-[43%]">INFANCIA TARDÍA</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="obj in reunion.programa.objetivosEducativos" :key="obj.id">
            <td class="border border-black p-1 font-bold">{{ obj.area }}</td>
            <td class="border border-black p-1 text-left">{{ obj.media }}</td>
            <td class="border border-black p-1 text-left">{{ obj.tardia }}</td>
          </tr>
        </tbody>
      </table>
      <!-- ================= EVALUACIÓN INTEGRADA ================= -->
      <div class="mt-4" style="page-break-inside: avoid">
        <h3 class="font-bold text-xs bg-gray-200 border border-black border-b-0 p-1 uppercase">
          EVALUACIÓN DE LA REUNIÓN
        </h3>
        <table class="w-full text-xs border-collapse border border-black mb-4">
          <tbody>
            <tr>
              <td class="border border-black p-1.5 font-bold w-1/2">
                9.1. ¿SE CUMPLE EL PROGRAMA?
              </td>
              <td class="border border-black p-1.5">
                {{ reunion.programa?.evaluacion?.cumplePrograma || 'Sin evaluar' }}
              </td>
            </tr>
            <tr>
              <td class="border border-black p-1.5 font-bold">
                9.2. ¿SE CUMPLE EL OBJETIVO DE LA ACTIVIDAD PRINCIPAL?
              </td>
              <td class="border border-black p-1.5">
                {{ reunion.programa?.evaluacion?.cumpleObjetivo || 'Sin evaluar' }}
              </td>
            </tr>
            <tr>
              <td class="border border-black p-1.5 font-bold">
                9.3. ¿SE LOGRA CONTRIBUIR AL DESARROLLO DE LOS OBJETIVOS EDUCATIVOS?
              </td>
              <td class="border border-black p-1.5">
                {{ reunion.programa?.evaluacion?.contribuyeObjetivos || 'Sin evaluar' }}
              </td>
            </tr>
            <tr>
              <td class="border border-black p-1.5 font-bold">
                9.4. ¿LAS ACTIVIDADES GUARDARON COHERENCIA CON EL ÉNFASIS?
              </td>
              <td class="border border-black p-1.5">
                {{ reunion.programa?.evaluacion?.coherenciaEnfasis || 'Sin evaluar' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- ======================================================== -->
    </div>
    <!-- ========================================== -->
    <!-- EVALUACIÓN DE REUNIONES (MÓDULO C.2)       -->
    <!-- ========================================== -->
    <div class="page-break"></div>
    <div class="mb-4 text-center">
      <h2 class="text-xl font-bold uppercase">Evaluación del Ciclo de Programa</h2>
    </div>
  </div>
</template>
