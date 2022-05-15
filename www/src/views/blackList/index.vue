<template>
  <el-container class="container">
    <el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 90px">
      <el-form ref="queryForm" :model="queryForm" :inline="true" label-width="10vw">
        <el-row v-for="(row, rowIndex) in formItems" :key="rowIndex">
          <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 8">
            <el-form-item :label="formItem.label">
              <el-select v-if="formItem.type == 'select'" v-model="queryForm[formItem.key]"
                :style="{ width: formItem.width || '11vw' }" placeholder="请选择" :clearable="true">
                <el-option v-for="option in formItem.options" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
              <el-input v-else-if="formItem.type == 'input'" v-model="queryForm[formItem.key]"
                :style="{ width: formItem.width || '11vw' }" />
              <el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="queryForm[formItem.key]"
                :style="{ width: formItem.width || '11vw' }" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" />
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
      <el-table v-loading="tableLoading" :data="tableData" height="calc(100% - 36px)" border style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column v-for="column in columns" :key="column.prop" v-bind="column" :show-overflow-tooltip="true" />
        <el-table-column prop="operate" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row, 'detail')">详情</el-button> -->
            <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row, 'edit')">编辑</el-button>
            <el-button slot="reference" type="text" size="small" @click="handleRemove(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background
        :total="tableDataCount" />
    </el-footer>
    <!-- 新增 编辑 -->
    <el-dialog class="hotel-base-add" :title="dialogTittle" :visible.sync="dialogVisible" width="50%" top="10vh"
      :close-on-click-modal="false">
      <el-form ref="addEditForm" :model="addEditForm" label-width="10vw" :inline="true" label-suffix=":"
        :disabled="flag == 'detail'">
        <el-row>
          <el-form-item :label="addEditformItems[0].label">
            <el-select v-model="addEditForm[addEditformItems[0].key]" style="width: 16vw"
              :placeholder="addEditformItems[0].placeholder || '请选择'" @change="handleChange()">
              <el-option v-for="option in addEditformItems[0].options" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item :label="addEditformItems[1].label">
            <el-select v-model="addEditForm[addEditformItems[1].key]" style="width: 16vw"
              :placeholder="addEditformItems[1].placeholder || '请选择'" v-bind="addEditformItems[1]"
              @change="handleChange2()">
              <el-option v-for="option in addEditformItems[1].options" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="addEditformItems[2].label">
            <el-input v-model="addEditForm[addEditformItems[2].key]" type="textarea"
              :autosize="{ minRows: 5, maxRows: 10 }" style="width: 500px" />
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import defaultSettings, { csrfTokenName } from '@/settings'
import { items, create, update, remove } from '@/api/blackList'
import { enumsItems, getEnterpriseList } from '@/api/common'
import mapToArray from '@/utils/mapToArray'
import handleEnum from '@/utils/handleEnum'
import map from '@/const/map'
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
      enumData: {},
      dialogVisible: false,
      submitDisabled: false,
      flag: 'add',
      addEditForm: {

      },
      loading: false,
      options: [],
      enterpriseData: []
    }
  },
  computed: {
    dialogTittle() {
      let tittle = ''
      switch (this.flag) {
        case 'edit':
          tittle = '编辑企业黑名单'
          break
        case 'add':
          tittle = '新增企业黑名单'
          break
          // case 'detail':
          //   tittle = '企业黑名单详情'
          break
      }

      return tittle
    },
    formItems() {
      return [
        [
          {
            key: 'type',
            label: '行业类别',
            type: 'select',
            options: mapToArray(map.trade_type2),
          },
          { key: 'enterprise', label: '企业名称', type: 'input' },
          { key: 'credit_code', label: '社会统一信用代码', type: 'input' },
          { key: 'btn', type: 'btn' }
        ]
      ]
    },
    columns() {
      return [
        { type: 'index', label: '序号', width: 50 },
        { prop: 'type', label: '行业类别', minWidth: 120, formatter: (row, column, cellValue, index) => map.trade_type2[cellValue] },
        { prop: 'enterprise', label: '企业名称', minWidth: 200 },
        { prop: 'credit_code', label: '社会统一信用代码', width: 180 },
        { prop: 'black_reason', label: '原因', width: 200 },
        { prop: 'input_time', label: '时间', width: 140 }
      ]
    },
    addEditformItems() {

      return [
        {
          key: 'type',
          label: '行业类别',
          type: 'select',
          options: mapToArray(map.trade_type2),
          span: 24
        },
        {
          key: 'systemid',
          label: '企业名称',
          type: 'select',
          filterable: true,
          remote: true,
          placeholder: "请输入关键词",
          remoteMethod: this.remoteMethod,
          loading: this.loading,
          options: this.options,
          span: 24
        },
        {
          key: 'black_reason',
          label: '原因',
          type: 'textarea',
          span: 24
        }
      ];
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.tableLoading = true
      const { inputTime, licenseIssueDate, ...rest } = this.queryForm
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
      this.formClear(flag, false)
      this.addEditForm = { ...row }
      this.remoteMethod(row.enterprise);
      this.dialogVisible = true
    },
    handleRemove(index, row) {
      this.removeData(row.blackid)
    },
    removeData(blackid) {
      this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({
            blackid
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
      const { pagesize, pageindex } = this.queryForm
      this.queryForm = { pagesize, pageindex }
      this.$refs.queryForm.resetFields()
    },

    formClear(flag, visible) {
      this.dialogVisible = visible
      this.flag = flag
      this.options = [];
      if (this.$refs.addEditForm) {
        this.addEditForm = {
          type: undefined,
        }
        this.$refs.addEditForm.resetFields()
      }
    },
    handleCreate() {
      this.formClear('add', true)
    },
    handleSubmit() {
      this.submitDisabled = true // 防止重复提交
      const select = this.enterpriseData.find(i => i.systemid == this.addEditForm.systemid) || {};
      const requestData = {
        ...this.addEditForm,
        ...select,
      }
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
        this.dialogVisible = false
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
    remoteMethod(enterprise) {
      if (!this.addEditForm.type) {
        this.$message({
          message: '请先选择行业类别',
          type: 'warning'
        })

        return;
      }
      if (enterprise !== '') {
        this.loading = true;
        getEnterpriseList({
          enterprise,
          type: this.addEditForm.type,
        }).then(({ data, code }) => {
          this.loading = false;
          if (code === 200) {
            this.options = data.map(i => ({ label: i.enterprise, value: i.systemid }));
            this.enterpriseData = data;
          }
        }).catch(e => {
          this.loading = false;
        });
      } else {
        this.options = [];
      }
    },
    handleChange() {
      this.addEditForm.systemid = undefined;
      this.options = [];
    },
    handleChange2() {
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 120px);
  width: 100%;

  .main {
    height: calc(100% - 86px);
    width: 100%;
    padding: 5px;

    >button {
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
