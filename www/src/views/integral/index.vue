<template>
	<div class="ktv-container">
		<el-header style="padding: 5px; border-bottom: 1px solid #dcdfe6; height: 40px; margin-bottom: 10px">
			<el-form ref="form" :model="queryForm" label-width="140px">
				<el-form-item v-for="formItem in formItems" style="width: 30%" :key="formItem.key" :label="formItem.label">
					<el-select v-if="formItem.type == 'select'" v-model="queryForm[formItem.key]" style="width: 20vw" placeholder="请选择">
						<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label" />
					</el-select>
					<el-input v-else-if="formItem.type == 'input'" v-model="queryForm[formItem.key]" style="width: 20vw" />
					<el-date-picker v-else-if="formItem.type == 'datePicker'" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="queryForm[formItem.key]" style="width: 20vw" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
					<el-date-picker v-else-if="formItem.type == 'dateTimePicker'" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" v-model="queryForm[formItem.key]" style="width: 20vw" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="getList" icon="el-icon-search">搜索</el-button>
					<el-button @click="handleReset" icon="el-icon-delete">重置</el-button>
				</el-form-item>
			</el-form>
		</el-header>
		<div class="ktv-body" style="padding: 5px">
			<div style="height: calc(100vh - 220px)">
				<el-table :data="tableData" border height="100%">
					<el-table-column v-for="column in columns" :show-overflow-tooltip="true" :key="column.prop" v-bind="column" />
				</el-table>
			</div>
			<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pager.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
			</el-footer>
		</div>
	</div>
</template>

<script>
import defaultSettings from '@/settings'
import API from './api'
import MAP from '@/const/map'
import mapToArray from '@/utils/mapToArray'


export default {
	data() {
		return {
			showBack: false,
			pager: {
				pageindex: 1,
				pagesize: 20
			},
			queryForm: { },
			formItems: [
				{ key: 'police_unit', label: '治安管辖机构', type: 'select', options: mapToArray(MAP.police_unit) },
				{ key: 'date', label: '时间', type: 'datePicker' },
			],
			tableDataCount: 0,
			pagesizes: defaultSettings.pageSizes,
			pagesize: defaultSettings.pageSizes[0],
			pageindex: 1,
			tableData: [],
			columns: [
				{ prop: 'trade_type', label: '行业类别', formatter: (row, col, cell) => MAP.trade_type2[cell], width: 100 },
				{ prop: 'police_unit', label: '管辖单位', type: 'input' , options: mapToArray(MAP.police_unit) },
				{ prop: 'enterpriseid', label: '企业编码', type: 'input' },
				{ prop: 'enterpriseid', label: '企业名称', type: 'input' },
				{ prop: 'type', label: '扣分类型', type: 'input' },
				{ prop: 'deduct', label: '扣分数量', type: 'input' },
			],
			dialogVisible: false,
			submitDisabled: false,
			flag: 'add',
			addEditForm: {},
			addEditformItems: {}

		}
	},
	mounted() { },
	created() {

		this.getList()
	},
	computed: {
		dialogTittle() {
			let tittle = ''
			switch (this.flag) {
				case 'edit':
					tittle = '编辑'
					break
				case 'add':
					tittle = '新增'
					break
				case 'detail':
					tittle = '详情'
					break
			}

			return tittle
		}
	},
	methods: {

		handleBack() {
			this.$router.go(-1)
		},
		async getList() {
			const params = { ...this.queryForm }
			const {pagesize, pageindex} = this.pager
			params.index = pageindex
			params.size = pagesize
			this.formItems.forEach(v => {
				if (v.type === 'datePicker' && params[v.key]) {
					const range = params[v.key]
					params.fromdate = range[0]
					params.todate = range[1]
					delete params[v.key]
				}
			})
			const { data, size } = await API.list(
				params
			)
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
		handleEdit(index, row) {
			this.flag = 'edit'
			this.addEditForm = { ...row }
			this.dialogVisible = true
		},
		handlePerson() { },
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
			this.dialogVisible = false
		},
		handleSizeChange(pagesize) {
			this.pager.pagesize = pagesize
			this.getList()
		},
		handleCurrentChange(pageindex) {
			this.pager.pageindex = pageindex
			this.getList()
		}
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
