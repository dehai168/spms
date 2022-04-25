<template>
  <el-table ref="tableData" :data="tableData" border style="width: 100%">
    <el-table-column type="index" width="50"> </el-table-column>
    <el-table-column prop="name" label="名称"> </el-table-column>
    <el-table-column label="操作" width="90">
      <template slot-scope="scope">
        <el-button type="text" style="font-size: 16px" icon="el-icon-video-camera" @click="handleVideo(scope.$index, scope.row)"></el-button>
        <el-button type="text" style="font-size: 16px" icon="el-icon-picture-outline" @click="handleImage(scope.$index, scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'medialist',
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
      tableData: [
        { id: 1, name: '大厅正面监控' },
        { id: 2, name: '大厅监控' },
        { id: 3, name: '停车场A入口' },
        { id: 4, name: '停车场A出口' },
        { id: 5, name: '停车场云台监控' }
      ]
    }
  },
  methods: {
    handleVideo(index, row) {
      this.$emit('openVideo', row)
    },
    handleImage(index, row) {
      this.$emit('openImage', row)
    }
  }
}
</script>
<style scoped></style>
