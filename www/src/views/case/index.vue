<template>
	<div class="ktv-container">
		<el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 200px; margin-bottom: 10px">
			<el-form ref="form" :model="queryForm" label-width="140px">
				<el-form-item v-for="formItem in formItems" style="width: 30%" :key="formItem.key" :label="formItem.label">
					<el-select v-if="formItem.type == 'select'" v-model="queryForm[formItem.key]" style="width: 20vw" placeholder="请选择">
						<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
					</el-select>
					<el-input v-else-if="formItem.type == 'input'" v-model="queryForm[formItem.key]" style="width: 20vw" />
					<el-date-picker v-else-if="formItem.type == 'datePicker'" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="queryForm[formItem.key]" style="width: 20vw" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
					<el-date-picker v-else-if="formItem.type == 'dateTimePicker'" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" v-model="queryForm[formItem.key]" style="width: 20vw" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="getList" icon="el-icon-search">搜索</el-button>
					<el-button @click="handleReset" icon="el-icon-delete">重置</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<div class="ktv-body" style="padding: 5px">
			<el-button @click="handleAdd" icon="el-icon-plus" style="margin-bottom: 10px" type="primary">新增</el-button>
			<el-button @click="handleBack" icon="el-icon-back" style="margin-bottom: 10px" v-if="showBack">返回</el-button>
			<div style="height: calc(100vh - 420px)">
				<el-table :data="tableData" border height="100%">
					<el-table-column v-for="column in columns" :show-overflow-tooltip="true" :key="column.prop" v-bind="column" />
					<el-table-column prop="operate" label="操作" width="130">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
							<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button slot="reference" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pager.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
			</el-footer>
		</div>
		<el-dialog
			class="hotel-base-add"
			:title="dialogTittle"
			:visible.sync="dialogVisible"
			width="70%"
			dest
			top="4vh"
			@close="
				addEditForm = {}
				enterprise = ''
			"
			destroy-on-close
			:close-on-click-modal="false"
		>
			<el-form ref="addEditForm" :model="addEditForm" label-width="120px" :inline="true" :disabled="flag == 'detail'">
				<el-form-item key="enterprise" label="企业名称">
					<el-select style="width: 250px" v-model="enterprise" @change="onChange" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
						<el-option v-for="(item, idx) in options" :key="idx" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<div v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
					<el-form-item v-for="formItem in cardItem" :key="formItem.key" :label="formItem.label">
						<el-select v-if="formItem.type == 'select'" v-model="addEditForm[formItem.key]" style="width: 250px" placeholder="请选择">
							<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
						</el-select>
						<el-input v-else-if="formItem.type == 'input'" v-model="addEditForm[formItem.key]" style="width: 250px" />
						<el-input v-else-if="formItem.type == 'textarea'" v-model="addEditForm[formItem.key]" type="textarea" style="width: 500px" />
						<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="addEditForm[formItem.key]" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 250px" />
						<el-date-picker
							v-else-if="formItem.type == 'dateTimePicker'"
							v-model="addEditForm[formItem.key]"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							format="yyyy-MM-dd HH:mm:ss"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							style="width: 250px"
						/>
						<el-radio-group v-else-if="formItem.type == 'radio'" v-model="addEditForm[formItem.key]">
							<el-radio v-for="option in formItem.options" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" :disabled="submitDisabled" @click="handleSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import defaultSettings from '@/settings'
import API from './api'
import MAP from '@/const/map'
import mapToArray from '@/utils/mapToArray'
import { getDynamicMap } from '@/const/map'

