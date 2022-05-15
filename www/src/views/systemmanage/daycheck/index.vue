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
            <el-form-item prop="enterprise" label="企业名称">
              <el-input v-model="queryForm.enterprise" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="daterange" label="创建日期">
              <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" style="max-width: 240px"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
        <el-table-column prop="type" label="行业类型"> </el-table-column>
        <el-table-column prop="enterprise" label="企业名称"> </el-table-column>
        <el-table-column prop="check_type" label="检查方式"> </el-table-column>
        <el-table-column label="检查时间段" width="270">
          <template slot-scope="scope">
            <span>{{ scope.row.check_fromtime }}</span
            >~<span>{{ scope.row.check_totime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="check_user" label="检查人" width="80"> </el-table-column>
        <el-table-column prop="check_result" label="检查结果" width="105"> </el-table-column>
        <el-table-column prop="chief_person" label="企业负责人" width="105"> </el-table-column>
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
    <el-dialog :title="addflag ? '添加' : '编辑'" :visible.sync="dialogVisible" width="45%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item prop="type" label="行业类型">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%" :disabled="isView" @change="handleTypeSelect">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="enterprise" label="企业名称">
          <el-select v-model="form.enterprise" filterable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading" :disabled="isView" style="width: 100%">
            <el-option v-for="item in options" :key="item.systemid" :label="item.enterprise" :value="item.systemid"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="check_type" label="检查方式">
          <el-select v-model="form.check_type" placeholder="请选择" style="width: 100%" :disabled="isView">
            <el-option v-for="item in checkTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="daterange" label="检查时间">
          <el-date-picker v-model="form.daterange" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" placeholder="选择日期时间" style="width: 100%" :disabled="isView"> </el-date-picker>
        </el-form-item>
        <el-form-item prop="check_user" label="检查人">
          <el-input v-model="form.check_user" maxlength="50" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item prop="check_peer" label="共同检查人">
          <el-input v-model="form.check_peer" maxlength="50" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item>
          <el-table :data="form.checkList" border style="width: 100%">
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="check_name" label="检查事项"> </el-table-column>
            <el-table-column label="选择">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.result">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="说明">
              <template slot-scope="scope">
                <el-input type="textarea" v-model="scope.row.explain"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <!-- <table>
                <thead>
                    <th>
                        <td>检查事项</td>
                        <td>选择</td>
                        <td>说明</td>
                    </th>
                </thead>
                <tbody>
                    <tr v-for="item in checkList" :key="item.checkid">
                        <td>{{item.check_name}}</td>
                        <td><el-radio-group v-model="item.result">
    <el-radio :label="1">是</el-radio>
    <el-radio :label="0">否</el-radio>
  </el-radio-group></td>
                        <td><el-input type="textarea" v-model="item.explain"></el-input></td>
                    </tr>
                </tbody>
            </table> -->
        </el-form-item>
        <el-form-item prop="check_idea" label="工作意见">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.check_idea" maxlength="250" show-word-limit :disabled="isView"> </el-input>
        </el-form-item>
        <el-form-item prop="check_result" label="检查结果">
          <el-select v-model="form.check_result" placeholder="请选择" style="width: 100%" :disabled="isView" clearable>
            <el-option v-for="item in checkResultList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="chief_person" label="场所负责人">
          <el-input v-model="form.chief_person" maxlength="50" :disabled="isView"></el-input>
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
import { items, create, update, remove, searchlist, checkItems } from '@/api/daycheck'
export default {
  name: 'DayCheck',
  components: {},
  props: {},
  data() {
    const now = new Date()
    const yestoday = new Date()
    yestoday.setTime(now.getTime() - 3600 * 24 * 1000)
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        type: null,
        enterprise: '',
        daterange: [],
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      importForm: {
        filename: ''
      },
      form: {
        daily_check_id: -1,
        type: 1,
        systemid: -1,
        enterprise: '',
        check_type: 1,
        daterange: [],
        check_user: '',
        check_peer: '',
        checkList: [],
        check_idea: '',
        check_result: 0,
        chief_person: '',
        remark: ''
      },
      formRules: {
        // realname: [{ required: true, trigger: 'blur', message: '该项是必填项' }],
        // certificate_code: [{ required: true, trigger: 'blur', message: '该项是必填项' }]
      },
      typeList: [
        { value: 1, label: '旅馆业' },
        { value: 2, label: '旧货交易' },
        { value: 3, label: '机动车修理业' },
        { value: 4, label: '废旧金属回收' },
        { value: 5, label: '公章刻制业' },
        { value: 6, label: 'KTV' },
        { value: 7, label: '酒吧' }
      ],
      checkTypeList: [{ value: 1, label: '着警服公开检查' }],
      checkResultList: [
        { value: 0, label: '正常' },
        { value: 1, label: '异常' }
      ],
      addflag: true,
      isView: false,
      dialogVisible: false,
      submitDisabled: false,
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableSelected: [],
      loading: false,
      options: []
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
      if (this.queryForm.daterange.length > 0) {
        this.queryForm.fromtime = this.queryForm.daterange[0]
        this.queryForm.totime = this.queryForm.daterange[1]
      } else {
        this.queryForm.fromtime = ''
        this.queryForm.totime = ''
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
          this.tableLoading = false
        })
    },
    handleReset() {
      this.$refs.queryForm.resetFields()
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
      return
    },
    handleRemove(index, row) {
      this.removeData(row.daily_check_id, row.realname)
    },
    removeData(daily_check_id, names) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            daily_check_id,
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
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        searchlist({
          type: this.form.type,
          enterprise: query,
          index: 1,
          size: 10
        })
          .then(res => {
            this.loading = false
            if (res.code === 200) {
              this.options = res.data
            }
          })
          .catch(err => {})
      } else {
        this.options = []
      }
    },
    handleTypeSelect(item) {
      checkItems({
        pageindex: 1,
        pagesize: 99999,
        type: item
      })
        .then(res => {
          if (res.code === 200) {
            this.form.checkList.length = 0
            res.data.forEach(element => {
              this.form.checkList.push({
                checkid: element.checkid,
                check_name: element.check_name,
                result: null,
                explain: '',
                score: element.score
              })
            })
          }
        })
        .catch(err => {})
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
