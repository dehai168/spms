<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 180px">
      <el-form ref="queryForm" :model="queryForm" :inline="true" label-width="9.5vw">
        <el-row v-for="(row, rowIndex) in formItems" :key="rowIndex">
          <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 6">
            <el-form-item :label="formItem.label">
              <el-select
                v-if="formItem.type == 'select'"
                v-model="queryForm[formItem.key]"
                style="width:10vw"
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
                style="width:10vw"
              />
              <el-date-picker
                v-else-if="formItem.type == 'datePicker'"
                v-model="queryForm[formItem.key]"
                style="width:10vw"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
              <div v-else-if="formItem.type == 'btn'">
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
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
              :value="formItem.valueType == 'string' ? option.value : +option.value"
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
import { items, create, update, remove } from '@/api/scrapMetal'
import mapToArray from '@/utils/mapToArray';
import map from '@/const/map';
import { formatDate } from '@/utils/index'
export default {
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
      formItems: [
        [
          {
            key: 'district',
            label: '行政区划',
            type: 'select',
            options: mapToArray(map.district)
          },
          {
            key: 'police_unit',
            label: '派出所名称',
            type: 'select',
            options: mapToArray(map.police_unit)
          },
          { key: 'enterprise', label: '企业名称', type: 'input' },
          { key: 'enterprise_address', label: '企业地址', type: 'input' },
        ],
        [
          { key: 'enterprise_build_no', label: '企业门楼牌号', type: 'input' },
          { key: 'enterprise_detail_address', label: '企业详址', type: 'input' },
          { key: 'economic_type', label: '经济类型', type: 'select', options: mapToArray(map.economic_type) },
          { key: 'security_level', label: '治安级别', type: 'select', options: mapToArray(map.security_level) },

        ],
        [
          { key: 'legal_certificate_code', label: '法人代表证据号码', type: 'input' },
          { key: 'chief_person', label: '单位负责人', type: 'input' },
          { key: 'chief_certificate_code', label: '负责人证件号码', type: 'input' },
          {
            key: 'is_record_register', label: '是否备案登记', type: 'select', options: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ]
          },
        ],
        [{ key: 'btn', type: 'btn' },]
      ],
      columns: [
        { type: 'index', label: '序号', },
        { prop: 'district', label: '行政区划', formatter: (r, c, value) => map.district[value] },
        { prop: 'police_unit', label: '派出所名称', formatter: (r, c, value) => map.police_unit[value] },
        { prop: 'enterprise', label: '企业名称', },
        { prop: 'security_level', label: '治安级别', formatter: (r, c, value) => map.security_level[value] },
        { prop: 'is_record_register', label: '是否备案登记', formatter: (r, c, value) => value ? '是' : '否' },
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
          options: mapToArray(map.district)
        },
        {
          key: 'police_unit',
          label: '派出所名称',
          type: 'select',
          valueType: 'string',
          options: mapToArray(map.police_unit)
        },
        { key: 'enterprise_vice_class', label: '企业副分类', type: 'input' },
        { key: 'enterprise', label: '企业名称', type: 'input' },
        { key: 'enterprise_street', label: '企业街路巷', type: 'input' },
        { key: 'enterprise_build_no', label: '企业门楼牌号', type: 'input' },
        { key: 'enterprise_detail_address', label: '企业详址', type: 'input' },
        { key: 'county_police_unit_code', label: '公安机关代码', type: 'input' },
        { key: 'jurisdiction_unit', label: '管辖单位', type: 'input' },
        { key: '企业组织机构代码', label: '企业组织机构代码', type: 'input' },
        { key: '联系电话', label: '联系电话', type: 'input' },

        { key: 'post_code', label: '邮政编码', type: 'input' },

        {
          key: 'economic_type',
          label: '经济类型',
          type: 'select',
          options: mapToArray(map.economic_type)
        },
        { key: 'concurrently_scale', label: '经营范围（主营）', type: 'input' },
        { key: '经营范围', label: '经营范围（兼营）', type: 'input' },
        { key: 'operate_area', label: '经营面积（平方米）', type: 'input' },
        { key: 'security_level', label: '治安级别', type: 'select', options: mapToArray(map.security_level), valueType: 'string' },
        { key: 'business_state', label: '营业状态', type: 'select', options: mapToArray(map.my_business_state) },
        { key: 'legal_person', label: '法定代表人姓名', type: 'input' },
        { key: 'legal_certificate_type', label: '法定代表证件类型', type: 'select', options: mapToArray(map.legal_certificate_type) },
        { key: 'legal_certificate_code', label: '法定代表证件号码', type: 'input' },
        { key: 'legal_telephone', label: '法人代表联系电话', type: 'input' },
        { key: 'open_date', label: '开业日期', type: 'datePicker' },
        { key: 'stop_date', label: '停业日期', type: 'datePicker' },
        { key: 'operate_way', label: '经营方式', type: 'input' },
        { key: 'chief_person', label: '单位负责人姓名', type: 'input' },
        { key: 'chief_certificate_type', label: '单位负责人证件类型', type: 'select', options: mapToArray(map.certificate_type) },
        { key: 'chief_certificate_code', label: '单位负责人证件号码', type: 'input' },
        { key: 'chief_telephone', label: '单位负责人联系方式', type: 'input' },
        { key: 'fire_check_unit', label: '消防审核单位', type: 'input' },
        { key: 'fire_qualify_code', label: '消防合格证号', type: 'input' },
        { key: 'security_enterprise_name', label: '保安公司名称', type: 'input' },
        { key: 'security_chief_identify', label: '保安负责人身份证号', type: 'input' },
        { key: 'security_chief_person', label: '保安负责人姓名', type: 'input' },
        { key: 'security_chief_telephone', label: '保安负责人电话', type: 'input' },
        { key: 'security_persons', label: '保安人数', type: 'input' },
        { key: 'post_train_persons', label: '经岗位培训人数', type: 'input' },
        { key: 'exit_total', label: '出口数量', type: 'input' },
        { key: 'room_total', label: '包厢包间数', type: 'input' },
        { key: 'is_record_register', label: '是否备案登记', type: 'input' },
        { key: 'record_code', label: '备案登记号', type: 'input' },
        { key: 'fire_appraisal_code', label: '消防鉴定书编号', type: 'input' },
        { key: 'save_time', label: '保存时间', type: 'datePicker' },
        { key: 'input_time', label: '录入时间', type: 'datePicker' },
        { key: 'annual_check_date', label: '年审日期', type: 'datePicker' },

      ]
    };
  },
  computed: {
    dialogTittle() {
      let tittle = '';
      switch (this.flag) {
        case 'edit':
          tittle = '编辑废旧金属交易信息';
          break;
        case 'add':
          tittle = '新增废旧金属交易信息';
          break;
        case 'detail':
          tittle = '废旧金属交易详情';
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
      const { is_record_register, ...rest } = this.queryForm;
      items({
        is_record_register: typeof is_record_register === 'undefined' ? undefined : !!is_record_register,
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
      this.formClear(flag, false)
      this.addEditForm = { ...row, is_record_register: +row.is_record_register };
      this.dialogVisible = true;
    },
    handlePerson(index, row) {
      this.$router.push({ path: '/employees/domestic', query: { enterprise: row.enterprise } });
    },
    handleRemove(index, row) {
      this.removeData(row.scrap_metal_recycleid)
    },
    removeData(scrap_metal_recycleid) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            scrap_metal_recycleid
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

      this.submitDisabled = true // 防止重复提交

      const {
        open_date,
        stop_date,
        annual_check_date,
        is_record_register,
        input_time,
        save_time,
        ...rest
      } = this.addEditForm;
      const requestData = {
        open_date: open_date ? formatDate('date', open_date) : undefined,
        stop_date: stop_date ? formatDate('date', stop_date) : undefined,
        annual_check_date: annual_check_date ? formatDate('dateTime', annual_check_date) : undefined,
        input_time: input_time ? formatDate('dateTime', input_time) : undefined,
        save_time: save_time ? formatDate('dateTime', save_time) : undefined,
        is_record_register: typeof is_record_register === 'undefined' ? undefined : !!is_record_register,
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
    height: calc(100% - 224px);
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
