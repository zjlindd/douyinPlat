// utils/provinces.js
// 省份代码数据

/**
 * 省份代码列表
 */
const PROVINCES = [
  { code: '京', name: '北京', fullName: '北京市' },
  { code: '津', name: '天津', fullName: '天津市' },
  { code: '沪', name: '上海', fullName: '上海市' },
  { code: '渝', name: '重庆', fullName: '重庆市' },
  { code: '冀', name: '河北', fullName: '河北省' },
  { code: '晋', name: '山西', fullName: '山西省' },
  { code: '蒙', name: '内蒙古', fullName: '内蒙古自治区' },
  { code: '辽', name: '辽宁', fullName: '辽宁省' },
  { code: '吉', name: '吉林', fullName: '吉林省' },
  { code: '黑', name: '黑龙江', fullName: '黑龙江省' },
  { code: '苏', name: '江苏', fullName: '江苏省' },
  { code: '浙', name: '浙江', fullName: '浙江省' },
  { code: '皖', name: '安徽', fullName: '安徽省' },
  { code: '闽', name: '福建', fullName: '福建省' },
  { code: '赣', name: '江西', fullName: '江西省' },
  { code: '鲁', name: '山东', fullName: '山东省' },
  { code: '豫', name: '河南', fullName: '河南省' },
  { code: '鄂', name: '湖北', fullName: '湖北省' },
  { code: '湘', name: '湖南', fullName: '湖南省' },
  { code: '粤', name: '广东', fullName: '广东省' },
  { code: '桂', name: '广西', fullName: '广西壮族自治区' },
  { code: '琼', name: '海南', fullName: '海南省' },
  { code: '川', name: '四川', fullName: '四川省' },
  { code: '贵', name: '贵州', fullName: '贵州省' },
  { code: '云', name: '云南', fullName: '云南省' },
  { code: '藏', name: '西藏', fullName: '西藏自治区' },
  { code: '陕', name: '陕西', fullName: '陕西省' },
  { code: '甘', name: '甘肃', fullName: '甘肃省' },
  { code: '青', name: '青海', fullName: '青海省' },
  { code: '宁', name: '宁夏', fullName: '宁夏回族自治区' },
  { code: '新', name: '新疆', fullName: '新疆维吾尔自治区' },
  { code: '港', name: '香港', fullName: '香港特别行政区' },
  { code: '澳', name: '澳门', fullName: '澳门特别行政区' },
  { code: '台', name: '台湾', fullName: '台湾省' }
]

/**
 * 根据输入模糊搜索省份
 * @param {string} keyword - 搜索关键词（省份代码、名称或拼音）
 * @returns {array} 匹配的省份列表
 */
function searchProvinces(keyword) {
  if (!keyword || !keyword.trim()) {
    return []
  }

  const kw = keyword.trim().toUpperCase()
  const results = []

  PROVINCES.forEach(province => {
    // 匹配省份代码
    if (province.code === kw || province.code.indexOf(kw) !== -1) {
      results.push({
        code: province.code,
        name: province.name,
        fullName: province.fullName,
        matchType: 'code',
        score: 10
      })
      return
    }

    // 匹配省份名称
    if (province.name.indexOf(kw) !== -1 || province.name.indexOf(kw) === 0) {
      results.push({
        code: province.code,
        name: province.name,
        fullName: province.fullName,
        matchType: 'name',
        score: 8
      })
      return
    }

    // 匹配全称
    if (province.fullName.indexOf(kw) !== -1) {
      results.push({
        code: province.code,
        name: province.name,
        fullName: province.fullName,
        matchType: 'fullName',
        score: 5
      })
      return
    }

    // 拼音匹配（简单实现）
    const pinyinMap = {
      'BEI': '京', 'TIAN': '津', 'SHANG': '沪', 'CHONG': '渝',
      'HE': '冀', 'SHAN': '晋', 'NEI': '蒙', 'LIAO': '辽',
      'JI': '吉', 'HEI': '黑', 'JIANG': '苏', 'ZHE': '浙',
      'WAN': '皖', 'FU': '闽', 'GAN': '赣', 'SHAN': '鲁',
      'YU': '豫', 'E': '鄂', 'XIANG': '湘', 'GUANG': '粤',
      'GUI': '桂', 'QIONG': '琼', 'CHUAN': '川', 'GUI': '贵',
      'YUN': '云', 'ZANG': '藏', 'SHAN': '陕', 'GAN': '甘',
      'QING': '青', 'NING': '宁', 'XIN': '新', 'GANG': '港',
      'AO': '澳', 'TAI': '台'
    }

    // 简单的拼音首字母匹配
    const firstLetter = kw.charAt(0)
    if (province.name.charAt(0) === firstLetter || province.code === firstLetter) {
      results.push({ ...province, matchType: 'fuzzy', score: 3 })
    }
  })

  // 按匹配度排序
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, 10) // 返回前10个结果
}

