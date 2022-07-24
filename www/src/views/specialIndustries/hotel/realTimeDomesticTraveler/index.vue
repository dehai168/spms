<template>
	<el-container class="container">
		<span class="timer">
			<el-alert :title="`${time} 秒后自动刷新数据`" type="success"  > </el-alert>
		</span>
		<el-main class="main">
			<el-table v-loading="tableLoading" :data="tableData" border :height="showBack ? 'calc(100% - 39px)' : '100%'" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column v-for="column in columns" :key="column.prop" v-bind="column" :show-overflow-tooltip="true" />
				<el-table-column prop="operate" label="操作" width="80" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer style="padding: 5px; border-top: 1px solid #dcdfe6; height: 42px">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="queryForm.pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableDataCount" />
		</el-footer>
		<!-- 详情 -->
		<el-dialog class="domestic-traveler-detail" title="境内旅客详情" :visible.sync="dialogVisible" width="70%" top="4vh" :close-on-click-modal="false">
			<el-form label-width="120px" :inline="true" label-suffix=":">
				<my-card v-for="(cardItem, title, index) in detailItems" :key="index" :title="title">
					<el-form-item v-for="item in cardItem.items" :key="item.key" :label="item.label" :style="{ width: cardItem.width }">{{ item.formatter ? item.formatter(detailData[item.key]) : detailData[item.key] }}</el-form-item>
				</my-card>
				<div class="photo-coantainer">
					<el-image style="width: 100px; height: 100px" :src="detailData.certificate_image" fit="fill" />
					<div class="photo-tittle">证件照片</div>
					<el-image style="width: 100px; height: 100px" :src="detailData.scene_capture" fit="fill" />
					<div class="photo-tittle">现场照片</div>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
import defaultSettings from '@/settings'
import { items } from '@/api/domesticTraveler'
import mapToArray from '@/utils/mapToArray';
import map from '@/const/map';
import handleEnum from '@/utils/handleEnum';
import { enumsItems } from '@/api/common'
import { formatDate } from '@/utils/index'
import MyCard from './MyCard.vue'

