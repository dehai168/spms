<template>
  <el-container>
    <el-header height="80">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-card class="box-card red">
            <div class="title">
              <i class="el-icon-aim"></i>
              <span>在逃人员报警:{{ count.escapee_alarms }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card blue">
            <div class="title">
              <i class="el-icon-s-shop"></i>
              <span>重点地区数：{{ count.important_regions }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card gray">
            <div class="title">
              <i class="el-icon-s-cooperation"></i>
              <span>重点关注对象数：{{ count.important_persons }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card origen">
            <div class="title">
              <i class="el-icon-office-building"></i>
              <span>特种行业数：{{ count.special_enterprises }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card gray2">
            <div class="title">
              <i class="el-icon-mic"></i>
              <span>娱乐场所数：{{ count.recreation_enterprises }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card green">
            <div class="title">
              <i class="el-icon-user"></i>
              <span>从业人员数：{{ count.employees }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="当前企业总数" name="company">
          <div id="chart_company" style="width: 600px; height: 400px"></div>
        </el-tab-pane>
        <el-tab-pane label="住宿统计" name="room">
          <el-container>
            <el-header height="34px" style="border-bottom:1px solid #EBEEF5">
              <el-row>
                <el-col :span="8">
                  <el-form ref="queryForm" :inline="true" :model="queryForm">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item prop="daterange" label="日期">
                          <el-date-picker v-model="queryForm.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" style="max-width: 220px"> </el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" icon="el-icon-search" @click="handleQueryDation">查询</el-button>
                </el-col>
              </el-row>
            </el-header>
            <el-main>
              <el-row>
                <el-col :span="12"> <div id="chart_in_detail" style="width: 500px; height: 400px"></div></el-col>
                <el-col :span="12"> <div id="chart_in_source" style="width: 500px; height: 400px"></div></el-col>
              </el-row>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import { systemlist, enterpriselist, travellerlist, travellerdomesticregion } from '@/api/datacount'
export default {
  name: 'Priview',
  components: {},
  props: {},
  data() {
    return {
      queryForm: {
        daterange: []
      },
      activeName: 'company',
      count: {
        escapee_alarms: 0,
        important_regions: 0,
        important_persons: 0,
        special_enterprises: 0,
        recreation_enterprises: 0,
        employees: 0
      }
    }
  },
  computed: {},
  created() {
    const that = this
    this.init(function () {
      that.handleQueryCount()
      //that.handleQuery()
    })
  },
  mounted() {},
  destroyed() {},
  methods: {
    init(callback) {
      // 初始化异步操作，例如数据字典
      callback()
    },
    handleQueryCount() {
      systemlist({})
        .then(res => {
          if (res.code === 200) {
            this.count = { ...this.count, ...res.data }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    handleQueryCompany() {
      enterpriselist({})
        .then(res => {
          if (res.code === 200) {
            const array = res.data
            const xDatas = []
            const yDatas = []
            array.forEach(element => {
              xDatas.push(element.police_unit)
              yDatas.push(element.enterprises)
            })
            this.initCompanyChart(xDatas, yDatas)
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    initCompanyChart(xDatas, yDatas) {
      const myChart = echarts.init(document.getElementById('chart_company'))
      const option = {
        xAxis: {
          type: 'category',
          data: xDatas
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yDatas,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    handleQueryDation() {
      const queryObj = {}
      if (this.queryForm.daterange.length > 0) {
        queryObj.fromtime = this.queryForm.daterange[0]
        queryObj.totime = this.queryForm.daterange[1]
      }
      travellerlist(queryObj)
        .then(res => {
          if (res.code === 200) {
            const array = res.data
            const xDatas = []
            const yDatas = []
            array.forEach(element => {
              xDatas.push(element.police_unit)
              yDatas.push(element.persons)
            })
            this.initInDetailChart(xDatas, yDatas)
          }
        })
        .catch(e => {
          console.error(e)
        })
      travellerdomesticregion(queryObj)
        .then(res => {
          if (res.code === 200) {
            const array = res.data
            const datas = []
            array.forEach(element => {
              datas.push({
                name: element.region,
                value: element.size
              })
            })
            this.initInSourceChart(datas)
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    initInDetailChart(xDatas, yDatas) {
      const myChart = echarts.init(document.getElementById('chart_in_detail'))
      const option = {
        title: {
          text: '境内入住记录',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: xDatas
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yDatas,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    initInSourceChart(datas) {
      const myChart = echarts.init(document.getElementById('chart_in_source'))
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
    },
    handleTabsClick(name) {}
  }
}
</script>
<style scoped>
.box-card {
  margin-top: 20px;
  color: white;
}
.title {
  text-align: center;
  height: 80px;
}
.title i {
  font-size: 40px;
}
.title span {
  margin-top: 10px;
  display: inline-block;
}
.green {
  background-color: #67c23a;
}
.blue {
  background-color: #409eff;
}
.origen {
  background-color: #e6a23c;
}
.red {
  background-color: #f56c6c;
}
.gray {
  background-color: #bfcbd9;
}
.gray2 {
  background-color: #606266;
}
</style>
