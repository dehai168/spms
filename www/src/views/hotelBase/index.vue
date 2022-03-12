<template>
  <div class="hotel-base-container">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item v-for="formItem in formItems" :key="formItem.key" :label="formItem.label">
        <el-select v-if="formItem.type == 'select'" v-model="form[formItem.key]" placeholder="请选择">
          <el-option
            v-for="option in formItem.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
        <el-input v-else-if="formItem.type == 'input'" v-model="form[formItem.key]" />
        <el-date-picker
          v-else-if="formItem.type == 'datePicker'"
          v-model="form[formItem.key]"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <div class="hotel-base-body">
      <el-button @click="dialogFormVisible = true">新增</el-button>
      <el-table :data="tableData">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
        />
        <el-table-column prop="operate" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handlePerson(scope.$index, scope.row)">从业人员</el-button>
            <el-popconfirm
              title="确定删除此旅馆吗？"
              icon="el-icon-info"
              icon-color="red"
              style="margin-left: 10px"
            >
              <el-button
                slot="reference"
                type="text"
                size="small"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-edit-modal :visible="dialogFormVisible" :on-ok="handleAdd" :on-cancel="handleCancel" />
  </div>
</template>

<script>

import AddEditModal from './AddEditModal.vue';
export default {
  components: {
    AddEditModal
  },
  data() {
    return {
      form: {
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
        licenseIssueDate: ''
      },
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
        {
          key: 'enterpriseCode',
          label: '企业编码',
          type: 'input'
        },
        {
          key: 'legalPerson',
          label: '法人姓名',
          type: 'input'
        },
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
        {
          key: 'companyName',
          label: '企业名称',
          type: 'input'
        },

        {
          key: 'businessType',
          label: '工商类型',
          type: 'select',
          options: [
            { label: '个体工商户', value: 1 },
            { label: '工商企业', value: 2 }
          ]
        },
        {
          key: 'signboardName',
          label: '招牌名称',
          type: 'input'
        },
        {
          key: 'unifiedSocialCreditCode',
          label: '统一社会信用代码',
          type: 'input'
        },
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
        {
          key: 'inputTime',
          label: '录入时间',
          type: 'datePicker'
        },
        {
          key: 'licenseIssueDate',
          label: '许可证发证日期',
          type: 'datePicker'
        }
      ],
      tableData: [{
        agency: 'hahahhaaaahaahhahaha',
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
        licenseIssueDate: ''
      }],
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
      dialogFormVisible: false
    };
  },
  methods: {
    handleDetail(index, row) {

    },
    handleEdit() { },
    handlePerson() { },
    handleDelete() { },
    handleSearch() { },
    handleReset() { },
    handleAdd() {

    },
    handleCancel() {
      this.dialogFormVisible = false;
    },

  }

}
</script>

<style lang="scss" scoped>
.hotel-base-container {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      flex-basis: 25%;
      .el-form-item__content > .el-input {
        width: 78%;
      }
    }
  }

  .hotel-base-body {
    padding: 0 5%;
  }
}
</style>
