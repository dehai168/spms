<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
      <el-form ref="queryForm" :inline="true" :model="queryForm">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="daterange" label="上传日期">
              <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="true" style="width: 230px"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="title" label="标题" style="width: 100%">
              <el-input v-model="queryForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
        <el-row> </el-row>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-row>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate" style="margin-bottom: 5px">新增</el-button>
      </el-row>
      <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="author" label="作者"> </el-table-column>
        <el-table-column prop="filecode" label="文件编号"> </el-table-column>
        <el-table-column prop="user" label="上传用户"> </el-table-column>
        <el-table-column prop="input_time" label="上传时间" width="135"> </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.$index, scope.row)">详情</el-button>
            <el-button type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" v-if="scope.row.filename.length > 0" @click="handleDownload(scope.$index, scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
    </el-footer>
    <el-dialog :title="addflag ? '添加' : '编辑'" :visible.sync="dialogVisible" width="45%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item prop="title" label="标题">
          <el-input type="text" v-model="form.title" maxlength="50" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item prop="author" label="作者">
          <el-input type="text" v-model="form.author" maxlength="50" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item prop="filecode" label="文件编号">
          <el-input type="text" v-model="form.filecode" maxlength="50" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item prop="msg" label="内容">
          <el-input type="textarea" :rows="3" v-model="form.msg" maxlength="350" show-word-limit :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input type="text" v-model="form.remark" maxlength="50" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload ref="upload" drag :action="uploadUrl" :on-error="handleUploadError" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">
              注意:只能上传<strong>{{ whiteList }}</strong
              >文件，且不超过<strong>{{ fileSize }}MB</strong>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { items, create, update, remove, uploadUrl, download } from '@/api/knowledge'
import { parseTime } from '@/utils/index'
export default {
  name: 'Knowledge',
  components: {},
  props: {},
  data() {
    const now = new Date()
    const start = new Date()
    if (now.getDate() === 1) {
      start.setMonth(now.getMonth() - 1)
      start.setDate(1)
      now.setDate(now.getDate() - 1)
    } else {
      start.setDate(1)
      now.setDate(now.getDate() - 1)
    }
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        title: '',
        daterange: [parseTime(start, '{y}-{m}-{d}'), parseTime(now, '{y}-{m}-{d}')],
        fromtime: '',
        totime: '',
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      form: {
        knowledgeid: -1,
        title: '',
        author: '',
        filecode: '',
        filename: '',
        msg: '',
        remark: ''
      },
      formRules: {
        title: [{ required: true, trigger: 'blur', message: '该项是必填项' }]
        // certificate_code: [{ required: true, trigger: 'blur', message: '该项是必填项' }]
      },
      addflag: true,
      isView: false,
      dialogVisible: false,
      submitDisabled: false,
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableSelected: [],
      whiteList: 'wps/doc/docx/ppt/pptx/xls/xlsx/pdf/zip/rar',
      fileSize: 20
    }
  },
  computed: {
    uploadUrl() {
      return uploadUrl()
    }
  },
  created() {
    const that = this
    this.init(function () {
      that.handleQuery()
    })
  },
  mounted() {},
  destroyed() {},
  methods: {
    init(callback) {
      // 初始化异步操作，例如数据字典
      callback()
    },
    handleQuery(flag) {
      if (flag === undefined) {
        this.queryForm.pageindex = 1
      }
      if (this.queryForm.daterange) {
        this.queryForm.fromtime = this.queryForm.daterange[0]
        this.queryForm.totime = this.queryForm.daterange[1]
      } else {
        this.queryForm.fromtime = ''
        this.queryForm.totime = ''
      }
      const queryObj = { ...this.queryForm }
      console.log(queryObj)
      delete queryObj.daterange
      this.tableLoading = true
      items(queryObj)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data
            this.tableDataCount = res.size
          }
          this.tableLoading = false
        })
        .catch(e => {
          this.tableLoading = false
          console.error(e)
        })
    },
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    handleBatchRemove() {
      const ids = []
      const names = []
      this.tableSelected.forEach(element => {
        ids.push(element.knowledgeid)
        names.push(element.title)
      })
      if (ids.length > 0) {
        this.removeData(ids, names)
      } else {
        this.$message({
          message: '请选择需要删除的内容!',
          type: 'info'
        })
      }
    },
    formClear(flag) {
      this.dialogVisible = flag
      this.addflag = flag
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },
    handleCreate() {
      this.formClear(true)
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitDisabled = true // 防止重复提交
          if (this.addflag) {
            create(this.form)
              .then(res => {
                if (res.code === 200) {
                  if (res.data) {
                    this.$message({
                      message: '操作成功!',
                      type: 'success'
                    })
                    this.dialogVisible = false
                    this.handleQuery()
                  } else {
                    this.$message({
                      message: '操作失败!',
                      type: 'warning'
                    })
                  }
                }
                this.submitDisabled = false
              })
              .catch(e => {
                console.error(e)
                this.submitDisabled = false
              })
          } else {
            update(this.form)
              .then(res => {
                if (res.code === 200) {
                  if (res.data) {
                    this.$message({
                      message: '操作成功!',
                      type: 'success'
                    })
                    this.dialogVisible = false
                    this.handleQuery()
                  } else {
                    this.$message({
                      message: '操作失败!',
                      type: 'warning'
                    })
                  }
                }
                this.submitDisabled = false
              })
              .catch(e => {
                console.error(e)
                this.submitDisabled = false
              })
          }
        }
      })
    },
    handleSelectionChange(val) {
      this.tableSelected = val
    },
    handleSizeChange(pagesize) {
      this.queryForm.pagesize = pagesize
      this.handleQuery(true)
    },
    handleCurrentChange(pageindex) {
      this.queryForm.pageindex = pageindex
      this.handleQuery(true)
    },
    handleView(index, row) {
      this.formClear(false)
      this.isView = true
      this.form = { ...row }
      this.dialogVisible = true
      return
    },
    handleUpdate(index, row) {
      this.formClear(false)
      this.form = { ...row }
      this.dialogVisible = true
    },
    handleRemove(index, row) {
      this.removeData(row.knowledge, row.title)
    },
    removeData(knowledge, names) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            knowledge,
            names
          })
            .then(res => {
              if (res.code === 200) {
                if (res.data) {
                  this.$message({
                    message: '操作成功!',
                    type: 'success'
                  })
                  if (1 === this.tableDataCount && this.queryForm.pageindex !== 1) {
                    this.queryForm.pageindex = 1
                  }
                  this.handleQuery()
                } else {
                  this.$message({
                    message: '操作失败!',
                    type: 'warning'
                  })
                }
              }
            })
            .catch(e => {
              console.error(e)
            })
        })
        .catch(() => {})
    },
    handleDownload(index, row) {
      download(row.filename)
    },
    beforeUpload(file) {
      const whiteListArray = this.whiteList.split('/')
      let isWhite = false
      whiteListArray.forEach(element => {
        console.log(file.name + ',' + element)
        if (file.name.indexOf(element) > -1) {
          isWhite = true
        }
      })
      whiteListArray.indexOf(file.name) > -1
      const islimit = file.size / 1024 / 1024 < this.fileSize

      if (!isWhite) {
        this.$message.error('上传文件格式不支持!')
      }
      if (!islimit) {
        this.$message.error('上传文件体积过大!')
      }
      return isWhite && islimit
    },
    handleUploadSuccess(res, file, filelist) {
      if (res.code === 200) {
        if (this.form.filecode.length === 0) {
          this.form.filecode = file.name
        }
        this.form.filename = res.data
      } else {
        this.$message({
          message: '文件上传失败,请重新上传!',
          type: 'warning'
        })
      }
    },
    handleUploadError() {
      this.$message({
        message: '文件上传失败,请重新上传!',
        type: 'warning'
      })
    }
  }
}
</script>
<style scoped>
.container {
  height: calc(100vh - 110px);
  width: 100%;
}
.main {
  height: calc(100vh - 152px);
  width: 100%;
  padding: 5px;
}
</style>
