<template>
  <el-container class="container">
    <el-aside width="600px">
      <el-container>
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
          <el-table ref="tableData" :data="tableData" v-loading="tableLoading" border style="width: 100%" @row-click="handleRowClick">
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="name" label="名称">
              <template slot-scope="scope">
                <el-button type="text" @click="handleVideo(scope.$index, scope.row)">{{ scope.row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="编码"> </el-table-column>
          </el-table>
        </el-main>
        <!-- <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount"> </el-pagination>
        </el-footer> -->
      </el-container>
    </el-aside>
    <el-main>
      <el-image fit="contain" :src="viewSrc" :preview-src-list="srcList">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-main>
    <iframe id="targetFrame" width="0" height="0" frameborder="0"></iframe>
  </el-container>
</template>
<script>
import defaultSettings from '@/settings'
import { devicelist } from '@/api/home'
export default {
  name: 'ViewManage',
  components: {},
  props: {},
  data() {
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        name: '',
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      videoObject: {
        src: ''
      },
      viewSrc: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      srcList: ['https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg', 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'],
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableSelected: [],
      cacheList: []
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
    handleQuery(flag) {
      if (flag === undefined) {
        this.queryForm.pageindex = 1
      }
      this.tableLoading = true
      devicelist(this.queryForm)
        .then(res => {
          if (res.code === 200) {
            this.cacheList = res.data
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
    handleSearch() {
      if (this.queryForm.name.length > 0) {
        this.tableData = this.cacheList.filter(v => {
          return v.name.indexOf(this.queryForm.name) > -1
        })
      }
    },
    handleReset() {
      this.queryForm.name = ''
      this.tableData = this.cacheList
    },
    handleRowClick(row, column, event) {
      if (column.label !== '名称') {
        // 加载刷新图片
        console.log(row)
      }
    },
    handleSizeChange(pagesize) {
      this.queryForm.pagesize = pagesize
      this.handleQuery(true)
    },
    handleCurrentChange(pageindex) {
      this.queryForm.pageindex = pageindex
      this.handleQuery(true)
    },
    handleVideo(index, row) {
      this.videoObject.src = row.code
      this.play()
    },
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
      const url = 'VideoPlay://index=' + this.videoObject.src + '&pos=0_0_200_200&fullscreen=true'
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
</style>
