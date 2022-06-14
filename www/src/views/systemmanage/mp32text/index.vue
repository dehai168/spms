<template>
  <el-form style="width: 50%; margin: 100px auto auto auto">
    <h3>语音转文字</h3>
    <el-form-item>
      <el-upload ref="upload" drag action="/police/upload/file" :on-error="handleUploadError" :on-success="handleUploadSuccess" :before-upload="beforeUpload" style="width: 100%">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">注意:只能上传<strong>mp3/wav</strong>文件，且不超过<strong>20MB</strong></div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-refresh" @click="handleSubmit">转换</el-button>
    </el-form-item>
    <el-form-item label="输出文字">
      <el-input type="textarea" :rows="6" v-model="text" readonly></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import request from '@/utils/request'
export default {
  name: 'Mp32Text',
  components: {},
  props: {},
  data() {
    return {
      filename: '',
      text: ''
    }
  },
  computed: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    handleSubmit() {
      if (this.filename.length === 0) {
        this.$message({
          message: '请先选择文件!',
          type: 'warning'
        })
        return
      }
      request({
        url: '/alarm/sound/text?filename=' + this.filename + '&token=',
        method: 'get',
        params: {}
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data) {
              this.$message({
                message: '转换成功!',
                type: 'success'
              })
              this.text = res.data
            } else {
              this.$message({
                message: '转换失败!',
                type: 'warning'
              })
            }
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    beforeUpload(file) {
      const isXls = file.name.indexOf('.mp3') > -1 || file.name.indexOf('.wav') > -1
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!isXls) {
        this.$message.error('上传文件只能是 mp3/wav 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 20MB!')
      }
      return isXls && isLt2M
    },
    handleUploadSuccess(res, file, filelist) {
      if (res.code === 200) {
        this.filename = res.data
      } else {
        this.$refs.upload.clearFiles()
        this.$message({
          message: '文件上传失败,请重新上传!',
          type: 'warning'
        })
      }
    },
    handleUploadError(error, file, filelist) {
      this.$message({
        message: '文件上传失败,请重新上传!',
        type: 'warning'
      })
    }
  }
}
</script>
<style scoped></style>
