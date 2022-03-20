<template>
	<div class="seal-list-container">
		<el-form ref="form" :model="queryForm" label-width="140px">
			<el-form-item v-for="formItem in formItems" :key="formItem.key" :label="formItem.label">
				<el-select v-if="formItem.type == 'select'" v-model="queryForm[formItem.key]" style="width: 14vw" placeholder="请选择">
					<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
				</el-select>
				<el-input v-else-if="formItem.type == 'input'" v-model="queryForm[formItem.key]" style="width: 14vw" />
				<el-date-picker v-else-if="formItem.type == 'datePicker'" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="queryForm[formItem.key]" style="width: 14vw" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="getList">搜索</el-button>
				<el-button @click="handleReset">重置</el-button>
			</el-form-item>
		</el-form>
		<div class="seal-list-body">
			<!-- <el-button @click="dialogFormVisible = true">新增</el-button> -->
			<el-table :data="tableData" border>
				<el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" :formatter="column.formatter" />
				<el-table-column prop="operate" label="操作" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pager.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
			</el-footer>
		</div>
		<el-dialog title="公章备案详情" :visible.sync="dialogVisible" width="60%">
			<el-tabs type="card" :value="activeName">
				<el-tab-pane v-for="(tab, tabIdx) in detailTabs" :key="tabIdx" :label="tab.label" :name="tabIdx + 1 + ''">
					<el-descriptions border size="medium" :column="4">
						<el-descriptions-item v-for="(item, idx) in recordInfo[tab.props]" :label="item.label" :key="idx">
							<img v-if="item.type === 'img'" width="120" height="160" :src="detail[item.value]" alt="" />
							<span v-else>{{ item.map ? item.map[detail[item.value]] : detail[item.value] }}</span>
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
import API from './api'

