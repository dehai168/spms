<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 189px">
      <el-form ref="queryForm" :model="queryForm" :inline="true" label-width="7vw">
        <el-row v-for="(row, rowIndex) in formItems" :key="rowIndex">
          <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 8">
            <el-form-item :label="formItem.label">
              <el-select
                v-if="formItem.type == 'select'"
                v-model="queryForm[formItem.key]"
                style="width:18vw"
                placeholder="请选择"
                :clearable="true"
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
                style="width:18vw"
              />
              <el-date-picker
                v-else-if="formItem.type == 'datePicker'"
                v-model="queryForm[formItem.key]"
                style="width:18vw"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
              <div v-else-if="formItem.type == 'btn'">
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          v-bind="column"
          :show-overflow-tooltip="true"
        />
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
      class="overseas-traveler-detail"
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
          >{{ item.formatter ? item.formatter(detailData[item.key]) : detailData[item.key] }}</el-form-item>
        </my-card>
        <div class="photo-coantainer">
          <el-image
            style="width: 100px; height: 100px"
            :src="detailData.certificate_image"
            fit="fill"
          />
          <div class="photo-tittle">证件照片</div>
          <el-image style="width: 100px; height: 100px" :src="detailData.scene_capture" fit="fill" />
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
import { items } from '@/api/overseasTraveler'
import mapToArray from '@/utils/mapToArray';
import map from '@/const/map';
import handleEnum from '@/utils/handleEnum';
import { enumsItems } from '@/api/common'
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
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableSelected: [],
      dialogVisible: false,
      detailData: {},
      enumData: {},
    };
  },
  computed: {
    formItems() {
      return [
        [
          { key: 'inTime', label: '入住时间', type: 'datePicker' },
          { key: 'lastname', label: '英文姓', type: 'input' },
          { key: 'firstname', label: '英文名', type: 'input' },

        ],
        [
          { key: 'birthday', label: '出生日期', type: 'datePicker' },
          { key: 'certificate_code', label: '证件号码', type: 'input' },
          {
            key: 'security_manage_org',
            label: '管辖单位',
            type: 'select',
            options: this.enumData[2]
          },
        ],
        [
          { key: 'sign_name', label: '招牌名称', type: 'input' },
          { key: 'enterprise', label: '企业名称', type: 'input' },
          { key: 'chinese_name', label: '中文姓名', type: 'input' },

        ], [
          { key: 'nationality', label: '国籍', type: 'input' },
          {
            key: 'sex',
            label: '性别',
            type: 'select',
            options: [
              { label: '男', value: '男' },
              { label: '女', value: '女' }
            ]
          },
          { key: 'btn', type: 'btn' },
        ]
      ]
    },
    columns() {
      return [
        { label: '序号', width: 50, type: 'index' },
        { prop: 'last_name', label: '英文姓', minWidth: 120 },
        { prop: 'first_name', label: '英文名', minWidth: 120 },
        { prop: 'chinese_name', label: '中文姓名', width: 80 },
        { prop: 'sex', label: '性别', width: 80 },
        { prop: 'nationality', label: '国籍', width: 80 },
        { prop: 'birthday', label: '出生日期', width: 120 },
        { prop: 'certificate_code', label: '证件号码', width: 180 },
        { prop: 'telephone', label: '联系电话', minWidth: 180 },
        { prop: 'in_room', label: '房间号', minWidth: 120 },
        { prop: 'in_time', label: '入住时间', width: 150 },
        { prop: 'out_time', label: '退房时间', width: 150 },
        { prop: 'enterprise', label: '企业名称', minWidth: 200 },
        { prop: 'sign_name', label: '招牌名称', minWidth: 200 },
        { prop: 'security_manage_org', label: '管辖单位', minWidth: 200, formatter: (r, c, cellValue) => this.enumData[2].find(i => i.value === cellValue)?.label },
      ]
    },
    detailItems() {
      return {
        '旅客证件信息': {
          width: '40%',
          items: [
            { key: 'last_name', label: '英文姓' },
            { key: 'first_name', label: '英文名' },
            { key: 'chinese_name', label: '中文姓名' },
            { key: 'sex', label: '性别' },
            { key: 'birthday', label: '出生日期' },
            { key: 'nationality', label: '国家/地区', formatter: (value) => map.nationality[value] || '其他' },
            { key: 'certificate_type', label: '证件类型', formatter: (value) => map.certificate_type[value] || '其他' },
            { key: 'certificate_code', label: '证件号码' },
            { key: 'visa_class', label: '签证种类', formatter: (value) => map.visa_class[value] || '其他' },
            { key: 'visa_code', label: '签证号码' },
            { key: 'residence_validity', label: '停留有效期' },
            { key: 'enter_reason', label: '入境事由' },
            { key: 'telephone', label: '联系电话' },
            { key: 'admit_unit', label: '接待单位（人）' },
            { key: 'admit_telephone', label: '接待联系电话' },
            { key: 'remark', label: '备注' }
          ]
        },
        '旅客入住信息': {
          width: '30%',
          items: [
            { key: 'in_room', label: '入住房间号' },
            { key: 'in_time', label: '入住时间' },
            { key: 'out_time', label: '退房时间' },
            { key: 'image_similarity', label: '人像比对相似度' },
            { key: 'image_result', label: '人像比对结果' },
            { key: 'is_person_check', label: '是否人工复核', formatter: (value) => value ? '是' : '否' }
          ]
        },
        '管理信息': {
          width: '40%',
          items: [
            { key: 'sign_name', label: '招牌名称' },
            { key: 'enterprise', label: '企业名称' },
            { key: 'security_manage_org', label: '治安管理机构' },
            { key: 'standard_address', label: '标准经营地址' },
            { key: 'save_time', label: '前台保存时间' },
            { key: 'last_update_time', label: '最后更新时间' },
            { key: 'data_upload_type', label: '数据上报形式' },
          ]
        },
      }
    }
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
      enumsItems({ types: [2] })
        .then(res => {
          if (res.code === 200) {
            this.enumData = handleEnum(res.data);
            callback();
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handleQuery() {
      this.tableLoading = true
      const { inTime, birthday, ...rest } = this.queryForm;
      items({
        in_begin: inTime ? formatDate('date', inTime[0]) : undefined,
        in_end: inTime ? formatDate('date', inTime[1]) : undefined,
        birthday_begin: birthday ? formatDate('date', birthday[0]) : undefined,
        birthday_end: birthday ? formatDate('date', birthday[1]) : undefined,
        ...rest
      })
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
    handleDetail(index, row) {
      this.dialogVisible = true;
      this.detailData = row;
    },
    handleReset() {
      const { pagesize, pageindex } = this.queryForm;
      this.queryForm = { pagesize, pageindex };
      this.$refs.queryForm.resetFields();
    },
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
  height: calc(100vh - 120px);
  width: 100%;
  .main {
    height: calc(100% - 231px);
    width: 100%;
    padding: 5px;
  }
}

.overseas-traveler-detail {
  .el-form {
    position: relative;
    max-height: 600px;
    overflow: auto;
    .photo-coantainer {
      position: absolute;
      top: 0;
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
