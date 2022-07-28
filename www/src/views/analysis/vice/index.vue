<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
      <el-row>
        <el-col :span="6">
          <el-form ref="queryForm" :inline="true" :model="queryForm">
            <el-form-item prop="daterange" label="入住时间">
              <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" style="max-width: 220px"> </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="padding: 0">
      <el-row>
        <el-col :span="12">
          <el-container style="padding: 0">
            <el-main class="main">
              <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="realname" label="姓名"> </el-table-column>
                <el-table-column prop="certificate_code" label="身份证号码"> </el-table-column>
                <el-table-column prop="ages" label="年龄(岁)"> </el-table-column>
                <el-table-column prop="alarm_reason" label="预警原因"> </el-table-column>
                <el-table-column label="入住酒店次数">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="queryLogAndPerson(scope.row.certificate_code, scope.row.alarmid)">{{ scope.row.in_rooms }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
            </el-footer>
          </el-container>
        </el-col>
        <el-col :span="12">
          <el-tabs v-model="activeName">
            <el-tab-pane label="入住记录" name="first">
              <el-table :data="tableDataLog" border style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="realname" label="姓名"> </el-table-column>
                <el-table-column prop="certificate_code" label="身份证号码"> </el-table-column>
                <el-table-column prop="nation" label="民族"> </el-table-column>
                <el-table-column prop="province_city" label="省市县"> </el-table-column>
                <el-table-column prop="detail_address" label="详细地址"> </el-table-column>
                <el-table-column prop="in_room" label="房间号"> </el-table-column>
                <el-table-column prop="in_time" label="入住时间"> </el-table-column>
                <el-table-column prop="enterprise" label="企业名称"> </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="同宿人员" name="second">
              <el-table :data="tableDataPerson" border style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="realname" label="姓名"> </el-table-column>
                <el-table-column prop="sex" label="性别"> </el-table-column>
                <el-table-column prop="certificate_code" label="身份证号码"> </el-table-column>
                <el-table-column prop="nation" label="民族"> </el-table-column>
                <el-table-column prop="province_city" label="省市县"> </el-table-column>
                <el-table-column prop="detail_address" label="详细地址"> </el-table-column>
                <el-table-column prop="in_room" label="房间号"> </el-table-column>
                <el-table-column prop="in_time" label="入住时间"> </el-table-column>
                <el-table-column prop="enterprise" label="企业名称"> </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { items } from '@/api/earlywarn'
import { items as logitems, homoclinicsitems } from '@/api/domesticTraveler'
import { parseTime } from '@/utils/index'
export default {
  name: 'Vice',
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
        daterange: [parseTime(start, '{y}-{m}-{d}'), parseTime(now, '{y}-{m}-{d}')],
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1,
        types: [4]
      },
      activeName: 'first',
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableDataLog: [],
      tableDataPerson: []
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
    handleSizeChange(pagesize) {
      this.queryForm.pagesize = pagesize
      this.handleQuery()
    },
    handleCurrentChange(pageindex) {
      this.queryForm.pageindex = pageindex
      this.handleQuery()
    },
    queryLogAndPerson(certificate_code, alarmid) {
      logitems({
        certificate_code,
        in_begin: this.queryForm.daterange[0],
        in_end: this.queryForm.daterange[1],
        pagesize: 99999999,
        pageindex: 1
      })
        .then(res => {
          if (res.code === 200) {
            this.tableDataLog = res.data
          }
        })
        .catch(e => {
          console.error(e)
        })
      homoclinicsitems({
        alarmid,
        pagesize: 99999999,
        pageindex: 1
      })
        .then(res => {
          if (res.code === 200) {
            this.tableDataPerson = res.data
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
  height: calc(100vh - 194px);
  width: 100%;
  padding: 5px;
}
</style>
