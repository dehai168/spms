<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
      <el-row>
        <el-col :span="21">
          <el-form ref="queryForm" :inline="true" :model="queryForm">
            <el-row>
              <el-col :span="6">
                <el-form-item prop="daterange" label="预警时间">
                  <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" style="max-width: 220px"> </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="state" label="状态">
                  <el-select v-model="queryForm.state" placeholder="请选择">
                    <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="realname" label="姓名">
                  <el-input v-model="queryForm.realname" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="certificate_code" label="证件号码">
                  <el-input v-model="queryForm.certificate_code" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="main">
      <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%">
        <el-table-column prop="alarm_time" label="预警时间"> </el-table-column>
        <el-table-column prop="alarm_address" label="预警地点"> </el-table-column>
        <el-table-column prop="alarm_reason" label="预警原因"> </el-table-column>
        <el-table-column prop="realname" label="姓名"> </el-table-column>
        <el-table-column prop="certificate_code" label="证件号码"> </el-table-column>
        <el-table-column prop="state" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state === 1">已处理</el-tag>
            <el-tag type="danger" v-else>未处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dispose_user" label="处理人" width="80"> </el-table-column>
        <el-table-column prop="dispose_time" label="处理时间" width="135"> </el-table-column>
        <el-table-column prop="dispose_msg" label="处理结果"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state !== 0" type="text" @click="handleView(scope.$index, scope.row)">详情</el-button>
            <el-button v-if="scope.row.state === 0" type="text" @click="handleDispose(scope.$index, scope.row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
    </el-footer>
    <el-dialog title="处理" :visible.sync="disposeDialogVisible" width="30%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
        <el-form-item label="预警时间">
          <el-input v-model="form.alarm_time" disabled></el-input>
        </el-form-item>
        <el-form-item label="预警地点">
          <el-input v-model="form.alarm_address" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realname" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.certificate_code" disabled></el-input>
        </el-form-item>
        <el-form-item label="预警原因">
          <el-input v-model="form.alarm_reason" disabled></el-input>
        </el-form-item>
        <el-form-item prop="dispose_msg" label="处理结果">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" maxlength="250" v-model="form.dispose_msg"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="disposeDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="detailDialogVisible" width="30%" :close-on-click-modal="false">
      <fieldset>
        <legend>预警信息</legend>
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
          <el-form-item label="预警时间">
            <el-input v-model="form.alarm_time" disabled></el-input>
          </el-form-item>
          <el-form-item label="预警地点">
            <el-input v-model="form.alarm_address" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.realname" disabled></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="form.certificate_code" disabled></el-input>
          </el-form-item>
          <el-form-item label="预警原因">
            <el-input v-model="form.alarm_reason" disabled></el-input>
          </el-form-item>
        </el-form>
      </fieldset>
      <fieldset>
        <legend>处理信息</legend>
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
          <el-form-item label="处理人">
            <el-input v-model="form.dispose_user" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理时间">
            <el-input v-model="form.dispose_time" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理结果">
            <el-input type="textarea" :rows="3" v-model="form.dispose_msg" disabled></el-input>
          </el-form-item>
        </el-form>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { items, item, update } from '@/api/earlywarn'
export default {
  name: 'EarlyWarn',
  components: {},
  props: {},
  data() {
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        realname: '',
        certificate_code: '',
        state: -1,
        daterange: [],
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      form: {
        alarmid: -1,
        realname: '',
        certificate_code: '',
        alarm_time: '',
        alarm_address: '',
        alarm_reason: '',
        state: -1,
        dispose_user: '', // TODO 获取当前用户
        dispose_time: '',
        dispose_msg: ''
      },
      formRules: {
        dispose_msg: [{ required: true, trigger: 'blur', message: '请输入' }]
      },
      stateList: [
        { value: -1, label: '所有' },
        { value: 0, label: '待处理' },
        { value: 1, label: '已处理' }
      ],
      detailDialogVisible: false,
      disposeDialogVisible: false,
      submitDisabled: false,
      tableLoading: false,
      tableData: [],
      tableDataCount: 0
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
      if (this.queryForm.daterange.length > 0) {
        this.queryForm.begindate = this.queryForm.daterange[0]
        this.queryForm.enddate = this.queryForm.daterange[1]
      } else {
        this.queryForm.begindate = ''
        this.queryForm.enddate = ''
      }
      const queryObj = { ...this.queryForm }
      if (this.queryForm.state === -1) {
        delete queryObj.state
      }
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
          console.error(e)
        })
    },
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitDisabled = true // 防止重复提交
          update(this.form)
            .then(res => {
              if (res.code === 200) {
                if (res.data) {
                  this.$message({
                    message: '操作成功!',
                    type: 'success'
                  })
                  this.disposeDialogVisible = false
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
      })
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
      this.form = { ...row }
      this.detailDialogVisible = true
      return
      item({
        keyid: row.keyid
      })
        .then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.detailDialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleDispose(index, row) {
      this.form = { ...row }
      this.disposeDialogVisible = true
      return
      item({
        keyid: row.keyid
      })
        .then(res => {
          if (res.code === 200) {
            this.form = res.data
            this.disposeDialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
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
