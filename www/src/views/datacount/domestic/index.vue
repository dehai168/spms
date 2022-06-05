<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
      <el-form ref="queryForm" :inline="true" :model="queryForm">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="police_unit" label="管辖单位">
              <el-select v-model="queryForm.police_unit" placeholder="请选择">
                <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="daterange" label="统计日期">
              <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="true" style="max-width: 220px"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%">
        <el-table-column prop="police_unit" label="管辖单位"> </el-table-column>
        <el-table-column prop="persons" label="入住总数"> </el-table-column>
        <el-table-column prop="domestic_in_size" label="境内入住"> </el-table-column>
        <el-table-column prop="domestic_off_size" label="境内退房"> </el-table-column>
        <el-table-column prop="abroad_in_size" label="境外入住"> </el-table-column>
        <el-table-column prop="abroad_off_size" label="境外退房"> </el-table-column>
        <el-table-column prop="domestic_juveniles" label="未成年"> </el-table-column>
        <el-table-column prop="xizang_size" label="西藏旅客数"> </el-table-column>
        <el-table-column prop="xinjiang_size" label="新疆旅客数"> </el-table-column>
        <el-table-column prop="in_percent" label="入住率"> </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { travellerlist } from '@/api/datacount'
import handleEnum from '@/utils/handleEnum'
import { enumsItems } from '@/api/common'
export default {
  name: 'Domestic',
  components: {},
  props: {},
  data() {
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        police_unit: null,
        daterange: [],
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      unitList: [],
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
      enumsItems({ types: [2] })
        .then(res => {
          if (res.code === 200) {
            this.unitList = handleEnum(res.data)[2]
            console.log(this.unitList)
            callback()
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    handleQuery(flag) {
      if (this.queryForm.daterange.length > 0) {
        this.queryForm.fromtime = this.queryForm.daterange[0]
        this.queryForm.totime = this.queryForm.daterange[1]
      } else {
        this.queryForm.fromtime = ''
        this.queryForm.totime = ''
      }
      if (flag === undefined) {
        this.queryForm.pageindex = 1
      }
      const queryObj = { ...this.queryForm }
      if (this.queryForm.unit === null) {
        delete queryObj.unit
      }
      this.tableLoading = true
      travellerlist(queryObj)
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
    handleSizeChange(pagesize) {
      this.queryForm.pagesize = pagesize
      this.handleQuery(true)
    },
    handleCurrentChange(pageindex) {
      this.queryForm.pageindex = pageindex
      this.handleQuery(true)
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
