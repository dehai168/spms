<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
      <el-form ref="queryForm" :inline="true" :model="queryForm">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="police_unit" label="管辖单位">
              <el-select v-model="queryForm.police_unit" placeholder="请选择">
                <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="daterange" label="报警日期">
              <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="true"
                style="width: 230px"> </el-date-picker>
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
        <el-table-column prop="persons" label="人数"> </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes"
        :page-size="queryForm.size" background layout="total, sizes, prev, pager, next, jumper"
        :total="tableDataCount"> </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { importantlist } from '@/api/datacount'
import handleEnum from '@/utils/handleEnum'
import { enumsItems } from '@/api/common'
import { parseTime } from '@/utils/index'
export default {
  name: 'FocusTarget',
  components: {},
  props: {},
  data() {
    const now = new Date();
    const start = new Date();
    if (now.getDate() === 1) {
      start.setMonth(now.getMonth() - 1);
      start.setDate(1);
      now.setDate(now.getDate() - 1)
    } else {
      start.setDate(1);
      now.setDate(now.getDate() - 1)
    }
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        police_unit: null,
        daterange: [parseTime(start, '{y}-{m}-{d}'), parseTime(now, '{y}-{m}-{d}')],
        size: defaultSettings.pageSizes[0],
        index: 1
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
  mounted() { },
  destroyed() { },
  methods: {
    init(callback) {
      // 初始化异步操作，例如数据字典
      enumsItems({ types: [2] })
        .then(res => {
          if (res.code === 200) {
            this.unitList = handleEnum(res.data)[2]
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
        this.queryForm.index = 1
      }
      const queryObj = { ...this.queryForm }
      delete queryObj.daterange;
      if (this.queryForm.unit === null) {
        delete queryObj.unit
      }
      this.tableLoading = true
      importantlist(queryObj)
        .then(res => {
          if (res.code === 200) {
            res.data.forEach(element => {
              const unit = this.unitList.find(i => i.value === element.police_unit)
              element.police_unit = unit.label;
            });
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
