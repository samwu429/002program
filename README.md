# 硬骨头泰拳馆 · 官网

老哥拳馆的网站，静态站，纯 HTML / CSS / JS，没用任何框架。

## 跑起来

直接双击 `index.html` 就能在浏览器里看。或者起个本地服务：

```
python -m http.server 8000
```

然后开 `http://localhost:8000`。

## 目录

```
.
├─ index.html           主页 · 四向导航
├─ about.html           简介
├─ pricing.html         价格表
├─ coaches.html         教练介绍
├─ contact.html         联系方式
├─ css/
│  ├─ base.css          全站样式（配色、字体、按钮、顶栏、底栏）
│  ├─ punch.css         拳头冲击过场动画
│  ├─ home.css          主页
│  ├─ about.css         简介页
│  ├─ pricing.css       价格表页
│  ├─ coaches.css       教练页
│  └─ contact.css       联系方式页
├─ js/
│  └─ punch.js          拳头过场逻辑（按方向决定从哪边打过来）
├─ assets/
│  ├─ glove.svg         拳套
│  └─ crack.svg         击中碎裂线
└─ README.md
```

## 拳头过场怎么用

任何元素加上 `data-punch-to="目标页面.html"` 就会有拳头过场。
方向自动按按钮的位置算，也可以手动指定：

```
<a href="about.html" data-punch-to="about.html" data-punch="up">看简介</a>
```

可选方向：`up` / `down` / `left` / `right` / `up-left` / `up-right` / `down-left` / `down-right`。

## 改内容

文案都直接写在 HTML 里，图也都是占位框，后面替换 `assets/` 里的图片就行。
