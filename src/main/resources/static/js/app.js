const API = '/api/quote';

const i18n = {
    zh: {
        pageTitle: '运 输 费 报 价',
        length: '长 (m)',
        width: '宽 (m)',
        height: '高 (m)',
        quantity: '数量',
        weight: '重量 (kg)',
        product: '品名',
        placeholderLength: '例：2.00',
        placeholderWidth: '例：1.20',
        placeholderHeight: '例：1.50',
        placeholderQuantity: '例：10',
        placeholderWeight: '例：800',
        placeholderProduct: '-- 请选择品名 --',
        calcBtn: '计 算 报 价',
        calculating: '计算中...',
        resProduct: '品名',
        resVolume: '体积',
        resDensity: '密度',
        resUnitPrice: '单价',
        totalPrefix: '总价：',
        unitPriceSuffix: ' 美元/kg',
        totalSuffix: ' 美元',
        fillAll: '请填写所有字段',
        rateLimit: '请求过于频繁，请稍后再试',
        calcFailed: '计算失败',
        networkError: '网络错误：',
        loadFailed: '加载品名列表失败：',
        originCountry: '出发国家',
        originCity: '出发城市',
        destCountry: '到达国家',
        destCity: '到达城市',
        selectCountry: '-- 请选择国家 --',
        selectCityFirst: '-- 请先选择国家 --',
        selectCity: '-- 请选择城市 --',
        routeDist: '公路里程',
        routeTime: '预计驾驶时间',
        routeLoading: '正在规划路线...',
        routeUnavailable: '路线规划不可用（显示直线距离）'
    },
    ru: {
        pageTitle: 'Расчёт перевозки',
        length: 'Длина (м)',
        width: 'Ширина (м)',
        height: 'Высота (м)',
        quantity: 'Количество',
        weight: 'Вес (кг)',
        product: 'Товар',
        placeholderLength: 'напр. 2.00',
        placeholderWidth: 'напр. 1.20',
        placeholderHeight: 'напр. 1.50',
        placeholderQuantity: 'напр. 10',
        placeholderWeight: 'напр. 800',
        placeholderProduct: '-- Выберите товар --',
        calcBtn: 'Рассчитать',
        calculating: 'Расчёт...',
        resProduct: 'Товар',
        resVolume: 'Объём',
        resDensity: 'Плотность',
        resUnitPrice: 'Цена за ед.',
        totalPrefix: 'Итого: ',
        unitPriceSuffix: ' $/кг',
        totalSuffix: ' $',
        fillAll: 'Заполните все поля',
        rateLimit: 'Слишком много запросов, попробуйте позже',
        calcFailed: 'Ошибка расчёта',
        networkError: 'Ошибка сети: ',
        loadFailed: 'Не удалось загрузить список товаров: ',
        originCountry: 'Страна отправления',
        originCity: 'Город отправления',
        destCountry: 'Страна назначения',
        destCity: 'Город назначения',
        selectCountry: '-- Выберите страну --',
        selectCityFirst: '-- Сначала выберите страну --',
        selectCity: '-- Выберите город --',
        routeDist: 'Дистанция',
        routeTime: 'Расчётное время',
        routeLoading: 'Прокладка маршрута...',
        routeUnavailable: 'Маршрут недоступен (прямая линия)'
    },
    en: {
        pageTitle: 'Freight Quote',
        length: 'Length (m)',
        width: 'Width (m)',
        height: 'Height (m)',
        quantity: 'Quantity',
        weight: 'Weight (kg)',
        product: 'Product',
        placeholderLength: 'e.g. 2.00',
        placeholderWidth: 'e.g. 1.20',
        placeholderHeight: 'e.g. 1.50',
        placeholderQuantity: 'e.g. 10',
        placeholderWeight: 'e.g. 800',
        placeholderProduct: '-- Select Product --',
        calcBtn: 'Calculate Quote',
        calculating: 'Calculating...',
        resProduct: 'Product',
        resVolume: 'Volume',
        resDensity: 'Density',
        resUnitPrice: 'Unit Price',
        totalPrefix: 'Total: ',
        unitPriceSuffix: ' $/kg',
        totalSuffix: ' $',
        fillAll: 'Please fill in all fields',
        rateLimit: 'Too many requests, please try again later',
        calcFailed: 'Calculation failed',
        networkError: 'Network error: ',
        loadFailed: 'Failed to load product list: ',
        originCountry: 'Origin Country',
        originCity: 'Origin City',
        destCountry: 'Destination Country',
        destCity: 'Destination City',
        selectCountry: '-- Select Country --',
        selectCityFirst: '-- Select Country First --',
        selectCity: '-- Select City --',
        routeDist: 'Driving Distance',
        routeTime: 'Est. Driving Time',
        routeLoading: 'Planning route...',
        routeUnavailable: 'Route unavailable (straight line)'
    }
};

