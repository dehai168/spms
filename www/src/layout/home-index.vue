<template>
  <el-container>
    <el-header style="padding: 0px">
      <menuBar />
    </el-header>
    <el-main style="padding: 0px">
      <app-main />
    </el-main>
  </el-container>
</template>

<script>
import { AppMain, menuBar } from './components'
export default {
  components: {
    AppMain,
    menuBar
  }
}
</script>

<style scoped>
</style>
