<template>
	<div class="seal-list-container">
		<el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 150px">
			<el-form ref="form" :model="queryForm" label-width="140px">
				<el-form-item v-for="formItem in formItems" :key="formItem.key" style="width: 30%" :label="formItem.label">
					<el-select v-if="formItem.type == 'select'" v-model="queryForm[formItem.key]" style="width: 14vw" placeholder="请选择">
						<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
					</el-select>
					<el-input v-else-if="formItem.type == 'input'" v-model="queryForm[formItem.key]" style="width: 14vw" />
					<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="queryForm[formItem.key]" style="width: 14vw" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="getList" icon="el-icon-search">搜索</el-button>
					<el-button @click="handleReset" icon="el-icon-delete">重置</el-button>
				</el-form-item>
			</el-form>
		</el-header>

		<div class="main" style="padding: 5px">
			<el-button @click="handleCreate" type="primary" icon="el-icon-plus" style="margin: 10px 0">新增</el-button>
			<Import @success="getList" path="pawns"></Import>
			<div style="height: calc(100vh - 360px)">
				<el-table :data="tableData" border height="100%">
					<el-table-column v-for="column in columns" :key="column.prop" v-bind="column" :show-overflow-tooltip="true" />
					<el-table-column prop="operate" label="操作" width="200" fixed="right">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row, 'detail')">详情</el-button>
							<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row, 'edit')">编辑</el-button>
							<el-button type="text" size="small" @click="handlePerson(scope.$index, scope.row)">从业人员</el-button>

							<el-button slot="reference" type="text" size="small" @click="handleRemove(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pager.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
		</el-footer>

		<Detail ref="detalDialog" :dialogTittle="dialogTittle" :flag="flag" :dialogVisible.sync="dialogVisible" @submit="handleSubmit" :submitDisabled="submitDisabled" :addEditformItems="addEditformItems"></Detail>
	</div>
</template>

