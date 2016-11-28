<template>
  <svg class="spinner" :width="radius" viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20" fill="none" :stroke="color" :stroke-width="stroke" stroke-miterlimit="10" />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#1591B5'
    },
  	stroke: {
      type: Number,
      default: 4
    },
    radius: {
      type: Number,
      default: 50
    }
  }
}
</script>

<style>
svg.spinner {
  animation: rotate 1.4s linear infinite;
  display: block;
  margin: 0 auto;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
</style>
