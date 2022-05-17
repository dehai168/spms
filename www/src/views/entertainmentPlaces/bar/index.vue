<template>
	<div class="ktv-container">
		<el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 150px; margin-bottom: 10px">
			<el-form ref="form" :model="queryForm" label-width="140px">
				<el-form-item v-for="formItem in formItems" style="width: 30%" :key="formItem.key" :label="formItem.label">
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
		<div class="ktv-body" style="padding: 5px">
			<el-button @click="handleAdd" icon="el-icon-plus" style="margin-bottom: 10px" type="primary">新增</el-button>
			<div style="height: calc(100vh - 360px)">
				<el-table :data="tableData" border height="100%">
					<el-table-column v-for="column in columns" :show-overflow-tooltip="true" :key="column.prop" v-bind="column" />
					<el-table-column prop="operate" label="操作" width="200" fixed="right">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
							<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="text" size="small" @click="handlePerson(scope.$index, scope.row)">从业人员</el-button>
							<el-button slot="reference" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pager.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
			</el-footer>
		</div>
		<el-dialog class="hotel-base-add" :title="dialogTittle" :visible.sync="dialogVisible" width="70%" dest top="4vh" @close="addEditForm = {}" destroy-on-close :close-on-click-modal="false">
			<el-form ref="addEditForm" :model="addEditForm" label-width="120px" :inline="true" :disabled="flag == 'detail'">
				<my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
					<el-form-item v-for="formItem in cardItem" :key="formItem.key" :label="formItem.label">
						<el-select v-if="formItem.type == 'select'" :disabled="formItem.disabled" v-model="addEditForm[formItem.key]" style="width: 150px" placeholder="请选择">
							<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
						</el-select>
						<el-input v-else-if="formItem.type == 'input'" :disabled="formItem.disabled" v-model="addEditForm[formItem.key]" style="width: 150px" />
						<el-input v-else-if="formItem.type == 'textarea'" :disabled="formItem.disabled" v-model="addEditForm[formItem.key]" type="textarea" style="width: 500px" />
						<el-date-picker v-else-if="formItem.type == 'datePicker'" :disabled="formItem.disabled" v-model="addEditForm[formItem.key]" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
						<el-radio-group v-else-if="formItem.type == 'radio'" :disabled="formItem.disabled" v-model="addEditForm[formItem.key]">
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
				pagesize: 20
			},
			submitDisabled: false,
			flag: '',
			queryForm: {

			},
			detail: {},
			addEditForm: {},
			addEditformItems: {
				'场所基本信息': [
					{ label: '酒吧编号', key: 'barid', type: 'input', disabled: true },
					{ label: '行业类别', key: 'trade_type', options: mapToArray(MAP.entertainment_type), type: 'select' },
					{ label: '治安管理机构', key: 'security_manage_unit', type: 'select', options: mapToArray(MAP.jurisdiction_unit, 'string') },
					{ label: '场所分类', key: 'place_main_type', type: 'input' },
					{ label: '场所分类（副）', key: 'place_vice_type', type: 'input' },
					{ label: '场所备案编号', key: 'record_code', type: 'input' },
					{ label: '娱乐场所名称', key: 'recreation_place_name', type: 'input' },
					{ label: '简称', key: 'recreation_place_short', type: 'input' },
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
					{ label: '户外悬挂', key: 'outdoor_hang', type: 'input' },
					{ label: '联系电话', key: 'telephone', type: 'input' },
					{ label: '邮政编码', key: 'post_code', type: 'input' },
					{ label: '传真', key: 'fax', type: 'input' },
					{ label: '经济类型', key: 'economic_type', options: mapToArray(MAP.economic_type), type: 'select' },
					{ label: '注册资金（万元）', key: 'register_cost', type: 'input' },
					{ label: '经营范围（主营）', key: 'operate_scale', type: 'input' },
					{ label: '经营范围（兼营）', key: 'concurrently_scale', type: 'input' },
					{ label: '经营面积', key: 'operate_area', type: 'input' },
					{ label: '法定代表人姓名', key: 'legal_person', type: 'input' },
					{ label: '法人证件类型', key: 'legal_certificate_type', options: mapToArray(MAP.legal_certificate_type), type: 'select' },
					{ label: '法人证件号码', key: 'legal_certificate_code', type: 'input' },
					{ label: '法人联系方式', key: 'legal_telephone', type: 'input' },
					{ label: '开业日期', key: 'open_date', type: 'input' },
					{ label: '营业时间', key: 'operate_time', type: 'input' },
					{ label: '单位负责人', key: 'chief_person', type: 'input' },
					{ label: '单位负责人联系方式', key: 'chief_telephone', type: 'input' },
					{ label: '单位负责人身份证号', key: 'chief_certificate_code', type: 'input' },
					{ label: '娱乐服务场所治安级别', key: 'security_level', options: mapToArray(MAP.security_level), type: 'select' },
					{ label: '营业执照编号', key: 'license_code', type: 'input' },
					{ label: '营业执照发证机关', key: 'license_org', type: 'input' },
					{ label: '营业执照起始日期', key: 'license_begin', type: 'datePicker' },
					{ label: '营业执照截止日期', key: 'license_end', type: 'datePicker' },
					{ label: '营业执照登记日期', key: 'license_register_date', type: 'datePicker' },
					{ label: '组织机构代码', key: 'group_code', type: 'input' },
					{
						label: '是否有证', key: 'is_permit', options: [
							{ label: '是', value: true },
							{ label: '否', value: false },
						], type: 'select'
					},
					{ label: '娱乐经营许可证号', key: 'permit_code', type: 'input' },
					{ label: '娱乐经营许可证发证机关', key: 'permit_org', type: 'input' },
					{ label: '娱乐经营许可证起始日期', key: 'permit_begin', type: 'datePicker' },
					{ label: '娱乐经营许可证截止日期', key: 'permit_end', type: 'datePicker' },
					{ label: '股东情况', key: 'shareholders', type: 'input' },
					// { label: '娱乐项目内容', key: '营业性娱乐场所' ,type: 'input'},
				],
				'场地设备及人员情况': [
					{ label: '消防合格证号', key: 'fire_qualify_code', type: 'input' },
					{ label: '消防审核单位', key: 'fire_check_unit', type: 'input' },
					{ label: '经度', key: 'lng', type: 'input' },
					{ label: '纬度', key: 'lat', type: 'input' },
					{ label: '核定消费者数量（人）', key: 'max_consumers', type: 'input' },
					{ label: '安全出口数量（个）', key: 'exit_total', type: 'input' },
					{ label: '包厢包间数量（个）', key: 'rooms', type: 'input' },
					{ label: '总人数（人）', key: 'persons', type: 'input' },
					{ label: '治安负责人', key: 'security_chief_person', type: 'input' },
					{ label: '保安人数（人）', key: 'security_persons', type: 'input' },
					{ label: '经岗位培训人数（人）', key: 'post_train_persons', type: 'input' },
					{ label: '保安公司意见', key: 'security_unit_opinion', type: 'input' },
					{ label: '备注', key: 'remark', type: 'input' },
					{ label: '录入时间', key: 'input_time', type: 'datePicker' },
				]
			},
			formItems: [
				// {
				// 	key: 'trade_type',
				// 	label: '场所分类',
				// 	type: 'select',
				// 	options: mapToArray(MAP.entertainment_type)
				// },
				{
					key: 'security_manage_unit',
					label: '治安管理机构',
					type: 'select',
					options: mapToArray(MAP.jurisdiction_unit, 'string')
				},
				{
					key: 'recreation_place_name',
					label: '场所名称',
					type: 'input'
				},
				// {
				// 	key: 'license_code',
				// 	label: '营业执照号',
				// 	type: 'input'
				// },
				// {
				// 	key: 'legal_person',
				// 	label: '法人姓名',
				// 	type: 'input'
				// },
				// {
				// 	key: 'operate_address',
				// 	label: '经营地址',
				// 	type: 'input'
				// },
				// {
				// 	key: 'economic_type',
				// 	label: '经济类型',
				// 	type: 'select',
				// 	options: mapToArray(MAP.economic_type)
				// },
				{
					key: 'recreation_place_state',
					label: '场所状态',
					type: 'select',
					options: mapToArray(MAP.recreation_place_state)
				},
				{
					key: 'security_level',
					label: '治安级别',
					type: 'select',
					options: mapToArray(MAP.security_level)
				},
				// {
				// 	key: 'reg',
				// 	label: '登记日期',
				// 	type: 'datePicker'
				// },
				// {
				// 	key: 'legalPerson',
				// 	label: '装机状态',
				// 	type: 'input'
				// }, 
				{
					key: 'input',
					label: '录入时间',
					type: 'datePicker'
				},
				{
					key: 'recreation_place_short',
					label: '简称',
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
				// {
				// 	key: 'outdoor_hang',
				// 	label: '户外悬挂',
				// 	type: 'input'
				// },
				// {
				// 	key: 'businessType',
				// 	label: '娱乐项目内容',
				// 	type: 'select',
				// 	options: [
				// 		{ label: '迪吧', value: 1 },
				// 		{ label: '大众卡拉OK（200平米下）', value: 2 },
				// 		{ label: '量贩', value: 3 },
				// 		{ label: '演艺', value: 4 },
				// 		{ label: '商务KTV', value: 5 },
				// 		{ label: '大众舞厅', value: 6 },
				// 		{ label: '电子游艺', value: 7 },
				// 		{ label: '酒吧', value: 8 },
				// 	]
				// },

			],
			tableDataCount: 0,
			pagesizes: defaultSettings.pageSizes,
			pagesize: defaultSettings.pageSizes[0],
			pageindex: 1,
			tableData: [],
			columns: [
				{ prop: 'recreation_place_name', label: '娱乐场所名称', },
				{ prop: 'recreation_place_short', label: '简称', },
				{ prop: 'place_main_type', label: '场所主分类', },
				{ prop: 'record_code', label: '备案登记号' },
				{ prop: 'recreation_place_state', label: '场所状态', formatter: (row, col, cell) => MAP.recreation_place_state[cell], width: 100 },
				{ prop: 'security_level', label: '治安级别', formatter: (row, col, cell) => MAP.security_level[cell], width: 100 },
				{ prop: 'persons', label: '总人数', width: 80 },
				{ prop: 'check_state', label: '核查状态', width: 120, formatter: (row, column, cellValue, index) => MAP.check_state[cellValue] },
				{ prop: 'iscase', label: '是否涉案', width: 80, formatter: (row, column, cellValue, index) => MAP.iscase[cellValue] },
				{ prop: 'security_manage_unit', label: '治安管理机构', formatter: (row, col, cell) => MAP.jurisdiction_unit[cell] },
			],
			dialogVisible: false
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
		handlePerson(index, row) {
			this.$router.push({ path: '/basicinfo/employees/domestic', query: { enterprise: row.recreation_place_name, enterprise_id: row.barid } });
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
		handleDetail(index, row) {
			this.addEditForm = row
			this.flag = 'detail'
			this.dialogVisible = true
		},
		handleEdit(index, row) {
			this.flag = 'edit'
			this.addEditForm = { ...row };
			this.dialogVisible = true
		},
		handleDelete(idx, { barid }) {
			this.$confirm('此操作将删除该信息且不可恢复, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					API.delete({
						barid
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
		handleSearch() { },
		handleReset() {
			this.queryForm = {}
			this.pager.pageindex = 1
			this.getList()
		},
		handleAdd() {
			this.flag = 'add'
			this.dialogVisible = true
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
.el-form {
	max-height: 600px;
	overflow: auto;
}
</style>
