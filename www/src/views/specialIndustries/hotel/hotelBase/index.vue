<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 140px">
      <el-form ref="queryForm" :model="queryForm" :inline="true" label-width="10vw">
        <el-row v-for="(row, rowIndex) in formItems" :key="rowIndex">
          <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 8">
            <el-form-item :label="formItem.label">
              <el-select
                v-if="formItem.type == 'select'"
                v-model="queryForm[formItem.key]"
                :style="{ width: formItem.width || '11vw' }"
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
                :style="{ width: formItem.width || '11vw' }"
              />
              <el-date-picker
                v-else-if="formItem.type == 'datePicker'"
                v-model="queryForm[formItem.key]"
                :style="{ width: formItem.width || '11vw' }"
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
      <el-button @click="handleCreate" icon="el-icon-plus" type="primary">新增</el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pagesizes"
        :page-size="queryForm.pagesize"
        background
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
        label-width="10vw"
        :inline="true"
        label-suffix=":"
        :disabled="flag == 'detail'"
      >
        <div style="display:flex;justify-content:space-around;">
          <el-form-item label="申报方式" required>
            <el-radio-group v-model="addEditForm.declare_type">
              <el-radio :label="0">告知承诺制</el-radio>
              <el-radio :label="1">一般审批制</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="工商类型" required>
            <el-radio-group v-model="addEditForm.business_type">
              <el-radio :label="0">个体工商户</el-radio>
              <el-radio :label="2">工商企业</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
          <el-row v-for="(row, rowIndex) in cardItem" :key="rowIndex">
            <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 8">
              <el-form-item v-if="formItem.type !== 'standardAddress'" :label="formItem.label">
                <el-select
                  v-if="formItem.type == 'select'"
                  v-model="addEditForm[formItem.key]"
                  style="width:11vw"
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
                  style="width:11vw"
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
                  style="width:11vw"
                  type="date"
                  placeholder="请选择日期"
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
              <el-form-item
                v-else-if="formItem.type == 'standardAddress' && addEditForm.is_standard_address == 1"
                :label="formItem.label"
              >
                <el-input v-model="addEditForm.standardAddress" style="width:12vw" />
              </el-form-item>
            </el-col>
          </el-row>
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
import { items, create, update, remove } from '@/api/hotelBase'
import { enumsItems } from '@/api/common'
import mapToArray from '@/utils/mapToArray';
import handleEnum from '@/utils/handleEnum';
import map from '@/const/map';
import { formatDate } from '@/utils/index'
import MyCard from './MyCard.vue';
export default {
  components: {
    MyCard
  },
  data() {
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        // jurisdiction_unit: '',
        // trade_type: '',
        // logout: '',
        // enterprise_code: '',
        // legal_person: '',
        // checkStatus: '',
        // licenseStatus: '',
        // enterprise: '',
        // business_type: '',
        // sign_name: '',
        // credit_code: '',
        // business_state: '',
        // inputTime: [],
        // licenseIssueDate: [],
        pagesize: defaultSettings.pageSizes[0],
        pageindex: 1
      },
      tableLoading: false,
      tableData: [],
      tableDataCount: 0,
      tableSelected: [],
      enumData: {},
      dialogVisible: false,
      submitDisabled: false,
      flag: 'add',
      addEditForm: {
        declare_type: '0',
        business_type: '0'
      },
    }
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
    },
    formItems() {

      return [
        [
          {
            key: 'jurisdiction_unit',
            label: '管辖单位',
            type: 'select',
            options: this.enumData[2]
          },

          { key: 'enterprise_code', label: '企业编码', type: 'input' },
          { key: 'legal_person', label: '法人姓名', type: 'input' },
        ],
        [
          { key: 'enterprise', label: '企业名称', type: 'input' },
          { key: 'sign_name', label: '招牌名称', type: 'input' },
          { key: 'credit_code', label: '社会统一信用代码', type: 'input' },
        ],
        [
          {
            key: 'business_state',
            label: '营业状态',
            type: 'select',
            options: mapToArray(map.business_state)
          },
          { key: 'inputTime', label: '录入时间', type: 'datePicker', width: '14vw' },
          { key: 'btn', type: 'btn' }
        ]
        // [
        // {
        //   key: 'business_type',
        //   label: '工商类型',
        //   type: 'select',
        //   options: [
        //     { label: '个体工商户', value: 0 },
        //     { label: '工商企业', value: 2 }
        //   ]
        // },
        // {
        //   key: 'trade_type',
        //   label: '行业分类',
        //   type: 'select',
        //   options: mapToArray(map.hotel_trade_type)
        // },
        // {
        //   key: 'logout',
        //   label: '注销状态',
        //   type: 'select',
        //   options: [
        //     { label: '未注销', value: 1 },
        //     { label: '已注销', value: 2 }
        //   ]
        // },
        // {
        //   key: 'checkStatus',
        //   label: '核查状态',
        //   type: 'select',
        //   options: [
        //     { label: '变更待核查', value: 1 },
        //     { label: '关停', value: 2 },
        //     { label: '已保存安保信息', value: 3 },
        //     { label: '待核查', value: 4 },
        //     { label: '核查通过', value: 5 },
        //     { label: '核查失败', value: 6 },
        //     { label: '变更核查成功', value: 7 },
        //     { label: '变更保存', value: 8 },
        //     { label: '撤销许可', value: 9 },
        //     { label: '已保存基本信息', value: 10 },
        //     { label: '已保存电子材料', value: 11 },
        //     { label: '变更核查失败', value: 12 },
        //     { label: '限期整改', value: 13 }
        //   ]
        // },
        // {
        //   key: 'licenseStatus',
        //   label: '许可证状态',
        //   type: 'select',
        //   options: [
        //     { label: '未发放', value: 1 },
        //     { label: '已发放', value: 2 },
        //     { label: '已吊销', value: 3 }
        //   ]
        // },
        // { key: 'licenseIssueDate', label: '许可证发证日期', type: 'datePicker', width: '14vw', span: 8 },
        // ],

      ]
    },
    columns() {
      return [
        { type: 'index', label: '序号', width: 80 },
        { prop: 'enterprise', label: '企业名称', minWidth: 200 },
        { prop: 'credit_code', label: '社会统一信用代码', width: 180 },
        { prop: 'enterprise_code', label: '企业编码', width: 80 },
        { prop: 'legal_person', label: '法人姓名', width: 80 },
        { prop: 'jurisdiction_unit', label: '管辖单位', minWidth: 200, formatter: (r, c, cellValue) => map.police_unit[cellValue] },
        { prop: 'sign_name', label: '招牌名称', minWidth: 200 },
        { prop: 'enterprise_telephone', label: '联系电话', width: 180 },
        { prop: 'business_state', label: '营业状态', width: 80, formatter: (row, column, cellValue, index) => map.business_state[cellValue] },
        { prop: 'input_time', label: '录入时间', width: 180 },

        // { prop: 'checkStatus', label: '核查状态', width: 80 },
        // { prop: 'trade_type', label: '行业类别', width: 120, formatter: (row, column, cellValue, index) => map.hotel_trade_type[cellValue] },
        // { prop: 'logout', label: '注销状态', width: 80 },
        // { prop: 'licenseStatus', label: '许可证状态', width: 120 },
        // { prop: 'licenseIssueDate', label: '许可证发证日期', width: 180 },
        // { prop: 'origin', label: '数据来源', width: 120 }
      ];
    },
    addEditformItems() {
      return {
        '基础信息': [
          [
            {
              key: 'business_state',
              label: '营业状态',
              type: 'select',
              options: mapToArray(map.business_state)
            },
            {
              key: 'trade_type',
              label: '行业分类',
              type: 'select',
              options: mapToArray(map.hotel_trade_type)
            },
            { key: 'enterprise_code', label: '企业编码', type: 'input' },
          ],
          [

            { key: 'sign_name', label: '招牌名称', type: 'input' },
            { key: 'area', label: '占地面积（平米）', type: 'input' },
            { key: 'fax', label: '传真', type: 'input' },
          ],
          [
            { key: 'rooms', label: '房间数', type: 'input' },
            { key: 'beds', label: '床位数', type: 'input' },
            {
              key: 'hotel_star',
              label: '旅馆星级',
              type: 'select',
              options: mapToArray(map.hotel_star)
            },
          ],
          [
            {
              key: 'hotel_level',
              label: '旅馆等级',
              type: 'select',
              options: mapToArray(map.hotel_level)
            },
          ],
          [
            {
              key: 'jurisdiction_unit',
              label: '管辖单位',
              type: 'select',
              options: mapToArray(map.police_unit, 'string'),
            },
            { key: 'actual_address', label: '实际经营地址', type: 'input' },
          ],
          [
            {
              key: 'is_standard_address',
              label: '是否有标准地址',
              type: 'radio',
              options: [
                { label: '是', value: 1 },
                { label: '否', value: 0 }
              ]
            },
            { key: 'standard_address', label: '标准经营地址', type: 'standardAddress' },

          ]
        ],
        '工商信息': [
          [
            { key: 'enterprise', label: '企业名称(全称)', type: 'input' },
            { key: 'credit_code', label: '社会信用代码', type: 'input' },
            {
              key: 'district',
              label: '行政区域',
              type: 'select',
              options: this.enumData[3]
            },
          ],
          [
            {
              key: 'economic_type',
              label: '经济类型',
              type: 'select',
              options: mapToArray(map.economic_type)
            },
            { key: 'enterprise_telephone', label: '企业电话', type: 'input' },
            { key: 'register_cost', label: '注册资本（万元）', type: 'input' },
          ],
          [
            { key: 'legal_person', label: '法人姓名', type: 'input' },
            {
              key: 'legal_certificate_type',
              label: '法人证件类型',
              type: 'select',
              options: mapToArray(map.legal_certificate_type)
            },
            { key: 'legal_certificate_code', label: '法人证件号码', type: 'input' },
          ],
          [{ key: 'operate_address', label: '工商经营地址', type: 'input' },],
          [{ key: 'operate_scale', label: '经营范围（主营）', type: 'input' }]
        ],
        '管理信息': [
          [
            { key: 'chief_person', label: '单位负责人', type: 'input' },
            { key: 'chief_certificate_code', label: '负责人证件号码', type: 'input' },
            { key: 'chief_telephone', label: '负责人联系电话', type: 'input' },
          ],
          [
            { key: 'security_person', label: '安保负责人', type: 'input' },
            { key: 'security_certificate_code', label: '安保负责人证件号码', type: 'input' },
            { key: 'security_telephone', label: '安保负责人联系电话', type: 'input' },
          ],
          [
            { key: 'fire_opinion_date', label: '消防意见书发放日期', type: 'datePicker' },
            { key: 'fire_qualify_code', label: '消防合格证号', type: 'input' },
            { key: 'fire_check_unit', label: '消防审核单位', type: 'input' },
          ],
          [{ key: 'fire_check_opinion_code', label: '消防审核意见书编号', type: 'input' },],
          [{ key: 'remark', label: '备注', type: 'textarea', span: 24 }]
        ]
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
      enumsItems({ types: [3, 2] })
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
      const { inputTime, licenseIssueDate, ...rest } = this.queryForm;
      items({
        input_begin: inputTime ? formatDate('date', inputTime[0]) : undefined,
        input_end: inputTime ? formatDate('date', inputTime[1]) : undefined,
        license_begin: licenseIssueDate ? formatDate('date', licenseIssueDate[0]) : undefined,
        license_end: licenseIssueDate ? formatDate('date', licenseIssueDate[1]) : undefined,
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
    handleEdit(index, row, flag) {
      this.formClear(flag, false);
      this.addEditForm = { ...row, is_standard_address: +row.is_standard_address };
      this.dialogVisible = true;
    },
    handlePerson(index, row) {
      this.$router.push({ path: '/employees/domestic', query: { enterprise: row.enterprise } });
    },
    handleRemove(index, row) {
      this.removeData(row.hotelid)
    },
    removeData(hotelid) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            hotelid
          })
            .then(res => {
              if (res.code === 200) {
                if (res.data) {
                  this.$message({
                    message: '操作成功!',
                    type: 'success'
                  })
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
    handleReset() {
      const { pagesize, pageindex } = this.queryForm;
      this.queryForm = { pagesize, pageindex };
      this.$refs.queryForm.resetFields();
    },

    formClear(flag, visible) {
      this.dialogVisible = visible
      this.flag = flag
      if (this.$refs.addEditForm) {
        this.addEditForm = {
          declare_type: '0',
          business_type: '0'

        };
        this.$refs.addEditForm.resetFields()
      }
    },
    handleCreate() {
      this.formClear('add', true)
    },
    handleSubmit() {
      this.submitDisabled = true // 防止重复提交

      const { fire_opinion_date, is_standard_address, ...rest } = this.addEditForm;
      const requestData = {
        fire_opinion_date: formatDate('date', fire_opinion_date),
        is_standard_address: !!is_standard_address,
        ...rest
      };
      if (this.flag === 'add') {
        create(requestData)
          .then(res => {
            if (res.code === 200) {
              if (res.data) {
                this.$message({
                  message: '操作成功!',
                  type: 'success'
                })
                this.dialogVisible = false
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
        update(requestData)
          .then(res => {
            if (res.code === 200) {
              if (res.data) {
                this.$message({
                  message: '操作成功!',
                  type: 'success'
                })
                this.dialogVisible = false
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
    height: calc(100% - 136px);
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
