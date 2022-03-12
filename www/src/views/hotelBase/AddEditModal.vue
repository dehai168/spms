<template>
  <el-dialog title="新增旅馆" :visible.sync="visible">
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel()">取 消</el-button>
      <el-button type="primary" @click="onOk()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    onOk: {
      type: Function,
      default: () => { }
    },
    onCancel: {
      type: Function,
      default: () => { }
    }
  },

}
</script>

<style lang="scss" scoped>
</style>