/**
 * 获取所有省份列表
 * @returns {array} 所有省份列表
 */
function getAllProvinces() {
  return PROVINCES
}

/**
 * 根据省份代码获取省份信息
 * @param {string} code - 省份代码
 * @returns {object|null} 省份信息
 */
function getProvinceByCode(code) {
  return PROVINCES.find(p => p.code === code) || null
}

/**
 * 城市代码映射表（省份代码 + 城市字母代码 -> 城市名称）
 */
const CITY_CODE_MAP = {
  // 北京
  '京A': '北京市', '京B': '北京市（出租车）', '京C': '北京市', '京D': '北京市', '京E': '北京市',
  '京F': '北京市', '京G': '北京市', '京H': '北京市', '京J': '北京市', '京K': '北京市',
  '京L': '北京市', '京M': '北京市', '京N': '北京市', '京P': '北京市', '京Q': '北京市',
  '京Y': '北京市',
  // 天津
  '津A': '天津市', '津B': '天津市', '津C': '天津市', '津D': '天津市', '津E': '天津市',
  '津F': '天津市', '津G': '天津市', '津H': '天津市', '津J': '天津市', '津K': '天津市',
  '津L': '天津市', '津M': '天津市', '津N': '天津市', '津P': '天津市', '津Q': '天津市',
  '津R': '天津市',
  // 上海
  '沪A': '上海市', '沪B': '上海市', '沪C': '上海市（远郊区）', '沪D': '上海市', '沪E': '上海市',
  '沪F': '上海市', '沪G': '上海市', '沪H': '上海市', '沪J': '上海市', '沪K': '上海市',
  '沪L': '上海市', '沪M': '上海市', '沪N': '上海市',
  // 重庆
  '渝A': '重庆市', '渝B': '重庆市', '渝C': '重庆市', '渝D': '重庆市', '渝F': '重庆市',
  '渝G': '重庆市', '渝H': '重庆市',
  // 河北
  '冀A': '石家庄市', '冀B': '唐山市', '冀C': '秦皇岛市', '冀D': '邯郸市', '冀E': '邢台市',
  '冀F': '保定市', '冀G': '张家口市', '冀H': '承德市', '冀J': '沧州市', '冀R': '廊坊市',
  '冀T': '衡水市',
  // 山西
  '晋A': '太原市', '晋B': '大同市', '晋C': '阳泉市', '晋D': '长治市', '晋E': '晋城市',
  '晋F': '朔州市', '晋H': '忻州市', '晋J': '吕梁市', '晋K': '晋中市', '晋L': '临汾市',
  '晋M': '运城市',
  // 内蒙古
  '蒙A': '呼和浩特市', '蒙B': '包头市', '蒙C': '乌海市', '蒙D': '赤峰市', '蒙E': '呼伦贝尔市',
  '蒙F': '兴安盟', '蒙G': '通辽市', '蒙H': '锡林郭勒盟', '蒙J': '乌兰察布市', '蒙K': '鄂尔多斯市',
  '蒙L': '巴彦淖尔市', '蒙M': '阿拉善盟',
  // 辽宁
  '辽A': '沈阳市', '辽B': '大连市', '辽C': '鞍山市', '辽D': '抚顺市', '辽E': '本溪市',
  '辽F': '丹东市', '辽G': '锦州市', '辽H': '营口市', '辽J': '阜新市', '辽K': '辽阳市',
  '辽L': '盘锦市', '辽M': '铁岭市', '辽N': '朝阳市', '辽P': '葫芦岛市',
  // 吉林
  '吉A': '长春市', '吉B': '吉林市', '吉C': '四平市', '吉D': '辽源市', '吉E': '通化市',
  '吉F': '白山市', '吉G': '白城市', '吉H': '延边朝鲜族自治州',
  // 黑龙江
  '黑A': '哈尔滨市', '黑B': '齐齐哈尔市', '黑C': '牡丹江市', '黑D': '佳木斯市', '黑E': '大庆市',
  '黑F': '伊春市', '黑G': '鸡西市', '黑H': '鹤岗市', '黑J': '双鸭山市', '黑K': '七台河市',
  '黑L': '松花江地区', '黑M': '绥化市', '黑N': '黑河市', '黑P': '大兴安岭地区',
  // 江苏
  '苏A': '南京市', '苏B': '无锡市', '苏C': '徐州市', '苏D': '常州市', '苏E': '苏州市',
  '苏F': '南通市', '苏G': '连云港市', '苏H': '淮安市', '苏J': '盐城市', '苏K': '扬州市',
  '苏L': '镇江市', '苏M': '泰州市', '苏N': '宿迁市',
  // 浙江
  '浙A': '杭州市', '浙B': '宁波市', '浙C': '温州市', '浙D': '绍兴市', '浙E': '湖州市',
  '浙F': '嘉兴市', '浙G': '金华市', '浙H': '衢州市', '浙J': '台州市', '浙K': '丽水市',
  '浙L': '舟山市',
  // 安徽
  '皖A': '合肥市', '皖B': '芜湖市', '皖C': '蚌埠市', '皖D': '淮南市', '皖E': '马鞍山市',
  '皖F': '淮北市', '皖G': '铜陵市', '皖H': '安庆市', '皖J': '黄山市', '皖K': '滁州市',
  '皖L': '阜阳市', '皖M': '宿州市', '皖N': '六安市', '皖P': '宣城市', '皖Q': '池州市',
  '皖R': '亳州市',
  // 福建
  '闽A': '福州市', '闽B': '莆田市', '闽C': '泉州市', '闽D': '厦门市', '闽E': '漳州市',
  '闽F': '龙岩市', '闽G': '三明市', '闽H': '南平市', '闽J': '宁德市', '闽K': '省直系统',
  // 江西
  '赣A': '南昌市', '赣B': '赣州市', '赣C': '宜春市', '赣D': '吉安市', '赣E': '上饶市',
  '赣F': '抚州市', '赣G': '九江市', '赣H': '景德镇市', '赣J': '萍乡市', '赣K': '新余市',
  '赣L': '鹰潭市',
  // 山东
  '鲁A': '济南市', '鲁B': '青岛市', '鲁C': '淄博市', '鲁D': '枣庄市', '鲁E': '东营市',
  '鲁F': '烟台市', '鲁G': '潍坊市', '鲁H': '济宁市', '鲁J': '泰安市', '鲁K': '威海市',
  '鲁L': '日照市', '鲁M': '滨州市', '鲁N': '德州市', '鲁P': '聊城市', '鲁Q': '临沂市',
  '鲁R': '菏泽市', '鲁S': '莱芜市', '鲁U': '青岛市增补', '鲁Y': '烟台市增补',
  // 河南
  '豫A': '郑州市', '豫B': '开封市', '豫C': '洛阳市', '豫D': '平顶山市', '豫E': '安阳市',
  '豫F': '鹤壁市', '豫G': '新乡市', '豫H': '焦作市', '豫J': '濮阳市', '豫K': '许昌市',
  '豫L': '漯河市', '豫M': '三门峡市', '豫N': '商丘市', '豫P': '周口市', '豫Q': '驻马店市',
  '豫R': '南阳市', '豫S': '信阳市', '豫U': '济源市',
  // 湖北
  '鄂A': '武汉市', '鄂B': '黄石市', '鄂C': '十堰市', '鄂D': '荆州市', '鄂E': '宜昌市',
  '鄂F': '襄阳市', '鄂G': '鄂州市', '鄂H': '荆门市', '鄂J': '黄冈市', '鄂K': '孝感市',
  '鄂L': '咸宁市', '鄂M': '仙桃市', '鄂N': '潜江市', '鄂P': '神农架林区', '鄂Q': '恩施土家族苗族自治州',
  '鄂R': '天门市', '鄂S': '随州市',
  // 湖南
  '湘A': '长沙市', '湘B': '株洲市', '湘C': '湘潭市', '湘D': '衡阳市', '湘E': '邵阳市',
  '湘F': '岳阳市', '湘G': '张家界市', '湘H': '益阳市', '湘J': '常德市', '湘K': '娄底市',
  '湘L': '郴州市', '湘M': '永州市', '湘N': '怀化市', '湘U': '湘西土家族苗族自治州',
  // 广东
  '粤A': '广州市', '粤B': '深圳市', '粤C': '珠海市', '粤D': '汕头市', '粤E': '佛山市',
  '粤F': '韶关市', '粤G': '湛江市', '粤H': '肇庆市', '粤J': '江门市', '粤K': '茂名市',
  '粤L': '惠州市', '粤M': '梅州市', '粤N': '汕尾市', '粤P': '河源市', '粤Q': '阳江市',
  '粤R': '清远市', '粤S': '东莞市', '粤T': '中山市', '粤U': '潮州市', '粤V': '揭阳市',
  '粤W': '云浮市',
  // 广西
  '桂A': '南宁市', '桂B': '柳州市', '桂C': '桂林市', '桂D': '梧州市', '桂E': '北海市',
  '桂F': '防城港市', '桂G': '钦州市', '桂H': '贵港市', '桂J': '玉林市', '桂K': '百色市',
  '桂L': '贺州市', '桂M': '河池市', '桂N': '来宾市', '桂P': '崇左市',
  // 海南
  '琼A': '海口市', '琼B': '三亚市', '琼C': '琼海市', '琼D': '五指山市', '琼E': '儋州市',
  '琼F': '文昌市', '琼G': '万宁市', '琼H': '东方市',
  // 四川
  '川A': '成都市', '川B': '绵阳市', '川C': '自贡市', '川D': '攀枝花市', '川E': '泸州市',
  '川F': '德阳市', '川H': '广元市', '川J': '遂宁市', '川K': '内江市', '川L': '乐山市',
  '川M': '资阳市', '川Q': '宜宾市', '川R': '南充市', '川S': '达州市', '川T': '雅安市',
  '川U': '阿坝藏族羌族自治州', '川V': '甘孜藏族自治州', '川W': '凉山彝族自治州', '川X': '广安市',
  '川Y': '巴中市', '川Z': '眉山市',
  // 贵州
  '贵A': '贵阳市', '贵B': '六盘水市', '贵C': '遵义市', '贵D': '铜仁市', '贵E': '黔西南布依族苗族自治州',
  '贵F': '毕节市', '贵G': '安顺市', '贵H': '黔东南苗族侗族自治州', '贵J': '黔南布依族苗族自治州',
  // 云南
  '云A': '昆明市', '云C': '昭通市', '云D': '曲靖市', '云E': '楚雄彝族自治州', '云F': '玉溪市',
  '云G': '红河哈尼族彝族自治州', '云H': '文山壮族苗族自治州', '云J': '普洱市', '云K': '西双版纳傣族自治州',
  '云L': '大理白族自治州', '云M': '保山市', '云N': '德宏傣族景颇族自治州', '云P': '丽江市',
  '云Q': '怒江傈僳族自治州', '云R': '迪庆藏族自治州', '云S': '临沧市',
  // 西藏
  '藏A': '拉萨市', '藏B': '昌都市', '藏C': '山南市', '藏D': '日喀则市', '藏E': '那曲市',
  '藏F': '阿里地区', '藏G': '林芝市',
  // 陕西
  '陕A': '西安市', '陕B': '铜川市', '陕C': '宝鸡市', '陕D': '咸阳市', '陕E': '渭南市',
  '陕F': '汉中市', '陕G': '安康市', '陕H': '商洛市', '陕J': '延安市', '陕K': '榆林市',
  // 甘肃
  '甘A': '兰州市', '甘B': '嘉峪关市', '甘C': '金昌市', '甘D': '白银市', '甘E': '天水市',
  '甘F': '酒泉市', '甘G': '张掖市', '甘H': '武威市', '甘J': '定西市', '甘K': '陇南市',
  '甘L': '平凉市', '甘M': '庆阳市', '甘N': '临夏回族自治州', '甘P': '甘南藏族自治州',
  // 青海
  '青A': '西宁市', '青B': '海东市', '青C': '海北藏族自治州', '青D': '黄南藏族自治州',
  '青E': '海南藏族自治州', '青F': '果洛藏族自治州', '青G': '玉树藏族自治州', '青H': '海西蒙古族藏族自治州',
  // 宁夏
  '宁A': '银川市', '宁B': '石嘴山市', '宁C': '吴忠市', '宁D': '固原市', '宁E': '中卫市',
  // 新疆
  '新A': '乌鲁木齐市', '新B': '昌吉回族自治州', '新C': '石河子市', '新D': '奎屯市', '新E': '博尔塔拉蒙古自治州',
  '新F': '伊犁哈萨克自治州', '新G': '塔城地区', '新H': '阿勒泰地区', '新J': '克拉玛依市',
  '新K': '吐鲁番市', '新L': '哈密市', '新M': '巴音郭楞蒙古自治州', '新N': '阿克苏地区',
  '新P': '克孜勒苏柯尔克孜自治州', '新Q': '喀什地区', '新R': '和田地区',
  // 香港
  '港': '香港特别行政区',
  // 澳门
  '澳': '澳门特别行政区',
  // 台湾
  '台': '台湾省'
}

