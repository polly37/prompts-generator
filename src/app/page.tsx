'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

// 新的分层级提示词数据结构（重新组织）
const promptCategories = [
  {
    key: 'femaleSubject',
    name: '女性主体描写',
    icon: '👩',
    subcategories: [
      {
        key: 'appearance',
        name: '面貌描述',
        icon: '✨',
        tags: ['眼妆精致', '大眼睛', '丹凤眼', '小嘴', '红润嘴唇', '浅番茄色唇', '豆沙唇', '自然唇色', '高挺鼻梁','挺翘鼻梁','细长眉毛','野生眉','眉如远黛']
      },
      {
        key: 'hairstyle',
        name: '发型描述',
        icon: '💇',
        tags: ['长卷发', '大波浪披肩长发', '棕色长头发', '长卷发爆炸头', '黑棕色长发波浪卷', '黑色长直发', '黑色短卷发', '高马尾发型，发尾微卷', '发型是简洁的盘发，露出修长脖颈']
      },
      {
        key: 'clothing',
        name: '服饰描述',
        icon: '👗',
        tags: ['白色吊带蕾丝睡裙', '身穿白灯笼袖雪纺衬衫，蓝高腰直筒牛仔裤', '身穿白色上衣，牛仔短裤，腰上挂着围裙', '女生身穿蝴蝶印花一字领白色长袖T恤两边有抽绳，深蓝白格纹阔腿休闲裤，银色老爹运动鞋，蓝白条纹帆布包', 
          '穿蓝色衬衣，衣角打了结，露肚脐，浅白色牛仔短裙，白色运动鞋', '身穿粉色雪纺纱上衣、蓝色高腰阔腿长款沙滩裤（配细腰带、多口袋），脚穿棕色凉鞋', '身着白色紧身长袖上衣、黑色牛仔短裤，厚玻璃细高跟绑带凉鞋', 
          '身穿米黄色短袖蕾丝雪纺衫，浅蓝色裙子有珍珠腰带，穿着凉鞋', '穿着黄色吊带上衣、白色休闲短裤，和白色拖鞋', '穿着紧身浅色背心，牛仔短裤，白色鞋帆布鞋',
          '穿着jk，背上背着双肩包，带着耳机','穿着黑色紧身V领无袖上衣，下身穿浅咖色豹纹蛋糕短裙，同色系腰带，脚穿银色高跟凉鞋','身着淡蓝色修身连衣裙，凸显曼妙身姿，脚蹬白色平底单鞋',
          '穿着白色无袖长裙','灰色西装外套，白色内搭，浅蓝色牛仔裤，白色运动鞋','身穿米色多层连衣裙','白色缎面衬衫，粉色缎面高腰半裙，脚穿细跟尖头的水晶（亮片）高跟鞋',
          '一位身着精致礼服的女性，礼服为无袖抹胸设计，主体是浅米色，上面布满闪耀的银色亮片与精致花纹，呈现出心形胸型，裙摆开叉，一侧长纱自然垂下 ','穿着黑色心形抹胸亮片礼服裙，抹胸裙上面有一层白色蕾丝边，白色腰封，手拿白色小手包，下身裙子是蓬蓬的，黑色高跟凉鞋',
          '身穿黑色亮片修身鱼尾大裙摆礼服 佩带华丽配饰 黑色丝质长手套','身穿一件白色无袖衬衣领运动衫，下身穿一条深蓝色运动短裙，头带白色鸭舌帽，搭配白色运动鞋']
      },
      {
        key: 'action',
        name: '动作描述',
        icon: '🤸',
        tags: ['优雅坐在高档咖啡厅椅子上，美女手里拿着冒热气的咖啡，透过大玻璃窗俯视正看着夜晚江边的东方明珠', '坐在白色办公椅上，使用苹果电脑', '坐在主驾驶，系安全带，双手扶方向盘，目视前方开车', '女孩蜷在白色色懒人沙发上，手中捧着布面精装书', 
          '在大大的阳台躺椅上坐着看书', '侧卧在柔软的白色被褥里，她揉着眼睛慢慢坐起，头发微乱但充满元气', '美女坐在椅子上，手机端着冒热气的咖啡，桌子上放着甜点，有西瓜皮雕刻的龙的造型的果盘，还有其他水果和西瓜龙在一个果盘里', '坐在室内地板上，托腮望向窗外', 
          '双手交叉抱于胸前，站在繁华都市的写字楼落地窗前，背后是车水马龙的街景', '在女装店里选购衣服','走在街道上','正在水池旁洗菜，远处看着平板，平板里放着电视剧','她站在楼梯上，左手轻搭栏杆，右手自然下垂，身姿优雅从容','抱着一束粉色玫瑰鲜花走在街道上花店面前',
          '手机拿着一个单反相机对着一座复古的门庭仰视拍照','手里拿着电动牙刷，正在面对着镜子刷牙','双臂交叉站立，白皙大长腿修长笔直有光泽','跑在公园的跑道上']
      },
      {
        key: 'accessories',
        name: '配饰',
        icon: '💎',
        tags: ['银色珍珠耳饰', '银色项链', '女表', '单肩包包', '米白色设计感手提包，包有褶皱设计，包有金属扣', '佩戴精致银色耳饰、项链，还有手链',
          '脖子上戴着一条细细的金色锁骨链，链坠是一颗小小的钻石', '胸口挂墨镜，肩挎黑色亮面包包', '戴着咖啡色皮带手表，背着1个咖啡色的复古相机包', '头戴粉色遮阳帽']
      }
    ]
  },
  {
    key: 'environment',
    name: '环境描写',
    icon: '🏞️',
    subcategories: [
      {
        key: 'home',
        name: '家居/生活环境',
        icon: '🏠',
        tags: [
          // 室内环境
          '温馨的暖色调室内场景，有着自然温暖的光线，暗酒红色', '在客厅，有电视机，白色茶几，茶几上摆放着花，和手机，笔记本电脑，白色地毯，窗外阳光穿过绿植叶片形成斑驳光影',
          
          // 厨房环境
          '现代化厨房室内场景中，背景有冰箱，烟台，洗菜池',
          
          // 卧室环境
          '身旁有绿植盆栽，右侧有一只三花猫相伴，窗外是城市轮廓和美丽的落日天空，色彩柔和，营造出宁静、惬意的氛围',
          
          // 洗手间环境
          '在一个现代时尚装修风格的，宽敞装修精美洗漱间里，洗脸前台形状漂亮明灯亮着的镜子前，洗脸台上摆放着自白品和护肤品',
        ]
      },
      {
        key: 'office',
        name: '办公环境',
        icon: '🏢',
        tags: [
          // 办公室环境
          '办公室桌上有咖啡，手机，笔记本，向日葵装饰，白色书架，绿植'
        ]
      },
      {
        key: 'outdoor',
        name: '户外',
        icon: '🏃‍♀️',
        tags: [
          // 街道环境
          '旁边是写字楼玻璃材质，有绿植，树木，路灯，昏暗', '旁边是商店，有绿植，树木',
          '长长的小巷，古色古香的风格，石头铺的街道，两边是复古的建筑，墙头有蔷薇花垂落下来','道路两边都是花树，鲜艳的花朵特别美丽、远处有行人','背景是拉丝模糊街道和行走的人群',
          
          // 车内环境
          '窗外晴天，有绿化带，车内白色简洁明亮','坐在奔驰汽车驾驶座上，车子内饰豪华，有玫红色装饰灯，以浅粉为为主色调，汽车匀速行驶在高速上，窗外风景快速掠过，傍晚的时候 天空呈现桔红色晚霞，系着安全带',
          
          // 跑道环境
          '背景有跑道，树，湖',
          
          // 咖啡馆环境
          '一家咖啡厅室外，艺术时尚的桌椅，近处有江，旁边还有摩天轮',
        ]
      },
    ]
  },
  {
    key: 'artForm',
    name: '艺术形式',
    icon: '🎨',
    subcategories: [
      {
        key: 'film',
        name: '电影',
        icon: '🎬',
        tags: ['电影质感', '胶片感', '复古电影', '黑白电影', '好莱坞风格', '独立电影', '文艺片', '商业片', '纪录片','港片',
          '喜剧风','史诗片','王家卫电影感','新黑色电影风格','另类艺术感']
      },
      {
        key: 'photography',
        name: '摄像',
        icon: '📷',
        tags: ['人像摄影', '街拍', '时尚摄影', '艺术摄影', '纪实摄影', '婚纱摄影', '商业摄影', '风光摄影', '微距摄影', '黑白摄影',
          '鱼眼拍摄','微距镜头','移轴镜头','远摄镜头','慢快门拍摄','超广角镜头','高速相机捕捉','长焦微距拍摄','哈苏摄影',
          '柯达摄影','梦核朦胧','胶片柔光','宝丽来相片']
      },
      {
        key: 'animation',
        name: '动画',
        icon: '🎭',
        tags: ['二次元', '日式动漫', '迪士尼风格', '皮克斯风格', '手绘动画', '3D动画', '水彩动画', '扁平化', '卡通风格', '漫画风格',
          '美漫风格','国漫风格','宫崎骏','定格动画','线条漫画','绘本风格','儿童画','蜡笔画','素描海报','铅笔画素描']
      },
      {
        key: 'otherStyles',
        name: '其他风格',
        icon: '🖌️',
        tags: [
          // 古典艺术
          '由颜料雕刻的立体油画', '流体油画', '浮雕壁画', '梵高风格', '浮世绘', '象征主义', '文艺复兴', '山水画', '印象派', '野兽派', '洛可可风格', '大师版画', '水墨风格', '构成主义', '抽象主义', '孟菲斯',
          
          // 潮流艺术
          '岩彩画蘑菇肌理绘画', '这是一幅充满趣与活力的3D渲染图像', '几何风格', '机甲风格', '赛博风格', '包豪斯风格', 'ins风', '破碎文艺感',
          
          // 创意艺术
          '超现实的静物摄影', '超写实风格', '非传统构图的艺术', '超现实主义', '概念艺术',
          
          // 工业艺术
          '工业设计', '产品设计'
        ]
      }
    ]
  },
  {
    key: 'visualTerms',
    name: '视觉词',
    icon: '👁️',
    subcategories: [
      {
        key: 'photography_technique',
        name: '摄影技法',
        icon: '📷',
        tags: [
          // 相机设置
          '光圈f/1.4', '光圈f/2.8', '光圈f/5.6', '快门1/60', '快门1/125', '快门1/250',
          'ISO 100', 'ISO 400', 'ISO 800', '白平衡自动', '白平衡日光', '白平衡钨丝灯',
          
          // 镜头焦段
          '14mm超广角', '24mm广角', '35mm标准', '50mm标准', '85mm人像', '105mm中焦',
          '200mm长焦', '300mm超长焦', '微距镜头', '鱼眼镜头', '移轴镜头',
          
          // 拍摄技法
          '长曝光', '多重曝光', '高速快门', '慢门拖影', '追焦拍摄', '连拍模式',
          'HDR合成', '包围曝光', '景深合成', '焦点堆栈', '全景接片', '时光流逝',
          
          // 对焦技法
          '单点对焦', '区域对焦', '自动对焦', '手动对焦', '连续对焦', '单次对焦',
          '眼部检测对焦', '人脸识别对焦', '追踪对焦', '峰值对焦',
          
          // 专业设备
          'Sony A7R5', 'Canon 5D Mark IV', 'Nikon D850', 'Fujifilm X-T5',
          'Leica M11', 'Hasselblad X2D', '大画幅相机', '中画幅相机', '全画幅相机',
          
          // 后期技法
          'RAW格式', 'JPEG直出', 'Lightroom调色', 'Photoshop合成', '胶片模拟',
          '色彩分级', '曲线调整', '局部调整', '蒙版技法', '图层混合'
        ]
      },
      {
        key: 'composition',
        name: '构图',
        icon: '📐',
        tags: [
          // 景别 - 全景
          '航拍超大场景', '极远景镜头', '广角镜头', '长焦远景镜头', '远景镜头', '全景', '中远景镜头',
          '超广角', '鱼眼镜头', '全景拍摄', '环境全景',
          
          // 景别 - 特写
          '中景镜头', '中近景镜头', '近景镜头', '特写镜头', '极特写镜头', '微距抓拍', '大特写',
          '半身景', '胸部特写', '面部特写', '眼部特写', '手部特写', '细节特写',
          
          // 视角与角度
          '俯视镜头', '照片低角度30度仰拍', '平视视角', '仰视视角', '低角度视角', '俯视视角', '顶视图', 
          '中景，从正面稍侧角度拍摄', '侧身近景拍摄', '45度角', '斜角度', '正面角度', '背面角度',
          '三分之一侧面', '轮廓角度', '对角线角度',
          
          // 经典构图法则
          '三分法则', '黄金分割', '对称构图', '非对称构图', '中心构图', '框架构图',
          '引导线构图', '对角线构图', '三角形构图', '圆形构图', '放射状构图',
          
          // 拍摄构图技法
          '聚焦主体，背景虚化', '超广角强透视构图', '超现实景深控制', '倾斜构图', '独特镜头视角抓拍',
          '朱山尽摄影', '浅景深', '深景深', '虚实结合', '层次构图', '重复构图',
          '节奏构图', '平衡构图', '张力构图', '动态构图', '静态构图',
          
          // 空间构图
          '前景构图', '中景构图', '背景构图', '空间层次', '纵深感', '立体感',
          '透视效果', '空间感', '距离感', '比例关系',
          
          // 绘画构图  
          '大面积留白', '大写意', '极具观赏性', '舒开的笔墨触感', '画面大面积留空', '古韵留白',
          '简约构图', '复杂构图', '密集构图', '稀疏构图', '开放构图', '封闭构图'
        ]
      },
      {
        key: 'tone',
        name: '色调',
        icon: '🌈',
        tags: [
          // 浅色调
          '浅白色调', '大面积米白色', '亮调', '宽敞明亮', '暖色调搭配', '奶白色调', '象牙白',
          
          // 丰富色调
          '丰富的色彩', '传统色彩', '经典色调', '复古色调', '怀旧色调',
          
          // 色调组合
          '米白色和灰度的结合', '冷色调', '暖色调', '相似色', '互补色', '三角色',
          
          // 暗色调
          '暗调摄影', '黑色色调', '深绿色调', '暗色', '电影烟调', '深色调', '电影镜头', '故事感', '情绪感照片',
          '神秘暗调', '低调摄影', '阴影调', '深沉色调',
          
          // 饱和度
          '高饱和', '低饱和', '过饱和', '欠饱和', '自然饱和', '艺术饱和',
          
          // 亮度
          '多重曝光与失焦叠加', '高曝光', '低曝光', '正常曝光', '过曝效果', '欠曝效果',
          
          // 对比度
          '高对比', '低对比', '中等对比', '柔和对比', '强烈对比',
          
          // 特殊色调
          '棕褐色调', '黄昏色调', '黎明色调', '午夜蓝调', '森林绿调', '海洋蓝调',
          '珊瑚粉调', '薰衣草紫调', '香槟金调', '玫瑰金调', '青铜色调',
          
          // 渲染
          'OC渲染', '3D渲染', 'HDR渲染', '写实渲染', '卡通渲染'
        ]
      },
      {
        key: 'lighting',
        name: '光影',
        icon: '💡',
        tags: [
          // 自然光影
          '窗光', '水底光效', '晨光', '夕阳', '灯光柔和', '月光', '星光', '烛光',
          '摄拍夜间时刻的散射光', '精准复刻光影氛围', '黄昏暖光', '清晨冷光',
          
          // 环境光影
          '室内暖光', '户外自然光', '人工照明', '霓虹灯光', '街灯光', '车灯光',
          '火光', '激光', 'LED光', '荧光', '白炽灯光', '日光灯',
          
          // 光影风格
          '光影柔和', '炫彩光影', '丁达尔光效', '暗光效果', '戏剧光', '斑驳光影', '炫光', '丁达尔光',
          '线条电影光效', '柔焦效果', '逆光', '噪化璀璃', '强烈的光线能量', '富士极片', '雾雪点降噪非泽射',
          '细部高光', '空气感高', '高光压缩', '阴影层次', '光线追踪', '体积光',
          
          // 专业光影技法
          '伦勃朗光', '蝴蝶光', '分割光', '边缘光', '轮廓光', '发光', '顶光', '侧光',
          '底光', '环形光', '宽光', '窄光', '硬光', '软光',
          
          // 设备光影
          '棚拍光', 'sony a7m4 85mm', '专业影视光', '银色反光板光', '50mm焦段',
          '摄影棚灯光', '柔光箱', '八角柔光伞', '反光板补光', '闪光灯',
          
          // 人物光影
          '人物肤色自然', '光影过渡柔和', '背景虚化效果自然真实',
          '发丝带次表面散射效果', '自然光透适', '面部毛孔，真实可见',
          '肌肤质感', '人物立体感', '面部轮廓光',
          
          // 特殊光影效果
          '光斑', '光晕', '光束', '放射光', '散射光', '折射光', '反射光',
          '彩虹光', '极光效果', '镜面反射', '水面反光', '玻璃折射'
        ]
      },
      {
        key: 'texture',
        name: '质感',
        icon: '🤚',
        tags: [
          // 光滑质感
          '光滑质感', '丝绸质感', '水晶质感', '玻璃质感', '镜面质感', '陶瓷质感', '珠光质感',
          
          // 粗糙质感  
          '粗糙质感', '磨砂质感', '颗粒质感', '沙粒质感', '石头质感', '混凝土质感',
          
          // 材质质感
          '金属质感', '木质质感', '皮革质感', '绒毛质感', '羊毛质感', '棉质质感', '麻质质感',
          
          // 自然质感
          '树皮质感', '岩石质感', '沙滩质感', '雪花质感', '水波质感', '云朵质感',
          
          // 精致质感
          '缎面质感', '天鹅绒质感', '蕾丝质感', '刺绣质感', '编织质感', '手工质感',
          
          // 现代质感
          '哑光质感', '高光质感', '亮面质感', '半光质感', '雾面质感', '珠光漆质感'
        ]
      }
    ]
  },
  {
    key: 'atmosphere',
    name: '氛围词',
    icon: '🌟',
    subcategories: [
      {
        key: 'scene_mood',
        name: '画面氛围',
        icon: '🎨',
        tags: [
          // 时间氛围
          '晨曦初露', '午后阳光', '黄昏时分', '夜色朦胧', '深夜静谧', '破晓时光',
          '日落余晖', '月夜如水', '星空璀璨', '雾霭缭绕',
          
          // 季节氛围
          '春意盎然', '夏日清凉', '秋意浓浓', '冬日暖阳', '雪花飞舞', '春风拂面',
          '夏夜清风', '秋叶满地', '冬雪皑皑', '梅花飘香',
          
          // 情感氛围
          '温馨和谐', '宁静致远', '激情四射', '忧郁深沉', '欢乐祥和', '神秘莫测',
          '浪漫唯美', '古典雅致', '现代简约', '复古怀旧',
          
          // 空间氛围
          '空旷辽阔', '狭窄逼仄', '高大宏伟', '精致细腻', '粗犷豪放', '婉约清新',
          '庄严肃穆', '轻松活泼', '深邃幽静', '明亮通透'
        ]
      },
      {
        key: 'dreamy',
        name: '梦幻',
        icon: '💫',
        tags: [
          '梦幻', '虚幻', '超现实', '朦胧', '飘逸', '轻盈', '空灵', '神秘', '魔幻', '童话感',
          '仙境般', '云雾缭绕', '光影梦幻', '梦境般', '虚无缥缈', '如梦如幻',
          '超凡脱俗', '天马行空', '奇幻色彩', '幻想世界', '梦想国度', '童话世界',
          
          // 根据图片新增的梦幻元素
          '梦幻氛围', '朦胧画面效果', '梦幻神意', '朦胧模糊感', '梦幻场景', '微醺的感觉', 
          '全局朦胧模糊效果', '朦胧有光感'
        ]
      },
      {
        key: 'healing',
        name: '治愈',
        icon: '🌿',
        tags: [
          '温馨', '治愈', '舒缓', '宁静', '平和', '温柔', '清新', '自然', '纯净', '放松',
          '心灵慰藉', '温暖人心', '岁月静好', '安详宁和', '温润如玉', '柔情似水',
          '春风化雨', '润物无声', '温暖阳光', '清风徐来', '鸟语花香', '恬静安逸',
          
          // 根据图片新增的治愈元素
          '治愈明亮', '治愈风景', '温暖又有趣', '旧时光'
        ]
      },
      {
        key: 'oriental',
        name: '东方美感',
        icon: '🏮',
        tags: [
          '古典美', '东方韵味', '禅意', '水墨意境', '古韵', '诗意', '雅致', '含蓄', '婉约', '清雅',
          '中式美学', '古风古韵', '书香气息', '文人雅士', '琴棋书画', '茶香墨韵',
          '江南水乡', '古色古香', '传统文化', '国风典雅', '古建筑美', '传统工艺',
          
          // 根据图片新增的东方美感元素
          '东方美学氛围', '水墨意境', '写意'
        ]
      },
      {
        key: 'artistic',
        name: '意境',
        icon: '🎭',
        tags: [
          '意境深远', '诗意', '文艺', '浪漫', '唯美', '深邃', '内敛', '高雅', '脱俗', '空灵',
          '艺术气息', '美学境界', 
          
          // 根据图片新增的意境元素
          '空灵', '意境', '意识流'
        ]
      },
      {
        key: 'luxury',
        name: '高级感',
        icon: '💎',
        tags: [
          '高级感', '奢华', '精致', '优雅', '贵气', '品质感', '时尚', '大气', '精美',
          '贵族气质', '宫廷风范', '皇室典雅', '名门风度', '质量上乘', '工艺精湛', 
          // 根据图片新增的高级感元素
          '神秘感', '日常时尚'
        ]
      },
    ]
  }
]

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [finalPrompt, setFinalPrompt] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('提示词已复制到剪贴板！')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showQRCode, setShowQRCode] = useState<string | null>(null)
  
  // 新增上传和分享相关状态
  const [sharedPosts, setSharedPosts] = useState<Array<{id: string, imageUrl: string, prompt: string, userName: string, uploadTime: string}>>([])
  const [currentUpload, setCurrentUpload] = useState<{file: File | null, preview: string, prompt: string}>({file: null, preview: '', prompt: ''})
  const [userName, setUserName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  // 加载已分享的帖子
  const loadPosts = useCallback(async () => {
    setIsLoadingPosts(true)
    try {
      const response = await fetch('/api/posts')
      const result = await response.json()
      
      if (result.success) {
        setSharedPosts(result.data)
      } else {
        console.error('加载帖子失败:', result.message)
      }
    } catch (error) {
      console.error('加载帖子出错:', error)
    } finally {
      setIsLoadingPosts(false)
    }
  }, [])

  // 页面加载时获取帖子数据
  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // QR码组件
  const QRCodeModal = ({ type, onClose }: { type: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 m-4 max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">
            {type === 'wechat' ? '关注微信公众号' : '关注微博'}
          </h3>
          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-gray-500">二维码占位</span>
          </div>
          <p className="text-sm text-gray-600">扫描二维码关注@鸣姐</p>
          <button 
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )

  // 图片预览模态框组件
  const ImagePreviewModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => {
    console.log('ImagePreviewModal 渲染，图片URL:', imageUrl)
    return (
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
        onClick={onClose}
      >
        <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="图片预览"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <button 
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xl transition-all duration-200"
            onClick={onClose}
          >
            ×
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
            点击任意位置关闭
          </div>
        </div>
      </div>
    )
  }

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tag)) {
        newSet.delete(tag)
      } else {
        newSet.add(tag)
      }
      return newSet
    })
  }, [])

  const generatePrompt = useCallback(() => {
    let prompt = userInput.trim()
    if (selectedTags.size > 0) {
      const tagsArray = Array.from(selectedTags)
      if (prompt) {
        prompt += ', ' + tagsArray.join(', ')
      } else {
        prompt = tagsArray.join(', ')
      }
    }
    setFinalPrompt(prompt)
  }, [userInput, selectedTags])

  const clearSelection = useCallback(() => {
    setSelectedTags(new Set())
    setFinalPrompt('')
  }, [])

  const copyToClipboard = useCallback(async (text?: string) => {
    const textToCopy = text || finalPrompt
    try {
      await navigator.clipboard.writeText(textToCopy)
      setToastMessage('✅ 提示词已复制到剪贴板！')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    }
  }, [finalPrompt])

  const toggleCategory = useCallback((categoryKey: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey)
      } else {
        newSet.add(categoryKey)
      }
      return newSet
    })
  }, [])

  // 处理图片选择（不立即上传）
  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageSelect triggered', event.target.files)
    const files = event.target.files
    if (!files || files.length === 0) {
      console.log('No files selected')
      return
    }

    const file = files[0] // 只处理第一张图片
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCurrentUpload({
          file,
          preview: e.target?.result as string,
          prompt: ''
        })
      }
      reader.readAsDataURL(file)
    }
    
    // 清空input的值，允许重复选择同一文件
    event.target.value = ''
  }, [])

  // 提交上传（图片+提示词）
  const handleSubmitPost = useCallback(async () => {
    if (!currentUpload.file || !currentUpload.prompt.trim() || !userName.trim()) {
      alert('请选择图片、填写提示词和用户名')
      return
    }

    setIsUploading(true)
    
    try {
      // 创建 FormData
      const formData = new FormData()
      formData.append('image', currentUpload.file)
      formData.append('prompt', currentUpload.prompt)
      formData.append('userName', userName)
      
      // 发送到后端
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 上传成功，重新加载帖子列表
        await loadPosts()
        
        // 清空当前上传
        setCurrentUpload({file: null, preview: '', prompt: ''})
        
        // 显示成功提示
        setToastMessage('🎉 图片分享成功！')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        alert(result.message || '上传失败')
      }
    } catch (error) {
      console.error('上传出错:', error)
      alert('上传失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }, [currentUpload, userName, loadPosts])

  // 取消当前上传
  const handleCancelUpload = useCallback(() => {
    setCurrentUpload({file: null, preview: '', prompt: ''})
  }, [])

  // 清空已分享内容（仅用于演示）
  const handleClearSharedPosts = useCallback(async () => {
    if (confirm('确定要清空所有分享内容吗？此操作不可恢复。')) {
      try {
        // 删除所有帖子
        const deletePromises = sharedPosts.map(post => 
          fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
        )
        await Promise.all(deletePromises)
        
        // 重新加载帖子列表
        await loadPosts()
        
        setToastMessage('🧹 内容已清空！')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } catch (error) {
        console.error('清空失败:', error)
        alert('清空失败，请重试')
      }
    }
  }, [sharedPosts, loadPosts])



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 p-4 sm:p-8">
      {/* QR码弹窗 */}
      {showQRCode && (
        <QRCodeModal 
          type={showQRCode} 
          onClose={() => setShowQRCode(null)} 
        />
      )}

      {/* 图片预览弹窗 */}
      {previewImage && (
        <ImagePreviewModal 
          imageUrl={previewImage} 
          onClose={() => setPreviewImage(null)} 
        />
      )}

      {/* Toast 通知 */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 p-8 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent" style={{ marginLeft: '1em' }}>
                AI提示词组合器
              </h1>
              <p className="text-orange-700 text-lg font-medium mt-2" style={{ marginLeft: '2em' }}>选择不同类别的提示词，轻松创建AI绘画指令</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-orange-800">
              {/* 公众号二维码 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-lg shadow-md overflow-hidden">
                  <Image 
                    src="/qr-wechat.png" 
                    alt="公众号二维码"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs mt-1 font-medium">公众号</span>
              </div>

              {/* 视频号二维码 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-lg shadow-md overflow-hidden">
                  <Image 
                    src="/qr-video.png" 
                    alt="视频号二维码"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs mt-1 font-medium">视频号</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <span className="text-orange-800 font-medium text-sm" style={{ marginRight: '3em' }}>欢迎关注@鸣姐</span>
          </div>
        </header>

        {/* 主要内容区域 - 上下排列布局 */}
        <div className="space-y-8">
          {/* 使用说明区域 */}
          <div className="bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
              📖 使用说明
            </h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200">
              <div className="text-orange-900 leading-relaxed space-y-2">
                <p><strong>1. 两种使用方式：</strong></p>
                <ul className="ml-6 space-y-1 list-disc">
                  <li>先输入自己想要的提示词，再选择提示词标签做补充</li>
                  <li>直接使用提示词标签进行组合，不做其他输入</li>
                  <li>点击“生成提示词”，然后复制，就可以把这段提示词复制到AI绘图工具中去生图</li>
                </ul>
                <p className="mt-3"><strong>2. 标签选择建议：</strong></p>
                <p className="ml-6">提示词标签请按照顺序选择，从人物描述到环境、风格、技法等，这样生成的提示词更有逻辑性</p>
              </div>
            </div>
          </div>

          {/* 自定义提示词区域 */}
          <div className="bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
              📝 自定义提示词(可选)
            </h2>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="输入你的基础提示词，比如：一位美丽的女性..."
              className="w-full p-4 rounded-xl border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none text-black bg-white/80 backdrop-blur-sm"
              rows={4}
            />
          </div>

          {/* 标签选择区域 */}
          <div className="bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800 mb-6 flex items-center gap-2">
              🏷️ 选择提示词标签
            </h2>
            
            <div className="space-y-4">
              {promptCategories.map((category) => (
                <div key={category.key} className="border border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-orange-50">
                  <button
                    onClick={() => toggleCategory(category.key)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-orange-100 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-semibold text-orange-800">{category.name}</span>
                      <span className="text-sm text-orange-600">({category.subcategories.reduce((sum, sub) => sum + sub.tags.length, 0)}个)</span>
                    </div>
                    <div className="text-orange-600">
                      {expandedCategories.has(category.key) ? '▼' : '▶'}
                    </div>
                  </button>
                  
                  {expandedCategories.has(category.key) && (
                    <div className="p-4 pt-0 space-y-4 bg-white rounded-b-xl">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.key}>
                          <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                            <span className="text-lg">{subcategory.icon}</span>
                            {subcategory.name}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {subcategory.tags.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 transform hover:scale-105 ${
                                  selectedTags.has(tag)
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-white text-black border border-orange-300 hover:bg-orange-100 hover:border-orange-400'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 已选择标签 */}
            {selectedTags.size > 0 && (
              <div className="mt-6 p-4 bg-white rounded-xl border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                    ✨ 已选择标签 ({selectedTags.size})
                  </h3>
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
                  >
                    清空选择
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {Array.from(selectedTags).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-full text-sm shadow-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagClick(tag)}
                        className="ml-1 text-white hover:text-red-200 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 生成提示词区域 */}
          <div className="bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
              🎯 生成提示词
            </h2>
            <div className="bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl p-4 border border-orange-200 mb-4">
              <textarea
                value={finalPrompt}
                onChange={(e) => setFinalPrompt(e.target.value)}
                placeholder="请输入自定义提示词或选择标签来生成完整的提示词"
                className="w-full min-h-[200px] p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none text-amber-900 leading-relaxed"
                rows={8}
              />
              <div className="mt-3 text-sm text-orange-700 bg-orange-100/50 rounded-lg p-3 border border-orange-200">
                💡 <strong>优化提示：</strong>可以做适当调整，把你认为重要的要素往前放，删掉重复、冲突要素
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generatePrompt}
                disabled={!userInput && selectedTags.size === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              >
                🎨 生成提示词
              </button>
              <button
                onClick={() => copyToClipboard()}
                disabled={!finalPrompt}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              >
                📋 复制
              </button>
            </div>
          </div>

          {/* 图片分享功能区域 */}
          <div className="bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
              📸 分享图片和提示词
            </h2>
            
            {/* 用户名输入 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-orange-700 mb-2">
                你的昵称：
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="请输入你的昵称"
                className="w-full p-3 rounded-xl border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-black bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* 如果没有选择图片，显示上传区域 */}
            {!currentUpload.file ? (
              <div className="mb-6">
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl p-8 border-2 border-dashed border-orange-300 hover:border-orange-400 transition-colors">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📤</div>
                      <span className="text-orange-700 font-medium hover:text-orange-800 text-xl">点击选择图片</span>
                      <p className="text-sm text-orange-600 mt-2">支持 JPG、PNG、GIF 等格式，请选择一张图片</p>
                    </div>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              /* 如果已选择图片，显示预览和提示词输入 */
              <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 图片预览 - 可点击放大 */}
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800 mb-3">预览图片</h3>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentUpload.preview}
                      alt="预览图片"
                      className="w-full aspect-[3/4] object-cover rounded-lg border border-orange-200 cursor-pointer transition-all duration-300"
                      onClick={() => {
                        console.log('点击了预览图片:', currentUpload.preview)
                        setPreviewImage(currentUpload.preview)
                      }}
                    />
                  </div>
                  
                  {/* 提示词输入 */}
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800 mb-3">提示词</h3>
                    <textarea
                      value={currentUpload.prompt}
                      onChange={(e) => setCurrentUpload(prev => ({ ...prev, prompt: e.target.value }))}
                      placeholder="请输入用于生成这张图片的提示词，支持粘贴文本..."
                      className="w-full h-48 p-3 rounded-lg border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none text-black bg-white"
                    />
                    <p className="text-sm text-orange-600 mt-2">
                      📝 提示词将与图片一起分享，帮助其他用户了解如何生成类似的图片
                    </p>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSubmitPost}
                    disabled={!currentUpload.prompt.trim() || !userName.trim() || isUploading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {isUploading ? '📤 分享中...' : '📤 分享到社区'}
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    disabled={isUploading}
                    className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 社区分享区域 */}
          {sharedPosts.length > 0 && (
            <div className="bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-orange-800 flex items-center gap-2">
                  🌟 社区分享 ({sharedPosts.length})
                  {isLoadingPosts && <span className="text-sm text-orange-600 ml-2">加载中...</span>}
                </h2>
                <button
                  onClick={handleClearSharedPosts}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white text-sm rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 font-medium shadow hover:shadow-md"
                >
                  清空展示
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm border border-orange-200 hover:shadow-md transition-shadow">
                    {/* 图片 - 可点击放大 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt="分享的图片"
                      className="w-full aspect-[3/4] object-cover rounded-lg border border-orange-200 cursor-pointer transition-all duration-300 mb-3"
                      onClick={() => {
                        console.log('点击了社区图片:', post.imageUrl)
                        setPreviewImage(post.imageUrl)
                      }}
                    />
                    
                    {/* 提示词 */}
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-orange-800 mb-2">提示词：</h4>
                      <div className="bg-orange-50 rounded-lg p-3 text-sm text-gray-700 max-h-24 overflow-y-auto">
                        {post.prompt}
                      </div>
                    </div>
                    
                    {/* 用户信息和操作 */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>👤 {post.userName}</span>
                      <span>� {post.uploadTime}</span>
                    </div>
                    
                    <button
                      onClick={() => copyToClipboard(post.prompt)}
                      className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow hover:shadow-md"
                    >
                      📋 复制提示词
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-black">
          <p className="text-sm">Made with ❤️ for AI creators</p>
        </footer>
      </div>
    </div>
  )
}
