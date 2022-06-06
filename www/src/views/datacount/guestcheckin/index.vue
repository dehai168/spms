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
            <el-form-item prop="daterange" label="统计日期">
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
      <div id="chart_in_source" style="width: 100%; height: 100%"></div>
    </el-main>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { travellerdomesticregion } from '@/api/datacount'
import handleEnum from '@/utils/handleEnum'
import { enumsItems } from '@/api/common'
import provinces from '../../analysis/focusAreas/provinces'
import { parseTime } from '@/utils/index'
export default {
  name: 'GuestCheckIn',
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
      },
      unitList: []
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
    handleQuery() {
      if (this.queryForm.daterange) {
        this.queryForm.fromtime = this.queryForm.daterange[0]
        this.queryForm.totime = this.queryForm.daterange[1]
      } else {
        this.queryForm.fromtime = ''
        this.queryForm.totime = ''
      }
      const queryObj = { ...this.queryForm }
      delete queryObj.daterange;
      if (this.queryForm.unit === null) {
        delete queryObj.unit
      }
      travellerdomesticregion(queryObj)
        .then(res => {
          if (res.code === 200) {
            const array = res.data
            const datas = []
            provinces.provinces.forEach((province) => {
              const list = array.filter(i => i.region === province.code);
              let count = 0;
              list.forEach(item => {
                count += item.persons;
              });
              datas.push({
                name: province.name,
                value: count
              })
            });
            this.initInSourceChart(datas)
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    initInSourceChart(datas) {
      const myChart = this.$echarts.init(document.getElementById('chart_in_source'))
      const option = {
        title: {
          text: '境内旅客来源',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '境内旅客来源',
            type: 'pie',
            radius: '50%',
            data: datas,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
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
