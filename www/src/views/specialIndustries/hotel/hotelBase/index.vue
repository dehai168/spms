<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 188px">
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
      <el-button @click="handleCreate">新增</el-button>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        height="calc(100% - 36px)"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          v-bind="column"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="operate" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleEdit(scope.$index, scope.row, 'detail')"
            >详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleEdit(scope.$index, scope.row, 'edit')"
            >编辑</el-button>
            <el-button type="text" size="small" @click="handlePerson(scope.$index, scope.row)">从业人员</el-button>
            <el-button
              slot="reference"
              type="text"
              size="small"
              @click="handleRemove(scope.$index, scope.row)"
            >删除</el-button>
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
    <!-- 新增 编辑 -->
    <el-dialog
      class="hotel-base-add"
      :title="dialogTittle"
      :visible.sync="dialogVisible"
      width="70%"
      top="4vh"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addEditForm"
        :model="addEditForm"
        label-width="120px"
        :inline="true"
        :disabled="flag == 'detail'"
      >
        <my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
          <el-form-item v-for="formItem in cardItem" :key="formItem.key" :label="formItem.label">
            <el-select
              v-if="formItem.type == 'select'"
              v-model="addEditForm[formItem.key]"
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
              v-model="addEditForm[formItem.key]"
              style="width:150px"
            />
            <el-input
              v-else-if="formItem.type == 'textarea'"
              v-model="addEditForm[formItem.key]"
              type="textarea"
              style="width:500px"
            />
            <el-date-picker
              v-else-if="formItem.type == 'datePicker'"
              v-model="addEditForm[formItem.key]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-radio-group
              v-else-if="formItem.type == 'radio'"
              v-model="addEditForm[formItem.key]"
            >
              <el-radio
                v-for="option in formItem.options"
                :key="option.value"
                :label="option.value"
              >{{ option.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 标准地址根据用户选择 显示   这里单独处理 -->
          <el-form-item v-if="index === 0 && addEditForm.hasStandard == 1" label="标准经营地址">
            <el-input v-model="addEditForm.standardAddress" style="width:150px" />
          </el-form-item>
        </my-card>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import defaultSettings from '@/settings'
import { items, item, create, update, remove, batchremove, importexcel, exportexcel, exist, templeteUrl, uploadUrl, download } from '@/api/hotelBase'
import { formatDate } from '@/utils/index'
import MyCard from './MyCard.vue';
import Cookies from 'js-cookie'
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
        {
          key: 'agency',
          label: '管辖单位',
          type: 'select',
          options: [
            { label: 'aaaa', value: 1 },
            { label: 'aaaa', value: 2 },
            { label: 'aaaa', value: 3 }
          ]
        },
        {
          key: 'industry',
          label: '行业分类',
          type: 'select',
          options: [
            { label: '旅馆业', value: 1 },
            { label: '留宿洗浴业', value: 2 }
          ]
        },
        {
          key: 'logout',
          label: '注销状态',
          type: 'select',
          options: [
            { label: '未注销', value: 1 },
            { label: '已注销', value: 2 }
          ]
        },
        { key: 'enterpriseCode', label: '企业编码', type: 'input' },
        { key: 'legalPerson', label: '法人姓名', type: 'input' },
        {
          key: 'checkStatus',
          label: '核查状态',
          type: 'select',
          options: [
            { label: '变更待核查', value: 1 },
            { label: '关停', value: 2 },
            { label: '已保存安保信息', value: 3 },
            { label: '待核查', value: 4 },
            { label: '核查通过', value: 5 },
            { label: '核查失败', value: 6 },
            { label: '变更核查成功', value: 7 },
            { label: '变更保存', value: 8 },
            { label: '撤销许可', value: 9 },
            { label: '已保存基本信息', value: 10 },
            { label: '已保存电子材料', value: 11 },
            { label: '变更核查失败', value: 12 },
            { label: '限期整改', value: 13 }
          ]
        },
        {
          key: 'licenseStatus',
          label: '许可证状态',
          type: 'select',
          options: [
            { label: '未发放', value: 1 },
            { label: '已发放', value: 2 },
            { label: '已吊销', value: 3 }
          ]
        },
        { key: 'companyName', label: '企业名称', type: 'input' },
        {
          key: 'businessType',
          label: '工商类型',
          type: 'select',
          options: [
            { label: '个体工商户', value: 1 },
            { label: '工商企业', value: 2 }
          ]
        },
        { key: 'signboardName', label: '招牌名称', type: 'input' },
        { key: 'unifiedSocialCreditCode', label: '社会信用代码', type: 'input' },
        {
          key: 'businessStatus',
          label: '营业状态',
          type: 'select',
          options: [
            { label: '营业', value: 1 },
            { label: '停业', value: 2 },
            { label: '歇业', value: 3 },
            { label: '其他', value: 4 }
          ]
        },
        { key: 'inputTime', label: '录入时间', type: 'datePicker' },
        { key: 'licenseIssueDate', label: '许可证发证日期', type: 'datePicker' }
      ],
      columns: [
        { prop: 'agency', label: '管辖单位', width: 180 },
        { prop: 'enterpriseCode', label: '企业编码', width: 80 },
        { prop: 'companyName', label: '企业名称', width: 100 },
        { prop: 'signboardName', label: '招牌名称', width: 180 },
        { prop: 'legalPerson', label: '法人姓名', width: 80 },
        { prop: 'unifiedSocialCreditCode', label: '社会信用代码', width: 100 },
        { prop: 'phone', label: '联系电话', width: 100 },
        { prop: 'checkStatus', label: '核查状态', width: 80 },
        { prop: 'businessType', label: '行业类别', width: 80 },
        { prop: 'businessStatus', label: '营业状态', width: 80 },
        { prop: 'logout', label: '注销状态', width: 80 },
        { prop: 'licenseStatus', label: '许可证状态', width: 80 },
        { prop: 'licenseIssueDate', label: '许可证发证日期', width: 180 },
        { prop: 'inputTime', label: '录入时间', width: 180 },
        { prop: 'origin', label: '数据来源', width: 80 }
      ],
      dialogVisible: false,
      submitDisabled: false,
      flag: 'add',
      addEditForm: {

      },
      addEditformItems: {
        '基础信息': [
          {
            key: 'businessStatus',
            label: '营业状态',
            type: 'select',
            options: [
              { label: '营业', value: '1' },
              { label: '停业', value: '2' },
              { label: '歇业', value: '3' },
              { label: '其他', value: '4' }
            ]
          },
          {
            key: 'industry',
            label: '行业分类',
            type: 'select',
            options: [
              { label: '旅馆业', value: 1 },
              { label: '留宿洗浴业', value: 2 }
            ]
          },
          { key: 'enterpriseCode', label: '企业编码', type: 'input' },
          { key: 'signboardName', label: '招牌名称', type: 'input' },
          { key: 'area', label: '占地面积（平米）', type: 'input' },
          { key: '传真', label: '传真', type: 'input' },
          { key: '房间数', label: '房间数', type: 'input' },
          { key: '床位数', label: '床位数', type: 'input' },
          {
            key: '旅馆星级',
            label: '旅馆星级',
            type: 'select',
            options: [
              { label: '一星级', value: 1 },
              { label: '二星级', value: 2 },
              { label: '三星级', value: 3 },
              { label: '四星级', value: 4 },
              { label: '五星级', value: 5 },
              { label: '其他', value: 6 }
            ]
          },
          {
            key: '旅馆等级',
            label: '旅馆等级',
            type: 'select',
            options: [
              { label: 'A级', value: 1 },
              { label: 'B级', value: 2 },
              { label: 'C级', value: 3 }
            ]
          },
          {
            key: 'agency',
            label: '管辖单位',
            type: 'select',
            options: [
              { label: 'aaaa', value: 1 },
              { label: 'aaaa', value: 2 },
              { label: 'aaaa', value: 3 }
            ]
          },
          { key: '实际经营地址', label: '实际经营地址', type: 'input' },
          {
            key: 'hasStandard',
            label: '是否有标准地址',
            type: 'radio',
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 2 }
            ]
          }
        ],
        '工商信息': [
          { key: 'companyName', label: '企业名称(全称)', type: 'input' },
          { key: 'unifiedSocialCreditCode', label: '社会信用代码', type: 'input' },
          {
            key: '行政区域',
            label: '行政区域',
            type: 'select',
            options: [
              { label: 'xxx', value: 1 },
              { label: 'xxxx', value: 2 }
            ]
          },
          {
            key: '经济类型',
            label: '经济类型',
            type: 'select',
            options: [
              { label: 'xxx', value: 1 },
              { label: 'xxxx', value: 2 }
            ]
          },
          { key: '企业电话', label: '企业电话', type: 'input' },
          { key: '注册资本（万元）', label: '注册资本（万元）', type: 'input' },
          { key: 'legalPerson', label: '法人姓名', type: 'input' },
          {
            key: '法人证件类型',
            label: '法人证件类型',
            type: 'select',
            options: [
              { label: 'xxx', value: 1 },
              { label: 'xxxx', value: 2 }
            ]
          },
          { key: '法人证件号码', label: '法人证件号码', type: 'input' },
          { key: '工商经营地址', label: '工商经营地址', type: 'input' },
          { key: '经营范围', label: '经营范围（主营）', type: 'input' }
        ],
        '管理信息': [
          { key: '单位负责人', label: '单位负责人', type: 'input' },
          { key: '负责人证件号码', label: '负责人证件号码', type: 'input' },
          { key: '负责人联系电话', label: '负责人联系电话', type: 'input' },
          { key: '安保负责人', label: '安保负责人', type: 'input' },
          { key: '安保负责人证件号码', label: '安保负责人证件号码', type: 'input' },
          { key: '安保负责人联系电话', label: '安保负责人联系电话', type: 'input' },
          { key: '消防意见书发放日期', label: '消防意见书发放日期', type: 'datePicker' },
          { key: '消防合格证号', label: '消防合格证号', type: 'input' },
          { key: '消防审核单位', label: '消防审核单位', type: 'input' },
          { key: '消防审核意见书编号', label: '消防审核意见书编号', type: 'input' },
          { key: '备注', label: '备注', type: 'textarea', }
        ]
      }
    };
  },
  computed: {
    dialogTittle() {
      let tittle = '';
      switch (this.flag) {
        case 'edit':
          tittle = '编辑旅馆信息';
          break;
        case 'add':
          tittle = '新增旅馆信息';
          break;
        case 'detail':
          tittle = '旅馆信息详情';
          break;
      }

      return tittle;
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
    handleEdit(index, row, flag) {
      this.formClear(flag, false)
      item({
        keyid: row.keyid
      })
        .then(res => {
          if (res.code === 20000) {
            this.addEditForm = res.data
            this.dialogVisible = true
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    handlePerson() { },
    handleRemove(index, row) {
      this.removeData([row.keyid], [row.name])
    },
    removeData(ids, names) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          batchremove({
            ids,
            names
          })
            .then(res => {
              if (res.code === 20000) {
                if (res.data) {
                  this.$message({
                    message: '操作成功!',
                    type: 'success'
                  })
                  if (ids.length === this.tableDataCount && this.queryForm.pageindex !== 1) {
                    this.queryForm.pageindex = 1
                  }
                  this.handleQuery()
                } else {
                  this.$message({
                    message: '操作失败!',
                    type: 'warning'
                  })
                }
              }
            })
            .catch(e => {
              console.error(e)
            })
        })
        .catch(() => { })
    },
    handleReset() { },

    formClear(flag, visible) {
      this.dialogVisible = visible
      this.flag = flag
      if (this.$refs.addEditForm) {
        this.addEditForm = {};
        this.$refs.addEditForm.resetFields()
      }
    },
    handleCreate() {
      this.formClear('add', true)
    },
    handleSubmit() {
      console.log(this.addEditForm)

      this.submitDisabled = true // 防止重复提交
      if (this.flag === 'add') {
        create(this.addEditForm)
          .then(res => {
            if (res.code === 20000) {
              if (res.data) {
                this.$message({
                  message: '操作成功!',
                  type: 'success'
                })
                this.dialogVisible = false
                this.editKeyName = ''
                this.handleQuery()
              } else {
                this.$message({
                  message: '操作失败!',
                  type: 'warning'
                })
              }
            }
            this.submitDisabled = false
          })
          .catch(e => {
            console.error(e)
            this.submitDisabled = false
          })
      } else if (this.flag === 'edit') {
        update(this.addEditForm)
          .then(res => {
            if (res.code === 20000) {
              if (res.data) {
                this.$message({
                  message: '操作成功!',
                  type: 'success'
                })
                this.dialogVisible = false
                this.editKeyName = ''
                this.handleQuery()
              } else {
                this.$message({
                  message: '操作失败!',
                  type: 'warning'
                })
              }
            }
            this.submitDisabled = false
          })
          .catch(e => {
            console.error(e)
            this.submitDisabled = false
          })
      } else {
        this.dialogVisible = false;
      }

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
  height: calc(100vh - 100px);
  width: 100%;
  .main {
    height: calc(100% - 184px);
    width: 100%;
    padding: 5px;
    > button {
      margin-bottom: 5px;
    }
    .el-table {
      height: calc(100% - 36px);
    }
  }
}
.hotel-base-add {
  .el-form {
    max-height: 600px;
    overflow: auto;
  }
}
</style>
