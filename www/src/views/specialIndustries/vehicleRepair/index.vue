<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 96px">
      <el-form ref="queryForm" :model="queryForm" :inline="true" label-width="8vw">
        <el-row v-for="(row, rowIndex) in formItems" :key="rowIndex">
          <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 6">
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
      <el-button icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
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
        label-width="7.5vw"
        :inline="true"
        :disabled="flag == 'detail'"
      >
        <my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
          <el-row v-for="(row, rowIndex) in cardItem" :key="rowIndex">
            <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 8">
              <el-form-item :label="formItem.label">
                <el-select
                  v-if="formItem.type == 'select'"
                  v-model="addEditForm[formItem.key]"
                  :style="{ width: formItem.width || '13.5vw' }"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="option in formItem.options"
                    :key="option.value"
                    :value="formItem.valueType == 'string' ? option.value : +option.value"
                    :label="option.label"
                  />
                </el-select>
                <el-input
                  v-else-if="formItem.type == 'input'"
                  v-model="addEditForm[formItem.key]"
                  :style="{ width: formItem.width || '13.5vw' }"
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
                  :style="{ width: formItem.width || '13.5vw' }"
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
import { items, create, update, remove } from '@/api/vehicleRepair'
import { formatDate } from '@/utils/index'
import map from '@/const/map'
import mapToArray from '@/utils/mapToArray'
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
        // enterprise_code: '',
        // credit_code: '',
        // legal_person: '',
        // enterprise: '',
        // inputTime: '',
        // business_state: '',
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
            key: 'jurisdiction_unit',
            label: '管辖单位',
            type: 'select',
            options: mapToArray(map.police_unit)
          },
          { key: 'legal_person', label: '法人姓名', type: 'input' },
          { key: 'enterprise', label: '企业名称', type: 'input' },
          {
            key: 'business_state',
            label: '营业状态',
            type: 'select',
            options: mapToArray(map.business_state)
          },
        ],
        [
          { key: 'inputTime', label: '录入时间', type: 'datePicker', span: 8, width: '13vw' },
          { key: 'btn', type: 'btn', span: 4 },
          // { key: 'enterprise_code', label: '企业编码', type: 'input' },
          // { key: 'credit_code', label: '社会信用代码', type: 'input' },
        ],
      ],
      columns: [
        { type: 'index', label: '序号', width: 80 },
        { prop: 'enterprise', label: '企业名称', minWidth: 200 },
        { prop: 'legal_person', label: '法人姓名', width: 100 },
        { prop: 'district', label: '行政区划', minWidth: 140, formatter: (r, c, cellValue) => map.district[cellValue] },
        { prop: 'enterprise_address', label: '企业地址', minWidth: 160 },
        { prop: 'enterprise_telephone', label: '联系电话', minWidth: 180 },
        {
          prop: 'business_state',
          label: '营业状态', width: 100,
          formatter: (r, c, value) => map.business_state[value]
        },
        { prop: 'jurisdiction_unit', label: '管辖单位', minWidth: 200, formatter: (r, c, cellValue) => map.police_unit[cellValue] },
        // { prop: 'enterprise_code', label: '企业编码', width: 120 },
        // { prop: 'credit_code', label: '社会信用代码', minWidth: 120 },
        { prop: 'input_time', label: '录入时间', width: 180 }
      ],
      dialogVisible: false,
      submitDisabled: false,
      flag: 'add',
      addEditForm: {

      },
      addEditformItems: {
        '基础信息': [
          [
            {
              key: 'business_state',
              label: '营业状态',
              type: 'select',
              options: mapToArray(map.business_state)
            },
            { key: 'area', label: '占地面积（平米）', type: 'input' },
            { key: 'enterprise_code', label: '企业编码', type: 'input' },
          ],
          [
            {
              key: 'jurisdiction_unit',
              label: '管辖单位',
              type: 'select',
              valueType: 'string',
              options: mapToArray(map.police_unit)
            },
            { key: 'register_date', label: '企业登记日期', type: 'datePicker' },
          ],
          [{ key: 'enterprise_address', label: '地址', type: 'input', width: '500px', span: 24 },]
        ],
        '工商信息': [
          [
            { key: 'enterprise', label: '企业名称(全称)', type: 'input' },
            { key: 'credit_code', label: '社会信用代码', type: 'input' },
            {
              key: 'district',
              label: '行政区域',
              type: 'select',
              valueType: 'string',
              options: mapToArray(map.district)
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
          [{ key: 'operate_address', label: '工商经营地址', type: 'input', width: '500px', span: 24 }],
          [{ key: 'operate_scale', label: '经营范围（主营）', type: 'input', width: '500px', span: 24 }]
        ],
        '管理信息': [
          [
            { key: 'chief_person', label: '单位负责人', type: 'input' },
            { key: 'chief_certificate_code', label: '负责人证件号码', type: 'input' },
            { key: 'chief_telephone', label: '负责人联系电话', type: 'input' },
          ],
          [
            { key: 'manage_police_name', label: '列管民警姓名', type: 'input' },
            { key: 'manage_police_telephone', label: '列管民警手机', type: 'input' },
          ],
          [{ key: '备注', label: '备注', type: 'textarea', span: 24 }],
        ]
      }
    };
  },
  computed: {
    dialogTittle() {
      let tittle = '';
      switch (this.flag) {
        case 'edit':
          tittle = '编辑机动车修理业信息';
          break;
        case 'add':
          tittle = '新增机动车修理业信息';
          break;
        case 'detail':
          tittle = '机动车修理业详情';
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
      const { inputTime, ...rest } = this.queryForm;
      items({
        fromdate: inputTime ? formatDate('date', inputTime[0]) : undefined,
        todate: inputTime ? formatDate('date', inputTime[1]) : undefined,
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
      this.addEditForm = row;
      this.dialogVisible = true;
    },
    handlePerson(index, row) {
      this.$router.push({ path: '/employees/domestic', query: { enterprise: row.enterprise } });
    },
    handleRemove(index, row) {
      this.removeData(row.vehicle_repairid)
    },
    removeData(vehicle_repairid) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            vehicle_repairid
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
        this.addEditForm = {};
        this.$refs.addEditForm.resetFields()
      }
    },
    handleCreate() {
      this.formClear('add', true)
    },
    handleSubmit() {
      const { register_date, ...rest } = this.addEditForm;
      const requestData = {
        register_date: register_date ? formatDate('date', register_date) : undefined,
        ...rest
      };

      this.submitDisabled = true // 防止重复提交
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
    height: calc(100% - 84px);
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
