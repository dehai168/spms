<template>
  <el-container class="container">
    <el-main style="padding: 5px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="系统日志" name="system">
          <el-container>
            <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
              <el-form ref="queryForm" :inline="true" :model="queryForm">
                <el-row>
                  <el-col :span="5">
                    <el-form-item prop="daterange" label="时间">
                      <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="true" style="width: 230px"> </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-header>
            <el-main class="main">
              <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%">
                <el-table-column prop="systemlogid" label="序号" width="200"> </el-table-column>
                <el-table-column prop="type" label="类型"> </el-table-column>
                <el-table-column prop="servername" label="服务名称"> </el-table-column>
                <el-table-column prop="remark" label="备注"> </el-table-column>
                <el-table-column prop="input_time" label="录入时间"> </el-table-column>
              </el-table>
            </el-main>
            <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.size" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
            </el-footer>
          </el-container>
        </el-tab-pane>
        <el-tab-pane label="用户日志" name="user">
          <el-container>
            <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
              <el-form ref="queryForm2" :inline="true" :model="queryForm2">
                <el-row>
                  <el-col :span="5">
                    <el-form-item prop="daterange" label="时间">
                      <el-date-picker v-model="queryForm2.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="true" style="width: 230px"> </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item prop="user" label="用户">
                      <el-input v-model="queryForm2.user" maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery2">查询</el-button>
                    <el-button icon="el-icon-delete" @click="handleReset2">重置</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-header>
            <el-main class="main">
              <el-table ref="tableData2" :data="tableData2" v-loading="tableLoading" border style="width: 100%">
                <el-table-column prop="logid" label="序号" width="200"> </el-table-column>
                <el-table-column prop="type" label="类型"> </el-table-column>
                <el-table-column prop="msg" label="内容"> </el-table-column>
                <el-table-column prop="user" label="用户"> </el-table-column>
                <el-table-column prop="remark" label="备注"> </el-table-column>
                <el-table-column prop="input_time" label="录入时间"> </el-table-column>
              </el-table>
            </el-main>
            <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
              <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :page-sizes="pagesizes" :page-size="queryForm2.size" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount2"> </el-pagination>
            </el-footer>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { systemlog, userlog } from '@/api/datacount'
import { parseTime } from '@/utils/index'
export default {
  name: 'Domestic',
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
      activeName: 'system',
      tableLoading: false,
      queryForm: {
        daterange: [parseTime(start, '{y}-{m}-{d}'), parseTime(now, '{y}-{m}-{d}')],
        size: defaultSettings.pageSizes[0],
        index: 1
      },
      tableData: [],
      tableDataCount: 0,
      queryForm2: {
        daterange: [parseTime(start, '{y}-{m}-{d}'), parseTime(now, '{y}-{m}-{d}')],
        size: defaultSettings.pageSizes[0],
        user: '',
        index: 1
      },
      tableData2: [],
      tableDataCount2: 0
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
      callback()
    },
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    handleReset2() {
      this.$refs.queryForm2.resetFields()
    },
    handleQuery(flag) {
      if (this.queryForm.daterange) {
        this.queryForm.fromtime = this.queryForm.daterange[0]
        this.queryForm.totime = this.queryForm.daterange[1]
      } else {
        this.queryForm.fromtime = ''
        this.queryForm.totime = ''
      }
      if (flag === undefined) {
        this.queryForm.index = 1
      }
      const queryObj = { ...this.queryForm }
      delete queryObj.daterange
      this.tableLoading = true
      systemlog(queryObj)
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
    handleSizeChange(size) {
      this.queryForm.size = size
      this.handleQuery(true)
    },
    handleCurrentChange(index) {
      this.queryForm.index = index
      this.handleQuery(true)
    },
    handleQuery2(flag) {
      if (this.queryForm2.daterange) {
        this.queryForm2.fromtime = this.queryForm2.daterange[0]
        this.queryForm2.totime = this.queryForm2.daterange[1]
      } else {
        this.queryForm2.fromtime = ''
        this.queryForm2.totime = ''
      }
      if (flag === undefined) {
        this.queryForm2.index = 1
      }
      const queryObj = { ...this.queryForm2 }
      delete queryObj.daterange
      this.tableLoading = true
      userlog(queryObj)
        .then(res => {
          if (res.code === 200) {
            this.tableData2 = res.data
            this.tableDataCount2 = res.size
          }
          this.tableLoading = false
        })
        .catch(e => {
          this.tableLoading = false
          console.error(e)
        })
    },
    handleSizeChange2(size) {
      this.queryForm2.size = size
      this.handleQuery2(true)
    },
    handleCurrentChange2(index) {
      this.queryForm2.index = index
      this.handleQuery2(true)
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
  height: calc(100vh - 263px);
  width: 100%;
  padding: 5px;
}

.main >>> .el-tabs__header {
  padding: 2px;
}
</style>
