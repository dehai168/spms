<template>
  <img :src="imgSrc" style="width:100%" alt="" srcset="" />
</template>

<script>
import imgSrc from '@/assets/demo.png'
export default {
  name: 'markerdetail',
  props: {
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      imgSrc: imgSrc
    }
  }
}
</script>
<style scoped></style>
