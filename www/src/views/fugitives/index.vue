<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 92px">
      <el-form ref="queryForm" :inline="true" :model="queryForm">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="realname" label="人员姓名" style="width: 100%">
              <el-input v-model="queryForm.realname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="certificate_code" label="证件号码">
              <el-input v-model="queryForm.certificate_code" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="sex" label="性别">
              <el-select v-model="queryForm.sex" placeholder="请选择" clearable>
                <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="circular_code" label="通报编号">
              <el-input v-model="queryForm.circular_code" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="daterange" label="登记日期">
              <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" style="max-width: 220px"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="realname" label="姓名" width="75"> </el-table-column>
        <el-table-column prop="certificate_code" label="证件号码" width="145"> </el-table-column>
        <el-table-column prop="sex" label="性别" width="60"> </el-table-column>
        <el-table-column prop="birthday" label="出生日期" width="100"> </el-table-column>
        <el-table-column prop="province_city" label="户籍市县"> </el-table-column>
        <el-table-column prop="detail_address" label="户籍详址"> </el-table-column>
        <el-table-column prop="circular_code" label="通报编号" width="185"> </el-table-column>
        <el-table-column prop="reg_date" label="登记日期" width="110"> </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { items } from '@/api/fugitives'
export default {
  name: 'Fugitives',
  components: {},
  props: {},
  data() {
    const now = new Date()
    const yestoday = new Date()
    yestoday.setTime(now.getTime() - 3600 * 24 * 1000)
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        realname: '',
        certificate_code: '',
        sex: '',
        circular_code: '',
        daterange: [],
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      sexList: [
        { value: '男', label: '男' },
        { value: '女', label: '女' }
      ],
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
      if (this.queryForm.daterange.length > 0) {
        this.queryForm.begindate = this.queryForm.daterange[0]
        this.queryForm.enddate = this.queryForm.daterange[1]
      } else {
        this.queryForm.begindate = ''
        this.queryForm.enddate = ''
      }
      items(this.queryForm)
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
