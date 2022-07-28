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
            <el-form-item prop="trade_type" label="行业类别">
              <el-select v-model="queryForm.trade_type" placeholder="请选择">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
            <el-button icon="el-icon-printer" v-print>打印</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%">
        <el-table-column prop="police_unit" label="管辖单位"> </el-table-column>
        <el-table-column prop="type" label="行业类别"> </el-table-column>
        <el-table-column prop="enterprises" label="企业总数"> </el-table-column>
        <el-table-column prop="business_size" label="营业数"> </el-table-column>
        <el-table-column prop="un_business_size" label="未营业数"> </el-table-column>
        <el-table-column prop="login_size" label="未注销数"> </el-table-column>
        <el-table-column prop="logout_size" label="注销数"> </el-table-column>
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
import { enterpriselist } from '@/api/datacount'
import handleEnum from '@/utils/handleEnum'
import { enumsItems } from '@/api/common'
import mapToArray from '@/utils/mapToArray'
import map from '@/const/map'
export default {
  name: 'Construction',
  components: {},
  props: {},
  data() {
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        police_unit: null,
        trade_type: null,
        size: defaultSettings.pageSizes[0],
        index: 1
      },
      unitList: [],
      typeList: mapToArray(map.trade_type2),
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
      if (flag === undefined) {
        this.queryForm.index = 1
      }
      const queryObj = { ...this.queryForm }
      if (this.queryForm.unit === null) {
        delete queryObj.unit
      }
      this.tableLoading = true
      enterpriselist(queryObj)
        .then(res => {
          if (res.code === 200) {
            res.data.forEach(element => {
              const unit = this.unitList.find(i => i.value === element.police_unit)
              element.police_unit = unit.label;
              const typeItem = this.typeList.find(i => i.value === element.type);
              element.type = typeItem.label;
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
