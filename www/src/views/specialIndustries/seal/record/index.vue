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
				<el-button type="primary" @click="handleSearch">搜索</el-button>
				<el-button>重置</el-button>
			</el-form-item>
		</el-form>
		<div class="seal-list-body">
			<!-- <el-button @click="dialogFormVisible = true">新增</el-button> -->
			<el-table :data="tableData" border>
				<el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" />
				<el-table-column prop="operate" label="操作" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
			</el-footer>
		</div>
		<el-dialog title="公章备案详情" :visible.sync="dialogVisible" width="60%">
			<el-tabs type="card" :value="activeName">
				<el-tab-pane v-for="(tab, tabIdx) in detailTabs" :key="tabIdx" :label="tab.label" :name="tabIdx + 1 + ''">
					<el-descriptions border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in detail[tab.props]" :label="item.label" :key="idx">
							<img v-if="item.type === 'img'" width="120" height="160" src="https://img.zcool.cn/community/012f61575e211c0000012e7ece98be.jpg@1280w_1l_2o_100sh.jpg" alt="" />
							<span v-else>{{ item.value }}</span>
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
import defaultSettings from '@/settings'

export default {
	data() {
		return {
			dialogVisible: false,
			activeName: '1',
			pagesizes: defaultSettings.pageSizes,
			tableDataCount: 0,
			detail: {
				unitInfo: [
					{ label: '单位类型', value: '其他' },
					{ label: '单位名称', value: '其他' },
					{ label: '单位编码', value: '其他' },
					{ label: '单位英文缩写', value: '其他' },
					{ label: '单位少数民族文字名', value: '其他' },
					{ label: '统一社会信用代码', value: '其他' },
					{ label: '法人/负责人国籍', value: '其他' },
					{ label: '法人/负责人姓名', value: '其他' },
					{ label: '法人/负责人证件类型', value: '其他' },
					{ label: '法人/负责人证件号码', value: '其他' },
					{ label: '法人/负责人联系电话', value: '其他' },
					{ label: '行政区划', value: '其他' },
					{ label: '单位注册地址', value: '其他' },
					{ label: '成立日期', value: '其他' },
					{ label: '注册资本（万元）', value: '其他' },
					{ label: '单位实际经营地址', value: '其他' },
					{ label: '单位联系电话', value: '其他' },
					{ label: '邮政编码', value: '其他' },
					{ label: '经营范围（主营）', value: '其他' },
					{ label: '备注', value: '其他' },
				],
				sealInfo: [
					{ label: '印章状态', value: '已制作' },
					{ label: '印章制作类型', value: '已制作' },
					{ label: '是否有电子印章', value: '已制作' },
					{ label: '印章编码', value: '已制作' },
					{ label: '印章类型', value: '已制作' },
					{ label: '印章材料', value: '已制作' },
					{ label: '印章名称', value: '已制作' },
					{ label: '印章尺寸', value: '已制作' },
					{ label: '印章形状', value: '已制作' },
					{ label: '印油说明简要情况', value: '已制作' },
					{ label: '制作人', value: '已制作' },
					{ label: '制作时间', value: '已制作' },
					{ label: '印章图像宽度', value: '已制作' },
					{ label: '印章图像高度', value: '已制作' },
					{ label: '电子原始印模', value: '已制作', type: 'img' },
					{ label: '实物印文图像', value: '已制作', type: 'img' },
				],
				requireDoc: [
					{ label: '主要负责人身份证', value: '已制作' },
					{ label: '经办人身份证', value: '已制作' },
					{ label: '其他资料', value: '已制作' },
				],
				operatorInfo: [
					{ label: '经办人姓名', value: '张三' },
					{ label: '经办人证件类型', value: '已制作' },
					{ label: '经办人证件号码', value: '已制作' },
					{ label: '经办人联系电话', value: '已制作' },
					{ label: '实际居住地址', value: '已制作' },
					{ label: '取章方式', value: '已制作' },
					{ label: '证件照', value: '已制作', type: 'img' },
					{ label: '现场照', value: '已制作', type: 'img' },
				],
				deliveryInfo: [
					{ label: '取章方式', value: '已制作' },
					{ label: '取章人姓名', value: '张三' },
					{ label: '取章人证件类型', value: '已制作' },
					{ label: '取章人证件号码', value: '已制作' },
					{ label: '取章时间', value: '已制作' },
					{ label: '证件照', value: '已制作', type: 'img' },
					{ label: '现场照', value: '已制作', type: 'img' },
				],
				makeInfo: [
					{ label: '企业名称', value: '已制作' },
					{ label: '企业联系电话', value: '张三' },
					{ label: '企业经营地址', value: '已制作' },
				],
				recordInfo: [
					{ label: '提交备案人员', value: '已制作' },
					{ label: '提交备案时间', value: '张三' },
					{ label: '备案机关编码', value: '已制作' },
					{ label: '备案机关名称', value: '已制作' },
					{ label: '确认结果', value: '已制作' },
					{ label: '备案确认人', value: '已制作' },
					{ label: '备案告知', value: '已制作' },
					{ label: '备案确认时间', value: '已制作' },
				],
			},

			queryForm: {
				useUnit: '',
				makeUnit: '',
				recordStatus: '',
				orderNo: '',
				applyDate: '',
				recordDate: '',
				pagesize: defaultSettings.pageSizes[0],
				pageindex: 1
			},
			formItems: [
				{
					key: 'useUnit',
					label: '印章使用单位',
					type: 'input'
				},
				{
					key: 'makeUnit',
					label: '刻制单位',
					type: 'input'
				},
				{
					key: 'recordStatus',
					label: '备案状态',
					type: 'select',
					options: [
						{ label: '营业', value: 1 },
						{ label: '停业', value: 2 },
						{ label: '歇业', value: 3 },
						{ label: '其他', value: 4 }
					]
				},
				{
					key: 'orderNo',
					label: '订单编号',
					type: 'input'
				},
				{
					key: 'applyDate',
					label: '申请时间',
					type: 'datePicker'
				},
				{
					key: 'recordDate',
					label: '备案时间',
					type: 'datePicker'
				}
			],
			tableData: new Array(10).fill({
				agency: '测试数据',
				enterpriseCode: '测试数据',
				companyName: '测试数据',
				signboardName: '测试数据',
				legalPerson: '测试数据',
				unifiedSocialCreditCode: '测试数据',
				phone: '测试数据',
				checkStatus: '测试数据',
				businessType: '测试数据',
			}),
			columns: [
				{ prop: 'agency', label: '印章订单编号', },
				{ prop: 'enterpriseCode', label: '使用单位名称', },
				{ prop: 'companyName', label: '使用单位法人姓名', },
				{ prop: 'signboardName', label: '提交备案时间', },
				{ prop: 'legalPerson', label: '备案时间', },
				{ prop: 'unifiedSocialCreditCode', label: '订单状态', },
				{ prop: 'phone', label: '备案状态', },
				{ prop: 'checkStatus', label: '消息来源', },
				{ prop: 'businessType', label: '申请时间', },
			],
			detailTabs: [
				{ label: '使用单位信息', props: 'unitInfo' },
				{ label: '印章信息', props: 'sealInfo' },
				{ label: '必备资料', props: 'requireDoc' },
				{ label: '经办人信息', props: 'operatorInfo' },
				{ label: '交付信息', props: 'deliveryInfo' },
				{ label: '刻制企业信息', props: 'makeInfo' },
				{ label: '备案信息', props: 'recordInfo' },
			],
			dialogFormVisible: false
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
		handleClose() {

		},
		handleCancel() {
			this.dialogFormVisible = false;
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
