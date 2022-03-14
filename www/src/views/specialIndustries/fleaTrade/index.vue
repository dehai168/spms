<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 140px">
      <el-form ref="queryForm" :model="queryForm" :inline="true" label-width="8.5vw">
        <el-row v-for="(row, rowIndex) in formItems" :key="rowIndex">
          <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 6">
            <el-form-item :label="formItem.label">
              <el-select
                v-if="formItem.type == 'select'"
                v-model="queryForm[formItem.key]"
                style="width:12vw"
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
                style="width:12vw"
              />
              <el-date-picker
                v-else-if="formItem.type == 'datePicker'"
                v-model="queryForm[formItem.key]"
                style="width:12vw"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
              <div v-else-if="formItem.type == 'btn'">
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button>重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
        label-width="160px"
        :inline="true"
        :disabled="flag == 'detail'"
      >
        <el-form-item
          v-for="formItem in addEditformItems"
          :key="formItem.key"
          :label="formItem.label"
        >
          <el-select
            v-if="formItem.type == 'select'"
            v-model="addEditForm[formItem.key]"
            style="width:200px"
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
            style="width:200px"
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
            style="width:300px"
          />
          <el-radio-group v-else-if="formItem.type == 'radio'" v-model="addEditForm[formItem.key]">
            <el-radio
              v-for="option in formItem.options"
              :key="option.value"
              :label="option.value"
            >{{ option.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
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
import { items, item, create, update, remove, batchremove } from '@/api/fleaTrade'
import { formatDate } from '@/utils/index'
export default {
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
        [
          {
            key: '行政区划',
            label: '行政区划',
            type: 'select',
            options: [
              { label: 'aaaa', value: 1 },
              { label: 'aaaa', value: 2 },
              { label: 'aaaa', value: 3 }
            ]
          },
          {
            key: '派出所名称',
            label: '派出所名称',
            type: 'select',
            options: [
              { label: '旅馆业', value: 1 },
              { label: '留宿洗浴业', value: 2 }
            ]
          },
          { key: '备案编号', label: '备案编号', type: 'input' },
          { key: '企业名称', label: '企业名称', type: 'input' },
        ],
        [
          { key: '企业地址', label: '企业地址', type: 'input' },
          { key: '企业门楼牌号', label: '企业门楼牌号', type: 'input' },
          { key: '企业详址', label: '企业详址', type: 'input' },
          { key: '分类', label: '分类', type: 'input' },
        ],
        [
          { key: '特种行业许可证编号', label: '特种行业许可证编号', type: 'input' },
          { key: '法定代表人姓名', label: '法定代表人姓名', type: 'input' },
          { key: 'btn', type: 'btn' },
        ]
      ],
      columns: [
        { prop: '序号', label: '序号', width: 80 },
        { prop: 'agency', label: '行政区划', width: 180 },
        { prop: 'enterpriseCode', label: '派出所名称', minWidth: 200 },
        { prop: 'companyName', label: '备案编号', width: 120 },
        { prop: 'signboardName', label: '企业名称', minWidth: 180 },
        { prop: 'legalPerson', label: '企业地址', minWidth: 180 },
        { prop: 'unifiedSocialCreditCode', label: '企业门楼牌号', width: 100 },
        { prop: 'phone', label: '企业详址', minWidth: 180 },
        { prop: 'checkStatus', label: '分类', width: 150 },
        { prop: 'businessType', label: '特种行业许可证编号', width: 180 },
        { prop: 'businessStatus', label: '法定代表人姓名', width: 120 },
        { prop: 'logout', label: '法定代表人联系电话', minWidth: 180 }
      ],
      dialogVisible: false,
      submitDisabled: false,
      flag: 'add',
      addEditForm: {

      },
      addEditformItems: [
        {
          key: 'businessStatus',
          label: '行政区划',
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
          label: '派出所名称',
          type: 'select',
          options: [
            { label: '旅馆业', value: 1 },
            { label: '留宿洗浴业', value: 2 }
          ]
        },
        { key: 'enterpriseCode', label: '备案编号', type: 'input' },
        { key: 'signboardName', label: '企业名称', type: 'input' },
        { key: 'area', label: '企业地址', type: 'input' },
        { key: '传真', label: '企业门楼牌号', type: 'input' },
        {
          key: '分类',
          label: '分类',
          type: 'select',
          options: [
            { label: '旅馆业', value: 1 },
            { label: '留宿洗浴业', value: 2 }
          ]
        },
        { key: '经营负责人电话', label: '经营负责人电话', type: 'input' },
        { key: '企业详址', label: '企业详址', type: 'input' },
        { key: '企业网址', label: '企业网址', type: 'input' },
        {
          key: '经济性质',
          label: '经济性质',
          type: 'select',
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 2 }
          ]
        },
        { key: '特种行业许可证编号', label: '特种行业许可证编号', type: 'input' },
        { key: '工商营业执照编号', label: '工商营业执照编号', type: 'input' },
        { key: '注册资金（万元）', label: '注册资金（万元）', type: 'input' },
        { key: '经营范围', label: '经营范围', type: 'input' },
        { key: '经营面积（平方米）', label: '经营面积（平方米）', type: 'input' },
        { key: '上级主管部门', label: '上级主管部门', type: 'input' },
        { key: '企业联系电话', label: '企业联系电话', type: 'input' },
        { key: '法定代表人身份证号码', label: '法定代表人身份证号码', type: 'input' },
        { key: '法定代表人姓名', label: '法定代表人姓名', type: 'input' },
        { key: '法定代表人联系电话', label: '法定代表人联系电话', type: 'input' },
        { key: '从业人员数', label: '从业人员数', type: 'input' },
        { key: '保安人数', label: '保安人数', type: 'input' },
        { key: '登记保管人员数', label: '登记保管人员数', type: 'input' },
        { key: '夜间值班人数', label: '夜间值班人数', type: 'input' },
        {
          key: '房屋结构',
          label: '房屋结构',
          type: 'select',
          options: [
            { label: 'xxx', value: 1 },
            { label: 'xxxx', value: 2 }
          ]
        },
        {
          key: '消防重点单位管理级别',
          label: '消防重点单位管理级别',
          type: 'select',
          options: [
            { label: 'xxx', value: 1 },
            { label: 'xxxx', value: 2 }
          ]
        },
        { key: '消防负责人', label: '消防负责人', type: 'input' },
        { key: '消防负责人联系电话', label: '消防负责人联系电话', type: 'input' },
        { key: '消防验收单位', label: '消防验收单位', type: 'input' },
        { key: '消防验收意见', label: '消防验收意见', type: 'input' },
        { key: '消防验收时间', label: '消防验收时间', type: 'datePicker' },
        {
          key: '是否有安全规章制度',
          label: '是否有安全规章制度',
          type: 'select',
          options: [
            { label: 'xxx', value: 1 },
            { label: 'xxxx', value: 2 }
          ]
        },
        { key: '技防物防设施', label: '技防物防设施', type: 'input' },
        { key: '填表人', label: '填表人', type: 'input' },
        { key: '操作时间', label: '操作时间', type: 'datePicker' },
        { key: '填表日期', label: '填表日期', type: 'datePicker' },
        { key: '备注', label: '备注', type: 'textarea' },

      ]
    };
  },
  computed: {
    dialogTittle() {
      let tittle = '';
      switch (this.flag) {
        case 'edit':
          tittle = '编辑旧货交易信息';
          break;
        case 'add':
          tittle = '新增旧货交易信息';
          break;
        case 'detail':
          tittle = '旧货交易详情';
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
  height: calc(100vh - 120px);
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
