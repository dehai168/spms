<template>
	<div class="ktv-container">
		<el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 140px; margin-bottom: 10px">
			<el-form ref="form" :model="queryForm" label-width="140px">
				<el-form-item v-for="formItem in formItems"  style="width: 30%"  :key="formItem.key" :label="formItem.label">
					<el-select v-if="formItem.type == 'select'" v-model="queryForm[formItem.key]" style="width: 14vw" placeholder="请选择">
						<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
					</el-select>
					<el-input v-else-if="formItem.type == 'input'" v-model="queryForm[formItem.key]" style="width: 14vw" />
					<el-date-picker v-else-if="formItem.type == 'datePicker'" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="queryForm[formItem.key]" style="width: 14vw" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="getList" icon="el-icon-search">搜索</el-button>
					<el-button @click="handleReset" icon="el-icon-delete">重置</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<div class="ktv-body">
			<el-button @click="handleAdd" icon="el-icon-plus" style="margin-bottom: 10px" type="primary">新增</el-button>
			<div style="height: calc(100vh - 360px)">
				<el-table :data="tableData" border>
					<el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" :formatter="column.formatter" />
					<el-table-column prop="operate" label="操作" width="200" fixed="right">
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
		<el-dialog class="hotel-base-add" :title="dialogTittle" :visible.sync="dialogVisible" width="70%" top="4vh" @close="addEditForm = {}" destroy-on-close :close-on-click-modal="false">
			<el-form ref="addEditForm" :model="addEditForm" label-width="120px" :inline="true" :disabled="flag == 'detail'">
				<my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
					<el-form-item v-for="formItem in cardItem" :key="formItem.key" :label="formItem.label">
						<el-select v-if="formItem.type == 'select'" v-model="addEditForm[formItem.key]" style="width: 150px" placeholder="请选择">
							<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
						</el-select>
						<el-input v-else-if="formItem.type == 'input'" v-model="addEditForm[formItem.key]" style="width: 150px" />
						<el-input v-else-if="formItem.type == 'textarea'" v-model="addEditForm[formItem.key]" type="textarea" style="width: 500px" />
						<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="addEditForm[formItem.key]" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
						<el-radio-group v-else-if="formItem.type == 'radio'" v-model="addEditForm[formItem.key]">
							<el-radio v-for="option in formItem.options" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</my-card>
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
import MAP from '../../../const/map'
import mapToArray from '../../../utils/mapToArray'