/**
 * 根据省份代码和城市代码获取城市名称
 * @param {string} provinceCode - 省份代码
 * @param {string} cityCode - 城市字母代码
 * @returns {string} 城市名称
 */
function getCityName(provinceCode, cityCode) {
  if (!provinceCode || !cityCode) {
    return null
  }
  
  const key = provinceCode + cityCode.toUpperCase()
  return CITY_CODE_MAP[key] || null
}

/**
 * 验证车牌号格式并提取省份代码和城市信息
 * @param {string} plateNumber - 车牌号
 * @returns {object} { isValid: boolean, province: object|null, city: string|null, plate: string }
 */
function parsePlateNumber(plateNumber) {
  if (!plateNumber || !plateNumber.trim()) {
    return { isValid: false, province: null, city: null, plate: '' }
  }

  const plate = plateNumber.trim().toUpperCase().replace(/\s/g, '')
  
  if (plate.length < 2) {
    return { isValid: false, province: null, city: null, plate }
  }

  // 提取省份代码（第1位）
  const provinceCode = plate.substring(0, 1)
  const province = getProvinceByCode(provinceCode)
  
  // 提取城市代码（第2位）
  let cityName = null
  if (plate.length >= 2) {
    const cityCode = plate.substring(1, 2)
    cityName = getCityName(provinceCode, cityCode)
  }

  return {
    isValid: province !== null,
    province: province,
    city: cityName,
    plate: plate,
    provinceCode: provinceCode
  }
}

export {
  PROVINCES,
  CITY_CODE_MAP,
  searchProvinces,
  getAllProvinces,
  getProvinceByCode,
  getCityName,
  parsePlateNumber
}

