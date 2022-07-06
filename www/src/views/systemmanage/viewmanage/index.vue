<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 42px">
      <el-form ref="queryForm" :inline="true" :model="queryForm">
        <el-row>
          <el-col :span="14">
            <el-input v-model="queryForm.name" placeholder="模糊搜索名称"></el-input>
          </el-col>
          <el-col :span="10" style="padding-left: 10px">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
        <el-row> </el-row>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="视频设备" name="video">
          <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%">
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="name" label="名称">
              <template slot-scope="scope">
                <el-button type="text" @click="handleVideo(scope.$index, scope.row)">{{ scope.row.name }} </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="编码"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="抓拍设备" name="capture">
          <el-container class="capture_main">
            <el-aside width="600px" style="height: 100%">
              <el-table ref="tableData_capture" :data="tableData_capture" v-loading="tableLoading" border style="width: 100%">
                <el-table-column type="index"> </el-table-column>
                <el-table-column prop="name" label="名称">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleCapture(scope.$index, scope.row)">{{ scope.row.name }} </el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类型"> </el-table-column>
              </el-table>
            </el-aside>
            <el-container>
              <el-header height="42px" style="border-bottom: 1px solid #dcdfe6">
                {{ capturename }}
                <el-date-picker v-model="queryForm_capture.daterange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" style="width: 230px" @change="handleQueryImage"> </el-date-picker>
                抓拍图片共计:{{ tableDataCount_capture }}张
              </el-header>
              <el-main v-loading="viewimageLoading" style="padding: 0 150px">
                <viewimage ref="viewimage" />
              </el-main>
              <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm_capture.size" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount_capture"> </el-pagination>
              </el-footer>
            </el-container>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <iframe id="targetFrame" width="0" height="0" frameborder="0"></iframe>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { devicelist, devicelist_yt, imagelist_yt } from '@/api/home'
import viewimage from '@/components/viewimage/index.vue'
import { parseTime } from '@/utils/index'
export default {
  name: 'ViewManage',
  components: { viewimage },
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
    const pagesizes = [5, 10, 20]
    return {
      pagesizes: pagesizes,
      queryForm: {
        name: ''
      },
      videoObject: {
        src: ''
      },
      tableLoading: false,
      tableData: [],
      queryForm_capture: {
        id: -1,
        daterange: [parseTime(start, '{y}-{m}-{d}'), parseTime(now, '{y}-{m}-{d}')],
        fromtime: '',
        totime: '',
        size: pagesizes[0],
        index: 1
      },
      viewimageLoading: false,
      tableData_capture: [],
      tableDataCount_capture: 0,
      tableSelected: [],
      cacheList: [],
      cacheList_capture: [],
      activeName: 'video',
      capturename: ''
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
      devicelist(this.queryForm)
        .then(res => {
          if (res.code === 200) {
            this.cacheList = res.data
            this.tableData = res.data
          }
          this.tableLoading = false
        })
        .catch(e => {
          this.tableLoading = false
          console.error(e)
        })
      devicelist_yt(this.queryForm)
        .then(res => {
          if (res.code === 200) {
            this.cacheList_capture = res.data
            this.tableData_capture = res.data
          }
          this.tableLoading = false
        })
        .catch(e => {
          this.tableLoading = false
          console.error(e)
        })
    },
    handleSearch() {
      if (this.queryForm.name.length > 0) {
        this.tableData = this.cacheList.filter(v => {
          return v.name.indexOf(this.queryForm.name) > -1
        })
        this.tableData_capture = this.cacheList_capture.filter(v => {
          return v.name.indexOf(this.queryForm.name) > -1
        })
      }
    },
    handleReset() {
      this.queryForm.name = ''
      this.tableData = this.cacheList
      this.tableData_capture = this.cacheList_capture
    },
    handleSizeChange(pagesize) {
      this.queryForm_capture.size = pagesize
      this.handleQueryImage()
    },
    handleCurrentChange(pageindex) {
      this.queryForm_capture.index = pageindex
      this.handleQueryImage()
    },
    handleVideo(index, row) {
      this.videoObject.src = row.code
      this.play()
    },
    handleCapture(index, row) {
      this.queryForm_capture.id = row.id
      this.capturename = row.name
      this.handleQueryImage()
    },
    handleQueryImage(flag) {
      if (this.queryForm_capture.daterange) {
        this.queryForm_capture.fromtime = this.queryForm_capture.daterange[0]
        this.queryForm_capture.totime = this.queryForm_capture.daterange[1]
      } else {
        this.queryForm_capture.fromtime = ''
        this.queryForm_capture.totime = ''
      }
      if (flag === undefined) {
        this.queryForm_capture.index = 1
      }
      const queryObj = { ...this.queryForm_capture }
      delete queryObj.daterange
      this.viewimageLoading = true
      imagelist_yt(queryObj)
        .then(res => {
          const list = []
          if (res.code === 200) {
            res.data.forEach(element => {
              list.push({
                title: element.time,
                src: element.picture_uri,
                width: element.width,
                height: element.height
              })
            })
            this.tableDataCount_capture = res.size
          }
          this.$refs.viewimage.load(list)
          this.viewimageLoading = false
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleClick(tab, event) {},
    full() {
      const url = 'VideoMap://fullscreen'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    hide() {
      const url = 'VideoMap://hide'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    exit() {
      const url = 'VideoMap://exit'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    play() {
      const url = 'VideoPlay://index=' + this.videoObject.src + '&pos=0_0_200_200&fullscreen=false'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    stop() {
      const url = 'VideoPlay://exit'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
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

.capture_main {
  height: calc(100vh - 216px);
}
</style>
