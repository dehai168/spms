
// 无详情接口 
<template>
    <!-- 新增 编辑 -->
    <el-dialog class="hotel-base-add" :title="dialogTittle" :visible.sync="dialogVisible" width="70%" top="4vh"
        :close-on-click-modal="false">
        <el-form ref="addEditForm" :model="addEditForm" label-width="10vw" :inline="true" label-suffix=":"
            :disabled="type == 'detail'">
            <div style="display: flex; justify-content: space-around">
                <el-form-item label="申报方式" required>
                    <el-radio-group v-model="addEditForm.declare_type">
                        <el-radio :label="0">告知承诺制</el-radio>
                        <el-radio :label="1">一般审批制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="工商类型" required>
                    <el-radio-group v-model="addEditForm.business_type">
                        <el-radio :label="0">个体工商户</el-radio>
                        <el-radio :label="2">工商企业</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>

            <my-card v-for="(cardItem, title, index) in addEditformItems" :key="index" :title="title">
                <el-row v-for="(row, rowIndex) in cardItem" :key="rowIndex">
                    <el-col v-for="formItem in row" :key="formItem.key" :span="formItem.span || 8">
                        <el-form-item v-if="formItem.type !== 'standardAddress'" :label="formItem.label">
                            <el-select v-if="formItem.type == 'select'" v-model="addEditForm[formItem.key]"
                                style="width: 11vw" placeholder="请选择">
                                <el-option v-for="option in formItem.options" :key="option.value" :value="option.value"
                                    :label="option.label" />
                            </el-select>
                            <el-input v-else-if="formItem.type == 'input'" v-model="addEditForm[formItem.key]"
                                style="width: 11vw" />
                            <el-input v-else-if="formItem.type == 'textarea'" v-model="addEditForm[formItem.key]"
                                type="textarea" style="width: 500px" />
                            <el-date-picker v-else-if="formItem.type == 'datePicker'"
                                v-model="addEditForm[formItem.key]" style="width: 11vw" type="date"
                                placeholder="请选择日期" />
                            <el-radio-group v-else-if="formItem.type == 'radio'" v-model="addEditForm[formItem.key]">
                                <el-radio v-for="option in formItem.options" :key="option.value" :label="option.value">
                                    {{ option.label
                                    }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 标准地址根据用户选择 显示   这里单独处理 -->
                        <el-form-item
                            v-else-if="formItem.type == 'standardAddress' && addEditForm.is_standard_address == 1"
                            :label="formItem.label">
                            <el-input v-model="addEditForm.standardAddress" style="width: 12vw" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </my-card>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="submitDisabled" @click="handleOk">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import mapToArray from '@/utils/mapToArray'
import map from '@/const/map'
import { enumsItems } from '@/api/common'
import handleEnum from '@/utils/handleEnum'
export default {
    props: {
        type: {
            type: String,
            default: 'add'
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        submitDisabled: {
            type: Boolean,
            default: false
        },
        onOk: {
            type: Function,
            default: ()=>{}
        },
    },
    data() {
        return {
            addEditForm: {
                declare_type: '0',
                business_type: '0'
            },
            enumData: {},
        }
    },
    computed: {
        dialogTittle() {
            let tittle = ''
            switch (this.type) {
                case 'edit':
                    tittle = '编辑旅馆信息'
                    break
                case 'add':
                    tittle = '新增旅馆信息'
                    break
                case 'detail':
                    tittle = '旅馆信息详情'
                    break
            }

            return tittle
        },
        addEditformItems() {
            return {
                基础信息: [
                    [
                        {
                            key: 'business_state',
                            label: '营业状态',
                            type: 'select',
                            options: mapToArray(map.business_state)
                        },
                        {
                            key: 'check_state',
                            label: '核查状态',
                            type: 'select',
                            options: mapToArray(map.check_state)
                        },
                        {
                            key: 'trade_type',
                            label: '行业分类',
                            type: 'select',
                            options: mapToArray(map.hotel_trade_type)
                        }
                    ],
                    [
                        { key: 'enterprise_code', label: '企业编码', type: 'input' },
                        { key: 'sign_name', label: '招牌名称', type: 'input' },
                        { key: 'area', label: '占地面积（平米）', type: 'input' }
                    ],
                    [
                        { key: 'fax', label: '传真', type: 'input' },
                        { key: 'rooms', label: '房间数', type: 'input' },
                        { key: 'beds', label: '床位数', type: 'input' }
                    ],
                    [
                        {
                            key: 'hotel_star',
                            label: '旅馆星级',
                            type: 'select',
                            options: mapToArray(map.hotel_star)
                        },
                        {
                            key: 'hotel_level',
                            label: '旅馆等级',
                            type: 'select',
                            options: mapToArray(map.hotel_level)
                        },
                        {
                            key: 'install_state',
                            label: '安装状态',
                            type: 'select',
                            options: mapToArray(map.install_state)
                        }
                    ],
                    [
                        {
                            key: 'jurisdiction_unit',
                            label: '管辖单位',
                            type: 'select',
                            options: this.enumData[2]
                        },
                        { key: 'actual_address', label: '实际经营地址', type: 'input' },
                        {
                            key: 'iscase',
                            label: '是否涉案',
                            type: 'select',
                            options: mapToArray(map.iscase)
                        }
                    ],
                    [
                        {
                            key: 'is_standard_address',
                            label: '是否有标准地址',
                            type: 'radio',
                            options: [
                                { label: '是', value: 1 },
                                { label: '否', value: 0 }
                            ]
                        },
                        { key: 'standard_address', label: '标准经营地址', type: 'standardAddress', span: 10 }
                    ]
                ],
                工商信息: [
                    [
                        { key: 'enterprise', label: '企业名称(全称)', type: 'input' },
                        { key: 'credit_code', label: '社会信用代码', type: 'input' },
                        {
                            key: 'district',
                            label: '行政区域',
                            type: 'select',
                            options: this.enumData[3]
                        }
                    ],
                    [
                        {
                            key: 'economic_type',
                            label: '经济类型',
                            type: 'select',
                            options: mapToArray(map.economic_type)
                        },
                        { key: 'enterprise_telephone', label: '企业电话', type: 'input' },
                        { key: 'register_cost', label: '注册资本（万元）', type: 'input' }
                    ],
                    [
                        { key: 'legal_person', label: '法人姓名', type: 'input' },
                        {
                            key: 'legal_certificate_type',
                            label: '法人证件类型',
                            type: 'select',
                            options: mapToArray(map.legal_certificate_type)
                        },
                        { key: 'legal_certificate_code', label: '法人证件号码', type: 'input' }
                    ],
                    [{ key: 'operate_address', label: '工商经营地址', type: 'input' }],
                    [{ key: 'operate_scale', label: '经营范围（主营）', type: 'input' }]
                ],
                管理信息: [
                    [
                        { key: 'chief_person', label: '单位负责人', type: 'input' },
                        { key: 'chief_certificate_code', label: '负责人证件号码', type: 'input' },
                        { key: 'chief_telephone', label: '负责人联系电话', type: 'input' }
                    ],
                    [
                        { key: 'security_person', label: '安保负责人', type: 'input' },
                        { key: 'security_certificate_code', label: '安保负责人证件号码', type: 'input' },
                        { key: 'security_telephone', label: '安保负责人联系电话', type: 'input' }
                    ],
                    [
                        { key: 'fire_opinion_date', label: '消防意见书发放日期', type: 'datePicker' },
                        { key: 'fire_qualify_code', label: '消防合格证号', type: 'input' },
                        { key: 'fire_check_unit', label: '消防审核单位', type: 'input' }
                    ],
                    [{ key: 'fire_check_opinion_code', label: '消防审核意见书编号', type: 'input' }],
                    [{ key: 'remark', label: '备注', type: 'textarea', span: 24 }]
                ]
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init(callback) {
            // 初始化异步操作，例如数据字典
            enumsItems({ types: [2] })
                .then(res => {
                    if (res.code === 200) {
                        this.enumData = handleEnum(res.data)
                        callback && callback()
                    }
                })
                .catch(e => {
                    console.error(e)
                })
        },
        handleOk(){
            this.onOk && this.onOk();
        }
    },

}
</script>

<style lang="scss" scoped>
</style>