import MAP from '../../../../const/map'
import mapToArray from '../../../../utils/mapToArray'
export default {
	data() {
		return {
			dialogVisible: false,
			activeName: '1',
			pagesizes: defaultSettings.pageSizes,
			tableDataCount: 0,
			recordInfo: {
				unitInfo: [
					{ label: '使用单位类型', value: 'enterprise_type' },
					{ label: '使用单位名称', value: 'enterprise' },
					{ label: '使用单位编码', value: 'enterprise_code' },
					{ label: '使用单位英文缩写', value: 'enterprise_english' },
					{ label: '使用单位少数民族文字名', value: 'minority_character' },
					{ label: '统一社会信用代码', value: 'credit_code' },
					{ label: '法人/负责人国籍', value: 'legal_nationality',map: MAP.nationality },
					{ label: '法人/负责人姓名', value: 'legal_person' },
					{ label: '法人/负责人证件类型', value: 'legal_certificate_type' ,map: MAP.certificate_type },
					{ label: '法人/负责人证件号码', value: 'legal_certificate_code' },
					{ label: '法人/负责人联系电话', value: 'legal_telephone' },
					{ label: '行政区划', value: 'district',map: MAP.district  },
					{ label: '单位注册地址', value: 'register_address' },
					{ label: '成立日期', value: 'create_date' },
					{ label: '注册资本（万元）', value: 'register_cost' },
					{ label: '单位实际经营地址', value: 'actual_address' },
					{ label: '单位联系电话', value: 'enterprise_telephone' },
					{ label: '邮政编码', value: 'post_code' },
					{ label: '经营范围（主营）', value: 'operate_scale' },
					{ label: '备注', value: 'remark' },
				],
				sealInfo: [
					{ label: '印章状态', value: 'seal_state' },
					{ label: '印章制作类型', value: 'seal_made_type' },
					{ label: '是否有电子印章', value: 'is_e_seal' },
					{ label: '印章编码', value: 'seal_code' },
					{ label: '印章类型', value: 'seal_type' },
					{ label: '印章材料', value: 'seal_material' },
					{ label: '印章名称', value: 'seal_material' },
					{ label: '印章尺寸', value: 'seal_size' },
					{ label: '印章形状', value: 'seal_shape' },
					{ label: '印油说明简要情况', value: 'seal_ink_desc' },
					{ label: '制作人', value: 'mader' },
					{ label: '制作时间', value: 'made_time' },
					{ label: '印章图像宽度', value: 'seal_width' },
					{ label: '印章图像高度', value: 'seal_height' },
					{ label: '电子原始印模', value: 'seal_original_image', type: 'img' },
					{ label: '实物印文图像', value: 'seal_actual_image', type: 'img' },
				],
				requireDoc: [
					{ label: '主要负责人身份证', value: 'chief_person' },
					// { label: '经办人身份证', value: 'operator_name' },
					{ label: '其他资料', value: 'other_info' },
				],
				operatorInfo: [
					{ label: '经办人姓名', value: 'operator_name' },
					{ label: '经办人证件类型', value: 'operator_certificate_type',map: MAP.certificate_type },
					{ label: '经办人证件号码', value: 'operator_certificate_code' },
					{ label: '经办人联系电话', value: 'operator_telephone' },
					{ label: '实际居住地址', value: 'operator_actual_address' },
					
					{ label: '证件照', value: 'operator_certificate_image', type: 'img' },
					{ label: '现场照', value: 'operator_scene_image', type: 'img' },
				],
				deliveryInfo: [
					{ label: '取章方式', value: 'get_seal_type',map: MAP.get_seal_type  },
					{ label: '取章人姓名', value: 'get_seal_name' },
					{ label: '取章人证件类型', value: 'get_seal_certificate_type',map: MAP.certificate_type  },
					{ label: '取章人证件号码', value: 'get_seal_certificate_code' },
					{ label: '取章时间', value: 'get_seal_time' },
					{ label: '证件照', value: 'get_seal_certificate_image', type: 'img' },
					{ label: '现场照', value: 'get_seal_scene_image', type: 'img' },
				],
				makeInfo: [
					{ label: '刻制企业名称', value: 'engrave_enterprise' },
					{ label: '刻制企业联系电话', value: 'engrave_telephone' },
					{ label: '刻制企业经营地址', value: 'engrave_address' },
				],
				recordInfo: [
					{ label: '提交备案人员', value: 'submit_record_name' },
					{ label: '提交备案时间', value: 'submit_record_time' },
					{ label: '备案机关编码', value: 'record_unit_code' },
					{ label: '备案机关名称', value: 'record_unit' },
					{ label: '确认结果', value: 'record_result' },
					{ label: '备案确认人', value: 'record_confirm_name' },
					{ label: '备案告知', value: 'record_opinin' },
					{ label: '备案确认时间', value: 'record_confirm_time' },
				],
			},
			pager: {
				pageindex: 1,
				pagesize: 10
			},
			queryForm: {

			},
			formItems: [
				{
					key: 'enterprise',
					label: '印章使用单位',
					type: 'input'
				},
				{
					key: 'engrave_enterprise',
					label: '刻制单位',
					type: 'input'
				},
				{
					key: 'record_result',
					label: '备案状态',
					type: 'select',
					options: mapToArray(MAP.record_result)
				},
				{
					key: 'request',
					label: '申请时间',
					type: 'datePicker'
				},
				{
					key: 'record',
					label: '备案时间',
					type: 'datePicker'
				}
			],
			tableData: [],
			columns: [
				{ prop: 'seal_code', label: '印章编码', },
				{ prop: 'enterprise', label: '使用单位名称', },
				{ prop: 'legal_person', label: '法人姓名', },
				{ prop: 'submit_record_time', label: '提交备案时间', },
				{ prop: 'record_confirm_time', label: '备案时间', },
				{ prop: 'seal_state', label: '印章状态', },
				{ prop: 'record_result', label: '备案状态', formatter: (row, col, cell) => MAP.record_result[cell]  },
				// { prop: 'checkStatus', label: '消息来源', },
				{ prop: 'input_time', label: '录入时间', },
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
			dialogFormVisible: false,
			detail: {}
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
			this.detail = row
			this.dialogVisible = true
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
		handleClose() {

		},
		handleCancel() {
			this.dialogFormVisible = false;
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
