<template>
	<el-dialog class="hotel-base-add" :title="dialogTittle" :visible="dialogVisible" @close="onClose" width="70%" top="4vh" :close-on-click-modal="false">
		<el-tabs v-model="activeName" stretch @tab-click="handleTab">
			<el-tab-pane label="基础信息" name="1" :class="{ isAdd: flag === 'add' }">
				<el-form v-if="isSimple" ref="addEditForm" :model="addEditForm" label-width="160px" :inline="true" :disabled="flag == 'detail'">
					<el-form-item v-for="formItem in addEditformItems" :key="formItem.key" :label="formItem.label">
						<el-select v-if="formItem.type == 'select'" v-model="addEditForm[formItem.key]" style="width: 200px" placeholder="请选择">
							<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
						</el-select>
						<el-input v-else-if="formItem.type == 'input'" v-model="addEditForm[formItem.key]" style="width: 200px" />
						<el-input v-else-if="formItem.type == 'textarea'" v-model="addEditForm[formItem.key]" type="textarea" style="width: 500px" />
						<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="addEditForm[formItem.key]" type="date" placeholder="请选择日期" style="width: 200px" />
						<el-radio-group v-else-if="formItem.type == 'radio'" v-model="addEditForm[formItem.key]">
							<el-radio v-for="option in formItem.options" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<el-form v-else ref="addEditForm" :model="addEditForm" label-width="10vw" :inline="true" label-suffix=":" :disabled="flag == 'detail'">
					<my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
						<el-row v-for="(row, rowIndex) in cardItem" :key="rowIndex">
							<el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 8">
								<el-form-item v-if="formItem.type !== 'standardAddress'" :label="formItem.label" :required="formItem.required">
									<el-select v-if="formItem.type == 'select'" v-model="addEditForm[formItem.key]" style="width: 11vw" placeholder="请选择">
										<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
									</el-select>
									<el-input v-else-if="formItem.type == 'input'" v-model="addEditForm[formItem.key]" style="width: 11vw" />
									<el-input v-else-if="formItem.type == 'textarea'" v-model="addEditForm[formItem.key]" type="textarea" style="width: 500px" />
									<el-date-picker v-else-if="formItem.type == 'datePicker'" v-model="addEditForm[formItem.key]" style="width: 11vw" type="date" placeholder="请选择日期" />
									<el-radio-group v-else-if="formItem.type == 'radio'" v-model="addEditForm[formItem.key]">
										<el-radio v-for="option in formItem.options" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
									</el-radio-group>
								</el-form-item>

								<!-- 标准地址根据用户选择 显示   这里单独处理 -->
								<el-form-item v-else-if="formItem.type == 'standardAddress' && addEditForm.is_standard_address == 1" :label="formItem.label">
									<el-input v-model="addEditForm.standardAddress" style="width: 11vw" />
								</el-form-item>
							</el-col>
						</el-row>
					</my-card>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="从业人员" name="2" v-if="flag !== 'add'" :disabled="flag !== 'detail'">
				<div>
					<el-radio v-model="employeeType" label="domestic">国内</el-radio>
					<el-radio v-model="employeeType" label="overseas">境外</el-radio>
				</div>
				<div style="margin: 20px 0">
					<el-table :data="employeeData" border height="100%">
						<el-table-column v-for="column in employeeCols" :show-overflow-tooltip="true" :key="column.prop" v-bind="column" />
					</el-table>
				</div>
				<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.pagesize" background layout="total, prev, pager, next, jumper" :total="employeeCount" />
				</el-footer>
			</el-tab-pane>
			<el-tab-pane label="日常检查" name="3" v-if="flag !== 'add'" :disabled="flag !== 'detail'">
				<div>
					<el-descriptions border :column="2" size="medium" v-if="checkData.enterprise">
						<el-descriptions-item label="企业名称">{{ checkData.enterprise }}</el-descriptions-item>
						<el-descriptions-item label="统一社会信用代码">{{ checkData.credit_code }}</el-descriptions-item>
						<el-descriptions-item label="检查方式">{{ checkData.check_type }}</el-descriptions-item>
						<el-descriptions-item label="检查时间段">{{ checkData.check_fromtime }} ~ {{ checkData.check_totime }}</el-descriptions-item>
						<el-descriptions-item label="检查人">{{ checkData.chief_person }}</el-descriptions-item>
						<el-descriptions-item label="共同检查人">{{ checkData.check_peer }}</el-descriptions-item>
						<el-descriptions-item label="工作意见">{{ checkData.check_idea }}</el-descriptions-item>
						<el-descriptions-item label="检查结果">{{ checkData.check_result == 1 ? '异常' : '正常' }}</el-descriptions-item>
						<el-descriptions-item label="场所负责人">{{ checkData.chief_person }}</el-descriptions-item>
						<el-descriptions-item label="场所负责人签字">{{ checkData.chief_person_sign }}</el-descriptions-item>
						<el-descriptions-item label="备注">{{ checkData.remark }}</el-descriptions-item>
						<el-descriptions-item label="录入时间">{{ checkData.input_time }}</el-descriptions-item>
					</el-descriptions>
					<el-table :data="checkList" border height="100%" style="margin-top: 20px">
						<el-table-column v-for="column in checkCols" :show-overflow-tooltip="true" :key="column.prop" v-bind="column" />
					</el-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="案件信息" name="4" v-if="flag !== 'add'" :disabled="flag !== 'detail'">
				<div style="margin: 20px 0">
					<el-table :data="caseData" border height="100%">
						<el-table-column v-for="column in caseCols" :show-overflow-tooltip="true" :key="column.prop" v-bind="column" />
					</el-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="物品信息" name="5" v-if="flag !== 'add'" :disabled="flag !== 'detail'">
				<div style="margin: 20px 0">
					<el-table :data="goodsData" border height="100%">
						<el-table-column v-for="column in goodsCols" :show-overflow-tooltip="true" :key="column.prop" v-bind="column" />
					</el-table>
				</div>
			</el-tab-pane>
		</el-tabs>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" :disabled="submitDisabled" @click="handleSubmit">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import MAP from '../../const/map'