let currentLang = localStorage.getItem('lang') || 'zh';
const productsMap = new Map();
let lastProductId = null;

function t(key) {
    return i18n[currentLang]?.[key] || i18n.zh[key] || key;
}

function switchLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
}

function applyTranslations() {
    document.getElementById('langSelect').value = currentLang;
    document.getElementById('pageTitle').textContent = t('pageTitle');
    setLabels();
    document.getElementById('length').placeholder = t('placeholderLength');
    document.getElementById('width').placeholder = t('placeholderWidth');
    document.getElementById('height').placeholder = t('placeholderHeight');
    document.getElementById('quantity').placeholder = t('placeholderQuantity');
    document.getElementById('weight').placeholder = t('placeholderWeight');
    const productSelect = document.getElementById('productId');
    const firstOpt = productSelect.options[0];
    if (firstOpt && firstOpt.value === '') {
        firstOpt.textContent = t('placeholderProduct');
    }
    renderProductOptions();
    document.getElementById('lblProduct').textContent = t('resProduct');
    document.getElementById('lblVolume').textContent = t('resVolume');
    document.getElementById('lblDensity').textContent = t('resDensity');
    document.getElementById('lblUnitPrice').textContent = t('resUnitPrice');
    const btn = document.getElementById('calcBtn');
    if (!btn.dataset.loading || btn.dataset.loading !== 'true') {
        btn.textContent = t('calcBtn');
    }
    refreshCountrySelectors();
    updateDropdownPlaceholders();
    if (map && document.getElementById('mapSection').classList.contains('show')) {
        onLocationChange();
    }
    refreshRoutePanel();
}

function refreshRoutePanel() {
    var info = document.getElementById('routeInfo');
    if (!info || !info._routeData) return;
    var d = info._routeData;
    var oCity = document.getElementById('originCity').value;
    var dCity = document.getElementById('destCity').value;
    info.innerHTML = '<span>' + (oCity || '') + ' <b style="font-size:16px;margin:0 4px;">→</b> ' + (dCity || '') + '</span>' +
        '<span>' + t('routeDist') + ': <b>' + d.distKm + ' km</b></span>';
}

function updateDropdownPlaceholders() {
    ['originCountry', 'originCity', 'destCountry', 'destCity'].forEach(function(id) {
        var sel = document.getElementById(id);
        var opt = sel.options[0];
        if (opt && opt.value === '') {
            if (id.includes('Country')) opt.textContent = t('selectCountry');
            else {
                var countryVal = document.getElementById(id === 'originCity' ? 'originCountry' : 'destCountry').value;
                opt.textContent = countryVal ? t('selectCity') : t('selectCityFirst');
            }
        }
    });
}

// ===== 地图 =====
var map = null;
var originMarker = null;
var destMarker = null;
var routeLine = null;

function initCountrySelectors() {
    var originSel = document.getElementById('originCountry');
    var destSel = document.getElementById('destCountry');
    originSel.innerHTML = '<option value="">' + t('selectCountry') + '</option>';
    destSel.innerHTML = '<option value="">' + t('selectCountry') + '</option>';
    countryOrder.forEach(function(key) {
        var label = countryDisplayName(key);
        [originSel, destSel].forEach(function(sel) {
            var opt = document.createElement('option');
            opt.value = key;
            opt.textContent = label;
            sel.appendChild(opt);
        });
    });
    resetCityDropdown('originCity');
    resetCityDropdown('destCity');
}

function resetCityDropdown(id) {
    var sel = document.getElementById(id);
    sel.innerHTML = '<option value="">' + t('selectCityFirst') + '</option>';
}

function populateCityDropdown(countryKey, selectId) {
    var sel = document.getElementById(selectId);
    sel.innerHTML = '<option value="">' + t('selectCity') + '</option>';
    if (!countryKey || !citiesData[countryKey]) return;
    Object.keys(citiesData[countryKey].cities).sort(function(a, b) {
        return a.localeCompare(b, 'zh');
    }).forEach(function(name) {
        var opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        sel.appendChild(opt);
    });
}

