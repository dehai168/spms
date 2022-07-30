import mapToArray from '@/utils/mapToArray'
import map from '@/const/map'
import handleEnum from '@/utils/handleEnum';
import {
    enumsItems
} from '@/api/common'
import {
    formatDate
} from '@/utils/index'
let enumData = [];
enumsItems({
        types: [1, 3]
    })
    .then(res => {
        if (res.code === 200) {
            enumData = handleEnum(res.data);
        }
    })
    .catch(e => {
        console.error(e)
    })

export default {
    getHotel() {
        return {
            基础信息: [
                [{
                        key: 'declare_type',
                        label: '申报方式',
                        type: 'radio',
                        required: true,
                        options: mapToArray(map.declare_type)
                    },
                    {
                        key: 'business_type',
                        label: '工商类型',
                        type: 'radio',
                        required: true,
                        options: mapToArray(map.business_type)
                    },
                ],
                [{
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
                [{
                        key: 'enterprise_code',
                        label: '企业编码',
                        type: 'input'
                    },
                    {
                        key: 'sign_name',
                        label: '招牌名称',
                        type: 'input'
                    },
                    {
                        key: 'area',
                        label: '占地面积（平米）',
                        type: 'input'
                    }
                ],
                [{
                        key: 'fax',
                        label: '传真',
                        type: 'input'
                    },
                    {
                        key: 'rooms',
                        label: '房间数',
                        type: 'input'
                    },
                    {
                        key: 'beds',
                        label: '床位数',
                        type: 'input'
                    }
                ],
                [{
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
                [{
                        key: 'jurisdiction_unit',
                        label: '管辖单位',
                        type: 'select',
                        options: enumData[2]
                    },
                    {
                        key: 'actual_address',
                        label: '实际经营地址',
                        type: 'input'
                    },
                    {
                        key: 'iscase',
                        label: '是否涉案',
                        type: 'select',
                        options: mapToArray(map.iscase)
                    },
                    {
                        key: 'iserror',
                        label: '是否异常',
                        type: 'select',
                        options: mapToArray(map.iserror)
                    },
                ],
                [{
                        key: 'is_standard_address',
                        label: '是否有标准地址',
                        type: 'radio',
                        options: [{
                                label: '是',
                                value: 1
                            },
                            {
                                label: '否',
                                value: 0
                            }
                        ]
                    },
                    {
                        key: 'standard_address',
                        label: '标准经营地址',
                        type: 'standardAddress',
                        span: 10
                    }
                ]
            ],
            工商信息: [
                [{
                        key: 'enterprise',
                        label: '企业名称(全称)',
                        type: 'input'
                    },
                    {
                        key: 'credit_code',
                        label: '社会信用代码',
                        type: 'input'
                    },
                    {
                        key: 'district',
                        label: '行政区域',
                        type: 'select',
                        options: enumData[3]
                    }
                ],
                [{
                        key: 'economic_type',
                        label: '经济类型',
                        type: 'select',
                        options: mapToArray(map.economic_type)
                    },
                    {
                        key: 'enterprise_telephone',
                        label: '企业电话',
                        type: 'input'
                    },
                    {
                        key: 'register_cost',
                        label: '注册资本（万元）',
                        type: 'input'
                    }
                ],
                [{
                        key: 'legal_person',
                        label: '法人姓名',
                        type: 'input'
                    },
                    {
                        key: 'legal_certificate_type',
                        label: '法人证件类型',
                        type: 'select',
                        options: mapToArray(map.legal_certificate_type)
                    },
                    {
                        key: 'legal_certificate_code',
                        label: '法人证件号码',
                        type: 'input'
                    }
                ],
                [{
                    key: 'operate_address',
                    label: '工商经营地址',
                    type: 'input'
                }],
                [{
                    key: 'operate_scale',
                    label: '经营范围（主营）',
                    type: 'input'
                }]
            ],
            管理信息: [
                [{
                        key: 'chief_person',
                        label: '单位负责人',
                        type: 'input'
                    },
                    {
                        key: 'chief_certificate_code',
                        label: '负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'chief_telephone',
                        label: '负责人联系电话',
                        type: 'input'
                    }
                ],
                [{
                        key: 'security_person',
                        label: '安保负责人',
                        type: 'input'
                    },
                    {
                        key: 'security_certificate_code',
                        label: '安保负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'security_telephone',
                        label: '安保负责人联系电话',
                        type: 'input'
                    }
                ],
                [{
                        key: 'fire_opinion_date',
                        label: '消防意见书发放日期',
                        type: 'datePicker'
                    },
                    {
                        key: 'fire_qualify_code',
                        label: '消防合格证号',
                        type: 'input'
                    },
                    {
                        key: 'fire_check_unit',
                        label: '消防审核单位',
                        type: 'input'
                    }
                ],
                [{
                    key: 'fire_check_opinion_code',
                    label: '消防审核意见书编号',
                    type: 'input'
                }],
                [{
                    key: 'remark',
                    label: '备注',
                    type: 'textarea',
                    span: 24
                }]
            ]
        }
    },
    getTrade() {
        return [{
                key: 'district',
                label: '行政区划',
                type: 'select',
                valueType: 'string',
                options: enumData[3]
            },
            {
                key: 'police_unit',
                label: '派出所名称',
                type: 'select',
                valueType: 'string',
                options: enumData[1]
            },
            {
                key: 'record_code',
                label: '备案编号',
                type: 'input'
            },
            {
                key: 'enterprise',
                label: '企业名称',
                type: 'input'
            },
            // { key: 'enterprise_address', label: '企业地址', type: 'input' },
            // { key: 'enterprise_build_no', label: '企业门楼牌号', type: 'input' },
            {
                key: 'junk_type',
                label: '分类',
                type: 'select',
                options: mapToArray(map.trade_type, 'string')
            },
            {
                key: 'chief_telephone',
                label: '经营负责人电话',
                type: 'input'
            },
            {
                key: 'enterprise_detail_address',
                label: '企业详址',
                type: 'input'
            },
            {
                key: 'enterprise_website',
                label: '企业网址',
                type: 'input'
            },
            {
                key: 'economic_type',
                label: '经济性质',
                type: 'select',
                options: mapToArray(map.economic_type)
            },
            {
                key: 'check_state',
                label: '核查状态',
                type: 'select',
                options: mapToArray(map.check_state)
            },
            {
                key: 'iscase',
                label: '是否涉案',
                type: 'select',
                options: mapToArray(map.iscase)
            },
            {
                key: 'iserror',
                label: '是否异常',
                type: 'select',
                options: mapToArray(map.iserror)
            },
            {
                key: 'special_license',
                label: '特种行业许可证编号',
                type: 'input'
            },
            {
                key: 'enterprise_permit_code',
                label: '工商营业执照编号',
                type: 'input'
            },
            {
                key: 'register_cost',
                label: '注册资金（万元）',
                type: 'input'
            },
            {
                key: 'operate_scale',
                label: '经营范围',
                type: 'input'
            },
            {
                key: 'operate_area',
                label: '经营面积（平方米）',
                type: 'input'
            },
            {
                key: 'senior_chief_unit',
                label: '上级主管部门',
                type: 'input'
            },
            {
                key: 'enterprise_telephone',
                label: '企业联系电话',
                type: 'input'
            },
            {
                key: 'legal_certificate_code',
                label: '法定代表人身份证号码',
                type: 'input'
            },
            {
                key: 'legal_person',
                label: '法定代表人姓名',
                type: 'input'
            },
            {
                key: 'legal_telephone',
                label: '法定代表人联系电话',
                type: 'input'
            },
            {
                key: 'staffs',
                label: '从业人员数',
                type: 'input'
            },
            {
                key: 'security_persons',
                label: '保安人数',
                type: 'input'
            },
            {
                key: 'register_keepers',
                label: '登记保管人员数',
                type: 'input'
            },
            {
                key: 'night_persons',
                label: '夜间值班人数',
                type: 'input'
            },
            {
                key: '房屋结构',
                label: '房屋结构',
                type: 'input',
                options: [{
                        label: 'xxx',
                        value: 1
                    },
                    {
                        label: 'xxxx',
                        value: 2
                    }
                ]
            },
            {
                key: 'fire_important_level',
                label: '消防重点单位管理级别',
                type: 'select',
                options: [{
                        label: 'xxx',
                        value: 1
                    },
                    {
                        label: 'xxxx',
                        value: 2
                    }
                ]
            },
            {
                key: 'security_chief_person',
                label: '消防负责人',
                type: 'input'
            },
            {
                key: 'security_chief_telephone',
                label: '消防负责人联系电话',
                type: 'input'
            },
            {
                key: 'fire_check_unit',
                label: '消防验收单位',
                type: 'input'
            },
            {
                key: 'fire_check_opinion',
                label: '消防验收意见',
                type: 'input'
            },
            {
                key: 'fire_check_time',
                label: '消防验收时间',
                type: 'datePicker'
            },
            {
                key: 'is_fire_regulation',
                label: '是否有安全规章制度',
                type: 'select',
                options: [{
                        label: '是',
                        value: 1
                    },
                    {
                        label: '否',
                        value: 0
                    }
                ]
            },
            // { key: '技防物防设施', label: '技防物防设施', type: 'input' },
            // { key: '填表人', label: '填表人', type: 'input' },
            // { key: '操作时间', label: '操作时间', type: 'datePicker' },
            // { key: '填表日期', label: '填表日期', type: 'datePicker' },
            // { key: '备注', label: '备注', type: 'textarea' },
        ]
    },
    getVehicleRepair() {
        return {
            '基础信息': [
                [{
                        key: 'business_state',
                        label: '营业状态',
                        type: 'select',
                        options: mapToArray(map.business_state)
                    },
                    {
                        key: 'area',
                        label: '占地面积（平米）',
                        type: 'input'
                    },
                    {
                        key: 'enterprise_code',
                        label: '企业编码',
                        type: 'input'
                    },
                ],
                [{
                        key: 'jurisdiction_unit',
                        label: '管辖单位',
                        type: 'select',
                        options: enumData[2]
                    },
                    {
                        key: 'check_state',
                        label: '核查状态',
                        type: 'select',
                        options: mapToArray(map.check_state)
                    },
                    {
                        key: 'iscase',
                        label: '是否涉案',
                        type: 'select',
                        options: mapToArray(map.iscase)
                    },
                    {
                        key: 'iserror',
                        label: '是否异常',
                        type: 'select',
                        options: mapToArray(map.iserror)
                    },
                ],
                [{
                        key: 'register_date',
                        label: '企业登记日期',
                        type: 'datePicker'
                    },
                    {
                        key: 'enterprise_address',
                        label: '地址',
                        type: 'input',
                        width: '500px',
                        span: 24
                    },
                ]
            ],
            '工商信息': [
                [{
                        key: 'enterprise',
                        label: '企业名称(全称)',
                        type: 'input'
                    },
                    {
                        key: 'credit_code',
                        label: '社会信用代码',
                        type: 'input'
                    },
                    {
                        key: 'district',
                        label: '行政区域',
                        type: 'select',
                        options: enumData[3]
                    },
                ],
                [{
                        key: 'economic_type',
                        label: '经济类型',
                        type: 'select',
                        options: mapToArray(map.economic_type)
                    },
                    {
                        key: 'enterprise_telephone',
                        label: '企业电话',
                        type: 'input'
                    },
                    {
                        key: 'register_cost',
                        label: '注册资本（万元）',
                        type: 'input'
                    },
                ],
                [{
                        key: 'legal_person',
                        label: '法人姓名',
                        type: 'input'
                    },
                    {
                        key: 'legal_certificate_type',
                        label: '法人证件类型',
                        type: 'select',
                        options: mapToArray(map.legal_certificate_type)
                    },
                    {
                        key: 'legal_certificate_code',
                        label: '法人证件号码',
                        type: 'input'
                    },
                ],
                [{
                    key: 'operate_address',
                    label: '工商经营地址',
                    type: 'input',
                    width: '500px',
                    span: 24
                }],
                [{
                    key: 'operate_scale',
                    label: '经营范围（主营）',
                    type: 'input',
                    width: '500px',
                    span: 24
                }]
            ],
            '管理信息': [
                [{
                        key: 'chief_person',
                        label: '单位负责人',
                        type: 'input'
                    },
                    {
                        key: 'chief_certificate_code',
                        label: '负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'chief_telephone',
                        label: '负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'manage_police_name',
                        label: '列管民警姓名',
                        type: 'input'
                    },
                    {
                        key: 'manage_police_telephone',
                        label: '列管民警手机',
                        type: 'input'
                    },
                ],
                [{
                    key: 'remark',
                    label: '备注',
                    type: 'textarea',
                    span: 24
                }],
            ]
        }
    },
    getScrapMetal() {
        return [{
                key: 'district',
                label: '行政区划',
                type: 'select',
                options: enumData[3]
            },
            {
                key: 'police_unit',
                label: '派出所名称',
                type: 'select',
                options: enumData[1]
            },
            {
                key: 'enterprise_vice_class',
                label: '企业副分类',
                type: 'input'
            },
            {
                key: 'enterprise',
                label: '企业名称',
                type: 'input'
            },
            // { key: 'enterprise_street', label: '企业街路巷', type: 'input' },
            // { key: 'enterprise_build_no', label: '企业门楼牌号', type: 'input' },
            {
                key: 'enterprise_detail_address',
                label: '企业详址',
                type: 'input'
            },
            {
                key: 'county_police_unit_code',
                label: '公安机关代码',
                type: 'input'
            },
            {
                key: '企业组织机构代码',
                label: '企业组织机构代码',
                type: 'input'
            },
            {
                key: '联系电话',
                label: '联系电话',
                type: 'input'
            },

            {
                key: 'post_code',
                label: '邮政编码',
                type: 'input'
            },
            {
                key: 'check_state',
                label: '核查状态',
                type: 'select',
                options: mapToArray(map.check_state)
            },
            {
                key: 'iscase',
                label: '是否涉案',
                type: 'select',
                options: mapToArray(map.iscase)
            },
            {
                key: 'iserror',
                label: '是否异常',
                type: 'select',
                options: mapToArray(map.iserror)
            },
            {
                key: 'economic_type',
                label: '经济类型',
                type: 'select',
                options: mapToArray(map.economic_type)
            },
            {
                key: 'concurrently_scale',
                label: '经营范围（主营）',
                type: 'input'
            },
            {
                key: '经营范围',
                label: '经营范围（兼营）',
                type: 'input'
            },
            {
                key: 'operate_area',
                label: '经营面积（平方米）',
                type: 'input'
            },
            {
                key: 'security_level',
                label: '治安级别',
                type: 'select',
                options: mapToArray(map.security_level, 'string')
            },
            {
                key: 'business_state',
                label: '营业状态',
                type: 'select',
                options: mapToArray(map.my_business_state)
            },
            {
                key: 'legal_person',
                label: '法定代表人姓名',
                type: 'input'
            },
            {
                key: 'legal_certificate_type',
                label: '法定代表证件类型',
                type: 'select',
                options: mapToArray(map.legal_certificate_type)
            },
            {
                key: 'legal_certificate_code',
                label: '法定代表证件号码',
                type: 'input'
            },
            {
                key: 'legal_telephone',
                label: '法人代表联系电话',
                type: 'input'
            },
            {
                key: 'open_date',
                label: '开业日期',
                type: 'datePicker'
            },
            {
                key: 'stop_date',
                label: '停业日期',
                type: 'datePicker'
            },
            {
                key: 'operate_way',
                label: '经营方式',
                type: 'input'
            },
            {
                key: 'chief_person',
                label: '单位负责人姓名',
                type: 'input'
            },
            {
                key: 'chief_certificate_type',
                label: '单位负责人证件类型',
                type: 'select',
                options: mapToArray(map.certificate_type)
            },
            {
                key: 'chief_certificate_code',
                label: '单位负责人证件号码',
                type: 'input'
            },
            {
                key: 'chief_telephone',
                label: '单位负责人联系方式',
                type: 'input'
            },
            {
                key: 'fire_check_unit',
                label: '消防审核单位',
                type: 'input'
            },
            {
                key: 'fire_qualify_code',
                label: '消防合格证号',
                type: 'input'
            },
            {
                key: 'security_enterprise_name',
                label: '保安公司名称',
                type: 'input'
            },
            {
                key: 'security_chief_identify',
                label: '保安负责人身份证号',
                type: 'input'
            },
            {
                key: 'security_chief_person',
                label: '保安负责人姓名',
                type: 'input'
            },
            {
                key: 'security_chief_telephone',
                label: '保安负责人电话',
                type: 'input'
            },
            {
                key: 'security_persons',
                label: '保安人数',
                type: 'input'
            },
            {
                key: 'post_train_persons',
                label: '经岗位培训人数',
                type: 'input'
            },
            {
                key: 'exit_total',
                label: '出口数量',
                type: 'input'
            },
            {
                key: 'room_total',
                label: '包厢包间数',
                type: 'input'
            },
            {
                key: 'is_record_register',
                label: '是否备案登记',
                type: 'input'
            },
            {
                key: 'record_code',
                label: '备案登记号',
                type: 'input'
            },
            {
                key: 'fire_appraisal_code',
                label: '消防鉴定书编号',
                type: 'input'
            },
            {
                key: 'save_time',
                label: '保存时间',
                type: 'datePicker'
            },
            {
                key: 'input_time',
                label: '录入时间',
                type: 'datePicker'
            },
            {
                key: 'annual_check_date',
                label: '年审日期',
                type: 'datePicker'
            },
        ]
    },
    getSeal() {
        return {
            '基础信息': [
                [{
                        key: 'business_state',
                        label: '营业状态',
                        type: 'select',
                        options: mapToArray(MAP.business_state)
                    },
                    {
                        key: 'trade_type',
                        label: '行业分类',
                        type: 'select',
                        options: mapToArray(MAP.seal_trade_type)
                    },
                    {
                        key: 'enterprise_code',
                        label: '企业编码',
                        type: 'input'
                    },
                ],
                [

                    {
                        key: 'sign_name',
                        label: '招牌名称',
                        type: 'input'
                    },
                    {
                        key: 'area',
                        label: '占地面积（平米）',
                        type: 'input'
                    },
                    {
                        key: 'fax',
                        label: '传真',
                        type: 'input'
                    },
                ],

                [{
                        key: 'record_police_unit',
                        label: '许可备案公安机关',
                        type: 'input',
                    },
                    {
                        key: 'check_state',
                        label: '核查状态',
                        type: 'select',
                        options: mapToArray(MAP.check_state)
                    },
                    {
                        key: 'iscase',
                        label: '是否涉案',
                        type: 'select',
                        options: mapToArray(MAP.iscase)
                    },
                    {
                        key: 'iserror',
                        label: '是否异常',
                        type: 'select',
                        options: mapToArray(MAP.iserror)
                    },
                ],

                [{
                        key: 'police_unit',
                        label: '管辖单位',
                        type: 'select',
                        options: mapToArray(MAP.jurisdiction_unit),
                    },
                    {
                        key: 'actual_address',
                        label: '实际经营地址',
                        type: 'input'
                    },
                ],
                [{
                        key: 'is_standard_address',
                        label: '是否有标准地址',
                        type: 'radio',
                        options: [{
                                label: '是',
                                value: 1
                            },
                            {
                                label: '否',
                                value: 0
                            }
                        ]
                    },
                    {
                        key: 'standard_address',
                        label: '标准经营地址',
                        type: 'standardAddress'
                    },

                ]
            ],
            '工商信息': [
                [{
                        key: 'enterprise',
                        label: '企业名称(全称)',
                        type: 'input'
                    },
                    {
                        key: 'credit_code',
                        label: '社会信用代码',
                        type: 'input'
                    },
                    {
                        key: 'district',
                        label: '行政区域',
                        type: 'select',
                        options: mapToArray(MAP.district, 'string')
                    },
                ],
                [{
                        key: 'economic_type',
                        label: '经济类型',
                        type: 'select',
                        options: mapToArray(MAP.economic_type)
                    },
                    {
                        key: 'enterprise_telephone',
                        label: '企业电话',
                        type: 'input'
                    },
                    {
                        key: 'register_cost',
                        label: '注册资本（万元）',
                        type: 'input'
                    },
                ],
                [{
                        key: 'legal_person',
                        label: '法人姓名',
                        type: 'input'
                    },
                    {
                        key: 'legal_certificate_type',
                        label: '法人证件类型',
                        type: 'select',
                        options: mapToArray(MAP.legal_certificate_type)
                    },
                    {
                        key: 'legal_certificate_code',
                        label: '法人证件号码',
                        type: 'input'
                    },
                ],
                [{
                    key: 'operate_address',
                    label: '工商经营地址',
                    type: 'input'
                }, ],
                [{
                    key: 'operate_scale',
                    label: '经营范围（主营）',
                    type: 'input'
                }]
            ],
            '管理信息': [
                [{
                        key: 'chief_person',
                        label: '单位负责人',
                        type: 'input'
                    },
                    {
                        key: 'chief_certificate_code',
                        label: '负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'chief_telephone',
                        label: '负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'security_person',
                        label: '安保负责人',
                        type: 'input'
                    },
                    {
                        key: 'security_certificate_code',
                        label: '安保负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'security_telephone',
                        label: '安保负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'fire_opinion_date',
                        label: '消防意见书发放日期',
                        type: 'datePicker'
                    },
                    {
                        key: 'fire_qualify_code',
                        label: '消防合格证号',
                        type: 'input'
                    },
                    {
                        key: 'fire_check_unit',
                        label: '消防审核单位',
                        type: 'input'
                    },
                ],
                [{
                    key: 'fire_check_opinion_code',
                    label: '消防审核意见书编号',
                    type: 'input'
                }, ],
                [{
                    key: 'remark',
                    label: '备注',
                    type: 'textarea',
                    span: 24
                }]
            ]
        }
    },
    getKtv() {
        return [{
                label: 'KTV编号',
                key: 'ktvid',
                type: 'input',
                disabled: true
            },
            {
                label: '行业类别',
                key: 'trade_type',
                options: mapToArray(MAP.entertainment_type),
                type: 'select'
            },
            {
                label: '治安管理机构',
                key: 'security_manage_unit',
                type: 'select',
                options: mapToArray(MAP.jurisdiction_unit, 'string')
            },
            {
                label: '场所分类',
                key: 'place_main_type',
                type: 'input'
            },
            {
                label: '场所分类（副）',
                key: 'place_vice_type',
                type: 'input'
            },
            {
                label: '场所备案编号',
                key: 'record_code',
                type: 'input'
            },
            {
                label: '娱乐场所名称',
                key: 'recreation_place_name',
                type: 'input'
            },
            {
                label: '简称',
                key: 'recreation_place_short',
                type: 'input'
            },
            {
                key: 'check_state',
                label: '核查状态',
                type: 'select',
                options: mapToArray(MAP.check_state)
            },
            {
                key: 'iscase',
                label: '是否涉案',
                type: 'select',
                options: mapToArray(MAP.iscase)
            },
            {
                key: 'iserror',
                label: '是否异常',
                type: 'select',
                options: mapToArray(MAP.iserror)
            },
            {
                label: '户外悬挂',
                key: 'outdoor_hang',
                type: 'input'
            },
            {
                label: '联系电话',
                key: 'telephone',
                type: 'input'
            },
            {
                label: '邮政编码',
                key: 'post_code',
                type: 'input'
            },
            {
                label: '传真',
                key: 'fax',
                type: 'input'
            },
            {
                label: '经济类型',
                key: 'economic_type',
                options: mapToArray(MAP.economic_type),
                type: 'select'
            },
            {
                label: '注册资金（万元）',
                key: 'register_cost',
                type: 'input'
            },
            {
                label: '经营范围（主营）',
                key: 'operate_scale',
                type: 'input'
            },
            {
                label: '经营范围（兼营）',
                key: 'concurrently_scale',
                type: 'input'
            },
            {
                label: '经营面积',
                key: 'operate_area',
                type: 'input'
            },
            {
                label: '法定代表人姓名',
                key: 'legal_person',
                type: 'input'
            },
            {
                label: '法人证件类型',
                key: 'legal_certificate_type',
                options: mapToArray(MAP.legal_certificate_type),
                type: 'select'
            },
            {
                label: '法人证件号码',
                key: 'legal_certificate_code',
                type: 'input'
            },
            {
                label: '法人联系方式',
                key: 'legal_telephone',
                type: 'input'
            },
            {
                label: '开业日期',
                key: 'open_date',
                type: 'input'
            },
            {
                label: '营业时间',
                key: 'operate_time',
                type: 'input'
            },
            {
                label: '单位负责人',
                key: 'chief_person',
                type: 'input'
            },
            {
                label: '单位负责人联系方式',
                key: 'chief_telephone',
                type: 'input'
            },
            {
                label: '单位负责人身份证号',
                key: 'chief_certificate_code',
                type: 'input'
            },
            {
                label: '娱乐服务场所治安级别',
                key: 'security_level',
                options: mapToArray(MAP.security_level),
                type: 'select'
            },
            {
                label: '营业执照编号',
                key: 'license_code',
                type: 'input'
            },
            {
                label: '营业执照发证机关',
                key: 'license_org',
                type: 'input'
            },
            {
                label: '营业执照起始日期',
                key: 'license_begin',
                type: 'datePicker'
            },
            {
                label: '营业执照截止日期',
                key: 'license_end',
                type: 'datePicker'
            },
            {
                label: '营业执照登记日期',
                key: 'license_register_date',
                type: 'datePicker'
            },
            {
                label: '组织机构代码',
                key: 'group_code',
                type: 'input'
            },
            {
                label: '是否有证',
                key: 'is_permit',
                options: [{
                        label: '是',
                        value: true
                    },
                    {
                        label: '否',
                        value: false
                    },
                ],
                type: 'select'
            },
            {
                label: '娱乐经营许可证号',
                key: 'permit_code',
                type: 'input'
            },
            {
                label: '娱乐经营许可证发证机关',
                key: 'permit_org',
                type: 'input'
            },
            {
                label: '娱乐经营许可证起始日期',
                key: 'permit_begin',
                type: 'datePicker'
            },
            {
                label: '娱乐经营许可证截止日期',
                key: 'permit_end',
                type: 'datePicker'
            },
            {
                label: '股东情况',
                key: 'shareholders',
                type: 'input'
            },
            // { label: '娱乐项目内容', key: '营业性娱乐场所' ,type: 'input'},

            {
                label: '消防合格证号',
                key: 'fire_qualify_code',
                type: 'input'
            },
            {
                label: '消防审核单位',
                key: 'fire_check_unit',
                type: 'input'
            },
            {
                label: '经度',
                key: 'lng',
                type: 'input'
            },
            {
                label: '纬度',
                key: 'lat',
                type: 'input'
            },
            {
                label: '核定消费者数量（人）',
                key: 'max_consumers',
                type: 'input'
            },
            {
                label: '安全出口数量（个）',
                key: 'exit_total',
                type: 'input'
            },
            {
                label: '包厢包间数量（个）',
                key: 'rooms',
                type: 'input'
            },
            {
                label: '总人数（人）',
                key: 'persons',
                type: 'input'
            },
            {
                label: '治安负责人',
                key: 'security_chief_person',
                type: 'input'
            },
            {
                label: '保安人数（人）',
                key: 'security_persons',
                type: 'input'
            },
            {
                label: '经岗位培训人数（人）',
                key: 'post_train_persons',
                type: 'input'
            },
            {
                label: '保安公司意见',
                key: 'security_unit_opinion',
                type: 'input'
            },
            {
                label: '备注',
                key: 'remark',
                type: 'input'
            },
            {
                label: '录入时间',
                key: 'input_time',
                type: 'datePicker'
            },
        ]
    },
    getBar() {
        return [{
                label: '酒吧编号',
                key: 'barid',
                type: 'input',
                disabled: true
            },
            {
                label: '行业类别',
                key: 'trade_type',
                options: mapToArray(MAP.entertainment_type),
                type: 'select'
            },
            {
                label: '治安管理机构',
                key: 'security_manage_unit',
                type: 'select',
                options: mapToArray(MAP.jurisdiction_unit, 'string')
            },
            {
                label: '场所分类',
                key: 'place_main_type',
                type: 'input'
            },
            {
                label: '场所分类（副）',
                key: 'place_vice_type',
                type: 'input'
            },
            {
                label: '场所备案编号',
                key: 'record_code',
                type: 'input'
            },
            {
                label: '娱乐场所名称',
                key: 'recreation_place_name',
                type: 'input'
            },
            {
                label: '简称',
                key: 'recreation_place_short',
                type: 'input'
            },
            {
                key: 'check_state',
                label: '核查状态',
                type: 'select',
                options: mapToArray(MAP.check_state)
            },
            {
                key: 'iscase',
                label: '是否涉案',
                type: 'select',
                options: mapToArray(MAP.iscase)
            },
            {
                key: 'iserror',
                label: '是否异常',
                type: 'select',
                options: mapToArray(MAP.iserror)
            },
            {
                label: '户外悬挂',
                key: 'outdoor_hang',
                type: 'input'
            },
            {
                label: '联系电话',
                key: 'telephone',
                type: 'input'
            },
            {
                label: '邮政编码',
                key: 'post_code',
                type: 'input'
            },
            {
                label: '传真',
                key: 'fax',
                type: 'input'
            },
            {
                label: '经济类型',
                key: 'economic_type',
                options: mapToArray(MAP.economic_type),
                type: 'select'
            },
            {
                label: '注册资金（万元）',
                key: 'register_cost',
                type: 'input'
            },
            {
                label: '经营范围（主营）',
                key: 'operate_scale',
                type: 'input'
            },
            {
                label: '经营范围（兼营）',
                key: 'concurrently_scale',
                type: 'input'
            },
            {
                label: '经营面积',
                key: 'operate_area',
                type: 'input'
            },
            {
                label: '法定代表人姓名',
                key: 'legal_person',
                type: 'input'
            },
            {
                label: '法人证件类型',
                key: 'legal_certificate_type',
                options: mapToArray(MAP.legal_certificate_type),
                type: 'select'
            },
            {
                label: '法人证件号码',
                key: 'legal_certificate_code',
                type: 'input'
            },
            {
                label: '法人联系方式',
                key: 'legal_telephone',
                type: 'input'
            },
            {
                label: '开业日期',
                key: 'open_date',
                type: 'input'
            },
            {
                label: '营业时间',
                key: 'operate_time',
                type: 'input'
            },
            {
                label: '单位负责人',
                key: 'chief_person',
                type: 'input'
            },
            {
                label: '单位负责人联系方式',
                key: 'chief_telephone',
                type: 'input'
            },
            {
                label: '单位负责人身份证号',
                key: 'chief_certificate_code',
                type: 'input'
            },
            {
                label: '娱乐服务场所治安级别',
                key: 'security_level',
                options: mapToArray(MAP.security_level),
                type: 'select'
            },
            {
                label: '营业执照编号',
                key: 'license_code',
                type: 'input'
            },
            {
                label: '营业执照发证机关',
                key: 'license_org',
                type: 'input'
            },
            {
                label: '营业执照起始日期',
                key: 'license_begin',
                type: 'datePicker'
            },
            {
                label: '营业执照截止日期',
                key: 'license_end',
                type: 'datePicker'
            },
            {
                label: '营业执照登记日期',
                key: 'license_register_date',
                type: 'datePicker'
            },
            {
                label: '组织机构代码',
                key: 'group_code',
                type: 'input'
            },
            {
                label: '是否有证',
                key: 'is_permit',
                options: [{
                        label: '是',
                        value: true
                    },
                    {
                        label: '否',
                        value: false
                    },
                ],
                type: 'select'
            },
            {
                label: '娱乐经营许可证号',
                key: 'permit_code',
                type: 'input'
            },
            {
                label: '娱乐经营许可证发证机关',
                key: 'permit_org',
                type: 'input'
            },
            {
                label: '娱乐经营许可证起始日期',
                key: 'permit_begin',
                type: 'datePicker'
            },
            {
                label: '娱乐经营许可证截止日期',
                key: 'permit_end',
                type: 'datePicker'
            },
            {
                label: '股东情况',
                key: 'shareholders',
                type: 'input'
            },
            // { label: '娱乐项目内容', key: '营业性娱乐场所' ,type: 'input'},

            {
                label: '消防合格证号',
                key: 'fire_qualify_code',
                type: 'input'
            },
            {
                label: '消防审核单位',
                key: 'fire_check_unit',
                type: 'input'
            },
            {
                label: '经度',
                key: 'lng',
                type: 'input'
            },
            {
                label: '纬度',
                key: 'lat',
                type: 'input'
            },
            {
                label: '核定消费者数量（人）',
                key: 'max_consumers',
                type: 'input'
            },
            {
                label: '安全出口数量（个）',
                key: 'exit_total',
                type: 'input'
            },
            {
                label: '包厢包间数量（个）',
                key: 'rooms',
                type: 'input'
            },
            {
                label: '总人数（人）',
                key: 'persons',
                type: 'input'
            },
            {
                label: '治安负责人',
                key: 'security_chief_person',
                type: 'input'
            },
            {
                label: '保安人数（人）',
                key: 'security_persons',
                type: 'input'
            },
            {
                label: '经岗位培训人数（人）',
                key: 'post_train_persons',
                type: 'input'
            },
            {
                label: '保安公司意见',
                key: 'security_unit_opinion',
                type: 'input'
            },
            {
                label: '备注',
                key: 'remark',
                type: 'input'
            },
            {
                label: '录入时间',
                key: 'input_time',
                type: 'datePicker'
            },
        ]
    },
    getPawn() {
        return {
            '基础信息': [
                [{
                        key: 'business_state',
                        label: '营业状态',
                        type: 'select',
                        options: mapToArray(MAP.business_state)
                    },
                    {
                        key: 'trade_type',
                        label: '行业分类',
                        type: 'select',
                        options: mapToArray(MAP.pawn_trade_type)
                    },
                    {
                        key: 'enterprise_code',
                        label: '企业编码',
                        type: 'input'
                    },
                ],
                [

                    {
                        key: 'sign_name',
                        label: '招牌名称',
                        type: 'input'
                    },
                    {
                        key: 'area',
                        label: '占地面积（平米）',
                        type: 'input'
                    },
                    {
                        key: 'fax',
                        label: '传真',
                        type: 'input'
                    },
                ],

                [{
                        key: 'record_police_unit',
                        label: '许可备案公安机关',
                        type: 'input',
                    },
                    {
                        key: 'check_state',
                        label: '核查状态',
                        type: 'select',
                        options: mapToArray(MAP.check_state)
                    },
                    {
                        key: 'iscase',
                        label: '是否涉案',
                        type: 'select',
                        options: mapToArray(MAP.iscase)
                    },
                    {
                        key: 'iserror',
                        label: '是否异常',
                        type: 'select',
                        options: mapToArray(MAP.iserror)
                    },
                ],

                [{
                        key: 'police_unit',
                        label: '管辖单位',
                        type: 'select',
                        options: mapToArray(MAP.jurisdiction_unit),
                    },
                    {
                        key: 'actual_address',
                        label: '实际经营地址',
                        type: 'input'
                    },
                ],
                [{
                        key: 'is_standard_address',
                        label: '是否有标准地址',
                        type: 'radio',
                        options: [{
                                label: '是',
                                value: 1
                            },
                            {
                                label: '否',
                                value: 0
                            }
                        ]
                    },
                    {
                        key: 'standard_address',
                        label: '标准经营地址',
                        type: 'standardAddress'
                    },

                ]
            ],
            '工商信息': [
                [{
                        key: 'enterprise',
                        label: '企业名称(全称)',
                        type: 'input'
                    },
                    {
                        key: 'credit_code',
                        label: '社会信用代码',
                        type: 'input'
                    },
                    {
                        key: 'district',
                        label: '行政区域',
                        type: 'select',
                        options: mapToArray(MAP.district, 'string')
                    },
                ],
                [{
                        key: 'economic_type',
                        label: '经济类型',
                        type: 'select',
                        options: mapToArray(MAP.economic_type)
                    },
                    {
                        key: 'enterprise_telephone',
                        label: '企业电话',
                        type: 'input'
                    },
                    {
                        key: 'register_cost',
                        label: '注册资本（万元）',
                        type: 'input'
                    },
                ],
                [{
                        key: 'legal_person',
                        label: '法人姓名',
                        type: 'input'
                    },
                    {
                        key: 'legal_certificate_type',
                        label: '法人证件类型',
                        type: 'select',
                        options: mapToArray(MAP.legal_certificate_type)
                    },
                    {
                        key: 'legal_certificate_code',
                        label: '法人证件号码',
                        type: 'input'
                    },
                ],
                [{
                    key: 'operate_address',
                    label: '工商经营地址',
                    type: 'input'
                }, ],
                [{
                    key: 'operate_scale',
                    label: '经营范围（主营）',
                    type: 'input'
                }]
            ],
            '管理信息': [
                [{
                        key: 'chief_person',
                        label: '单位负责人',
                        type: 'input'
                    },
                    {
                        key: 'chief_certificate_code',
                        label: '负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'chief_telephone',
                        label: '负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'security_person',
                        label: '安保负责人',
                        type: 'input'
                    },
                    {
                        key: 'security_certificate_code',
                        label: '安保负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'security_telephone',
                        label: '安保负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'fire_opinion_date',
                        label: '消防意见书发放日期',
                        type: 'datePicker'
                    },
                    {
                        key: 'fire_qualify_code',
                        label: '消防合格证号',
                        type: 'input'
                    },
                    {
                        key: 'fire_check_unit',
                        label: '消防审核单位',
                        type: 'input'
                    },
                ],
                [{
                    key: 'fire_check_opinion_code',
                    label: '消防审核意见书编号',
                    type: 'input'
                }, ],
                [{
                    key: 'remark',
                    label: '备注',
                    type: 'textarea',
                    span: 24
                }]
            ]
        };
    },
    getUnlock() {
        return {
            '基础信息': [
                [{
                        key: 'business_state',
                        label: '营业状态',
                        type: 'select',
                        options: mapToArray(MAP.business_state)
                    },
                    {
                        key: 'trade_type',
                        label: '行业分类',
                        type: 'select',
                        options: mapToArray(MAP.unlock_trade_type)
                    },
                    {
                        key: 'enterprise_code',
                        label: '企业编码',
                        type: 'input'
                    },
                ],
                [

                    {
                        key: 'sign_name',
                        label: '招牌名称',
                        type: 'input'
                    },
                    {
                        key: 'area',
                        label: '占地面积（平米）',
                        type: 'input'
                    },
                    {
                        key: 'fax',
                        label: '传真',
                        type: 'input'
                    },
                ],

                [{
                        key: 'record_police_unit',
                        label: '许可备案公安机关',
                        type: 'input',
                    },
                    {
                        key: 'check_state',
                        label: '核查状态',
                        type: 'select',
                        options: mapToArray(MAP.check_state)
                    },
                    {
                        key: 'iscase',
                        label: '是否涉案',
                        type: 'select',
                        options: mapToArray(MAP.iscase)
                    },
                    {
                        key: 'iserror',
                        label: '是否异常',
                        type: 'select',
                        options: mapToArray(MAP.iserror)
                    },
                ],

                [{
                        key: 'police_unit',
                        label: '管辖单位',
                        type: 'select',
                        options: mapToArray(MAP.jurisdiction_unit),
                    },
                    {
                        key: 'actual_address',
                        label: '实际经营地址',
                        type: 'input'
                    },
                ],
                [{
                        key: 'is_standard_address',
                        label: '是否有标准地址',
                        type: 'radio',
                        options: [{
                                label: '是',
                                value: 1
                            },
                            {
                                label: '否',
                                value: 0
                            }
                        ]
                    },
                    {
                        key: 'standard_address',
                        label: '标准经营地址',
                        type: 'standardAddress'
                    },

                ]
            ],
            '工商信息': [
                [{
                        key: 'enterprise',
                        label: '企业名称(全称)',
                        type: 'input'
                    },
                    {
                        key: 'credit_code',
                        label: '社会信用代码',
                        type: 'input'
                    },
                    {
                        key: 'district',
                        label: '行政区域',
                        type: 'select',
                        options: mapToArray(MAP.district, 'string')
                    },
                ],
                [{
                        key: 'economic_type',
                        label: '经济类型',
                        type: 'select',
                        options: mapToArray(MAP.economic_type)
                    },
                    {
                        key: 'enterprise_telephone',
                        label: '企业电话',
                        type: 'input'
                    },
                    {
                        key: 'register_cost',
                        label: '注册资本（万元）',
                        type: 'input'
                    },
                ],
                [{
                        key: 'legal_person',
                        label: '法人姓名',
                        type: 'input'
                    },
                    {
                        key: 'legal_certificate_type',
                        label: '法人证件类型',
                        type: 'select',
                        options: mapToArray(MAP.legal_certificate_type)
                    },
                    {
                        key: 'legal_certificate_code',
                        label: '法人证件号码',
                        type: 'input'
                    },
                ],
                [{
                    key: 'operate_address',
                    label: '工商经营地址',
                    type: 'input'
                }, ],
                [{
                    key: 'operate_scale',
                    label: '经营范围（主营）',
                    type: 'input'
                }]
            ],
            '管理信息': [
                [{
                        key: 'chief_person',
                        label: '单位负责人',
                        type: 'input'
                    },
                    {
                        key: 'chief_certificate_code',
                        label: '负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'chief_telephone',
                        label: '负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'security_person',
                        label: '安保负责人',
                        type: 'input'
                    },
                    {
                        key: 'security_certificate_code',
                        label: '安保负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'security_telephone',
                        label: '安保负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'fire_opinion_date',
                        label: '消防意见书发放日期',
                        type: 'datePicker'
                    },
                    {
                        key: 'fire_qualify_code',
                        label: '消防合格证号',
                        type: 'input'
                    },
                    {
                        key: 'fire_check_unit',
                        label: '消防审核单位',
                        type: 'input'
                    },
                ],
                [{
                    key: 'fire_check_opinion_code',
                    label: '消防审核意见书编号',
                    type: 'input'
                }, ],
                [{
                    key: 'remark',
                    label: '备注',
                    type: 'textarea',
                    span: 24
                }]
            ]
        };
    },
    getPrint() {
        return {
            '基础信息': [
                [{
                        key: 'business_state',
                        label: '营业状态',
                        type: 'select',
                        options: mapToArray(MAP.business_state)
                    },
                    {
                        key: 'trade_type',
                        label: '行业分类',
                        type: 'select',
                        options: mapToArray(MAP.print_trade_type)
                    },
                    {
                        key: 'enterprise_code',
                        label: '企业编码',
                        type: 'input'
                    },
                ],
                [

                    {
                        key: 'sign_name',
                        label: '招牌名称',
                        type: 'input'
                    },
                    {
                        key: 'area',
                        label: '占地面积（平米）',
                        type: 'input'
                    },
                    {
                        key: 'fax',
                        label: '传真',
                        type: 'input'
                    },
                ],

                [{
                        key: 'record_police_unit',
                        label: '许可备案公安机关',
                        type: 'input',
                    },
                    {
                        key: 'check_state',
                        label: '核查状态',
                        type: 'select',
                        options: mapToArray(MAP.check_state)
                    },
                    {
                        key: 'iscase',
                        label: '是否涉案',
                        type: 'select',
                        options: mapToArray(MAP.iscase)
                    },
                    {
                        key: 'iserror',
                        label: '是否异常',
                        type: 'select',
                        options: mapToArray(MAP.iserror)
                    },
                ],

                [{
                        key: 'police_unit',
                        label: '管辖单位',
                        type: 'select',
                        options: mapToArray(MAP.jurisdiction_unit),
                    },
                    {
                        key: 'actual_address',
                        label: '实际经营地址',
                        type: 'input'
                    },
                ],
                [{
                        key: 'is_standard_address',
                        label: '是否有标准地址',
                        type: 'radio',
                        options: [{
                                label: '是',
                                value: 1
                            },
                            {
                                label: '否',
                                value: 0
                            }
                        ]
                    },
                    {
                        key: 'standard_address',
                        label: '标准经营地址',
                        type: 'standardAddress'
                    },

                ]
            ],
            '工商信息': [
                [{
                        key: 'enterprise',
                        label: '企业名称(全称)',
                        type: 'input'
                    },
                    {
                        key: 'credit_code',
                        label: '社会信用代码',
                        type: 'input'
                    },
                    {
                        key: 'district',
                        label: '行政区域',
                        type: 'select',
                        options: mapToArray(MAP.district, 'string')
                    },
                ],
                [{
                        key: 'economic_type',
                        label: '经济类型',
                        type: 'select',
                        options: mapToArray(MAP.economic_type)
                    },
                    {
                        key: 'enterprise_telephone',
                        label: '企业电话',
                        type: 'input'
                    },
                    {
                        key: 'register_cost',
                        label: '注册资本（万元）',
                        type: 'input'
                    },
                ],
                [{
                        key: 'legal_person',
                        label: '法人姓名',
                        type: 'input'
                    },
                    {
                        key: 'legal_certificate_type',
                        label: '法人证件类型',
                        type: 'select',
                        options: mapToArray(MAP.legal_certificate_type)
                    },
                    {
                        key: 'legal_certificate_code',
                        label: '法人证件号码',
                        type: 'input'
                    },
                ],
                [{
                    key: 'operate_address',
                    label: '工商经营地址',
                    type: 'input'
                }, ],
                [{
                    key: 'operate_scale',
                    label: '经营范围（主营）',
                    type: 'input'
                }]
            ],
            '管理信息': [
                [{
                        key: 'chief_person',
                        label: '单位负责人',
                        type: 'input'
                    },
                    {
                        key: 'chief_certificate_code',
                        label: '负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'chief_telephone',
                        label: '负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'security_person',
                        label: '安保负责人',
                        type: 'input'
                    },
                    {
                        key: 'security_certificate_code',
                        label: '安保负责人证件号码',
                        type: 'input'
                    },
                    {
                        key: 'security_telephone',
                        label: '安保负责人联系电话',
                        type: 'input'
                    },
                ],
                [{
                        key: 'fire_opinion_date',
                        label: '消防意见书发放日期',
                        type: 'datePicker'
                    },
                    {
                        key: 'fire_qualify_code',
                        label: '消防合格证号',
                        type: 'input'
                    },
                    {
                        key: 'fire_check_unit',
                        label: '消防审核单位',
                        type: 'input'
                    },
                ],
                [{
                    key: 'fire_check_opinion_code',
                    label: '消防审核意见书编号',
                    type: 'input'
                }, ],
                [{
                    key: 'remark',
                    label: '备注',
                    type: 'textarea',
                    span: 24
                }]
            ]
        };
    }
}