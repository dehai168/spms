<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 82px">
      <el-row>
        <el-col :span="20">
          <el-form ref="queryForm" :inline="true" :model="queryForm">
            <el-row>
              <el-col :span="6">
                <el-form-item label="人员姓名" style="width: 100%">
                  <el-input v-model="queryForm.realname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证件号码">
                  <el-input v-model="queryForm.certificate_code" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别">
                  <el-select v-model="queryForm.sex" placeholder="请选择">
                    <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="民族">
                  <el-select v-model="queryForm.nation" placeholder="请选择">
                    <el-option v-for="item in nationalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="创建日期">
                  <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-button type="primary" icon="el-icon-find" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
          <el-button icon="el-icon-delete" @click="handleBatchRemove">删除</el-button>
          <!-- <el-button icon="el-icon-download" @click="handleImport">导入</el-button>
          <el-button icon="el-icon-download" @click="handleExport">导出</el-button> -->
        </el-col>
      </el-row>
    </el-header>
    <el-main class="main">
      <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="realname" label="姓名"> </el-table-column>
        <el-table-column prop="certificate_code" label="证件号码"> </el-table-column>
        <el-table-column prop="sex" label="性别"> </el-table-column>
        <el-table-column prop="nation" label="名族"> </el-table-column>
        <el-table-column prop="birthday" label="出生日期"> </el-table-column>
        <el-table-column prop="interest_begin" label="关注日期"> </el-table-column>
        <el-table-column prop="interest_reason" label="关注原因"> </el-table-column>
        <el-table-column prop="" label="登记人"> </el-table-column>
        <el-table-column prop="input_time" label="登记时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.$index, scope.row)">详情</el-button>
            <el-button type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
    </el-footer>
    <el-dialog :title="addflag ? '添加' : '编辑'" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item prop="realname" label="姓名">
          <el-input v-model="form.realname" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="certificate_code" label="证件号码">
          <el-input v-model="form.certificate_code" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="名族">
          <el-select v-model="form.nation" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in nationalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="form.birthday" value-format="yyyy-MM-dd" type="datetime" placeholder="选择日期时间" style="width: 100%"> </el-date-picker>
        </el-form-item>
        <el-form-item label="关注日期">
          <el-date-picker v-model="form.interest_begin" value-format="yyyy-MM-dd" type="datetime" placeholder="选择日期时间" style="width: 100%"> </el-date-picker>
        </el-form-item>
        <el-form-item label="关注原因">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.interest_reason" maxlength="250"> </el-input>
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
import { items, item, create, update, remove, batchremove, importexcel, exportexcel, exist, templeteUrl, uploadUrl, download } from '@/api/focustarget'
import { formatDate } from '@/utils/index'
import Cookies from 'js-cookie'
export default {
  name: 'FocusTarget',
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
              if (res.code === 200) {
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
        realname: '',
        certificate_code: '',
        sex: '男',
        daterange: [],
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      importForm: {
        filename: ''
      },
      form: {
        important_interest_personid: -1,
        certificate_code: '',
        realname: '',
        sex: '男',
        nation: '汉族',
        interest_begin: null,
        interest_reason: ''
      },
      formRules: {
        realname: [{ required: true, trigger: 'blur', message: '该项是必填项' }],
        certificate_code: [{ required: true, trigger: 'blur', message: '该项是必填项' }]
      },
      sexList: [
        { value: '男', label: '男' },
        { value: '女', label: '女' }
      ],
      nationalList: [
        { value: '汉族', label: '汉族' },
        { value: '蒙古族', label: '蒙古族' },
        { value: '回族', label: '回族' },
        { value: '藏族', label: '藏族' },
        { value: '维吾尔族', label: '维吾尔族' },
        { value: '苗族', label: '苗族' }
      ],
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
      if (this.queryForm.daterange.length > 0) {
        this.queryForm.reg_begin = this.queryForm.daterange[0]
        this.queryForm.reg_end = this.queryForm.daterange[1]
      } else {
        this.queryForm.reg_begin = ''
        this.queryForm.reg_end = ''
      }
      items(this.queryForm)
        .then(res => {
          if (res.code === 200) {
            // res.data.items.forEach(element => {
            // })
            this.tableData = res.data
            this.tableDataCount = res.size
          }
          this.tableLoading = false
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    handleExport() {
      exportexcel(this.queryForm)
        .then(res => {
          if (res.code === 200) {
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
        ids.push(element.important_interest_personid)
        names.push(element.realname)
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
                if (res.code === 200) {
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
                if (res.code === 200) {
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
            if (res.code === 200) {
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
    handleView(index, row) {
      this.formClear(false)
      item({
        important_interest_personid: row.important_interest_personid
      })
        .then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.editKeyName = this.form.realame
            this.dialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleUpdate(index, row) {
      this.formClear(false)
      item({
        important_interest_personid: row.important_interest_personid
      })
        .then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.editKeyName = this.form.realname
            this.dialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleRemove(index, row) {
      this.removeData([row.important_interest_personid], [row.realname])
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
              if (res.code === 200) {
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
      if (res.code === 200) {
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
  height: calc(100vh - 110px);
  width: 100%;
}
.main {
  height: calc(100vh - 192px);
  width: 100%;
  padding: 5px;
}
</style>