function onOriginCountryChange() {
    populateCityDropdown(document.getElementById('originCountry').value, 'originCity');
    onLocationChange();
}

function onDestCountryChange() {
    populateCityDropdown(document.getElementById('destCountry').value, 'destCity');
    onLocationChange();
}

function onLocationChange() {
    var originCountry = document.getElementById('originCountry').value;
    var originCity = document.getElementById('originCity').value;
    var destCountry = document.getElementById('destCountry').value;
    var destCity = document.getElementById('destCity').value;

    var oCoord = (originCountry && originCity && citiesData[originCountry])
        ? citiesData[originCountry].cities[originCity] : null;
    var dCoord = (destCountry && destCity && citiesData[destCountry])
        ? citiesData[destCountry].cities[destCity] : null;

    var section = document.getElementById('mapSection');
    if (!oCoord || !dCoord) {
        section.classList.remove('show');
        return;
    }
    section.classList.add('show');
    updateMap(oCoord, dCoord, originCity, destCity);
}

function updateMap(oCoord, dCoord, oName, dName) {
    if (!map) {
        map = L.map('map', { worldCopyJump: true }).setView([48, 80], 3);

        var primaryTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri &copy; OSM', maxZoom: 18, maxNativeZoom: 17
        }).addTo(map);

        var fallbackTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '', maxZoom: 18, maxNativeZoom: 19
        });

        var fallbackActive = false;
        primaryTiles.on('tileerror', function() {
            if (fallbackActive) return;
            fallbackActive = true;
            map.removeLayer(primaryTiles);
            fallbackTiles.addTo(map);
        });
        fallbackTiles.on('tileerror', function() {
            if (!fallbackActive) return;
            fallbackActive = false;
            map.removeLayer(fallbackTiles);
            primaryTiles.addTo(map);
        });

        var dragTimeout;
        map.on('dragend', function() {
            clearTimeout(dragTimeout);
            dragTimeout = setTimeout(function() {
                (fallbackActive ? fallbackTiles : primaryTiles).redraw();
            }, 200);
        });
    }

    if (originMarker) map.removeLayer(originMarker);
    if (destMarker) map.removeLayer(destMarker);
    if (routeLine) map.removeLayer(routeLine);

    // 出发地
    originMarker = L.layerGroup().addTo(map);
    L.circleMarker(oCoord, { radius: 9, fillColor: '#27ae60', color: '#fff', weight: 3, fillOpacity: 1 }).addTo(originMarker);
    L.tooltip({ permanent: true, direction: 'bottom', offset: [0, 14], className: 'marker-label' })
        .setContent('<b>' + oName + '</b>').setLatLng(oCoord).addTo(originMarker);

    // 到达地
    destMarker = L.layerGroup().addTo(map);
    L.circleMarker(dCoord, { radius: 9, fillColor: '#e74c3c', color: '#fff', weight: 3, fillOpacity: 1 }).addTo(destMarker);
    L.tooltip({ permanent: true, direction: 'bottom', offset: [0, 14], className: 'marker-label' })
        .setContent('<b>' + dName + '</b>').setLatLng(dCoord).addTo(destMarker);

    // 贝塞尔弧线
    var midLat = (oCoord[0] + dCoord[0]) / 2;
    var midLng = (oCoord[1] + dCoord[1]) / 2;
    var distDeg = Math.sqrt(Math.pow(dCoord[0] - oCoord[0], 2) + Math.pow(dCoord[1] - oCoord[1], 2));
    var curve = Math.min(distDeg * 0.3, 22);
    var ctrlLat = midLat + curve;
    var ctrlLng = midLng;

    var arcPoints = [];
    for (var t = 0; t <= 1; t += 1 / 80) {
        var u = 1 - t;
        arcPoints.push([
            u * u * oCoord[0] + 2 * u * t * ctrlLat + t * t * dCoord[0],
            u * u * oCoord[1] + 2 * u * t * ctrlLng + t * t * dCoord[1]
        ]);
    }

    routeLine = L.layerGroup().addTo(map);
    L.polyline(arcPoints, { color: '#5dade2', weight: 5, opacity: 0.18, smoothFactor: 1 }).addTo(routeLine);
    L.polyline(arcPoints, { color: '#85c1e9', weight: 2, opacity: 0.55, smoothFactor: 1 }).addTo(routeLine);

    // 大圆距离
    var R = 6371;
    var d2r = Math.PI / 180;
    var lat1 = oCoord[0] * d2r, lat2 = dCoord[0] * d2r;
    var dlng = (dCoord[1] - oCoord[1]) * d2r;
    var sd = Math.sin((lat2 - lat1) / 2);
    var a = sd * sd + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlng / 2) * Math.sin(dlng / 2);
    var distKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

    var info = document.getElementById('routeInfo');
    info.style.display = 'flex';
    info._routeData = { distKm: distKm };
    info.innerHTML = '<span>' + oName + ' <b style="font-size:16px;margin:0 4px;">→</b> ' + dName + '</span>' +
        '<span>' + t('routeDist') + ': <b>' + distKm + ' km</b></span>';

    map.invalidateSize();
    map.fitBounds(L.latLngBounds([oCoord, dCoord]), { padding: [60, 60], animate: false });
}

