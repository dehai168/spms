<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 140px">
      <el-form ref="queryForm" :model="queryForm" :inline="true">
        <el-row v-for="(row, rowIndex) in formItems" :key="rowIndex">
          <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 6">
            <el-form-item :label="formItem.label" :label-width="formItem.labelWidth || '8.5vw'">
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
            type="date"
            placeholder="请选择日期"
            style="width:200px"
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
import { items, create, update, remove } from '@/api/fleaTrade'
import map from '@/const/map'
import mapToArray from '@/utils/mapToArray'
import { formatDate } from '@/utils/index'
export default {
  data() {
    return {
      pagesizes: defaultSettings.pageSizes,
      queryForm: {
        // district: '',
        // police_unit: '',
        // record_code: '',
        // enterprise: '',
        // enterprise_address: '',
        // enterprise_build_no: '',
        // enterprise_detail_address: '',
        // junk_type: '',
        // special_license: '',
        // legal_person: '',
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
            key: 'district',
            label: '行政区划',
            type: 'select',
            options: mapToArray(map.district, 'string')
          },
          {
            key: 'police_unit',
            label: '管辖派出所',
            type: 'select',
            options: mapToArray(map.police_unit, 'string')
          },
          { key: 'record_code', label: '备案登记号', type: 'input' },
          { key: 'enterprise', label: '企业名称', type: 'input' },
        ],
        [
          { key: 'enterprise_address', label: '企业地址', type: 'input' },
          { key: 'enterprise_build_no', label: '企业门楼牌号', type: 'input' },
          { key: 'enterprise_detail_address', label: '企业详址', type: 'input' },
          { key: 'junk_type', label: '分类', type: 'select', options: mapToArray(map.trade_type) },
        ],
        [
          { key: 'legal_person', label: '法人姓名', type: 'input' },
          { key: 'special_license', label: '特殊行业许可证', type: 'input'},
          { key: 'btn', type: 'btn' },
        ]
      ],
      columns: [
        { type: 'index', label: '序号', width: 80 },
        { prop: 'district', label: '行政区划', width: 180, formatter: (r, c, value) => map.district[value] },
        { prop: 'enterprise', label: '企业名称', minWidth: 180 },
        { prop: 'record_code', label: '备案登记号', width: 120 },
        { prop: 'enterprise_address', label: '企业地址', minWidth: 180 },
        { prop: 'enterprise_build_no', label: '企业门楼牌号', width: 100 },
        { prop: 'enterprise_detail_address', label: '企业详址', minWidth: 180 },
        { prop: 'junk_type', label: '分类', width: 150, formatter: (r, c, value) => map.trade_type[value] },
        { prop: 'special_license', label: '特殊行业许可证', width: 180 },
        { prop: 'legal_person', label: '法人姓名', width: 120 },
        { prop: 'legal_telephone', label: '法人联系电话', minWidth: 180 },
        { prop: 'police_unit', label: '管辖派出所', minWidth: 200, formatter: (r, c, value) => map.police_unit[value] },
      ],
      dialogVisible: false,
      submitDisabled: false,
      flag: 'add',
      addEditForm: {

      },
      addEditformItems: [
        {
          key: 'district',
          label: '行政区划',
          type: 'select',
          valueType: 'string',
          options: mapToArray(map.district, 'string')
        },
        {
          key: 'police_unit',
          label: '派出所名称',
          type: 'select',
          valueType: 'string',
          options: mapToArray(map.police_unit, 'string')
        },
        { key: 'record_code', label: '备案编号', type: 'input' },
        { key: 'enterprise', label: '企业名称', type: 'input' },
        { key: 'enterprise_address', label: '企业地址', type: 'input' },
        { key: 'enterprise_build_no', label: '企业门楼牌号', type: 'input' },
        {
          key: 'junk_type',
          label: '分类',
          type: 'select',
          options: mapToArray(map.trade_type, 'string')
        },
        { key: 'chief_telephone', label: '经营负责人电话', type: 'input' },
        { key: 'enterprise_detail_address', label: '企业详址', type: 'input' },
        { key: 'enterprise_website', label: '企业网址', type: 'input' },
        {
          key: 'economic_type',
          label: '经济性质',
          type: 'select',
          options: mapToArray(map.economic_type)
        },
        { key: 'special_license', label: '特种行业许可证编号', type: 'input' },
        { key: 'enterprise_permit_code', label: '工商营业执照编号', type: 'input' },
        { key: 'register_cost', label: '注册资金（万元）', type: 'input' },
        { key: 'operate_scale', label: '经营范围', type: 'input' },
        { key: 'operate_area', label: '经营面积（平方米）', type: 'input' },
        { key: 'senior_chief_unit', label: '上级主管部门', type: 'input' },
        { key: 'enterprise_telephone', label: '企业联系电话', type: 'input' },
        { key: 'legal_certificate_code', label: '法定代表人身份证号码', type: 'input' },
        { key: 'legal_person', label: '法定代表人姓名', type: 'input' },
        { key: 'legal_telephone', label: '法定代表人联系电话', type: 'input' },
        { key: 'staffs', label: '从业人员数', type: 'input' },
        { key: 'security_persons', label: '保安人数', type: 'input' },
        { key: 'register_keepers', label: '登记保管人员数', type: 'input' },
        { key: 'night_persons', label: '夜间值班人数', type: 'input' },
        {
          key: '房屋结构',
          label: '房屋结构',
          type: 'input',
          options: [
            { label: 'xxx', value: 1 },
            { label: 'xxxx', value: 2 }
          ]
        },
        {
          key: 'fire_important_level',
          label: '消防重点单位管理级别',
          type: 'select',
          options: [
            { label: 'xxx', value: 1 },
            { label: 'xxxx', value: 2 }
          ]
        },
        { key: 'security_chief_person', label: '消防负责人', type: 'input' },
        { key: 'security_chief_telephone', label: '消防负责人联系电话', type: 'input' },
        { key: 'fire_check_unit', label: '消防验收单位', type: 'input' },
        { key: 'fire_check_opinion', label: '消防验收意见', type: 'input' },
        { key: 'fire_check_time', label: '消防验收时间', type: 'datePicker' },
        {
          key: 'is_fire_regulation',
          label: '是否有安全规章制度',
          type: 'select',
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
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
      this.formClear(flag, false)
      this.addEditForm = { ...row, is_fire_regulation: +row.is_fire_regulation };
      this.dialogVisible = true;
    },
    handlePerson(index, row) {
      this.$router.push({ path: '/employees/domestic', query: { enterprise: row.enterprise } });
    },
    handleRemove(index, row) {
      this.removeData(row.junk_tradeid)
    },
    removeData(junk_tradeid) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            junk_tradeid
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
      console.log(this.addEditForm)
      const { fire_opinion_date, 填表日期, 操作时间, is_fire_regulation, ...rest } = this.addEditForm;
      const requestData = {
        fire_check_time: fire_opinion_date ? formatDate('date', fire_opinion_date) : undefined,
        is_fire_regulation: !!is_fire_regulation,
        填表日期: formatDate('date', 填表日期),
        操作时间: formatDate('date', 操作时间),
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
