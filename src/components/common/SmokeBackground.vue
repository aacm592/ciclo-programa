<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const mouseOffset = ref({ x: 0, y: 0 })
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let animationId = null

function handleMouseMove(e) {
  // Rango sutil de paralaje (-35px a +35px)
  const normX = (e.clientX / window.innerWidth) - 0.5
  const normY = (e.clientY / window.innerHeight) - 0.5
  targetX = normX * 45
  targetY = normY * 45
}

function handleMouseLeave() {
  targetX = 0
  targetY = 0
}

function updateParallax() {
  // Lerp suave
  currentX += (targetX - currentX) * 0.04
  currentY += (targetY - currentY) * 0.04
  mouseOffset.value = {
    x: Math.round(currentX * 100) / 100,
    y: Math.round(currentY * 100) / 100,
  }
  animationId = requestAnimationFrame(updateParallax)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
  animationId = requestAnimationFrame(updateParallax)
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<template>
  <div class="fixed inset-0 w-full h-full pointer-events-none z-0 no-print overflow-hidden select-none" aria-hidden="true">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      class="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Filtro de desenfoque extremo para crear el efecto de humo sedoso -->
        <filter id="smokeBlur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="130" />
        </filter>

        <!-- Filtro de desenfoque medio para mezclar capas -->
        <filter id="softBlur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="75" />
        </filter>
      </defs>

      <!-- Fondo base oscuro (Azul índigo pizarra profundo) -->
      <rect width="1440" height="900" fill="#0b0f19" />

      <!-- CONTENEDOR DE CAPAS DE HUMO CON PARALAJE REACTIVO AL MOUSE -->
      <g :style="{ transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`, transition: 'transform 0.1s linear' }">
        <!-- CAPA DE HUMO 1: Verde Esmeralda / Jade de marca (Esquina inferior izquierda) -->
        <circle
          cx="200"
          cy="720"
          r="420"
          fill="#068f63"
          opacity="0.85"
          filter="url(#smokeBlur)"
          class="smoke-blob-1"
        />

        <!-- CAPA DE HUMO 2: Morado Institucional de marca (Centro/Derecha) -->
        <circle
          cx="920"
          cy="420"
          r="520"
          fill="#433d95"
          opacity="0.9"
          filter="url(#smokeBlur)"
          class="smoke-blob-2"
        />

        <!-- CAPA DE HUMO 3: Cian / Azul claro suave (Esquina superior izquierda) -->
        <circle
          cx="300"
          cy="160"
          r="360"
          fill="#06b6d4"
          opacity="0.55"
          filter="url(#softBlur)"
          class="smoke-blob-3"
        />

        <!-- CAPA DE HUMO 4: Violeta / Magenta suave (Esquina inferior derecha) -->
        <circle
          cx="1220"
          cy="820"
          r="420"
          fill="#7e22ce"
          opacity="0.65"
          filter="url(#smokeBlur)"
          class="smoke-blob-4"
        />

        <!-- CAPA DE HUMO 5: Jade Esmeralda central para unificar colores -->
        <circle
          cx="700"
          cy="520"
          r="340"
          fill="#047857"
          opacity="0.6"
          filter="url(#smokeBlur)"
          class="smoke-blob-1"
        />

        <!-- CAPA DE HUMO 6: Toque verde suave luminoso en la zona izquierda -->
        <circle
          cx="450"
          cy="600"
          r="260"
          fill="#10b981"
          opacity="0.5"
          filter="url(#softBlur)"
          class="smoke-blob-3"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
/* Animaciones de flujo lento y orgánico */
@keyframes flow1 {
  0% {
    transform: translate(0px, 0px) scale(1) rotate(0deg);
  }
  50% {
    transform: translate(140px, -90px) scale(1.25) rotate(35deg);
  }
  100% {
    transform: translate(0px, 0px) scale(1) rotate(0deg);
  }
}

@keyframes flow2 {
  0% {
    transform: translate(0px, 0px) scale(1) rotate(0deg);
  }
  50% {
    transform: translate(-180px, 130px) scale(1.3) rotate(-25deg);
  }
  100% {
    transform: translate(0px, 0px) scale(1) rotate(0deg);
  }
}

@keyframes flow3 {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(90px, 160px) scale(0.85);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Aplicación a las manchas de color con aceleración GPU */
.smoke-blob-1 {
  animation: flow1 22s ease-in-out infinite alternate;
  transform-origin: center;
  will-change: transform;
}

.smoke-blob-2 {
  animation: flow2 26s ease-in-out infinite alternate;
  transform-origin: center;
  will-change: transform;
}

.smoke-blob-3 {
  animation: flow3 18s ease-in-out infinite alternate;
  transform-origin: center;
  will-change: transform;
}

.smoke-blob-4 {
  animation: flow1 32s ease-in-out infinite alternate-reverse;
  transform-origin: center;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .smoke-blob-1,
  .smoke-blob-2,
  .smoke-blob-3,
  .smoke-blob-4 {
    animation: none;
  }
}
</style>

