<template>
	<div class="ktv-container">
		<el-form ref="form" :model="form" label-width="140px">
			<el-form-item v-for="formItem in formItems" :key="formItem.key" :label="formItem.label">
				<el-select v-if="formItem.type == 'select'" v-model="form[formItem.key]" placeholder="请选择">
					<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
				</el-select>
				<el-input v-else-if="formItem.type == 'input'" v-model="form[formItem.key]" />
				<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="form[formItem.key]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="handleSearch">搜索</el-button>
				<el-button>重置</el-button>
			</el-form-item>
		</el-form>
		<div class="ktv-body">
			<!-- <el-button @click="dialogVisible = true">新增</el-button> -->
			<el-table :data="tableData">
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
		</div>
		<el-dialog title="详情" :visible.sync="dialogVisible" width="60%" top="10px">
			<el-tabs type="card" :value="1">
				<el-tab-pane label="场所信息" :name="1">
					<el-descriptions title="场所基本信息" border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in placeInfo.baseInfo" :label="item.label" :key="idx">
							{{ item.value }}
						</el-descriptions-item>
					</el-descriptions>
					<el-descriptions title="场地设备及人员情况" border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in placeInfo.deviceInfo" :label="item.label" :key="idx">
							{{ item.value }}
						</el-descriptions-item>
					</el-descriptions>
				</el-tab-pane>
				<el-tab-pane label="备案信息" :name="2">
					<el-descriptions title="场所基本信息" border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in placeInfo.baseInfo" :label="item.label" :key="idx">
							{{ item.value }}
						</el-descriptions-item>
					</el-descriptions>
					<el-descriptions title="场地设备及人员情况" border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in placeInfo.deviceInfo" :label="item.label" :key="idx">
							{{ item.value }}
						</el-descriptions-item>
					</el-descriptions>
				</el-tab-pane>
			</el-tabs>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>