export default {
	components: {
		MyCard
	},
	data() {
		return {
			showBack: false,
			pagesizes: defaultSettings.pageSizes,
			queryForm: {
				pagesize: defaultSettings.pageSizes[0],
				pageindex: 1,
			},
			tableLoading: false,
			tableData: [],
			tableDataCount: 0,
			tableSelected: [],
			dialogVisible: false,
			detailData: {},
			enumData: {},
			time: 10,
			timer1: null,
			timer2: null,
		};
	},
	computed: {
		formItems() {
			return [
				[
					{ key: 'inTime', label: '入住时间', type: 'datePicker' },
					{ key: 'realname', label: '姓名', type: 'input' },
					{
						key: 'nation',
						label: '民族',
						type: 'select',
						options: mapToArray(map.nation)
					},

				],
				[
					{
						key: 'sex',
						label: '性别',
						type: 'select',
						options: [
							{ label: '男', value: '男' },
							{ label: '女', value: '女' }
						]
					},
					{ key: 'birthday', label: '出生日期', type: 'datePicker' },
					{ key: 'certificate_code', label: '证件号码', type: 'input' },
				],
				[
					{
						key: 'security_manage_org',
						label: '管辖单位',
						type: 'select',
						options: this.enumData[2]
					},
					{ key: 'sign_name', label: '招牌名称', type: 'input' },
					{ key: 'enterprise', label: '企业名称', type: 'input' },
				],
				[{ key: 'btn', type: 'btn' }]
			]
		},
		columns() {
			return [
				{ label: '序号', width: 50, type: 'index' },
				{ prop: 'realname', label: '姓名', width: 120 },
				{ prop: 'sex', label: '性别', width: 80 },
				{ prop: 'certificate_code', label: '证件号码', width: 180 },
				{ prop: 'nation', label: '民族', width: 80 },
				{ prop: 'province_city', label: '省市县', width: 120 },
				{ prop: 'detail_address', label: '详细地址', minWidth: 200 },
				{ prop: 'in_room', label: '房间号', width: 120 },
				{ prop: 'in_time', label: '入住时间', width: 150 },
				{ prop: 'out_time', label: '退房时间', width: 150 },
				{ prop: 'enterprise', label: '企业名称', minWidth: 200 },
				{ prop: 'sign_name', label: '招牌名称', minWidth: 200 },
				{ prop: 'security_manage_org', label: '管辖单位', minWidth: 200, formatter: (r, c, cellValue) => this.enumData[2].find(i => i.value === cellValue)?.label },
				// { prop: '行业类型', label: '行业类型', width: 180 },
			]
		},
		detailItems() {
			return {
				'旅客证件信息': {
					width: '40%',
					items: [
						{ key: 'realname', label: '姓名' },
						{ key: 'sex', label: '性别' },
						{ key: 'nation', label: '民族' },
						{ key: 'birthday', label: '出生日期' },
						{ key: 'certificate_type', label: '证件类型', formatter: (value) => map.certificate_type[value] },
						{ key: 'certificate_code', label: '证件号码' },
						{ key: 'province_city', label: '省市县' },
						{ key: 'telephone', label: '联系电话' },
						{ key: 'detail_address', label: '详细地址' },
					]
				},
				'旅客入住信息': {
					width: '30%',
					items: [
						{ key: 'in_room', label: '入住房间号' },
						{ key: 'in_time', label: '入住时间' },
						{ key: 'out_time', label: '退房时间' },
						{ key: 'image_similarity', label: '人像比对相似度' },
						{ key: 'image_result', label: '人像比对结果' },
						{ key: 'is_person_check', label: '是否人工复核', formatter: (value) => value ? '是' : '否' },
					]
				},
				'管理信息': {
					width: '40%',
					items: [
						{ key: 'sign_name', label: '招牌名称' },
						{ key: 'enterprise', label: '企业名称' },
						{ key: 'security_manage_org', label: '治安管理机构' },
						{ key: 'standard_address', label: '标准经营地址' },
						{ key: 'save_time', label: '前台保存时间' },
						{ key: 'last_update_time', label: '最后更新时间' },
						{ key: 'data_upload_type', label: '数据上报形式' },
					]
				},
			}
		}
	},
	created() {
		this.handleQuery()
		this.timer1 = setInterval(() => {
			this.handleQuery()
		}, 10000)

		this.timer2 = setInterval(() => {
			this.time = this.time - 1
			if (this.time <= 0) {
				this.time = 10
			}
		}, 1000)
	},
	destroyed() {
		clearInterval(this.timer1)
		clearInterval(this.timer2)
	},
	methods: {
		handleBack() {
			this.$router.go(-1)
		},
		init(callback) {
			// 初始化异步操作，例如数据字典
			enumsItems({ types: [2] })
				.then(res => {
					if (res.code === 200) {
						this.enumData = handleEnum(res.data);
						callback();
					}
				})
				.catch(e => {
					console.error(e)
				})
		},
		handleQuery() {
			this.tableLoading = true
			const { inTime, birthday, ...rest } = this.queryForm;
			const today = new Date()
			today.setDate(today.getDate() + 1)
			items({
				in_begin: formatDate('date'),
				in_end: formatDate('date', today),
				...rest
			})
				.then(res => {
					if (res.code === 200) {
						this.tableData = res.data
						this.tableDataCount = res.size
					}
					this.tableLoading = false
				})
				.catch(e => {
					console.error(e)
				})
		},
		handleDetail(index, row) {
			this.dialogVisible = true;
			this.detailData = row;
		},
		handleReset() {
			const { pagesize, pageindex } = this.queryForm;
			this.queryForm = { pagesize, pageindex };
			this.$refs.queryForm.resetFields();
		},
		handleSelectionChange(val) {
			this.tableSelected = val
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
.container {
	height: calc(100vh - 120px);
	width: 100%;

	.main {
		height: calc(100% - 231px);
		width: 100%;
		padding: 5px;
	}
}

.domestic-traveler-detail {
	.el-form {
		position: relative;
		max-height: 600px;
		overflow: auto;

		.photo-coantainer {
			position: absolute;
			top: 0;
			right: 30px;

			.photo-tittle {
				display: flex;
				justify-content: center;
				margin-bottom: 20px;
			}
		}
	}
}
.timer {
	margin: 5px;
}
</style>
