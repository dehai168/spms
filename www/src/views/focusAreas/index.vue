<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 92px;">
      <el-form ref="queryForm" :inline="true" :model="queryForm">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="impotant_fence" label="重点地区名称">
              <el-input v-model="queryForm.impotant_fence"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="fence_name_temp" label="区划名称">
              <el-cascader v-model="queryForm.fence_name_temp" :options="zoneList"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="sex" label="性别">
              <el-select v-model="queryForm.sex" placeholder="请选择">
                <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="nation" label="民族">
              <el-select v-model="queryForm.nation" placeholder="请选择">
                <el-option v-for="item in nationalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="register_unit" label="登记单位名称">
              <el-input v-model="queryForm.register_unit" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="daterange" label="登记日期">
              <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" style="max-width: 220px"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-row>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate" style="margin-bottom: 5px">新增</el-button>
      </el-row>
      <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column prop="important_fence" label="重点地区名称"> </el-table-column>
        <el-table-column prop="fence_name" label="区划名称"> </el-table-column>
        <el-table-column prop="sex" label="性别" width="50"> </el-table-column>
        <el-table-column prop="nation" label="名族" width="50"> </el-table-column>
        <el-table-column prop="begin_age" label="年龄段从" width="70"> </el-table-column>
        <el-table-column prop="end_age" label="年龄段至" width="70"> </el-table-column>
        <el-table-column prop="begin_date" label="开始日期" width="90"> </el-table-column>
        <el-table-column prop="end_date" label="结束日期" width="90"> </el-table-column>
        <el-table-column prop="register_unit" label="登记单位"> </el-table-column>
        <el-table-column prop="input_time" label="登记时间" width="135"> </el-table-column>
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.size" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
    </el-footer>
    <el-dialog :title="addflag ? '添加' : '编辑'" :visible.sync="dialogVisible" width="45%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item prop="important_fence" label="重点地区名称">
          <el-input v-model="form.important_fence" maxlength="50" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item prop="fence_name_temp" label="区划名称">
          <el-cascader v-model="form.fence_name_temp" :options="zoneList" style="width: 100%" :disabled="isView"></el-cascader>
        </el-form-item>
        <el-form-item  prop="nation" label="名族">
          <el-select v-model="form.nation" placeholder="请选择" style="width: 100%" :disabled="isView">
            <el-option v-for="item in nationalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="sex" label="性别">
          <el-select v-model="form.sex" placeholder="请选择" style="width: 100%" :disabled="isView">
            <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="begin_age" label="年龄范围从">
          <el-input-number v-model="form.begin_age" :max="120" :min="0" style="width: 100%" :disabled="isView"></el-input-number>
        </el-form-item>
        <el-form-item  prop="end_age" label="年龄范围至">
          <el-input-number v-model="form.end_age" :max="120" :min="0" style="width: 100%" :disabled="isView"></el-input-number>
        </el-form-item>
        <el-form-item  prop="begin_date" label="起始时间">
          <el-date-picker v-model="form.begin_date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%" :disabled="isView"> </el-date-picker>
        </el-form-item>
        <el-form-item  prop="end_date" label="结束时间">
          <el-date-picker v-model="form.end_date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%" :disabled="isView"> </el-date-picker>
        </el-form-item>
        <el-form-item  prop="register_unit" label="登记单位">
          <el-input v-model="form.register_unit" maxlength="150" :disabled="isView"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入" :visible.sync="importDialogVisible" width="45%" :close-on-click-modal="false">
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
import { items, item, create, update, remove, batchremove, importexcel, exportexcel, exist, templeteUrl, uploadUrl, download } from '@/api/focusareas'
import Cookies from 'js-cookie'
export default {
  name: 'FocusAreas',
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
        important_fence: '',
        fence_name_temp: [],
        fence_name: '',
        sex: '男',
        nation: '汉族',
        daterange: [],
        size: defaultSettings.pageSizes[0],
        index: 1
      },
      importForm: {
        filename: ''
      },
      form: {
        important_fenceid: -1,
        important_fence: '',
        fence_name: '',
        fence_name_temp: [],
        nation: '汉族',
        sex: '男',
        begin_age: '',
        end_age: '',
        begin_date: '',
        end_date: '',
        register_unit: ''
      },
      formRules: {
        important_fence: [{ required: true, trigger: 'blur', message: '该项为必填项' }],
        fence_name_temp: [{ required: true, trigger: 'blur', message: '该项为必填项' }]
      },
      sexList: [
        { value: '男', label: '男' },
        { value: '女', label: '女' }
      ],
      zoneList: [
        {
          value: '北京市',
          label: '北京市',
          children: [
            {
              value: '北京市',
              label: '北京市',
              children: [
                {
                  value: '东城区',
                  label: '东城区'
                }
              ]
            }
          ]
        }
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
      isView: false,
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
      this.queryForm.fence_name = this.queryForm.fence_name_temp.join('/')
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
        ids.push(element.important_fenceid)
        names.push(element.important_fence)
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
      this.isView = false
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    handleCreate() {
      this.formClear(true)
    },
    handleSubmit() {
      if (this.isView) {
        this.dialogVisible = false
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.fence_name = this.form.fence_name_temp.join('/')
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
    handleSizeChange(size) {
      this.queryForm.size = size
      this.handleQuery()
    },
    handleCurrentChange(index) {
      this.queryForm.index = index
      this.handleQuery()
    },
    handleView(index, row) {
      this.formClear(false)
      this.isView = true
      this.form = { ...row }
      this.form.fence_name_temp = row.fence_name.split('/')
      this.dialogVisible = true
      return
      item({
        important_fenceid: row.important_fenceid
      })
        .then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.dialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleUpdate(index, row) {
      this.formClear(false)
      this.form = { ...row }
      this.form.fence_name_temp = row.fence_name.split('/')
      this.dialogVisible = true
      return
      this.formClear(false)
      item({
        important_fenceid: row.important_fenceid
      })
        .then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.editKeyName = this.form.important_fence
            this.dialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleRemove(index, row) {
      // this.removeData([row.important_fenceid], [row.important_fence])
      this.removeData(row.important_fenceid, row.important_fence)
    },
    removeData(important_fenceid, names) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            important_fenceid,
            names
          })
            .then(res => {
              if (res.code === 200) {
                if (res.data) {
                  this.$message({
                    message: '操作成功!',
                    type: 'success'
                  })
                  if (1 === this.tableDataCount && this.queryForm.index !== 1) {
                    this.queryForm.index = 1
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
  height: calc(100vh - 202px);
  width: 100%;
  padding: 5px;
}
</style>