export default {
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
			placeInfo: {
				baseInfo: [
					{ label: '行业类别', value: '营业性娱乐场所' },
					{ label: '治安管理机构', value: '营业性娱乐场所' },
					{ label: '场所分类', value: '营业性娱乐场所' },
					{ label: '场所分类（副）', value: '营业性娱乐场所' },
					{ label: '场所备案编号', value: '营业性娱乐场所' },
					{ label: '娱乐场所名称', value: '营业性娱乐场所' },
					{ label: '娱乐场所简称', value: '营业性娱乐场所' },
					{ label: '户外悬挂', value: '营业性娱乐场所' },
					{ label: '联系电话', value: '营业性娱乐场所' },
					{ label: '邮政编码', value: '营业性娱乐场所' },
					{ label: '传真', value: '营业性娱乐场所' },
					{ label: '经济类型', value: '营业性娱乐场所' },
					{ label: '注册资金（万元）', value: '营业性娱乐场所' },
					{ label: '经营范围（主营）', value: '营业性娱乐场所' },
					{ label: '经营范围（兼营）', value: '营业性娱乐场所' },
					{ label: '法定代表人姓名', value: '营业性娱乐场所' },
					{ label: '法人证件类型', value: '营业性娱乐场所' },
					{ label: '法人证件号码', value: '营业性娱乐场所' },
					{ label: '法人联系方式', value: '营业性娱乐场所' },
					{ label: '开业日期', value: '营业性娱乐场所' },
					{ label: '营业时间', value: '营业性娱乐场所' },
					{ label: '单位负责人', value: '营业性娱乐场所' },
					{ label: '单位负责人联系方式', value: '营业性娱乐场所' },
					{ label: '单位负责人身份证号', value: '营业性娱乐场所' },
					{ label: '娱乐服务场所治安级别', value: '营业性娱乐场所' },
					{ label: '营业执照编号', value: '营业性娱乐场所' },
					{ label: '营业执照发证机关', value: '营业性娱乐场所' },
					{ label: '营业执照起始日期', value: '营业性娱乐场所' },
					{ label: '营业执照截止日期', value: '营业性娱乐场所' },
					{ label: '营业执照登记日期', value: '营业性娱乐场所' },
					{ label: '组织机构代码', value: '营业性娱乐场所' },
					{ label: '是否有证', value: '营业性娱乐场所' },
					{ label: '娱乐经营许可证号', value: '营业性娱乐场所' },
					{ label: '娱乐经营许可证发证机关', value: '营业性娱乐场所' },
					{ label: '娱乐经营许可证起始日期', value: '营业性娱乐场所' },
					{ label: '娱乐经营许可证截止日期', value: '营业性娱乐场所' },
					{ label: '股东情况', value: '营业性娱乐场所' },
					{ label: '娱乐项目内容', value: '营业性娱乐场所' },
				],
				deviceInfo: [
					{ label: '消防合格证号', value: '营业性娱乐场所' },
					{ label: '消防审核单位', value: '营业性娱乐场所' },
					{ label: '经纬度坐标', value: '营业性娱乐场所' },
					{ label: '核定消费者数量（人）', value: '营业性娱乐场所' },
					{ label: '安全出口数量（个）', value: '营业性娱乐场所' },
					{ label: '包厢包间数量（个）', value: '营业性娱乐场所' },
					{ label: '总人数（人）', value: '营业性娱乐场所' },
					{ label: '治安负责人', value: '营业性娱乐场所' },
					{ label: '保安人数（人）', value: '营业性娱乐场所' },
					{ label: '经岗位培训人数（人）', value: '营业性娱乐场所' },
					{ label: '保安公司意见', value: '营业性娱乐场所' },
				]
			},
			formItems: [
				{
					key: 'agency',
					label: '场所分类',
				},
				{
					key: 'enterpriseCode',
					label: '治安管理机构',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '从业人员数量',
					type: 'input'
				},

				{
					key: 'enterpriseCode',
					label: '场所名称',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '营业执照号',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '法人姓名',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '经营地址',
					type: 'input'
				},
				{
					key: 'enterpriseCode',
					label: '经济类型',
					type: 'input'
				},
				{
					key: 'industry',
					label: '场所状态',
					type: 'select',
					options: [
						{ label: '营业', value: 1 },
						{ label: '自主停业', value: 2 },
						{ label: '勒令停业', value: 3 },
						{ label: '歇业', value: 4 },
						{ label: '注销', value: 5 },
						{ label: '其他', value: 6 },
					]
				},
				{
					key: '场所治安级别',
					label: '企业编码',
					type: 'input'
				},
				{
					key: 'licenseIssueDate',
					label: '登记日期',
					type: 'datePicker'
				},
				{
					key: 'legalPerson',
					label: '装机状态',
					type: 'input'
				}, {
					key: 'licenseIssueDate',
					label: '录入时间',
					type: 'datePicker'
				},
				{
					key: 'legalPerson',
					label: '娱乐场所简称',
					type: 'input'
				},
				{
					key: 'legalPerson',
					label: '户外悬挂',
					type: 'input'
				},
				{
					key: 'businessType',
					label: '娱乐项目内容',
					type: 'select',
					options: [
						{ label: '迪吧', value: 1 },
						{ label: '大众卡拉OK（200平米下）', value: 2 },
						{ label: '量贩', value: 3 },
						{ label: '演艺', value: 4 },
						{ label: '商务KTV', value: 5 },
						{ label: '大众舞厅', value: 6 },
						{ label: '电子游艺', value: 7 },
						{ label: '酒吧', value: 8 },
					]
				},

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
				{ prop: 'agency', label: '治安管理机构', },
				{ prop: 'enterpriseCode', label: '场所备案编号' },
				{ prop: 'companyName', label: '总人数', width: 100 },
				{ prop: 'signboardName', label: '场所类别', },
				{ prop: 'legalPerson', label: '场所状态' },
				{ prop: 'unifiedSocialCreditCode', label: '装机状态', },
				{ prop: 'phone', label: '治安级别', },

			],
			dialogVisible: false
		};
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
		handleCancel() {
			this.dialogVisible = false;
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
		padding: 0 5%;
	}
}
.el-descriptions {
  margin-top: 20px;
}
</style>
