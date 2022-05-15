<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
      <el-form ref="queryForm" :inline="true" :model="queryForm">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="type" label="行业类型">
              <el-select v-model="queryForm.type" placeholder="请选择" clearable>
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="check_name" label="检查事项" style="width: 100%">
              <el-input v-model="queryForm.check_name"></el-input>
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
        <el-table-column prop="typename" label="行业类型"> </el-table-column>
        <el-table-column prop="check_name" label="检查事项"> </el-table-column>
        <el-table-column prop="input_type" label="输入类型" width="80">
          <template slot-scope="scope">
            {{ scope.row.input_type ? '输入' : '选择' }}
          </template>
        </el-table-column>
        <el-table-column prop="isrequired" label="是否必填" width="80">
          <template slot-scope="scope">
            {{ scope.row.isrequired ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="use_check" label="企业核查用途" width="105">
          <template slot-scope="scope">
            {{ scope.row.use_check ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分数" width="60"> </el-table-column>
        <el-table-column prop="input_time" label="时间" width="135"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
    </el-footer>
    <el-dialog :title="addflag ? '添加' : '编辑'" :visible.sync="dialogVisible" width="45%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item prop="type" label="行业类型">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="check_name" label="检查事项">
          <el-input type="textarea" :rows="3" v-model="form.check_name" maxlength="250" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="input_type" label="输入类型">
          <el-select v-model="form.input_type" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in inputTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="score" label="分数">
          <el-select v-model="form.score" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in scoreList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isrequired" label="是否必填">
          <el-checkbox v-model="form.isrequired"></el-checkbox>
        </el-form-item>
        <el-form-item prop="use_check" label="企业核查用途">
          <el-checkbox v-model="form.use_check"></el-checkbox>
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
import { items, create, update, remove } from '@/api/checklist'
export default {
  name: 'CheckList',
  components: {},
  props: {},
  data() {
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        check_name: '',
        type: null,
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      form: {
        checkid: -1,
        type: '1',
        check_name: '',
        input_type: 0,
        isrequred: false,
        use_check: false,
        score: 1,
        remark: ''
      },
      formRules: {
        check_name: [{ required: true, trigger: 'blur', message: '该项是必填项' }]
        // certificate_code: [{ required: true, trigger: 'blur', message: '该项是必填项' }]
      },
      inputTypeList: [
        { value: 0, label: '选择' },
        { value: 1, label: '输入' }
      ],
      scoreList: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
      ],
      typeList: [
        { value: 1, label: '旅馆业' },
        { value: 2, label: '旧货交易' },
        { value: 3, label: '机动车修理业' },
        { value: 4, label: '废旧金属回收' },
        { value: 5, label: '公章刻制业' },
        { value: 6, label: 'KTV' },
        { value: 7, label: '酒吧' }
      ],
      addflag: true,
      dialogVisible: false,
      submitDisabled: false,
      submitImportDisabled: false,
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableSelected: []
    }
  },
  computed: {},
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
    handleQuery() {
      this.tableLoading = true
      items(this.queryForm)
        .then(res => {
          if (res.code === 200) {
            const that = this
            res.data.forEach(element => {
              element.typename = that.typeList.find(v => {
                return v.value === element.type
              }).label
            })
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
        ids.push(element.checkid)
        names.push(element.check_name)
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
      this.handleQuery()
    },
    handleCurrentChange(pageindex) {
      this.queryForm.pageindex = pageindex
      this.handleQuery()
    },
    handleUpdate(index, row) {
      this.formClear(false)
      this.form = { ...row }
      this.dialogVisible = true
    },
    handleRemove(index, row) {
      this.removeData(row.checkid, row.check_name)
    },
    removeData(checkid, names) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            checkid,
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