export default {
	data() {
		return {
			showBack: false,
			pager: {
				pageindex: 1,
				pagesize: 20
			},
			queryForm: { trade_type: null, enterprise: '' },
			formItems: [],
			tableDataCount: 0,
			pagesizes: defaultSettings.pageSizes,
			pagesize: defaultSettings.pageSizes[0],
			pageindex: 1,
			tableData: [],
			columns: [
			],
			dialogVisible: false,
			submitDisabled: false,
			flag: 'add',
			addEditForm: {},
			addEditformItems: {},
			options: [],
			loading: false,
			enterprise: ''
		}
	},
	mounted() { },
	created() {
		this.getEnum()
		// 其他页面跳转过来 填充企业名称
		if (this.$route.query.enterprise) {
			this.queryForm.enterprise = this.$route.query.enterprise
			this.queryForm.enterprise_id = this.$route.query.enterprise_id
			this.showBack = true
		}
		if (this.$route.query.trade_type) {
			this.queryForm.trade_type = parseInt(this.$route.query.trade_type)
			this.showBack = true
		}
		this.getList()
	},
	computed: {
		dialogTittle() {
			let tittle = ''
			switch (this.flag) {
				case 'edit':
					tittle = '编辑'
					break
				case 'add':
					tittle = '新增'
					break
				case 'detail':
					tittle = '详情'
					break
			}

			return tittle
		}
	},
	methods: {
		remoteMethod(query) {
			if (query !== '') {
				this.loading = true;
				API.getEnterpriseInfo({ key: query, size: 100000, index: 1 }).then(res => {
					if (res.data && res.data.length) {
						this.options = res.data.map(v => ({
							label: v.enterprise,
							value: v.systemid + '-' + v.type + '-' + v.enterprise,
							...v
						}))
						this.loading = false
					}
				})
			} else {
				this.options = [];
			}
		},
		onChange(val) {
			const [enterprise_id, trade_type, enterprise] = val.split('-')
			this.addEditForm = {
				...this.addEditForm,
				enterprise_id: +enterprise_id,
				trade_type: +trade_type,
				enterprise
			}
		},
		getEnum() {
			getDynamicMap().then(res => {
				this.addEditformItems = {
					立案信息: [
						// { key: 'trade_type', label: '行业类别', type: 'select', options: mapToArray(MAP.trade_type2) },
						// { key: 'enterprise', label: '企业名称', type: 'input' },
						// { key: 'enterprise_id', label: '企业编码', type: 'input' },
						{ key: 'case_code', label: '案件编号', type: 'input' },
						{ key: 'case_source', label: '案件来源', type: 'select', options: mapToArray(res.case_source) },
						{ key: 'case_time', label: '发案时间', type: 'dateTimePicker' },
						{ key: 'case_nature', label: '案件性质', type: 'select', options: mapToArray(res.case_nature) },
						{ key: 'case_type', label: '案件类别', type: 'select', options: mapToArray(res.case_type) },
						{ key: 'police_unit', label: '治安管辖机构', type: 'select', options: mapToArray(MAP.police_unit) },
						{ key: 'case_unit', label: '立案单位', type: 'select', options: mapToArray(MAP.jurisdiction_unit) },
						{ key: 'case_date', label: '立案日期', type: 'datePicker' },
						{ key: 'solve_date', label: '破案日期', type: 'datePicker' },
						{ key: 'enterprise_blame', label: '企业责任', type: 'select', options: mapToArray(res.enterprise_blame) },
						{ key: 'enterprise_persion', label: '企业人员/角色', type: 'input', options: mapToArray(MAP.employee_type) },
						{ key: 'messages', label: '情况描述', type: 'textarea' },
						{ key: 'remark', label: '备注', type: 'textarea' }
					]
				}
				this.columns = [
					{ prop: 'trade_type', label: '行业类别', formatter: (row, col, cell) => MAP.trade_type2[cell] },
					{ prop: 'enterprise_id', label: '企业编码', type: 'input' },
					{ prop: 'case_code', label: '案件编号', type: 'input' },
					{ prop: 'case_source', label: '案件来源', type: 'select', formatter: (row, col, cell) => res.case_source[cell] },
					{ prop: 'case_time', label: '发案时间', type: 'dateTimePicker' },
					{ prop: 'case_nature', label: '案件性质', type: 'select', formatter: (row, col, cell) => res.case_nature[cell] },
					{ prop: 'case_type', label: '案件类别', type: 'select', formatter: (row, col, cell) => res.case_type[cell] },
					{ prop: 'police_unit', label: '治安管辖机构', type: 'select', formatter: (row, col, cell) => MAP.police_unit[cell] },
					{ prop: 'case_unit', label: '立案单位', type: 'select', formatter: (row, col, cell) => MAP.jurisdiction_unit[cell] },
					{ prop: 'case_date', label: '立案日期', type: 'datePicker' },
					{ prop: 'solve_date', label: '破案日期', type: 'datePicker' },
					{ prop: 'enterprise_blame', label: '企业责任', type: 'select', formatter: (row, col, cell) => res.enterprise_blame[cell] },
					{ prop: 'enterprise_persion', label: '企业人员/角色', type: 'input', formatter: (row, col, cell) => MAP.employee_type[cell] },
				]
				this.formItems = [
					{
						key: 'trade_type',
						label: '行业类别',
						type: 'select',
						options: mapToArray(MAP.trade_type2)
					},
					{
						key: 'enterprise',
						label: '企业名称',
						type: 'input'
					},
					{ key: 'case_code', label: '案件编号', type: 'input' },
					{ key: 'case_source', label: '案件来源', type: 'select', options: mapToArray(res.case_source) },
					{ key: 'case_time', label: '发案时间', type: 'dateTimePicker' },
					{ key: 'case_nature', label: '案件性质', type: 'select', options: mapToArray(res.case_nature) },
					{ key: 'case_type', label: '案件类别', type: 'select', options: mapToArray(res.case_type) },
					{ key: 'police_unit', label: '治安管辖机构', type: 'select', options: mapToArray(MAP.police_unit) },
					{ key: 'case_unit', label: '立案单位', type: 'select', options: mapToArray(MAP.jurisdiction_unit) },
					{ key: 'case_date', label: '立案日期', type: 'datePicker' },
					{ key: 'solve_date', label: '破案日期', type: 'datePicker' },
				]
			})
		},
		handleBack() {
			this.$router.go(-1)
		},
		async getList() {
			const params = { ...this.queryForm }
			this.formItems.forEach(v => {
				if (v.type === 'datePicker' && params[v.key]) {
					const range = params[v.key]
					params[v.key + '_begin'] = range[0]
					params[v.key + '_end'] = range[1]
					delete params[v.key]
				}
			})
			const { data, size } = await API.list(
				{
					index: this.pager.pageindex,
					size: this.pager.pagesize
				},
				params
			)
			this.tableData = data
			this.tableDataCount = size
		},
		handleDetail(index, row) {
			this.addEditForm = row
			const { enterprise_id, trade_type, enterprise } = row
			const enterpriseName = `${enterprise_id}-${trade_type}-${enterprise}`
			this.options = [
				{
					label: enterprise,
					value: enterpriseName
				}
			]
			this.enterprise = enterpriseName
			this.flag = 'detail'
			this.dialogVisible = true
		},
		handleReset() {
			this.queryForm = {}
			this.pager.pageindex = 1
			this.getList()
		},
		handleEdit(index, row) {
			this.flag = 'edit'
			this.addEditForm = { ...row }
			const { enterprise_id, trade_type, enterprise } = row
			const enterpriseName = `${enterprise_id}-${trade_type}-${enterprise}`
			this.options = [
				{
					label: enterprise,
					value: enterpriseName
				}
			]
			this.enterprise = enterpriseName
			this.dialogVisible = true
		},
		handlePerson() { },
		handleDelete(idx, { caseid }) {
			this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					API.delete({
						caseid
					})
						.then(res => {
							if (res.code === 200) {
								if (res.data) {
									this.$message({
										message: '操作成功!',
										type: 'success'
									})
									this.getList()
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
		handleSearch() {
			this.getList()
		},

		handleAdd() {
			this.flag = 'add'
			this.dialogVisible = true
		},
		async handleSubmit() {
			if (this.flag === 'add') {
				await API.add(this.addEditForm)
				await this.getList()
				this.$succ()
			}
			if (this.flag === 'edit') {
				await API.update(this.addEditForm)
				await this.getList()
				this.$succ()
			}
			this.dialogVisible = false
			this.addEditForm = {}
			this.enterprise = ''
		},
		handleCancel() {
			this.dialogVisible = false
		},
		handleSizeChange(pagesize) {
			this.pager.pagesize = pagesize
			this.getList()
		},
		handleCurrentChange(pageindex) {
			this.pager.pageindex = pageindex
			this.getList()
		}
	}
}
</script>

<style lang="scss" scoped>
.ktv-container {
	.el-form {
		display: flex;
		flex-wrap: wrap;
		.el-form-item {
			// flex-basis: 25%;
			.el-form-item__content > .el-input {
				width: 78%;
			}
		}
	}

	.ktv-body {
	}
}
.el-descriptions {
	margin-top: 20px;
}
</style>