function refreshCountrySelectors() {
    var originCountryVal = document.getElementById('originCountry').value;
    var destCountryVal = document.getElementById('destCountry').value;
    var originCityVal = document.getElementById('originCity').value;
    var destCityVal = document.getElementById('destCity').value;

    var opts1 = document.getElementById('originCountry').querySelectorAll('option');
    var opts2 = document.getElementById('destCountry').querySelectorAll('option');
    countryOrder.forEach(function(key, i) {
        if (opts1[i + 1]) opts1[i + 1].textContent = countryDisplayName(key);
        if (opts2[i + 1]) opts2[i + 1].textContent = countryDisplayName(key);
    });

    if (originCountryVal) {
        populateCityDropdown(originCountryVal, 'originCity');
        document.getElementById('originCity').value = originCityVal;
    }
    if (destCountryVal) {
        populateCityDropdown(destCountryVal, 'destCity');
        document.getElementById('destCity').value = destCityVal;
    }
    updateDropdownPlaceholders();
}

function setLabels() {
    var labels = document.querySelectorAll('.form-group label');
    var keys = ['length', 'width', 'height', 'quantity', 'weight', 'product', 'originCountry', 'originCity', 'destCountry', 'destCity'];
    labels.forEach(function(label, i) {
        if (i < keys.length) label.textContent = t(keys[i]);
    });
}

// 诗句
var poems = [
    { line: '雄关漫道真如铁，而今迈步从头越。', source: '—— 《忆秦娥·娄山关》' },
    { line: '天若有情天亦老，人间正道是沧桑。', source: '—— 《七律·人民解放军占领南京》' },
    { line: '为有牺牲多壮志，敢教日月换新天。', source: '—— 《七律·到韶山》' },
    { line: '一万年太久，只争朝夕。', source: '—— 《满江红·和郭沫若同志》' },
    { line: '数风流人物，还看今朝。', source: '—— 《沁园春·雪》' },
    { line: '红军不怕远征难，万水千山只等闲。', source: '—— 《七律·长征》' },
    { line: '世上无难事，只要肯登攀。', source: '—— 《水调歌头·重上井冈山》' },
    { line: '踏遍青山人未老，风景这边独好。', source: '—— 《清平乐·会昌》' },
    { line: '独有英雄驱虎豹，更无豪杰怕熊罴。', source: '—— 《七律·冬云》' },
    { line: '不管风吹浪打，胜似闲庭信步。', source: '—— 《水调歌头·游泳》' },
    { line: '待到山花烂漫时，她在丛中笑。', source: '—— 《卜算子·咏梅》' },
    { line: '多少事，从来急；天地转，光阴迫。', source: '—— 《满江红·和郭沫若同志》' },
    { line: '敌军围困万千重，我自岿然不动。', source: '—— 《西江月·井冈山》' },
    { line: '宜将剩勇追穷寇，不可沽名学霸王。', source: '—— 《七律·人民解放军占领南京》' },
    { line: '牢骚太盛防肠断，风物长宜放眼量。', source: '—— 《七律·和柳亚子先生》' },
    { line: '指点江山，激扬文字，粪土当年万户侯。', source: '—— 《沁园春·长沙》' },
    { line: '苍山如海，残阳如血。', source: '—— 《忆秦娥·娄山关》' },
    { line: '可上九天揽月，可下五洋捉鳖。', source: '—— 《水调歌头·重上井冈山》' },
    { line: '中华儿女多奇志，不爱红装爱武装。', source: '—— 《七绝·为女民兵题照》' },
    { line: '横空出世，莽昆仑，阅尽人间春色。', source: '—— 《念奴娇·昆仑》' },
    { line: '风雨送春归，飞雪迎春到。', source: '—— 《卜算子·咏梅》' },
    { line: '萧瑟秋风今又是，换了人间。', source: '—— 《浪淘沙·北戴河》' },
    { line: '装点此关山，今朝更好看。', source: '—— 《菩萨蛮·大柏地》' },
    { line: '东方欲晓，莫道君行早。', source: '—— 《清平乐·会昌》' },
    { line: '雄鸡一唱天下白，万方乐奏有于阗。', source: '—— 《浣溪沙·和柳亚子先生》' },
    { line: '斑竹一枝千滴泪，红霞万朵百重衣。', source: '—— 《七律·答友人》' },
    { line: '金猴奋起千钧棒，玉宇澄清万里埃。', source: '—— 《七律·和郭沫若同志》' },
    { line: '喜看稻菽千重浪，遍地英雄下夕烟。', source: '—— 《七律·到韶山》' },
    { line: '坐地日行八万里，巡天遥看一千河。', source: '—— 《七律二首·送瘟神》' },
    { line: '红雨随心翻作浪，青山着意化为桥。', source: '—— 《七律二首·送瘟神》' },
    { line: '冷眼向洋看世界，热风吹雨洒江天。', source: '—— 《七律·登庐山》' }
];

