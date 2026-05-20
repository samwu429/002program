# Elephant Muay Thai · 象 · 泰拳馆 官网

老哥馆里的网站，静态站，纯 HTML / CSS / JS，没用任何框架。黑金 + 红色辅，Bangkok style。

## 跑起来

直接双击 `index.html` 就能在浏览器里看。或者起个本地服务：

```
python -m http.server 8000
```

然后开 `http://localhost:8000`。

## 目录

```
.
├─ index.html           主页 · 四向导航 + 时间线 + 八肢
├─ about.html           简介
├─ pricing.html         价格表
├─ coaches.html         教练介绍
├─ contact.html         联系方式
├─ css/
│  ├─ base.css          全站基底（黑金红配色、Cinzel/Oswald/Noto Sans SC 字体、按钮、顶/底栏）
│  ├─ punch.css         拳头冲击 + 按钮碎裂动画
│  ├─ home.css          主页专属
│  ├─ about.css         简介页
│  ├─ pricing.css       价格表页
│  ├─ coaches.css       教练页
│  └─ contact.css       联系方式页
├─ js/
│  └─ punch.js          拳头过场逻辑：方向判断 / 速度线 / 4 段拳套残影 / 闪光 / 24 火花 / 12 块碎片 / 多重冲击波 / 全屏裂纹 / 烟尘 / 余烬 / 屏幕震动 + 缩放 + 染色 + 闭幕 + Web Audio 合成的低音 + 玻璃碎裂声
├─ assets/
│  ├─ elephant-logo.png 拳馆主 logo（图片）
│  ├─ elephant-mark.svg 导航栏小金象
│  ├─ glove.svg         拳套
│  └─ crack.svg         击中碎裂线
└─ README.md
```

## 拳头过场怎么用

任何元素加上 `data-punch-to="目标页面.html"` 就有冲击过场。
方向自动按按钮位置算（按钮在哪边，拳就从哪边过来），也可以手动指定：

```
<a href="about.html" data-punch-to="about.html" data-punch="up">看简介</a>
```

可选方向：`up` / `down` / `left` / `right` / `up-left` / `up-right` / `down-left` / `down-right`。

## 过场都包含什么

按时间顺序：

1. 拳套从对应方向飞过来，带 4 层残影 + 9 条金色速度线
2. 击中按钮瞬间：合成低音 + 玻璃碎声、全屏白闪、按钮原位 12 块碎片向外飞散 + 旋转
3. 4 圈金色 / 红色冲击波从命中点扩散到全屏
4. 全屏 36 条放射状裂纹 + 8 条交叉裂纹
5. 28 颗火花朝四面八方迸射 + 14 颗金色余烬向上飘升
6. 命中点冒出深棕色烟尘云、慢慢上飘消散
7. 主体内容剧烈晃动 + 微缩放 + 暖色染色
8. 黑色幕布从底向上拉起，过渡到下一页

总时长 1080ms，按钮命中在 340ms。

## 改内容

文案都直接写在 HTML 里，图也都是占位框，后面替换 `assets/` 里的图片就行。logo 用的就是你给的那张。

## 配色

```
--bg: #0a0907
--gold: #d4a64a
--gold-2: #f1c668
--gold-3: #8a6420
--red: #c8302a
--text: #f5ecd6
```
