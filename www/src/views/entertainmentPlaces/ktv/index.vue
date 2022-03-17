<template>
	<div class="ktv-container">
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
		<div class="ktv-body">
			<!-- <el-button @click="dialogVisible = true">新增</el-button> -->
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
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pager.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
			</el-footer>
		</div>
		<el-dialog title="详情" :visible.sync="dialogVisible" width="60%" top="10px">
			<el-tabs type="card" :value="1">
				<el-tab-pane label="场所信息" :name="1">
					<el-descriptions title="场所基本信息" border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in placeInfo.baseInfo" :label="item.label" :key="idx">
							{{ item.map ? item.map[detail[item.value]] : detail[item.value] }}
						</el-descriptions-item>
					</el-descriptions>
					<el-descriptions title="场地设备及人员情况" border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in placeInfo.deviceInfo" :label="item.label" :key="idx">
							{{ item.map ? item.map[detail[item.value]] : detail[item.value] }}
						</el-descriptions-item>
					</el-descriptions>
				</el-tab-pane>
				<el-tab-pane label="备案信息" :name="2">
					<!-- <el-descriptions title="场所基本信息" border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in placeInfo.baseInfo" :label="item.label" :key="idx">
							{{ item.value }}
						</el-descriptions-item>
					</el-descriptions>
					<el-descriptions title="场地设备及人员情况" border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in placeInfo.deviceInfo" :label="item.label" :key="idx">
							{{ item.value }}
						</el-descriptions-item>
					</el-descriptions> -->
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
			queryForm: {

			},
			detail: {},
			placeInfo: {
				baseInfo: [
					{ label: 'ktv编号', value: 'ktvid'},
					{ label: '行业类别', value: 'trade_type' ,map: MAP.entertainment_type},
					{ label: '治安管理机构', value: 'security_manage_unit' },
					{ label: '场所分类', value: 'place_main_type' },
					{ label: '场所分类（副）', value: 'place_vice_type' },
					{ label: '场所备案编号', value: 'record_code' },
					{ label: '娱乐场所名称', value: 'recreation_place_name' },
					{ label: '娱乐场所简称', value: 'recreation_place_short' },
					{ label: '户外悬挂', value: 'outdoor_hang' },
					{ label: '联系电话', value: 'telephone' },
					{ label: '邮政编码', value: 'post_code' },
					{ label: '传真', value: 'fax' },
					{ label: '经济类型', value: 'economic_type',map: MAP.economic_type },
					{ label: '注册资金（万元）', value: 'register_cost' },
					{ label: '经营范围（主营）', value: 'operate_scale' },
					{ label: '经营范围（兼营）', value: 'concurrently_scale' },
					{ label: '经营面积', value: 'operate_area' },
					{ label: '法定代表人姓名', value: 'legal_person' },
					{ label: '法人证件类型', value: 'legal_certificate_type',map: MAP.legal_certificate_type },
					{ label: '法人证件号码', value: 'legal_certificate_code' },
					{ label: '法人联系方式', value: 'legal_telephone' },
					{ label: '开业日期', value: 'open_date' },
					{ label: '营业时间', value: 'operate_time' },
					{ label: '单位负责人', value: 'chief_person' },
					{ label: '单位负责人联系方式', value: 'chief_telephone' },
					{ label: '单位负责人身份证号', value: 'chief_certificate_code' },
					{ label: '娱乐服务场所治安级别', value: 'security_level',map: MAP.security_level },
					{ label: '营业执照编号', value: 'license_code' ,},
					{ label: '营业执照发证机关', value: 'license_org' },
					{ label: '营业执照起始日期', value: 'license_begin' },
					{ label: '营业执照截止日期', value: 'license_end' },
					{ label: '营业执照登记日期', value: 'license_register_date' },
					{ label: '组织机构代码', value: 'group_code' },
					{ label: '是否有证', value: 'is_permit',map: {true: '是',false: '否'} },
					{ label: '娱乐经营许可证号', value: 'permit_code', },
					{ label: '娱乐经营许可证发证机关', value: 'permit_org' },
					{ label: '娱乐经营许可证起始日期', value: 'permit_begin' },
					{ label: '娱乐经营许可证截止日期', value: 'permit_end' },
					{ label: '股东情况', value: 'shareholders' },
					// { label: '娱乐项目内容', value: '营业性娱乐场所' },
				],
				deviceInfo: [
					{ label: '消防合格证号', value: 'fire_qualify_code' },
					{ label: '消防审核单位', value: 'fire_check_unit' },
					{ label: '经度', value: 'lng' },
					{ label: '纬度', value: 'lat' },
					{ label: '核定消费者数量（人）', value: 'max_consumers' },
					{ label: '安全出口数量（个）', value: 'exit_total' },
					{ label: '包厢包间数量（个）', value: 'rooms' },
					{ label: '总人数（人）', value: 'persons' },
					{ label: '治安负责人', value: 'security_chief_person' },
					{ label: '保安人数（人）', value: 'security_persons' },
					{ label: '经岗位培训人数（人）', value: 'post_train_persons' },
					{ label: '保安公司意见', value: 'security_unit_opinion' },
					{ label: '备注', value: 'remark' },
					{ label: '录入时间', value: 'input_time' },
				]
			},
			formItems: [
				{
					key: 'trade_type',
					label: '场所分类',
					type: 'select',
					options: mapToArray(MAP.entertainment_type)
				},
				{
					key: 'security_manage_unit',
					label: '治安管理机构',
					type: 'input'
				},
				{
					key: 'recreation_place_name',
					label: '场所名称',
					type: 'input'
				},
				{
					key: 'license_code',
					label: '营业执照号',
					type: 'input'
				},
				{
					key: 'legal_person',
					label: '法人姓名',
					type: 'input'
				},
				{
					key: 'operate_address',
					label: '经营地址',
					type: 'input'
				},
				{
					key: 'economic_type',
					label: '经济类型',
					type: 'select',
					options: mapToArray(MAP.economic_type)
				},
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
				{
					key: 'reg',
					label: '登记日期',
					type: 'datePicker'
				},
				{
					key: 'legalPerson',
					label: '装机状态',
					type: 'input'
				}, {
					key: 'input',
					label: '录入时间',
					type: 'datePicker'
				},
				{
					key: 'recreation_place_short',
					label: '娱乐场所简称',
					type: 'input'
				},
				{
					key: 'outdoor_hang',
					label: '户外悬挂',
					type: 'input'
				},
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
			tableData: new Array(10).fill({
				agency: '测试数据',
				enterpriseCode: '测试数据',
				companyName: '测试数据',
				signboardName: '测试数据',
				legalPerson: '测试数据',
				unifiedSocialCreditCode: '测试数据',
				phone: '测试数据',
			}),
			columns: [
				{ prop: 'security_manage_unit', label: '治安管理机构', },
				{ prop: 'record_code', label: '场所备案编号' },
				{ prop: 'persons', label: '总人数', width: 100 },
				{ prop: 'trade_type', label: '场所类别', formatter: (row, col, cell) => MAP.entertainment_type[cell] },
				{ prop: 'recreation_place_state', label: '场所状态', formatter: (row, col, cell) => MAP.recreation_place_state[cell] },
				// { prop: 'unifiedSocialCreditCode', label: '装机状态', },
				{ prop: 'security_level', label: '治安级别', formatter: (row, col, cell) => MAP.security_level[cell] },
			],
			dialogVisible: false
		};
	},
	created() {
		this.getList()
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
			this.dialogVisible = true
			this.detail = row
		},
		handleEdit() { },
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
