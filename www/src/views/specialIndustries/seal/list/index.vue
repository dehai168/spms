<template>
	<div class="seal-list-container">
		<el-form ref="form" :model="queryForm" label-width="140px">
			<el-form-item v-for="formItem in formItems" :key="formItem.key" :label="formItem.label">
				<el-select v-if="formItem.type == 'select'" v-model="queryForm[formItem.key]" style="width: 14vw" placeholder="请选择">
					<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
				</el-select>
				<el-input v-else-if="formItem.type == 'input'" v-model="queryForm[formItem.key]" style="width: 14vw" />
				<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="queryForm[formItem.key]" style="width: 14vw" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="getList">搜索</el-button>
				<el-button @click="handleReset">重置</el-button>
			</el-form-item>
		</el-form>
		<div class="seal-list-body">
			<el-button @click="handleCreate">新增</el-button>
			<el-table :data="tableData" border>
				<el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" :formatter="column.formatter" />
				<el-table-column prop="operate" label="操作" width="200" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row, 'detail')">详情</el-button>
						<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row, 'edit')">编辑</el-button>
						<el-button type="text" size="small" @click="handlePerson(scope.$index, scope.row)">从业人员</el-button>

						<el-button slot="reference" type="text" size="small" @click="handleRemove(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pager.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
			</el-footer>
		</div>
		<el-dialog class="hotel-base-add" :title="dialogTittle" :visible.sync="dialogVisible" width="70%" top="4vh" :close-on-click-modal="false">
			<el-form ref="addEditForm" :model="addEditForm" label-width="8.5vw" :inline="true" label-suffix=":" :disabled="flag == 'detail'">
				<div style="display: flex; justify-content: space-around">
					<el-form-item label="申报方式" required>
						<el-radio-group v-model="addEditForm.declare_type">
							<el-radio :label="0">告知承诺制</el-radio>
							<el-radio :label="1">一般审批制</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="工商类型" required>
						<el-radio-group v-model="addEditForm.business_type">
							<el-radio :label="0">个体工商户</el-radio>
							<el-radio :label="1">工商企业</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>

				<my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
					<el-row v-for="(row, rowIndex) in cardItem" :key="rowIndex">
						<el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 8">
							<el-form-item v-if="formItem.type !== 'standard_address'" :label="formItem.label">
								<el-select v-if="formItem.type == 'select'" v-model="addEditForm[formItem.key]" style="width: 12vw" placeholder="请选择">
									<el-option v-for="option in formItem.options" :key="option.value" :value="formItem.key == 'district' ? option.value : +option.value" :label="option.label" />
								</el-select>
								<el-input v-else-if="formItem.type == 'input'" v-model="addEditForm[formItem.key]" style="width: 12vw" />
								<el-input v-else-if="formItem.type == 'textarea'" v-model="addEditForm[formItem.key]" type="textarea" style="width: 500px" />
								<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="addEditForm[formItem.key]" style="width: 12vw" type="date" placeholder="请选择日期" />
								<el-radio-group v-else-if="formItem.type == 'radio'" v-model="addEditForm[formItem.key]">
									<el-radio v-for="option in formItem.options" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
								</el-radio-group>
							</el-form-item>
							<!-- 标准地址根据用户选择 显示   这里单独处理 -->
							<el-form-item v-else-if="formItem.type == 'standard_address' && addEditForm.is_standard_address == 1" :label="formItem.label">
								<el-input v-model="addEditForm.standard_address" style="width: 12vw" />
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
	</div>
</template>

<script>
import defaultSettings from '@/settings'
import API from './api'
import { formatDate } from '@/utils/index'
import MAP from '../../../../const/map'
import mapToArray from '../../../../utils/mapToArray'
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
				pagesize: 10
			},
			formItems: [
				{
					key: 'police_unit',
					label: '管辖派出所',
					type: 'input',
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
					key: 'business_state',
					label: '营业状态',
					type: 'select',
					options: mapToArray(MAP.business_state)
				},
			],
			tableData: [],
			columns: [
				{ prop: 'police_unit', label: '管辖单位', width: 180 },
				{ prop: 'enterprise_code', label: '企业编码', width: 80 },
				{ prop: 'enterprise', label: '企业名称', width: 100 },
				{ prop: 'sign_name', label: '招牌名称', width: 180 },
				{ prop: 'legal_person', label: '法人姓名', width: 80 },
				{ prop: 'credit_code', label: '社会信用代码', width: 100 },
				{ prop: 'enterprise_telephone', label: '联系电话', width: 100 },
				{ prop: 'business_type', label: '工商类型', width: 80, formatter: (row, col, cell) => MAP.business_type[cell] },
				{ prop: 'trade_type', label: '行业类别', width: 80, formatter: (row, col, cell) => MAP.seal_trade_type[cell] },
				{ prop: 'business_state', label: '营业状态', width: 80, formatter: (row, col, cell) => MAP.business_state[cell] },
				// { prop: 'logout', label: '注销状态', width: 80 },
				// { prop: 'licenseStatus', label: '许可证状态', width: 80 },
				// { prop: 'licenseIssueDate', label: '许可证发证日期', width: 180 },
				{ prop: 'input_time', label: '录入时间', width: 180 },
				{ prop: 'origin', label: '数据来源', width: 80 }
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
							options: mapToArray(MAP.seal_trade_type)
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
							type: 'select',
							options: [
								{ label: '公安1', value: 1 }
							]
						},

					],

					[
						{
							key: 'police_unit',
							label: '管辖单位',
							type: 'input',
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
						{ key: 'standard_address', label: '标准经营地址', type: 'standard_address' },

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
							options: mapToArray(MAP.district)
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

		handlePerson() { },
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
			this.removeData(row.seal_engrave_unitid)
		},
		removeData(seal_engrave_unitid) {
			this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					API.delete({
						seal_engrave_unitid
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
		handleSubmit() {
			this.submitDisabled = true // 防止重复提交

			const { fire_opinion_date, is_standard_address, ...rest } = this.addEditForm;
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
			flex-basis: 25%;
			.el-form-item__content > .el-input {
				width: 78%;
			}
		}
	}

	.seal-list-body {
	}
}
</style>
