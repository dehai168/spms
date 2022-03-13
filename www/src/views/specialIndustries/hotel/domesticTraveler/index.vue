<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 142px">
      <el-form ref="queryForm" :model="queryForm" :inline="true" label-width="110px">
        <el-form-item v-for="formItem in formItems" :key="formItem.key" :label="formItem.label">
          <el-select
            v-if="formItem.type == 'select'"
            v-model="queryForm[formItem.key]"
            style="width:150px"
            placeholder="请选择"
          >
            <el-option
              v-for="option in formItem.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
          <el-input
            v-else-if="formItem.type == 'input'"
            v-model="queryForm[formItem.key]"
            style="width:150px"
          />
          <el-date-picker
            v-else-if="formItem.type == 'datePicker'"
            v-model="queryForm[formItem.key]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="main">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        height="100%"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-for="column in columns" :key="column.prop" v-bind="column" />
        <el-table-column prop="operate" label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pagesizes"
        :page-size="queryForm.pagesize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableDataCount"
      />
    </el-footer>
    <!-- 详情 -->
    <el-dialog
      class="domestic-traveler-detail"
      title="境内旅客详情"
      :visible.sync="dialogVisible"
      width="70%"
      top="4vh"
      :close-on-click-modal="false"
    >
      <el-form label-width="120px" :inline="true" label-suffix=":">
        <my-card v-for="(cardItem, title, index) in detailItems" :key="index" :title="title">
          <el-form-item
            v-for="item in cardItem.items"
            :key="item.key"
            :label="item.label"
            :style="{ width: cardItem.width }"
          >{{ detailData[item.key] }}</el-form-item>
        </my-card>
        <div class="photo-coantainer">
          <el-image
            style="width: 100px; height: 100px"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            :fit="fit"
          />
          <div class="photo-tittle">证件照片</div>
          <el-image
            style="width: 100px; height: 100px"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            :fit="fit"
          />
          <div class="photo-tittle">现场照片</div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import defaultSettings from '@/settings'
import { items, item } from '@/api/domesticTraveler'
import { formatDate } from '@/utils/index'
import MyCard from './MyCard.vue'
export default {
  components: {
    MyCard
  },
  data() {
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        agency: '',
        industry: '',
        logout: '',
        enterpriseCode: '',
        legalPerson: '',
        checkStatus: '',
        licenseStatus: '',
        companyName: '',
        businessType: '',
        signboardName: '',
        unifiedSocialCreditCode: '',
        businessStatus: '',
        inputTime: '',
        licenseIssueDate: '',
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableSelected: [],
      formItems: [
        { key: '入住时间', label: '入住时间', type: 'datePicker' },
        { key: '姓名', label: '姓名', type: 'input' },
        {
          key: '名族',
          label: '名族',
          type: 'select',
          options: [
            { label: '未注销', value: 1 },
            { label: '已注销', value: 2 }
          ]
        },
        {
          key: '性别',
          label: '性别',
          type: 'select',
          options: [
            { label: '未注销', value: 1 },
            { label: '已注销', value: 2 }
          ]
        },
        { key: '出生日期', label: '出生日期', type: 'datePicker' },
        { key: '证件号码', label: '证件号码', type: 'input' },
        {
          key: '管辖单位',
          label: '管辖单位',
          type: 'select',
          options: [
            { label: '变更待核查', value: 1 },
            { label: '关停', value: 2 }
          ]
        },
        { key: '招牌名称', label: '招牌名称', type: 'input' },
        { key: 'companyName', label: '企业名称', type: 'input' }
      ],
      columns: [
        { prop: '序号', label: '序号', width: 80 },
        { prop: '行业类型', label: '行业类型', width: 180 },
        { prop: 'name', label: '姓名', width: 80 },
        { prop: '性别', label: '性别', width: 80 },
        { prop: '证件号码', label: '证件号码', width: 180 },
        { prop: '民族', label: '民族', width: 80 },
        { prop: '省市县', label: '省市县', width: 120 },
        { prop: '详细地址', label: '详细地址', width: 180 },
        { prop: '房间号', label: '房间号', width: 80 },
        { prop: '入住时间', label: '入住时间', width: 80 },
        { prop: '退房时间', label: '退房时间', width: 80 },
        { prop: '招牌名称', label: '招牌名称', width: 180 },
        { prop: '企业名称', label: '企业名称', width: 180 },
        { prop: '管辖单位', label: '管辖单位', width: 180 },
      ],
      dialogVisible: false,
      detailData: {
        name: 'sssssss'
      },
      detailItems: {
        '旅客证件信息': {
          width: '40%',
          items: [
            { key: 'name', label: '姓名' },
            { key: 'sex', label: '性别' },
            { key: '民族', label: '民族' },
            { key: '出生日期', label: '出生日期' },
            { key: '证件类型', label: '证件类型' },
            { key: '证件号码', label: '证件号码' },
            { key: '省市县', label: '省市县' },
            { key: '联系电话', label: '联系电话' },
            { key: '详细地址', label: '详细地址' },
          ]
        },
        '旅客入住信息': {
          width: '30%',
          items: [
            { key: 'num', label: '入住房间号' },
            { key: 'date', label: '入住时间' },
            { key: '退房时间', label: '退房时间' },
            { key: '人像比对相似度', label: '人像比对相似度' },
            { key: '人像比对结果', label: '人像比对结果' },
            { key: '是否人工复核', label: '是否人工复核' },
          ]
        },
        '管理信息': {
          width: '40%',
          items: [
            { key: '招牌名称', label: '招牌名称' },
            { key: '企业名称', label: '企业名称' },
            { key: '治安管理机构', label: '治安管理机构' },
            { key: '标准经营地址', label: '标准经营地址' },
            { key: '前台保存时间', label: '前台保存时间' },
            { key: '最后更新时间', label: '最后更新时间' },
            { key: '数据上报形式', label: '数据上报形式' },
          ]
        },
      }
    };
  },
  created() {
    const that = this
    this.init(function () {
      that.handleQuery()
    })
  },
  methods: {
    init(callback) {
      // 初始化异步操作，例如数据字典
      callback()
    },
    handleQuery() {
      this.tableLoading = true
      items(this.queryForm)
        .then(res => {
          if (res.code === 20000) {
            res.data.items.forEach(element => {
              element.createdat = formatDate('datetime', element.createdat)
              element.updatedat = formatDate('datetime', element.updatedat)
            })
            this.tableData = res.data.items
            this.tableDataCount = res.data.total
          }
          this.tableLoading = false
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleDetail(index, row) {
      item({
        keyid: row.keyid
      })
        .then(res => {
          if (res.code === 20000) {
            this.detail = res.data
            this.dialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleReset() { },
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
    },

  }

}
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 100px);
  width: 100%;
  .main {
    height: calc(100% - 184px);
    width: 100%;
    padding: 5px;
  }
}

.domestic-traveler-detail {
  .el-form {
    position: relative;
    max-height: 600px;
    overflow: auto;
    .photo-coantainer {
      position: absolute;
      top:0;
      right: 30px;
      .photo-tittle {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;

      }
    }
  }
}
</style>
