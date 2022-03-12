<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
      <el-form ref="queryForm" :inline="true" :model="queryForm">
        <el-form-item>
          <el-input placeholder="请输入关键字" suffix-icon="el-icon-search" v-model="queryForm.name" style="width: 400px" @keyup.enter.native="handleQuery"> </el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
          <el-button icon="el-icon-delete" @click="handleBatchRemove">删除</el-button>
          <el-button icon="el-icon-download" @click="handleImport">导入</el-button>
          <el-button icon="el-icon-download" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column fixed type="selection" width="55"> </el-table-column>
        <el-table-column fixed label="操作" width="90">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="关键字" width="90"> </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column prop="createuser" label="添加人员"> </el-table-column>
        <el-table-column prop="createdat" label="添加时间" width="140"> </el-table-column>
        <el-table-column prop="updateuser" label="更新人员"> </el-table-column>
        <el-table-column prop="updatedat" label="更新时间" width="140"> </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
    </el-footer>
    <el-dialog :title="addflag ? '添加' : '编辑'" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item prop="name" label="关键字">
          <el-input v-model="form.name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="3" v-model="form.remark" maxlength="150"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入" :visible.sync="importDialogVisible" width="30%" :close-on-click-modal="false">
      <el-form label-width="80px">
        <el-form-item label="参考模板">
          <el-link type="primary" :href="templeteUrl" target="_blank">下载</el-link>
        </el-form-item>
        <el-form-item label="导入数据">
          <el-upload ref="upload" drag :headers="uploadHeader" :action="uploadUrl" :on-error="handleUploadError" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">注意:只能上传<strong>xls/xlsx</strong>文件，且不超过<strong>2MB</strong></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitImportDisabled" @click="handleSubmitImport">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { items, item, create, update, remove, batchremove, importexcel, exportexcel, exist, templeteUrl, uploadUrl, download } from '@/api/table'
import { formatDate } from '@/utils/index'
import Cookies from 'js-cookie'
export default {
  name: 'Table',
  components: {},
  props: {},
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入关键字'))
      } else {
        if (this.editKeyName === value) {
          return callback()
        } else {
          exist({ key: 'name', value })
            .then(res => {
              if (res.code === 20000) {
                if (res.data) {
                  return callback(new Error('关键字已经存在,请重新输入!'))
                } else {
                  return callback()
                }
              }
            })
            .catch(e => {
              console.error(e)
            })
        }
      }
    }
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        name: '',
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      importForm: {
        filename: ''
      },
      form: {
        keyid: -1,
        name: '',
        remark: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }]
      },
      uploadHeader: {},
      addflag: true,
      importDialogVisible: false,
      dialogVisible: false,
      submitDisabled: false,
      submitImportDisabled: false,
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableSelected: [],
      editKeyName: ''
    }
  },
  computed: {
    templeteUrl() {
      return templeteUrl()
    },
    uploadUrl() {
      return uploadUrl()
    }
  },
  created() {
    const that = this
    this.init(function () {
      that.handleQuery()
    })
    this.uploadHeader[defaultSettings.csrfTokenName] = Cookies.get('csrfToken')
  },
  mounted() {},
  destroyed() {},
  methods: {
    init(callback) {
      // 初始化异步操作，例如数据字典
      callback()
    },
    handleQuery() {
      this.tableLoading = true
      items(this.queryForm)
        .then(res => {
          if (res.code === 20000) {
            res.data.items.forEach(element => {
              element.createdat = formatDate('datetime', element.createdat)
              element.updatedat = formatDate('datetime', element.updatedat)
            })
            this.tableData = res.data.items
            this.tableDataCount = res.data.total
          }
          this.tableLoading = false
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleExport() {
      exportexcel(this.queryForm)
        .then(res => {
          if (res.code === 20000) {
            download(res.data)
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleBatchRemove() {
      const ids = []
      const names = []
      this.tableSelected.forEach(element => {
        ids.push(element.keyid)
        names.push(element.name)
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
    handleImport() {
      this.importDialogVisible = true
      this.submitImportDisabled = false
      this.importForm.filename = ''
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },
    formClear(flag) {
      this.dialogVisible = flag
      this.addflag = flag
      if (this.$refs.form) {
        this.$refs.form.resetFields()
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
                if (res.code === 20000) {
                  if (res.data) {
                    this.$message({
                      message: '操作成功!',
                      type: 'success'
                    })
                    this.dialogVisible = false
                    this.editKeyName = ''
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
                if (res.code === 20000) {
                  if (res.data) {
                    this.$message({
                      message: '操作成功!',
                      type: 'success'
                    })
                    this.dialogVisible = false
                    this.editKeyName = ''
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
    handleSubmitImport() {
      const that = this
      if (this.importForm.filename.length !== 0) {
        importexcel(this.importForm)
          .then(res => {
            if (res.code === 20000) {
              if (res.data.flag) {
                that.importDialogVisible = false
                that.handleQuery()
              } else {
                this.$message({
                  message: '导入失败,错误信息如下:' + res.data.info.join(';'),
                  type: 'warning'
                })
              }
            }
          })
          .catch(e => {
            console.error(e)
          })
      } else {
        this.$message({
          message: '请选择需要导入的文件!',
          type: 'info'
        })
      }
    },
    handleSelectionChange(val) {
      this.tableSelected = val
    },
    handleSizeChange(pagesize) {
      this.queryForm.pagesize = pagesize
      this.handleQuery()
    },
    handleCurrentChange(pageindex) {
      this.queryForm.pageindex = pageindex
      this.handleQuery()
    },
    handleUpdate(index, row) {
      this.formClear(false)
      item({
        keyid: row.keyid
      })
        .then(res => {
          if (res.code === 20000) {
            this.form = res.data
            this.editKeyName = this.form.name
            this.dialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleRemove(index, row) {
      this.removeData([row.keyid], [row.name])
    },
    removeData(ids, names) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          batchremove({
            ids,
            names
          })
            .then(res => {
              if (res.code === 20000) {
                if (res.data) {
                  this.$message({
                    message: '操作成功!',
                    type: 'success'
                  })
                  if (ids.length === this.tableDataCount && this.queryForm.pageindex !== 1) {
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
    beforeUpload(file) {
      const isXls = file.name.indexOf('.xls') > -1 || file.name.indexOf('.xlsx') > -1
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isXls) {
        this.$message.error('上传文件只能是 xls/xlsx 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isXls && isLt2M
    },
    handleUploadSuccess(res, file, filelist) {
      if (res.code === 20000) {
        this.importForm.filename = res.data.sname
      } else {
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
<style scoped>
.container {
  height: calc(100vh - 50px);
  width: 100%;
}
.main {
  height: calc(100vh - 84px);
  width: 100%;
  padding: 5px;
}
</style>
