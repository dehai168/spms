import { enumsItems } from '../api/common'
const map = {
  // 行业类别
  trade_type: {
    1: '旧货门市（市场内）',
    2: '旧货门市（市场外）',
    3: '旧货市场',
    4: '旧货摊点（市场内）',
    5: '旧货摊点（市场外）',
    99: '其他',
  },
  trade_type2: {
    1: '旅馆',
    2: '旧货交易',
    3: '机动车修理',
    4: '废旧金属',
    5: '公章刻制',
    6: 'KTV',
    7: '酒吧',
    99: '其他',
  },


  employee_type: {
    1: '法定代表人',
    2: '经营负责人',
    3: '管理人员',
    4: '安保人员',
  },
  // 旅馆星级
  hotel_star: {
    1: '一星级',
    2: '二星级',
    3: '三星级',
    4: '四星级',
    5: '五星级',
    6: '其他',
  },
  // 旅馆等级
  hotel_level: {
    1: 'A级',
    2: 'B级',
    3: 'C级',
    4: '其他',
  },
  // 证件类型
  certificate_type: {
    1: '身份证',
    2: '临时身份证',
    3: '户口簿',
    4: '护照',
    5: '公安机关出具的身份证明',
    6: '港澳台居民居住证',
    7: '往来港澳通行证',
    8: '因公往来香港澳门特别行政区通行证',
    9: '旅行证',
    10: '警官证',
    11: '武装警察部队文职干部证',
    12: '军官证',
    13: '武装警察部队士兵证',
    14: '解放军文职干部证',
    15: '解放军军士兵证',
    16: '海员证',
    17: '其他',

  },
  // 签证种类
  visa_class: {
    1: '临时来华记者签证',
    2: '职业签证',
    3: '礼遇签证',
    4: '学习签证',
    5: '外交签证',
    6: '无签证',
    7: '公务签证',
    8: '团体签证',
    9: 'APEC商务旅行卡',
    10: '居留许可',
    11: '其他签证',
    12: '处罚和强制措施签证',
    13: '免办签证',
    14: '旅游签证',
    15: '常驻记者签证',
    16: '绿卡',
    17: '国境签证',
    18: '访问签证',
    19: '特区旅游签证',
    20: '定居签证',
    21: '乘务签证',
  },

  employeeState: {
    0: '在职',
    1: '离职'
  },
  recreation_place_state: {
    1: '营业',
    2: '自主停业',
    3: '勒令停业',
    4: '歇业',
    5: '注销',
  },
  dw: {
    1: '装机开业',
    2: '装机停业',
    3: '未装机开业',
    4: '未装机停业',
    5: '合装',
  },
  security_level: {
    0: '待定',
    1: 'A级',
    2: 'B级',
    3: 'C级',
  },
  entertainment_type: {
    1: '经营性娱乐场所',
    2: '非经营性娱乐场所',
  },
  declare_type: {
    0: '告知承诺制',
    1: '一般审批制'
  },
  business_type: {
    0: '个体工商户',
    1: '工商企业'
  },
  district: {
    "500101": "重庆市万州区",
    "500102": "重庆市涪陵区",
    "500103": "重庆市渝中区",
    "500104": "重庆市大渡口区",
    "500105": "重庆市江北区",
    "500106": "重庆市沙坪坝区",
    "500107": "重庆市九龙坡区",
    "500108": "重庆市南岸区",
    "500109": "重庆市北碚区",
    "500110": "重庆市綦江区",
    "500111": "重庆市大足区",
    "500112": "重庆市渝北区",
    "500113": "重庆市巴南区",
    "500114": "重庆市黔江区",
    "500115": "重庆市长寿区",
    "500116": "重庆市江津区",
    "500117": "重庆市合川区",
    "500118": "重庆市永川区",
    "500119": "重庆市南川区",
    "500120": "重庆市璧山区",
    "500129": "重庆市城口县",
    "500130": "重庆市丰都县",
    "500131": "重庆市江县",
    "500133": "重庆市忠县",
    "500135": "重庆市云阳县",
    "500151": "重庆市铜梁区",
    "500152": "重庆市潼南区",
    "500153": "重庆市荣昌区",
    "500154": "重庆市开州区",
    "500155": "重庆市梁平区",
    "500156": "重庆市武隆区",
    "500236": "重庆市奉节县",
    "500237": "重庆市巫山县",
    "500238": "重庆市巫溪县",
    "500240": "重庆市石柱自治县",
    "500241": "重庆市秀山自治县",
    "500242": "重庆市酉阳自治县",
    "500243": "重庆市彭水自治县"
  },
  // district: {
  //   '万州区': '万州区',
  //   '涪陵区': '涪陵区',
  //   '渝中区': '渝中区',
  //   '大渡口区': '大渡口区',
  //   '江北区': '江北区',
  //   '沙坪坝区': '沙坪坝区',
  //   '九龙坡区': '九龙坡区',
  //   '南岸区': '南岸区',
  //   '北碚区': '北碚区',
  //   '綦江区': '綦江区',
  //   '大足区': '大足区',
  //   '渝北区': '渝北区',
  //   '巴南区': '巴南区',
  //   '黔江区': '黔江区',
  //   '长寿区': '长寿区',
  //   '江津区': '江津区',
  //   '合川区': '合川区',
  //   '永川区': '永川区',
  //   '南川区': '南川区',
  //   '璧山区': '璧山区',
  //   '铜梁区': '铜梁区',
  //   '潼南区': '潼南区',
  //   '荣昌区': '荣昌区',
  //   '开州区': '开州区',
  //   '梁平区': '梁平区',
  //   '武隆区': '武隆区',
  //   '城口县': '城口县',
  //   '丰都县': '丰都县',
  //   '垫江县': '垫江县',
  //   '忠县': '忠县',
  //   '云阳县': '云阳县',
  //   '奉节县': '奉节县',
  //   '巫山县': '巫山县',
  //   '巫溪县': '巫溪县',
  //   '石柱自治县': '石柱自治县',
  //   '秀山自治县': '秀山自治县',
  //   '酉阳自治县': '酉阳自治县',
  //   '彭水自治县': '彭水自治县',
  // },
  jurisdiction_unit: {
    "100": "重庆市渝中区分局",
    "101": "重庆市渝中区分局大阳沟派出所",
    "102": "重庆市渝中区分局解放碑派出所",
    "103": "重庆市渝中区分局朝天门派出所",
    "104": "重庆市渝中区分局望龙门派出所",
    "105": "重庆市渝中区分局南纪门派出所",
    "106": "重庆市渝中区分局七星岗派出所",
    "107": "重庆市渝中区分局两路口派出所",
    "108": "重庆市渝中区分局菜园坝派出所",
    "109": "重庆市渝中区分局上清寺派出所",
    "110": "重庆市渝中区分局大溪沟派出所",
    "111": "重庆市渝中区分局大坪派出所",
    "112": "重庆市渝中区分局化龙桥派出所",
    "113": "重庆市渝中区分局石油路派出所",
    "114": "重庆市渝中区分局医学院路派出所"
  },
  // 经济类型
  economic_type: {
    0: '其他',
    1: '外资企业',
    2: '内资企业',
    3: '外资分支机构',
    4: '四星级外资办事机构',
    5: '外资集团',
    6: '有限责任公司',
    7: '其他有限责任公司',
    8: '私有',
    9: '个体经营'
  },
  // 法人证件类
  legal_certificate_type: {
    0: '其他',
    1: '身份证',
    2: '户口簿',
    3: '军官证',
    4: '警官证',
    5: '士兵证',
    6: '护照',
    7: '其他',
  },
  // 民族
  nation: {
    1: '汉族',
    2: '蒙古族',
    3: '回族',
    4: '藏族',
    5: '维吾尔族',
    6: '苗族',
    7: '彝族',
    8: '壮族',
    9: '布依族',
    10: '朝鲜族',
    11: '满族',
    12: '侗族',
    13: '瑶族',
    14: '白族',
    15: '土家族',
    16: '哈尼族',
    17: '哈萨克族',
    18: '傣族',
    19: '黎族',
    20: '僳僳族',
    21: '佤族',
    22: '畲族',
    23: '高山族',
    24: '拉祜族',
    25: '水族',
    26: '东乡族',
    27: '纳西族',
    28: '景颇族',
    29: '柯尔克孜族',
    30: '土族',
    31: '达斡尔族',
    32: '仫佬族',
    33: '羌族',
    34: '布朗族',
    35: '撒拉族',
    36: '毛南族',
    37: '仡佬族',
    38: '锡伯族',
    39: '阿昌族',
    40: '普米族',
    41: '塔吉克族',
    42: '怒族',
    43: '乌孜别克族',
    44: '俄罗斯族',
    45: '鄂温克族',
    46: '德昂族',
    47: '保安族',
    48: '裕固族',
    49: '京族',
    50: '塔塔尔族',
    51: '独龙族',
    52: '鄂伦春族',
    53: '赫哲族',
    54: '门巴族',
    55: '珞巴族',
    56: '基诺族',
  },
  // 国籍
  nationality: {
    1: '中国',
    2: '美国',
    3: '英国',
    4: '苏格兰',
    5: '日本',
    6: '巴西',
    7: '荷兰',
    8: '法国',
    9: '德国',
    10: '意大利',
    11: '挪威',
    12: '俄罗斯',
    13: '西班牙',
    14: '瑞典',
    15: '希腊',
    16: '澳大利亚',
    17: '奥地利',
    18: '加拿大',
    19: '芬兰',
    20: '印度',
    21: '尼日利亚',
    22: '土耳其',
    23: '韩国',
    24: '波兰',
    25: '泰国',
    26: '丹麦',

  },

  // 营业状态
  business_state: {
    0: '营业',
    1: '停业',
    2: '歇业',
    99: '其他',
  },

  // 营业状态
  my_business_state: {
    0: '营运',
    1: '未营业',
  },
  // 旅馆行业类型
  hotel_trade_type: {
    1: '旅馆业',
    2: '留宿洗浴业',
  },
  seal_trade_type: {
    1: '印章'
  },
  record_result: {
    0: '未备案',
    1: '已备案'
  },
  get_seal_type: {
    0: '自取',
    1: '邮寄'
  },
  // 派出所  和管辖单位
  police_unit: {
    "1": "大阳沟派出所",
    "2": "解放碑派出所",
    "3": "朝天门派出所",
    "4": "望龙门派出所",
    "5": "南纪门派出所",
    "6": "七星岗派出所",
    "7": "两路口派出所",
    "8": "菜园坝派出所",
    "9": "上清寺派出所",
    "10": "大溪沟派出所",
    "11": "大坪派出所",
    "12": "化龙桥派出所",
    "13": "石油路派出所",
    "14": "医学院路派出所"
  },
  // 安装状态
  install_state:{
    "0": "未安装",
    "1": "已安装",
  },
  // 是否涉案
  iscase:{
    0: "否",
    1: "是",
  },
  // 核查状态
  check_state: {
    0: '已保存基本信息',
    1: '待核查',
    2: '核查通过',
    3: '关停',
    99: '其他',
  }
  // police_unit: {
  //   '大阳沟派出所': '大阳沟派出所',
  //   '朝天门派出所': '朝天门派出所',
  //   '七星岗派出所': '七星岗派出所',
  //   '望龙门派出所': '望龙门派出所',
  //   '南纪门派出所': '南纪门派出所',
  //   '菜园坝派出所': '菜园坝派出所',
  //   '大溪沟派出所': '大溪沟派出所',
  //   '两路口派出所': '两路口派出所',
  //   '上清寺派出所': '上清寺派出所',
  //   '大坪派出所': '大坪派出所',
  //   '石油路派出所': '石油路派出所',
  //   '化龙桥派出所': '化龙桥派出所',
  // }
}
export default map

export const getDynamicMap = async () => {
  const res = await enumsItems({
    types: [1, 2, 3]
  })
  const result = res.data
  const police_unit = {}
  const jurisdiction_unit = {}
  const district = {}
  result.filter(v => v.type === 1).forEach(v => {
    police_unit[v.keyid] = v.name
  })
  result.filter(v => v.type === 2).forEach(v => {
    jurisdiction_unit[v.keyid] = v.name
  })
  result.filter(v => v.type === 3).forEach(v => {
    district[v.keyid] = v.name
  })

  return {
    ...map,
    police_unit,
    jurisdiction_unit,
    district
  }
}