<script>
import defaultSettings from '@/settings'
import API from '@/api/pawn'
import { formatDate } from '@/utils/index'
import MAP from '@/const/map'
import mapToArray from '@/utils/mapToArray'
export default {
	data() {
		return {
			dialogVisible: false,
			pagesizes: defaultSettings.pageSizes,
			tableDataCount: 0,
			queryForm: {

			},
			pager: {
				pageindex: 1,
				pagesize: 20
			},
			formItems: [
				{
					key: 'police_unit',
					label: '管辖派出所',
					type: 'select',
					options: mapToArray(MAP.jurisdiction_unit, 'string')
				},
				{
					key: 'enterprise',
					label: '企业名称',
					type: 'input',
				},
				{
					key: 'credit_code',
					label: '统一社会信用代码',
					type: 'input',
				},
				{
					key: 'enterprise_code',
					label: '企业编码',
					type: 'input'
				},
				{
					key: 'legal_person',
					label: '法人姓名',
					type: 'input'
				},
				{
					key: 'check_state',
					label: '核查状态',
					type: 'select',
					options: mapToArray(MAP.check_state)
				},
				{
					key: 'iscase',
					label: '是否涉案',
					type: 'select',
					options: mapToArray(MAP.iscase)
				},
				{
					key: 'business_state',
					label: '营业状态',
					type: 'select',
					options: mapToArray(MAP.business_state)
				},
			],
			tableData: [],
			columns: [
				{ prop: 'enterprise', label: '企业名称', width: 200 },
				{ prop: 'credit_code', label: '统一社会信用代码', width: 200 },
				{ prop: 'enterprise_code', label: '企业编码', minWidth: 140 },
				{ prop: 'legal_person', label: '法人姓名', minWidth: 80 },
				{ prop: 'enterprise_telephone', label: '联系电话', width: 100 },
				{ prop: 'business_state', label: '营业状态', width: 80, formatter: (row, col, cell) => MAP.business_state[cell] },
				{ prop: 'sign_name', label: '招牌名称', width: 200 },
				{ prop: 'police_unit', label: '管辖单位', width: 180, formatter: (row, col, cell) => MAP.jurisdiction_unit[cell] },
				{ prop: 'check_state', label: '核查状态', width: 120, formatter: (row, column, cellValue, index) => MAP.check_state[cellValue] },
				{ prop: 'iscase', label: '是否涉案', width: 80, formatter: (row, column, cellValue, index) => MAP.iscase[cellValue] },
				// { prop: 'logout', label: '注销状态', width: 80 },
				// { prop: 'licenseStatus', label: '许可证状态', width: 80 },
				// { prop: 'licenseIssueDate', label: '许可证发证日期', width: 180 },
				{ prop: 'input_time', label: '录入时间', width: 130 },
				// { prop: 'origin', label: '数据来源', width: 80 }
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
							options: mapToArray(MAP.business_state)
						},
						{
							key: 'trade_type',
							label: '行业分类',
							type: 'select',
							options: mapToArray(MAP.pawn_trade_type)
						},
						{ key: 'enterprise_code', label: '企业编码', type: 'input' },
					],
					[

						{ key: 'sign_name', label: '招牌名称', type: 'input' },
						{ key: 'area', label: '占地面积（平米）', type: 'input' },
						{ key: 'fax', label: '传真', type: 'input' },
					],

					[
						{
							key: 'record_police_unit',
							label: '许可备案公安机关',
							type: 'input',
						},
						{
							key: 'check_state',
							label: '核查状态',
							type: 'select',
							options: mapToArray(MAP.check_state)
						},
						{
							key: 'iscase',
							label: '是否涉案',
							type: 'select',
							options: mapToArray(MAP.iscase)
						},
					],

					[
						{
							key: 'police_unit',
							label: '管辖单位',
							type: 'select',
							options: mapToArray(MAP.jurisdiction_unit),
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
							options: mapToArray(MAP.district, 'string')
						},
					],
					[
						{
							key: 'economic_type',
							label: '经济类型',
							type: 'select',
							options: mapToArray(MAP.economic_type)
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
							options: mapToArray(MAP.legal_certificate_type)
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
	watch: {
		addEditForm: {
			handler(val) {
				if (this.$refs.detalDialog) {
					this.$refs.detalDialog.addEditForm = val
				}
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		handleDetail(index, row) {

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
			const { data, size } = await API.list({
				index: this.pager.pageindex,
				size: this.pager.pagesize
			}, params)
			this.tableData = data
			this.tableDataCount = size
		},

		handlePerson(index, row) {
			this.$router.push({ path: '/basicinfo/employees/domestic', query: { enterprise: row.enterprise, enterprise_id: row.pawnid } });
		},
		handleDelete() { },
		handleSearch() { },
		handleReset() {
			this.queryForm = {}
			this.pager.pageindex = 1
			this.getList()
		},
		handleAdd() {

		},
		handleRemove(index, row) {
			this.removeData(row.pawnid)
		},
		removeData(pawnid) {
			this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					API.delete({
						pawnid
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
		handleEdit(index, row, flag) {
			this.formClear(flag, false);
			this.addEditForm = { ...row, is_standard_address: +row.is_standard_address };
			this.dialogVisible = true;
		},
		handleSubmit(addEditForm) {
			this.submitDisabled = true // 防止重复提交

			const { fire_opinion_date, is_standard_address, ...rest } = addEditForm;
			const requestData = {
				fire_opinion_date: formatDate('date', fire_opinion_date),
				is_standard_address: !!is_standard_address,
				...rest
			};
			if (this.flag === 'add') {
				API.add(requestData)
					.then(res => {
						if (res.code === 200) {
							if (res.data) {
								this.$message({
									message: '操作成功!',
									type: 'success'
								})
								this.dialogVisible = false
								this.getList()
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
				API.update(requestData)
					.then(res => {
						if (res.code === 200) {
							if (res.data) {
								this.$message({
									message: '操作成功!',
									type: 'success'
								})
								this.dialogVisible = false
								this.getList()
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
.seal-list-container {
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

	.seal-list-body {
	}
}

.hotel-base-add {
	.el-form {
		max-height: 600px;
		overflow: auto;
	}
}
</style>
