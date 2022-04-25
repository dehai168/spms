<template>
  <div style="text-align: center">
    <img class="image" :src="logoSrcs[playIndex]" alt="" srcset="" />
    <div class="title">{{ datetime }}</div>
    <el-divider></el-divider>
    <el-carousel :initial-index="playIndex" :autoplay="false" type="card" height="120px" @change="handleView">
      <el-carousel-item v-for="(item, index) in logoSrcs" :key="index">
        <img :src="item" alt="" srcset="" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import logoSrc1 from '@/assets/demo.jpg'
import logoSrc2 from '@/assets/demo2.jpg'
import logoSrc3 from '@/assets/demo3.jpg'
import logoSrc4 from '@/assets/demo4.jpg'
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
      playIndex: 0,
      datetime: new Date().toLocaleDateString(),
      logoSrcs: [logoSrc1, logoSrc2, logoSrc3, logoSrc4]
    }
  },
  methods: {
    handleView(index) {
      this.playIndex = index
    }
  }
}
</script>
<style scoped>
.image {
  opacity: 0.75;
  height: 420px;
  width: 600px;
  margin: 0 auto;
}
.title {
  font-size: 14px;
}
.el-carousel__item img {
  opacity: 0.75;
  height: 120px;
}
</style>
