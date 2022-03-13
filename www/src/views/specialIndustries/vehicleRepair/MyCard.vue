<template>
  <div class="my-card-container">
    <div class="my-card-header">
      <el-button type="primary">{{ title }}</el-button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }

}
</script>

<style lang="scss" scoped>

</style>