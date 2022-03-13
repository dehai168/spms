<template>
	<div class="ktv-container">
		<el-form ref="form" :model="queryForm" label-width="140px">
			<el-form-item v-for="formItem in formItems" :key="formItem.key" :label="formItem.label">
				<el-select v-if="formItem.type == 'select'" v-model="queryForm[formItem.key]" placeholder="请选择">
					<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
				</el-select>
				<el-input v-else-if="formItem.type == 'input'" v-model="queryForm[formItem.key]" />
				<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="queryForm[formItem.key]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="handleSearch">搜索</el-button>
				<el-button>重置</el-button>
			</el-form-item>
		</el-form>
		<div class="ktv-body">
			<el-button @click="dialogVisible = true">新增</el-button>
			<el-table :data="tableData" border>
				<el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" />
				<el-table-column prop="operate" label="操作" width="200" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
						<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)" disabled>编辑</el-button>
						<el-popconfirm title="确定删除此旅馆吗？" icon="el-icon-info" icon-color="red" style="margin-left: 10px">
							<el-button slot="reference" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
			</el-footer>
		</div>
		<el-dialog class="hotel-base-add" :title="dialogTittle" :visible.sync="dialogVisible" width="70%" top="4vh" :close-on-click-modal="false">
			<el-form ref="addEditForm" :model="addEditForm" label-width="120px" :inline="true" :disabled="flag == 'detail'">
				<my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
					<el-form-item v-for="formItem in cardItem" :key="formItem.key" :label="formItem.label">
						<el-select v-if="formItem.type == 'select'" v-model="addEditForm[formItem.key]" style="width: 150px" placeholder="请选择">
							<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
						</el-select>
						<el-input v-else-if="formItem.type == 'input'" v-model="addEditForm[formItem.key]" style="width: 150px" />
						<el-input v-else-if="formItem.type == 'textarea'" v-model="addEditForm[formItem.key]" type="textarea" style="width: 500px" />
						<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="addEditForm[formItem.key]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
						<el-radio-group v-else-if="formItem.type == 'radio'" v-model="addEditForm[formItem.key]">
							<el-radio v-for="option in formItem.options" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
					<!-- 标准地址根据用户选择 显示   这里单独处理 -->
					<el-form-item v-if="index === 0 && addEditForm.hasStandard == 1" label="标准经营地址">
						<el-input v-model="addEditForm.standardAddress" style="width: 150px" />
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

export default {
	data() {
		return {
			queryForm: {
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
					label: '行业类别',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '治安管辖机构',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '企业名称',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '英文姓',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '英文名',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '国籍',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '证件号码',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '出生日期',
					type: 'datePicker'
				},
				{
					key: 'enterpriseCode',
					label: '招牌名称',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '人员编号',
					type: 'input'
				},
				{
					key: 'industry',
					label: '性别',
					type: 'select',
					options: [
						{ label: '男', value: 1 },
						{ label: '女', value: 2 },
					]
				},
				{
					key: 'licenseIssueDate',
					label: '录入时间',
					type: 'datePicker'
				},
				{
					key: '在职状态',
					label: '在职状态',
					type: 'input'
				}, {
					key: 'licenseIssueDate',
					label: '是否前端操作员',
					type: 'datePicker'
				},
			],
			tableDataCount: 0,
			pagesizes: defaultSettings.pageSizes,
			pagesize: defaultSettings.pageSizes[0],
			pageindex: 1,
			tableData: new Array(10).fill({
				行业类别: '测试数据',
				企业名称: '测试数据',
				人员编号: '测试数据',
				英文姓: '测试数据',
				英文名: '测试数据',
				证件号码: '测试数据',
				性别: '测试数据',
				国籍: '测试数据',
				录入时间: '测试数据',
				在职状态: '测试数据',
			}),
			columns: [
				{ prop: '行业类别', label: '行业类别', },
				{ prop: '企业名称', label: '企业名称' },
				{ prop: '人员编号', label: '人员编号', },
				{ prop: '英文姓', label: '英文姓', },
				{ prop: '英文名', label: '英文名', },
				{ prop: '证件号码', label: '证件号码' },
				{ prop: '性别', label: '性别', },
				{ prop: '国籍', label: '国籍', },
				{ prop: '录入时间', label: '录入时间', },
				{ prop: '在职状态', label: '在职状态', },

			],
			dialogVisible: false,
			submitDisabled: false,
			flag: 'add',
			addEditForm: {

			},
			addEditformItems: {

				'证件信息': [
					{ key: 'enterpriseCode', label: '姓名', type: 'input' },
					{
						key: 'businessStatus',
						label: '证件类型',
						type: 'select',
						options: [
							{ label: '身份证', value: '1' },
						]
					},
					{ key: 'signboardName', label: '证件号码', type: 'input' },
					{
						key: 'industry',
						label: '性别',
						type: 'select',
						options: [
							{ label: '男', value: 1 },
							{ label: '女', value: 2 }
						]
					},

					{ key: 'signboardName', label: '出生日期', type: 'datePicker' },
					{
						key: 'industry',
						label: '民族',
						type: 'select',
						options: [
							{ label: '汉族', value: 1 },
						]
					},
					{ key: 'area', label: '民族', type: 'input' },
					{ key: '传真', label: '户籍省县', type: 'input' },
					{ key: '房间数', label: '户籍地详细地址', type: 'input' },

				],
				'居住信息': [
					{ key: 'companyName', label: '现住址行政区划', type: 'input' },
					{ key: 'unifiedSocialCreditCode', label: '居住证号码', type: 'input' },
					{ key: 'companyName', label: '现住址', type: 'input' },
				],
				'管理信息': [
					{ key: '单位负责人', label: '行业类别', type: 'input' },
					{ key: '负责人证件号码', label: '企业名称', type: 'input' },
					{ key: '负责人联系电话', label: '是否前端操作员', type: 'input' },
					{ key: '安保负责人', label: '人员类别', type: 'input' },
					{ key: '安保负责人证件号码', label: '入职日期', type: 'datePicker' },
					{ key: '安保负责人联系电话', label: '联系电话', type: 'input' },
					{ key: '消防意见书发放日期', label: '紧急联系人', type: 'datePicker' },
					{ key: '消防合格证号', label: '紧急联系电话', type: 'input' },
					{ key: '消防审核单位', label: '备注', type: 'input' },
				]
			}
		};
	},
	computed: {
		dialogTittle() {
			let tittle = '';
			switch (this.flag) {
				case 'edit':
					tittle = '编辑旅馆信息';
					break;
				case 'add':
					tittle = '新增旅馆信息';
					break;
				case 'detail':
					tittle = '旅馆信息详情';
					break;
			}

			return tittle;
		}
	},
	methods: {
		handleDetail(index, row) {
			this.dialogVisible = true
		},
		handleEdit() { },
		handlePerson() { },
		handleDelete() { },
		handleSearch() { },
		handleReset() { },
		handleAdd() {

		},
		handleSubmit() {

		},
		handleCancel() {
			this.dialogVisible = false;
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
.ktv-container {
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

	.ktv-body {
	}
}
.el-descriptions {
	margin-top: 20px;
}
</style>