(function() {
    var today = poems[new Date().getDate() % poems.length];
    document.getElementById('poemLine').textContent = today.line;
    document.getElementById('poemSource').textContent = today.source;
})();

function productDisplayName(p) {
    if (currentLang === 'ru') return p.nameRu || p.name;
    if (currentLang === 'en') return p.nameEn || p.name;
    return p.name;
}

function renderProductOptions() {
    var select = document.getElementById('productId');
    while (select.options.length > 1) select.remove(1);
    productsMap.forEach(function(p) {
        var opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = productDisplayName(p);
        select.appendChild(opt);
    });
}

async function loadProducts() {
    try {
        var res = await fetch(API + '/products');
        var json = await res.json();
        if (json.code === 200 && json.data && json.data.length > 0) {
            json.data.forEach(function(p) { productsMap.set(p.id, p); });
            renderProductOptions();
        }
    } catch (e) {
        showError(t('loadFailed') + e.message);
    }
}

async function calculate() {
    var length = document.getElementById('length').value;
    var width = document.getElementById('width').value;
    var height = document.getElementById('height').value;
    var quantity = document.getElementById('quantity').value;
    var weight = document.getElementById('weight').value;
    var productId = document.getElementById('productId').value;

    hideError();
    hideResult();

    if (!length || !width || !height || !quantity || !weight || !productId) {
        showError(t('fillAll'));
        return;
    }

    lastProductId = parseInt(productId);

    var btn = document.getElementById('calcBtn');
    btn.disabled = true;
    btn.dataset.loading = 'true';
    btn.textContent = t('calculating');

    try {
        var res = await fetch(API + '/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                length: length, width: width, height: height,
                quantity: parseInt(quantity), weight: weight,
                productId: parseInt(productId)
            })
        });

        var json = await res.json();

        if (res.status === 429) { showError(t('rateLimit')); return; }

        if (json.code === 200 && json.data) {
            showResult(json.data);
        } else {
            showError(json.message || t('calcFailed'));
        }
    } catch (e) {
        showError(t('networkError') + e.message);
    } finally {
        btn.disabled = false;
        btn.dataset.loading = 'false';
        btn.textContent = t('calcBtn');
    }
}

function showResult(data) {
    var displayName = data.productName;
    if (lastProductId && productsMap.has(lastProductId)) {
        displayName = productDisplayName(productsMap.get(lastProductId));
    }
    document.getElementById('resProduct').textContent = displayName;
    document.getElementById('resVolume').textContent = data.volume + ' m³';
    document.getElementById('resDensity').textContent = data.density + ' kg/m³';
    document.getElementById('resUnitPrice').textContent = data.unitPrice + t('unitPriceSuffix');
    document.getElementById('resTotal').textContent = t('totalPrefix') + data.totalPrice + t('totalSuffix');
    document.getElementById('result').classList.add('show');
}

function hideResult() {
    document.getElementById('result').classList.remove('show');
}

function showError(msg) {
    var el = document.getElementById('errorMsg');
    el.textContent = msg;
    el.classList.add('show');
}

function hideError() {
    document.getElementById('errorMsg').classList.remove('show');
}

initCountrySelectors();
applyTranslations();
loadProducts();