import domesticAPI from '../../views/employees/domestic/api'
import overseasAPI from '../../views/employees/overseas/api'
import API from './api'
import { getDynamicMap } from '@/const/map'

const mapTypeId = {
	hotelid: 1,
	junk_tradeid: 2,
	vehicle_repairid: 3,
	scrap_metal_recycleid: 4,
	seal_engrave_unitid: 5,
	ktvid: 6,
	barid: 7,
	pawnid: 8,
	unlockid: 9,
	printid: 10
}

export default {
	props: {
		dialogTittle: String,
		dialogVisible: {
			type: Boolean,
			default: false
		},
		flag: String,
		addEditformItems: [Object, Array],
		submitDisabled: {
			type: Boolean,
			default: false
		},
		enterprise_id_key: String
	},
	created() {
		this.getEnum()
	},
	watch: {
		employeeType() {
			this.pager = {
				pageindex: 1,
				pagesize: 20
			}
			this.getList()
		},
		dialogVisible(val) {
			if (val && this.flag == 'add') {
				this.addEditForm = {}
			}
		}
	},
	data() {
		return {
			addEditForm: {},
			activeName: '1',
			employeeType: 'domestic',
			employeeCount: 0,
			pager: {
				pageindex: 1,
				pagesize: 20
			},
			goodsData: [],
			caseData: [],
			employeeData: [],
			employeeCols: [
				{ prop: 'trade_type', label: '行业类别', formatter: (row, col, cell) => MAP.trade_type2[cell], width: 100 },
				{ prop: 'enterprise', label: '企业名称' },
				// { prop: 'domestic_employeeid', label: '人员编号', },
				{ prop: 'realname', label: '姓名', width: 80 },
				{ prop: 'certificate_code', label: '证件号码', width: 160 },
				{ prop: 'sex', label: '性别', width: 60 },
				{ prop: 'nation', label: '民族', width: 100 },
				{ prop: 'state', label: '在职状态', formatter: (row, col, cell) => MAP.employeeState[cell], width: 100 },
				{ prop: 'input_time', label: '录入时间', width: 140 }
			],
			checkCols: [
				{ prop: 'checkid', label: '编号', },
				{ prop: 'check_name', label: '检查事项', },
				{ prop: 'result', label: '结果', formatter: (row, col, cell) => cell == 1 ? '是' : '否' },
				{ prop: 'explain', label: '说明' },
				{ prop: 'score', label: '分数' },
			],
			checkList: [],
			checkData: {},
			goodsCols: [
				{ prop: 'trade_type', label: '行业类别', formatter: (row, col, cell) => MAP.trade_type2[cell], width: 100 },
				{ prop: 'enterprise', label: '企业名称', type: 'input' },
				{ prop: 'enterprise_code', label: '企业编码', type: 'input' },
				{ prop: 'type', label: '物品类型', type: 'input' },
				{ prop: 'goods_name', label: '物品名称', type: 'input' },
				{ prop: 'total', label: '物品数量', type: 'input' },
				{ prop: 'unit', label: '物品数量单位', type: 'input' },
				{ prop: 'purpose', label: '物品用途', type: 'input' },
				{ prop: 'model', label: '物品型号', type: 'input' },
				{ prop: 'spec', label: '物品规格', type: 'input' },
				{
					prop: 'is_danger', label: '是否有危险性', formatter: (row, col, cell) => cell === true ? '是' : '否'
				},
				{ prop: 'danger_desc', label: '危险描述', type: 'input', },
				{ prop: 'input_time', label: '时间', type: 'datePicker' },
			],
			caseCols: []
		}
	},
	methods: {
		getEnum() {
			getDynamicMap().then(res => {
				this.caseCols = [
				{ prop: 'trade_type', label: '行业类别', formatter: (row, col, cell) => MAP.trade_type2[cell], width: 100 },
				{ prop: 'enterprise_code', label: '企业编码', type: 'input', width: 150 },
				{ prop: 'case_code', label: '案件编号', type: 'input', width: 150 },
				{ prop: 'case_source', label: '案件来源', type: 'select', formatter: (row, col, cell) => res.case_source[cell], width: 150 },
				{ prop: 'case_time', label: '发案时间', type: 'dateTimePicker', width: 150 },
				{ prop: 'case_nature', label: '案件性质', type: 'select', formatter: (row, col, cell) => res.case_nature[cell], width: 150 },
				{ prop: 'case_type', label: '案件类别', type: 'select', formatter: (row, col, cell) => res.case_type[cell], width: 150 },
				{ prop: 'police_unit', label: '治安管辖机构', type: 'select', formatter: (row, col, cell) => MAP.police_unit[cell], width: 150 },
				{ prop: 'case_unit', label: '立案单位', type: 'select', formatter: (row, col, cell) => MAP.jurisdiction_unit[cell], width: 150 },
				{ prop: 'case_date', label: '立案日期', type: 'datePicker', width: 150 },
				{ prop: 'solve_date', label: '破案日期', type: 'datePicker', width: 150 },
				{ prop: 'enterprise_blame', label: '企业责任', type: 'select', formatter: (row, col, cell) => res.enterprise_blame[cell], width: 150 },
				{ prop: 'enterprise_persion', label: '企业人员/角色', type: 'input', formatter: (row, col, cell) => MAP.employee_type[cell], width: 150 },
			]
			})
		},
		handleSubmit() {
			this.$emit('update:dialogVisible', false)
			this.$emit('submit', this.addEditForm)
		},
		onClose() {
			this.$emit('update:dialogVisible', false)
			this.activeName = '1'
			// this.addEditForm = {}
		},
		handleSizeChange(pagesize) {
			this.pager.pagesize = pagesize
			this.getList()
		},
		handleCurrentChange(pageindex) {
			this.pager.pageindex = pageindex
			this.getList()
		},
		handleTab(tab) {
			console.log(this.addEditForm, this.addEditformItems)
			this.pager = {
				pageindex: 1,
				pagesize: 20
			}
			if (this.activeName == '2') {
				this.getList()
			}
			if (this.activeName == '3') {
				this.getCheckData()
			}
			if (this.activeName == '4') {
				this.getCaseData()
			}
			if (this.activeName == '5') {
				this.getGoodsData()
			}
		},
		async getList() {
			const API = this.employeeType === 'domestic' ? domesticAPI : overseasAPI
			const params = {
				enterprise: this.addEditForm.enterprise,
				enterprise_id: this.addEditForm[this.enterprise_id_key]
			}
			const { data, size } = await API.list(
				{
					index: this.pager.pageindex,
					size: this.pager.pagesize
				},
				params
			)
			this.employeeData = data
			this.employeeCount = size
		},
		async getCheckData() {

			const params = {
				enterprise: this.addEditForm.enterprise,
				type: mapTypeId[this.enterprise_id_key]
			}
			const { data } = await API.dailyCheckList(
				{
					index: 1,
					size: 9999999
				},
				params
			)
			this.checkData = data[0] || {}
			this.checkList = data[0] ? data[0].check_list : []
		},
		async getCaseData() {
			const params = {
				enterprise_id: this.addEditForm[this.enterprise_id_key],
				trade_type: mapTypeId[this.enterprise_id_key],
				index: 1,
				size: 9999999
			}
			const { data } = await API.caseList(params)
			this.caseData = data
			console.log(this.caseData)
		},
		async getGoodsData() {

			const params = {
				enterprise_id: this.addEditForm[this.enterprise_id_key],
				trade_type: mapTypeId[this.enterprise_id_key],
				index: 1,
				size: 9999999
			}
			const { data } = await API.goodsList(
				params
			)
			this.goodsData = data
		}
	},
	computed: {
		isSimple() {
			return Array.isArray(this.addEditformItems)
		}
	}
}
</script>

<style lang="scss" scoped>
.hotel-base-add {
	.el-form {
		max-height: 600px;
		overflow: auto;
	}
}
</style>