export default {
	data() {
		return {
			pager: {
				pageindex: 1,
				pagesize: 10
			},
			queryForm: {},
			formItems: [
				{
					key: 'trade_type',
					label: '行业类别',
					type: 'select',
					options: mapToArray(MAP.trade_type)
				},
				{
					key: 'enterprise',
					label: '企业名称',
					type: 'input'
				},

				{
					key: 'last_name',
					label: '英文姓',
					type: 'input'
				},
				{
					key: 'first_name',
					label: '英文名',
					type: 'input'
				},
				{
					key: 'chinese_name',
					label: '中文姓名',
					type: 'input'
				},
				{
					key: 'certificate_code',
					label: '证件号码',
					type: 'input'
				},

				{
					key: 'sex',
					label: '性别',
					type: 'select',
					options: [
						{ label: '男', value: '男' },
						{ label: '女', value: '女' },
					]
				},
				{
					key: 'nationality',
					label: '国籍',
					type: 'select',
					options: mapToArray(MAP.nationality,'string')
				},

				// {
				// 	key: 'input',
				// 	label: '录入时间',
				// 	type: 'datePicker'
				// },
				// {
				// 	key: 'is_front_operator',
				// 	label: '是否前端操作员',
				// 	type: 'select',
				// 	options: [
				// 		{ label: '是', value: true },
				// 		{ label: '否', value: false },
				// 	]
				// },
			],
			tableDataCount: 0,
			pagesizes: defaultSettings.pageSizes,
			pagesize: defaultSettings.pageSizes[0],
			pageindex: 1,
			tableData: [],
			columns: [
				{ prop: 'trade_type', label: '行业类别', formatter: (row, col, cell) => MAP.trade_type[cell] },
				{ prop: 'enterprise', label: '企业名称' },
				// { prop: 'abroad_employeeid', label: '人员编号', },
				{ prop: 'last_name', label: '英文姓', },
				{ prop: 'first_name', label: '英文名', },
				{ prop: 'chinese_name', label: '中文姓名', },
				{ prop: 'certificate_code', label: '证件号码' },
				{ prop: 'sex', label: '性别', },
				{ prop: 'nationality', label: '国籍', },
				{ prop: 'state', label: '在职状态', formatter: (row, col, cell) => MAP.employeeState[cell] },
				{ prop: 'input_time', label: '录入时间', },
			],
			dialogVisible: false,
			submitDisabled: false,
			flag: 'add',
			addEditForm: {

			},
			addEditformItems: {
				'证件信息': [
					{ key: 'last_name', label: '英文姓', type: 'input' },
					{ key: 'first_name', label: '英文名', type: 'input' },
					{ key: 'chinese_name', label: '中文姓名', type: 'input' },
					{
						key: 'certificate_type',
						label: '证件类型',
						type: 'select',
						options: mapToArray(MAP.certificate_type)
					},
					{ key: 'certificate_code', label: '证件号码', type: 'input' },
					{
						key: 'sex',
						label: '性别',
						type: 'select',
						options: [
							{ label: '男', value: '男' },
							{ label: '女', value: '女' }
						]
					},
					{ key: 'birthday', label: '出生日期', type: 'datePicker' },
					{ key: 'nationality', label: '国籍', type: 'select', options: mapToArray(MAP.nationality,'string') },
					{ key: 'province_city', label: '户籍省县', type: 'input' },
					{ key: 'detail_address', label: '户籍地详细地址', type: 'input' },

				],
				'居住信息': [
					{ key: 'actual_live_city', label: '现住址行政区划', type: 'input' },
					{ key: 'actual_live_code', label: '居住证号码', type: 'input' },
					{ key: 'actual_live_address', label: '现住址', type: 'input' },
				],
				'管理信息': [
					{ key: 'trade_type', label: '行业类别', type: 'select', options: mapToArray(MAP.trade_type) },
					{ key: 'enterprise', label: '企业名称', type: 'input' },
					{
						key: 'is_front_operator', label: '是否前端操作员', type: 'select', options: [{ label: '是', value: true },
						{ label: '否', value: false },]
					},
					{ key: 'employee_type', label: '人员类别', type: 'select', options: mapToArray(MAP.employee_type) },
					{ key: 'induction_date', label: '入职日期', type: 'datePicker' },
					{ key: 'telephone', label: '联系电话', type: 'input' },
					{ key: 'urgent_telephone', label: '紧急联系人', type: 'input' },
				]
			}
		};
	},
	created() {
		this.getList()
	},
	computed: {
		dialogTittle() {
			let tittle = '';
			switch (this.flag) {
				case 'edit':
					tittle = '编辑';
					break;
				case 'add':
					tittle = '新增';
					break;
				case 'detail':
					tittle = '详情';
					break;
			}

			return tittle;
		}
	},
	methods: {
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
			const { data, size } = await API.list({
				index: this.pager.pageindex,
				size: this.pager.pagesize
			}, params)
			this.tableData = data
			this.tableDataCount = size
		},
		handleDetail(index, row) {
			this.addEditForm = row
			this.flag = 'detail'
			this.dialogVisible = true
		},
		handleReset() {
			this.queryForm = {}
			this.pager.pageindex = 1
			this.getList()
		},
		handleEdit(idx, row) {
			this.flag = 'edit'
			this.addEditForm = { ...row };
			this.dialogVisible = true
		},
		handlePerson() { },
		handleDelete(idx, { abroad_employeeid }) {
			this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					API.delete({
						abroad_employeeid
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

		},
		handleCancel() {
			this.dialogVisible = false;
		},
		handleSizeChange(pagesize) {
			this.pager.pagesize = pagesize
			this.getList()
		},
		handleCurrentChange(pageindex) {
			this.pager.pageindex = pageindex
			this.getList()
		},

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
