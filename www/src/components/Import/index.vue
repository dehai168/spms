<template>
	<div style="display: inline-block; margin-left: 10px;margin-right: 10px;">
		<el-dialog title="导入" :visible.sync="importDialogVisible" width="30%" :close-on-click-modal="false">
			<el-form label-width="80px">
				<el-form-item label="参考模板">
					<el-link type="primary" :href="templeteUrl" target="_blank">下载</el-link>
				</el-form-item>
				<el-form-item label="导入数据">
					<el-upload ref="upload" drag :headers="uploadHeader" :action="uploadUrl" :on-error="handleUploadError" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">注意:只能上传<strong>xls/xlsx</strong>文件</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="importDialogVisible = false">取 消</el-button>
				<el-button type="primary" :disabled="submitImportDisabled" @click="handleSubmitImport">确 定</el-button>
			</span>
		</el-dialog>
		<el-button icon="el-icon-download" @click="handleImport">导入</el-button>
	</div>
</template>

<script>
import Cookies from 'js-cookie'
import request from '@/utils/request'
export default {
	data() {
		return {
			uploadHeader: {
				JSESSIONID: Cookies.get('JSESSIONID')
			},
			importDialogVisible: false,
			importForm: {
				filename: ''
			},
			uploadUrl: ''
		}
	},
	props: {
		path: String
	},
	computed: {
		templeteUrl() {
			return `/template/${this.path}_template.xlsx`
		}
	},
	methods: {
		beforeUpload(file) {
			return new Promise((resolve, reject) => {
				const isXls = file.name.indexOf('.xls') > -1 || file.name.indexOf('.xlsx') > -1
				// const isLt2M = file.size / 1024 / 1024 < 10

				if (!isXls) {
					this.$message.error('上传文件只能是 xls/xlsx 格式!')
					reject()
				}
				// if (!isLt2M) {
				// 	this.$message.error('上传文件大小不能超过 10MB!')
				// }

				this.uploadUrl = `/police/import/${this.path}?name=${file.name}`
				resolve()
			})
		},
		handleUploadSuccess(res, file, filelist) {
			console.log(res,this.$root)
			if (res.code === 200) {
				this.importForm.filename = res.data.sname
				this.$emit('success')
			} else {
				this.$message({
					message: '文件上传失败,请重新上传!',
					type: 'warning'
				})
			}
		},
		handleUploadError(error, file, filelist) {
			this.$message({
				message: '文件上传失败,请重新上传!',
				type: 'warning'
			})
		},
		importexcel({ filename }) {
			return request.post(`/police/unlock/list?name=` + filename)
		},
		handleSubmitImport() {
			this.importDialogVisible = false
			return
			console.log(this.$parent)
			const that = this
			if (this.importForm.filename.length !== 0) {
				importexcel(this.importForm)
					.then(res => {
						if (res.code === 20000) {
							if (res.data.flag) {
								that.importDialogVisible = false
							} else {
								this.$message({
									message: '导入失败,错误信息如下:' + res.data.info.join(';'),
									type: 'warning'
								})
							}
						}
					})
					.catch(e => {
						console.error(e)
					})
			} else {
				this.$message({
					message: '请选择需要导入的文件!',
					type: 'info'
				})
			}
		},
		handleImport() {
			this.importDialogVisible = true
			this.submitImportDisabled = false
			this.importForm.filename = ''
			if (this.$refs.upload) {
				this.$refs.upload.clearFiles()
			}
		},
	}
}
</script>

<style>
</style>