/* Продовый скрипт калькулятора — БЕЗ ИЗМЕНЕНИЙ (turbolemons-smart-calculator.js). Логику не трогаем. */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* V27 · LOGIC AUDIT + AUTO VISUAL TERRITORY: adaptive bands, uncertainty, category normalization, budget policy, automatic art-scene. */

    const root = document.querySelector('[data-tlsc-root]');
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dataNode = root.querySelector('#tlsc-catalog-data');
    let products = [];

    try {
        products = JSON.parse(dataNode ? dataNode.textContent : '[]');
    } catch (e) {
        products = [];
    }

    const controls = root.querySelector('[data-tlsc-controls]');
    const result = root.querySelector('[data-tlsc-result]');
    const stage = root.querySelector('[data-tlsc-stage]');
    const budget = root.querySelector('[data-tlsc-budget]');
    const budgetLabel = root.querySelector('[data-tlsc-budget-label]');
    const budgetMarketLabel = root.querySelector('[data-tlsc-budget-market-label]');
    const marketMiniPoints = root.querySelector('[data-tlsc-market-points]');
    const budgetMapPoints = root.querySelector('[data-tlsc-budget-map-points]');
    const budgetCursor = root.querySelector('[data-tlsc-budget-cursor]');
    const budgetMapLabel = root.querySelector('[data-tlsc-budget-map-label]');
    const precisionToggle = root.querySelector('[data-tlsc-precision-toggle]');
    const precisionPanel = root.querySelector('[data-tlsc-precision]');
    const brandSelect = root.querySelector('[data-tlsc-brand]');
    const refineWrap = root.querySelector('[data-tlsc-refine]');
    const precisionSummary = root.querySelector('[data-tlsc-precision-summary]');
    const precisionStatus = root.querySelector('[data-tlsc-precision-status]');
    const precisionReset = root.querySelector('[data-tlsc-precision-reset]');
    const terrainPriorityName = root.querySelector('[data-tlsc-priority-name="terrain"]');

    const productName = root.querySelector('[data-tlsc-product-name]');
    const productSubtitle = root.querySelector('[data-tlsc-product-subtitle]');
    const productImage = root.querySelector('[data-tlsc-product-image]');
    const productEmpty = root.querySelector('[data-tlsc-product-empty]');
    const noResultStage = root.querySelector('[data-tlsc-no-result]');
    const productBrand = root.querySelector('[data-tlsc-product-brand]');
    const productYear = root.querySelector('[data-tlsc-product-year]');
    const galleryNode = root.querySelector('[data-tlsc-gallery]');
    const galleryCounter = root.querySelector('[data-tlsc-gallery-counter]');
    const variantsNode = root.querySelector('[data-tlsc-variants]');
    const colorChoices = root.querySelector('[data-tlsc-color-choices]');
    const colorName = root.querySelector('[data-tlsc-color-name]');
    const colorStock = root.querySelector('[data-tlsc-color-stock]');
    const accessoriesTab = root.querySelector('[data-tlsc-accessories-tab]');
    const accessoriesCount = root.querySelector('[data-tlsc-accessories-count]');
    const accessoriesCaption = root.querySelector('[data-tlsc-accessories-caption]');
    const accessoriesNode = root.querySelector('[data-tlsc-accessories]');
    const productLink = root.querySelector('[data-tlsc-product-link]');
    const cartButtons = Array.from(root.querySelectorAll('[data-tlsc-cart]'));
    const priceNode = root.querySelector('[data-tlsc-price]');
    const priceRangeNode = root.querySelector('[data-tlsc-price-range]');
    const matchNode = root.querySelector('[data-tlsc-match]');
    const matchRing = root.querySelector('[data-tlsc-match-ring]');
    const matchCaption = root.querySelector('[data-tlsc-match-caption]');
    const metricLabelTerrain = root.querySelector('[data-tlsc-metric-label="terrain"]');
    const budgetFitWrap = root.querySelector('[data-tlsc-budget-fit-wrap]');
    const budgetFit = root.querySelector('[data-tlsc-budget-fit]');
    const budgetDelta = root.querySelector('[data-tlsc-budget-delta]');
    const profileShape = root.querySelector('[data-tlsc-profile-shape]');
    const profileTitle = root.querySelector('[data-tlsc-profile-title]');
    const profileText = root.querySelector('[data-tlsc-profile-text]');
    const profileLegend = root.querySelector('[data-tlsc-profile-legend]');
    const profileDots = Array.from(root.querySelectorAll('[data-tlsc-profile-dot]'));


    const reasonTitles = [0, 1, 2].map(i => root.querySelector('[data-tlsc-reason-title="' + i + '"]'));
    const reasonTexts = [0, 1, 2].map(i => root.querySelector('[data-tlsc-reason-text="' + i + '"]'));

    const compareSelector = root.querySelector('[data-tlsc-compare-selector]');
    const compareCount = root.querySelector('[data-tlsc-compare-count]');
    const compareEmpty = root.querySelector('[data-tlsc-compare-empty]');
    const compareTable = root.querySelector('[data-tlsc-compare-table]');
    const upgradesNode = root.querySelector('[data-tlsc-upgrades]');
    const whatIfNode = root.querySelector('[data-tlsc-whatif]');
    const passport = root.querySelector('[data-tlsc-passport]');
    const scenarioRideNode = root.querySelector('[data-tlsc-scenario-chip="ride"]');
    const scenarioTerrainNode = root.querySelector('[data-tlsc-scenario-chip="terrain"]');
    const scenarioSeasonNode = root.querySelector('[data-tlsc-scenario-chip="season"]');
    const scenarioPassengersNode = root.querySelector('[data-tlsc-scenario-chip="passengers"]');
    const brandLogoWrap = root.querySelector('[data-tlsc-brand-logo-wrap]');
    const brandLogoImage = root.querySelector('[data-tlsc-brand-logo]');
    const journeyRoot = root.querySelector('[data-tlsc-journey]');
    const journeyResult = root.querySelector('[data-tlsc-journey-result]');
    const journeyImage = root.querySelector('[data-tlsc-journey-image]');
    const journeyName = root.querySelector('[data-tlsc-journey-name]');
    const journeyBrand = root.querySelector('[data-tlsc-journey-brand]');
    const journeyYear = root.querySelector('[data-tlsc-journey-year]');
    const journeyPrice = root.querySelector('[data-tlsc-journey-price]');
    const journeyVerdict = root.querySelector('[data-tlsc-journey-verdict]');
    const journeyCaption = root.querySelector('[data-tlsc-journey-caption]');
    const journeyMatch = root.querySelector('[data-tlsc-journey-match]');
    const journeyRing = root.querySelector('[data-tlsc-journey-ring]');
    const journeyLink = root.querySelector('[data-tlsc-journey-link]');
    const journeyLogoWrap = root.querySelector('[data-tlsc-journey-logo-wrap]');
    const journeyLogo = root.querySelector('[data-tlsc-journey-logo]');
    const journeyWordmark = root.querySelector('[data-tlsc-journey-wordmark]');
    const journeyFinalistsList = root.querySelector('[data-tlsc-journey-finalists-list]');
    const journeyFinalistsCount = root.querySelector('[data-tlsc-journey-finalists-count]');
    const journeyPrev = root.querySelector('[data-tlsc-journey-prev]');
    const journeyNext = root.querySelector('[data-tlsc-journey-next]');
    const journeyProgress = root.querySelector('[data-tlsc-journey-progress]');
    const journeyResultLabel = root.querySelector('[data-tlsc-journey-result-label]');

    /* V27 · Автоматический визуальный блок «Ваша территория». */
    const territoryRoot = root.querySelector('[data-tlsc-territory]');
    const territoryStage = root.querySelector('[data-tlsc-territory-stage]');
    const territoryBackdrop = root.querySelector('[data-tlsc-territory-backdrop]');
    const territoryAssetsBase = territoryRoot ? String(territoryRoot.getAttribute('data-tlsc-territory-assets') || '').replace(/\/$/,'') : '';
    const territoryWord = root.querySelector('[data-tlsc-territory-word]');
    const territoryFarPrev = root.querySelector('[data-tlsc-territory-far-prev]');
    const territoryPrev = root.querySelector('[data-tlsc-territory-prev]');
    const territoryNext = root.querySelector('[data-tlsc-territory-next]');
    const territoryFarNext = root.querySelector('[data-tlsc-territory-far-next]');
    const territoryFarPrevWord = root.querySelector('[data-tlsc-territory-far-prev-word]');
    const territoryPrevWord = root.querySelector('[data-tlsc-territory-prev-word]');
    const territoryNextWord = root.querySelector('[data-tlsc-territory-next-word]');
    const territoryFarNextWord = root.querySelector('[data-tlsc-territory-far-next-word]');
    const territoryCounter = root.querySelector('[data-tlsc-territory-counter]');
    const territoryImage = root.querySelector('[data-tlsc-territory-image]');
    const territoryGhost = root.querySelector('[data-tlsc-territory-ghost]');
    const territoryBrand = root.querySelector('[data-tlsc-territory-brand]');
    const territoryModel = root.querySelector('[data-tlsc-territory-model]');
    const territoryYear = root.querySelector('[data-tlsc-territory-year]');
    const territoryRide = root.querySelector('[data-tlsc-territory-ride]');
    const territoryLine = root.querySelector('[data-tlsc-territory-line]');
    const territoryScenario = root.querySelector('[data-tlsc-territory-scenario]');
    const territoryLink = root.querySelector('[data-tlsc-territory-link]');

    let currentProductId = null;
    let currentSelection = null;
    let currentState = null;
    let currentMetrics = null;
    let currentAlternatives = [];
    let activeAlternativeIndex = 0;
    let switchToken = 0;
    let mediaToken = 0;
    let detailsToken = 0;
    let resizeRaf = null;
    let budgetTimer = null;
    let priceRaf = null;
    let lastDisplayedPrice = 0;
    let lastMatch = 0;
    let currentGallery = [];
    let currentGalleryIndex = 0;
    let currentVariants = [];
    let currentVariantIndex = -1;
    let lastSelectionJourney = {catalog:products.length,compatible:0,constrained:0,scenario:0,finalists:0,result:0,shortlist:[]};
    let journeyUpdateTimer = null;
    let journeyPreviewTimer = null;
    let journeyPreviewToken = 0;
    let currentJourneyFinalists = [];
    let activeJourneyFinalistIndex = 0;
    let productTransitionTimer = null;
    const productDetailsCache = new Map();
    const territoryCutoutCache = new Map();
    let territoryImageToken = 0;
    let territoryFxTimer = null;
    let territoryPointerRaf = null;
    let territoryScrollRaf = null;
    let territoryInView = false;
    let territoryLastTerrain = 'forest';
    let territoryLastImageSrc = '';
    let territoryBackdropToken = 0;
    let territoryLastBackdrop = '';

    const labels = {
        ride: {
            calm: 'Спокойный стиль',
            active: 'Активный стиль',
            extreme: 'Экстремальный стиль',
            expedition: 'Экспедиционный стиль'
        },
        terrain: {
            forest: 'Лесной маршрут',
            mountain: 'Горный маршрут',
            mud: 'Грязь / бездорожье',
            stone: 'Каменистый маршрут',
            snow: 'Снежный маршрут',
            water: 'Водный маршрут',
            road: 'Дорога / асфальт'
        },
        season: {
            summer: 'Летний сезон',
            shoulder: 'Весна / осень',
            winter: 'Зимний сезон',
            all: 'Круглый год'
        },
        passengers: {
            '1': '1 человек',
            '2': '2 человека',
            '3': '3+ человека'
        }
    };

    const territoryTerrainOrder = ['forest','mountain','mud','stone','water','snow','road'];
    const territoryTerrainMeta = {
        forest:   {word:'ЛЕС',     line:'Свой ритм.',      bg:'tl-territory-forest.webp'},
        mountain: {word:'ГОРЫ',    line:'Выше линии.',     bg:'tl-territory-mountain.webp'},
        mud:      {word:'ГРЯЗЬ',   line:'Без асфальта.',   bg:'tl-territory-mud.webp'},
        stone:    {word:'КАМНИ',   line:'Держать линию.',  bg:'tl-territory-stone.webp'},
        water:    {word:'ВОДА',    line:'Больше свободы.', bg:'tl-territory-water.webp'},
        snow:     {word:'СНЕГ',    line:'Оставить след.',  bg:'tl-territory-snow.webp'},
        road:     {word:'ДОРОГА',  line:'Своя траектория.',bg:'tl-territory-road.webp'}
    };
    const territoryRideWords = {
        calm:'СПОКОЙНЫЙ',
        active:'АКТИВНЫЙ',
        extreme:'ЭКСТРЕМАЛЬНЫЙ',
        expedition:'ЭКСПЕДИЦИОННЫЙ'
    };
    const territorySeasonShort = {summer:'ЛЕТО',shoulder:'ВЕСНА / ОСЕНЬ',winter:'ЗИМА',all:'КРУГЛЫЙ ГОД'};
    const territoryPassengersShort = {'1':'1 ЧЕЛОВЕК','2':'2 ЧЕЛОВЕКА','3':'3+ ЧЕЛОВЕКА'};

    function normalize(value) {
        return String(value == null ? '' : value)
            .toLowerCase()
            .replace(/ё/g, 'е')
            .replace(/[–—]/g, '-')
            .replace(/\s+/g, ' ')
            .trim();
    }


    function territoryIndexOf(terrain) {
        const index = territoryTerrainOrder.indexOf(String(terrain || ''));
        return index >= 0 ? index : 0;
    }

    function territoryBackdropSource(terrain) {
        const meta = territoryTerrainMeta[terrain];
        if (!meta || !meta.bg || !territoryAssetsBase) return '';
        return territoryAssetsBase + '/' + meta.bg;
    }

    function territoryCommitBackdrop(terrain, instant) {
        if (!territoryBackdrop) return;
        const src = territoryBackdropSource(terrain);
        if (!src || src === territoryLastBackdrop) return;
        const token = ++territoryBackdropToken;
        const loader = new Image();
        loader.onload = function(){
            if (token !== territoryBackdropToken || !territoryBackdrop) return;
            territoryLastBackdrop = src;
            territoryBackdrop.style.backgroundImage = 'url("' + src.replace(/"/g,'\"') + '")';
            if (!instant && territoryRoot && !reduceMotion) {
                territoryRoot.classList.remove('is-backdrop-switching');
                void territoryRoot.offsetWidth;
                territoryRoot.classList.add('is-backdrop-switching');
                window.setTimeout(function(){
                    if (territoryRoot) territoryRoot.classList.remove('is-backdrop-switching');
                }, 760);
            }
        };
        loader.src = src;
    }

    function territorySyncTerrain(state) {
        if (!territoryRoot || !state) return;
        const terrain = territoryTerrainMeta[state.terrain] ? state.terrain : 'forest';
        const index = territoryIndexOf(terrain);
        const prevTerrain = territoryTerrainOrder[(index - 1 + territoryTerrainOrder.length) % territoryTerrainOrder.length];
        const nextTerrain = territoryTerrainOrder[(index + 1) % territoryTerrainOrder.length];
        const farPrevTerrain = territoryTerrainOrder[(index - 2 + territoryTerrainOrder.length) % territoryTerrainOrder.length];
        const farNextTerrain = territoryTerrainOrder[(index + 2) % territoryTerrainOrder.length];
        const meta = territoryTerrainMeta[terrain];

        territoryRoot.dataset.terrain = terrain;
        territoryCommitBackdrop(terrain, territoryLastBackdrop === '');
        if (territoryWord) territoryWord.textContent = meta.word;
        if (territoryFarPrevWord) territoryFarPrevWord.textContent = territoryTerrainMeta[farPrevTerrain].word;
        if (territoryPrevWord) territoryPrevWord.textContent = territoryTerrainMeta[prevTerrain].word;
        if (territoryNextWord) territoryNextWord.textContent = territoryTerrainMeta[nextTerrain].word;
        if (territoryFarNextWord) territoryFarNextWord.textContent = territoryTerrainMeta[farNextTerrain].word;
        if (territoryCounter) territoryCounter.textContent = String(index + 1).padStart(2,'0') + ' / ' + String(territoryTerrainOrder.length).padStart(2,'0');
        [
            [territoryFarPrev,farPrevTerrain],
            [territoryPrev,prevTerrain],
            [territoryNext,nextTerrain],
            [territoryFarNext,farNextTerrain]
        ].forEach(function(pair){
            const node=pair[0], target=pair[1];
            if (!node) return;
            node.dataset.terrainTarget=target;
            node.setAttribute('aria-label','Выбрать среду: ' + territoryTerrainMeta[target].word.toLowerCase());
        });
        if (territoryRide) territoryRide.textContent = territoryRideWords[state.ride] || 'ВАШ СТИЛЬ';
        if (territoryLine) territoryLine.textContent = meta.line;
        if (territoryScenario) {
            territoryScenario.textContent = [
                meta.word,
                territorySeasonShort[state.season] || String(state.season || '').toUpperCase(),
                territoryPassengersShort[state.passengers] || String(state.passengers || '').toUpperCase()
            ].filter(Boolean).join(' · ');
        }

        if (terrain !== territoryLastTerrain) {
            territoryLastTerrain = terrain;
            territoryRoot.classList.remove('is-terrain-switching');
            void territoryRoot.offsetWidth;
            territoryRoot.classList.add('is-terrain-switching');
            if (territoryFxTimer) window.clearTimeout(territoryFxTimer);
            territoryFxTimer = window.setTimeout(function(){
                if (territoryRoot) territoryRoot.classList.remove('is-terrain-switching');
                territoryFxTimer = null;
            }, 900);
        }
    }

    function territoryImageBackground(imageData, width, height) {
        const d = imageData.data;
        const samples = [];
        const sampleSquare = function(x0,y0,size){
            for (let y=y0; y<Math.min(height,y0+size); y+=2) {
                for (let x=x0; x<Math.min(width,x0+size); x+=2) {
                    const i=(y*width+x)*4;
                    if (d[i+3] < 220) continue;
                    samples.push([d[i],d[i+1],d[i+2]]);
                }
            }
        };
        const n = Math.max(4, Math.round(Math.min(width,height) * .028));
        sampleSquare(0,0,n);
        sampleSquare(Math.max(0,width-n),0,n);
        sampleSquare(0,Math.max(0,height-n),n);
        sampleSquare(Math.max(0,width-n),Math.max(0,height-n),n);
        if (!samples.length) return null;
        samples.sort(function(a,b){return (a[0]+a[1]+a[2])-(b[0]+b[1]+b[2]);});
        const start = Math.floor(samples.length * .35);
        const selected = samples.slice(start);
        let r=0,g=0,b=0;
        selected.forEach(function(c){r+=c[0];g+=c[1];b+=c[2];});
        r/=selected.length; g/=selected.length; b/=selected.length;
        const brightness=(r+g+b)/3;
        const chroma=Math.max(r,g,b)-Math.min(r,g,b);
        if (brightness < 216 || chroma > 38) return null;
        return {r:r,g:g,b:b,brightness:brightness};
    }

    function territoryCreateCutout(img) {
        return new Promise(function(resolve){
            const run = function(){
                try {
                    const naturalW = img.naturalWidth || 0;
                    const naturalH = img.naturalHeight || 0;
                    if (!naturalW || !naturalH) { resolve(null); return; }

                    const maxSide = 960;
                    const scale = Math.min(1, maxSide / Math.max(naturalW,naturalH));
                    const width = Math.max(1, Math.round(naturalW * scale));
                    const height = Math.max(1, Math.round(naturalH * scale));
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d', {willReadFrequently:true});
                    if (!ctx) { resolve(null); return; }
                    ctx.drawImage(img,0,0,width,height);
                    const imageData = ctx.getImageData(0,0,width,height);
                    const bg = territoryImageBackground(imageData,width,height);
                    if (!bg) { resolve(null); return; }

                    const data = imageData.data;
                    const total = width * height;
                    const visited = new Uint8Array(total);
                    const queue = new Int32Array(total);
                    let head=0, tail=0, removed=0;
                    const threshold = 56;
                    const minLight = Math.max(178, bg.brightness - 76);

                    const isBackground = function(index){
                        const i=index*4;
                        if (data[i+3] < 16) return true;
                        const r=data[i],g=data[i+1],b=data[i+2];
                        const dr=r-bg.r,dg=g-bg.g,db=b-bg.b;
                        const dist=Math.sqrt(dr*dr+dg*dg+db*db);
                        const light=(r+g+b)/3;
                        return dist <= threshold && light >= minLight;
                    };
                    const push = function(index){
                        if (index<0 || index>=total || visited[index] || !isBackground(index)) return;
                        visited[index]=1;
                        queue[tail++]=index;
                    };
                    for(let x=0;x<width;x++){push(x);push((height-1)*width+x);}
                    for(let y=1;y<height-1;y++){push(y*width);push(y*width+width-1);}
                    while(head<tail){
                        const index=queue[head++];
                        removed++;
                        const x=index%width;
                        if(x>0)push(index-1);
                        if(x<width-1)push(index+1);
                        if(index>=width)push(index-width);
                        if(index<total-width)push(index+width);
                    }
                    const removedRatio = removed / total;
                    if (removedRatio < .10 || removedRatio > .985) { resolve(null); return; }

                    for(let index=0;index<total;index++){
                        if (!visited[index]) continue;
                        data[index*4+3]=0;
                    }
                    ctx.putImageData(imageData,0,0);
                    resolve(canvas.toDataURL('image/webp',.96));
                } catch (e) {
                    resolve(null);
                }
            };
            if ('requestIdleCallback' in window) window.requestIdleCallback(run,{timeout:280});
            else window.setTimeout(run,0);
        });
    }

    function territoryCutoutForSource(src, loadedImage) {
        const key = String(src || '');
        if (!key) return Promise.resolve(null);
        if (territoryCutoutCache.has(key)) return territoryCutoutCache.get(key);
        const promise = territoryCreateCutout(loadedImage).catch(function(){return null;});
        territoryCutoutCache.set(key,promise);
        return promise;
    }

    function territoryCommitImage(product, src, instant) {
        if (!territoryImage || !territoryRoot) return;
        const normalizedSrc = String(src || '').trim();
        const token = ++territoryImageToken;
        if (!normalizedSrc) {
            territoryLastImageSrc='';
            territoryImage.removeAttribute('src');
            territoryImage.hidden=true;
            if (territoryGhost) territoryGhost.hidden=true;
            territoryRoot.classList.add('is-empty');
            return;
        }

        territoryRoot.classList.remove('is-empty');
        const oldSrc = territoryImage.getAttribute('src') || '';
        const changed = normalizedSrc !== territoryLastImageSrc;
        if (changed && oldSrc && territoryGhost && !instant && !reduceMotion) {
            territoryGhost.src = oldSrc;
            territoryGhost.hidden = false;
        }

        const loader = new Image();
        /* Загружаем без обязательного CORS: удаление фона — улучшение, а не условие показа фото. */
        loader.onload=function(){
            if (token !== territoryImageToken) return;
            territoryLastImageSrc = normalizedSrc;
            territoryImage.src = normalizedSrc;
            territoryImage.alt = product && product.name ? product.name : 'Подобранная модель';
            territoryImage.hidden = false;
            territoryImage.classList.remove('is-cutout');
            territoryImage.classList.add('is-fallback');

            if (changed && !instant && !reduceMotion) {
                territoryRoot.classList.remove('is-machine-switching');
                void territoryRoot.offsetWidth;
                territoryRoot.classList.add('is-machine-switching');
                window.setTimeout(function(){
                    if (territoryRoot) territoryRoot.classList.remove('is-machine-switching');
                    if (territoryGhost) territoryGhost.hidden=true;
                }, 920);
            } else if (territoryGhost) {
                territoryGhost.hidden=true;
            }

            territoryCutoutForSource(normalizedSrc,loader).then(function(cutout){
                if (token !== territoryImageToken || !territoryImage) return;
                if (cutout) {
                    territoryImage.src = cutout;
                    territoryImage.classList.remove('is-fallback');
                    territoryImage.classList.add('is-cutout');
                    territoryRoot.classList.add('has-cutout');
                } else {
                    territoryRoot.classList.remove('has-cutout');
                }
            });
        };
        loader.onerror=function(){
            if (token !== territoryImageToken) return;
            territoryLastImageSrc='';
            territoryImage.hidden=true;
            territoryRoot.classList.add('is-empty');
            if (territoryGhost) territoryGhost.hidden=true;
        };
        loader.src=normalizedSrc;
    }

    function renderTerritory(selection, state, instant, imageOverride) {
        if (!territoryRoot || !state) return;
        territorySyncTerrain(state);
        const product = selection && selection.product ? selection.product : null;
        if (!product) {
            if (territoryBrand) territoryBrand.textContent='Turbolemons';
            if (territoryModel) territoryModel.textContent='Нет точного совпадения';
            if (territoryYear) territoryYear.textContent='';
            if (territoryLink) {
                territoryLink.href='/catalog/';
                territoryLink.textContent='Перейти в каталог ↗';
            }
            territoryCommitImage(null,'',true);
            return;
        }
        if (territoryBrand) territoryBrand.textContent=displayBrand(product)||product.section_top||'Turbolemons';
        if (territoryModel) territoryModel.textContent=displayProductTitle(product);
        if (territoryYear) territoryYear.textContent=product.model_year||'';
        if (territoryLink) {
            territoryLink.href=product.url||'/catalog/';
            territoryLink.innerHTML='Открыть выбранную модель <span aria-hidden="true">↗</span>';
        }
        territoryCommitImage(product,imageOverride || product.image || '',Boolean(instant));
    }

    function territoryChooseTerrain(target) {
        const terrain = String(target || '');
        if (!territoryTerrainMeta[terrain] || !controls) return;
        if (territoryRoot) {
            const current=territoryRoot.dataset.terrain || 'forest';
            const currentIndex=territoryIndexOf(current);
            const targetIndex=territoryIndexOf(terrain);
            const count=territoryTerrainOrder.length;
            const forward=(targetIndex-currentIndex+count)%count;
            const backward=(currentIndex-targetIndex+count)%count;
            territoryRoot.dataset.direction = forward <= backward ? 'next' : 'prev';
        }
        if (!setRadio('terrain',terrain)) return;
        const input = controls.querySelector('input[name="terrain"][value="'+terrain+'"]');
        if (input) {
            input.dispatchEvent(new Event('change',{bubbles:true}));
        } else {
            recalculate();
        }
    }

    function initTerritoryMotion() {
        if (!territoryRoot || !territoryStage) return;
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries){
                entries.forEach(function(entry){
                    territoryInView = entry.isIntersecting;
                    if (entry.isIntersecting) territoryRoot.classList.add('is-inview');
                });
            },{threshold:.18});
            observer.observe(territoryRoot);
        } else {
            territoryInView=true;
            territoryRoot.classList.add('is-inview');
        }

        if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
            territoryStage.addEventListener('pointermove',function(event){
                const rect=territoryStage.getBoundingClientRect();
                const x=((event.clientX-rect.left)/Math.max(1,rect.width)-.5)*2;
                const y=((event.clientY-rect.top)/Math.max(1,rect.height)-.5)*2;
                if (territoryPointerRaf) cancelAnimationFrame(territoryPointerRaf);
                territoryPointerRaf=requestAnimationFrame(function(){
                    territoryStage.style.setProperty('--pointer-x',Math.max(-1,Math.min(1,x)).toFixed(3));
                    territoryStage.style.setProperty('--pointer-y',Math.max(-1,Math.min(1,y)).toFixed(3));
                    territoryPointerRaf=null;
                });
            });
            territoryStage.addEventListener('pointerleave',function(){
                territoryStage.style.setProperty('--pointer-x','0');
                territoryStage.style.setProperty('--pointer-y','0');
            });

            window.addEventListener('scroll',function(){
                if (!territoryInView || territoryScrollRaf) return;
                territoryScrollRaf=requestAnimationFrame(function(){
                    const rect=territoryRoot.getBoundingClientRect();
                    const center=rect.top+rect.height/2;
                    const viewport=window.innerHeight||1;
                    const progress=Math.max(-1,Math.min(1,(center-viewport/2)/(viewport/2+rect.height/2)));
                    territoryStage.style.setProperty('--scroll-shift',progress.toFixed(3));
                    territoryScrollRaf=null;
                });
            },{passive:true});
        }
    }


    function displayProductTitle(product) {
        const model = String(product && product.model || '').trim();
        return model || String(product && product.name || 'Turbolemons').trim();
    }

    function productSubtitleText(product) {
        const top = String(product && product.section_top || '').trim();
        const section = String(product && product.section_name || '').trim();
        if (top && section && normalize(top) !== normalize(section)) return top + ' · ' + section;
        return section || top || 'Подобрано под ваш сценарий';
    }


    function stageHeroWord(product) {
        const raw = displayProductTitle(product).replace(/\s+/g, ' ').trim();
        if (!raw) return '';
        const brand = displayBrand(product).replace(/^BRP\s+/i, '').trim();
        let cleaned = raw;
        if (brand && cleaned.toUpperCase().indexOf(brand.toUpperCase() + ' ') === 0) {
            cleaned = cleaned.slice(brand.length).trim();
        }
        cleaned = cleaned.replace(/^\d{4}\s+/, '').trim();
        const words = cleaned.split(' ').filter(Boolean);
        if (!words.length) return raw;
        const keep = [words[0]];
        if (words[1] && keep.join(' ').length < 16) keep.push(words[1]);
        return keep.join(' ');
    }

    function syncScenarioStrip(state) {
        if (!state) return;
        if (scenarioRideNode) scenarioRideNode.textContent = labels.ride[state.ride] || 'Сценарий';
        if (scenarioTerrainNode) scenarioTerrainNode.textContent = labels.terrain[state.terrain] || 'Маршрут';
        if (scenarioSeasonNode) scenarioSeasonNode.textContent = labels.season[state.season] || 'Сезон';
        if (scenarioPassengersNode) scenarioPassengersNode.textContent = labels.passengers[state.passengers] || 'Пассажиры';
    }

    function syncStageCopy(product) {
        if (!stage) return;
        if (!product) {
            stage.setAttribute('data-stage-brand', '');
            stage.setAttribute('data-stage-model', '');
            if (brandLogoWrap) brandLogoWrap.hidden = true;
            if (brandLogoImage) brandLogoImage.removeAttribute('src');
            return;
        }

        stage.setAttribute('data-stage-brand', displayBrand(product) || product.section_top || 'Turbolemons');
        stage.setAttribute('data-stage-model', stageHeroWord(product));

        const logo = String(product.brand_logo || '').trim();
        if (brandLogoImage && logo) {
            if (brandLogoImage.getAttribute('src') !== logo) brandLogoImage.src = logo;
            brandLogoImage.alt = displayBrand(product) || '';
            if (brandLogoWrap) brandLogoWrap.hidden = false;
        } else {
            if (brandLogoWrap) brandLogoWrap.hidden = true;
            if (brandLogoImage) brandLogoImage.removeAttribute('src');
        }
    }

    function journeyModelWord(value) {
        const n = Math.abs(parseInt(value, 10) || 0) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) return 'моделей';
        if (n1 === 1) return 'модель';
        if (n1 >= 2 && n1 <= 4) return 'модели';
        return 'моделей';
    }

    function journeyFinalistWord(value) {
        const n = Math.abs(parseInt(value, 10) || 0) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) return 'финалистов';
        if (n1 === 1) return 'финалист';
        if (n1 >= 2 && n1 <= 4) return 'финалиста';
        return 'финалистов';
    }

    function setJourneyText(selector, value) {
        const node = journeyRoot && journeyRoot.querySelector(selector);
        if (node) node.textContent = value == null ? '' : String(value);
    }

    function animateJourneyCount(key, value, instant) {
        if (!journeyRoot) return;
        const node = journeyRoot.querySelector('[data-tlsc-journey-count="' + key + '"]');
        const word = journeyRoot.querySelector('[data-tlsc-journey-word="' + key + '"]');
        if (!node) return;
        const next = Math.max(0, parseInt(value, 10) || 0);
        if (word) word.textContent = journeyModelWord(next);
        const previous = parseInt(node.dataset.value, 10);
        node.dataset.value = String(next);
        if (instant || reduceMotion || !Number.isFinite(previous)) {
            node.textContent = String(next);
            return;
        }
        const started = performance.now();
        const duration = 430;
        function frame(now) {
            const t = Math.min(1, (now - started) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            node.textContent = String(Math.round(previous + (next - previous) * eased));
            if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function renderJourneyCloud(key, count, previousCount) {
        if (!journeyRoot) return;
        const node = journeyRoot.querySelector('[data-tlsc-journey-cloud="' + key + '"]');
        if (!node) return;
        const dots = 40;
        if (node.children.length !== dots) {
            node.innerHTML = '';
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < dots; i++) {
                const dot = document.createElement('i');
                dot.style.setProperty('--dot-index', String(i));
                fragment.appendChild(dot);
            }
            node.appendChild(fragment);
        }
        const safePrevious = Math.max(1, parseInt(previousCount, 10) || 1);
        const safeCount = Math.max(0, parseInt(count, 10) || 0);
        const ratio = Math.max(0, Math.min(1, safeCount / safePrevious));
        const active = safeCount > 0 ? Math.max(1, Math.min(dots, Math.round(ratio * dots))) : 0;
        Array.from(node.children).forEach(function (dot, index) {
            dot.classList.toggle('is-active', index < active);
            dot.classList.toggle('is-edge', active > 0 && index === active - 1);
            dot.classList.toggle('is-rejected', index >= active);
        });
    }

    function setJourneyDelta(key, previous, current) {
        const node = journeyRoot && journeyRoot.querySelector('[data-tlsc-journey-delta="' + key + '"]');
        if (!node) return;
        if (key === 'catalog') {
            node.textContent = 'Стартовая выборка';
            node.classList.remove('is-zero');
            return;
        }
        const diff = Math.max(0, (parseInt(previous,10)||0) - (parseInt(current,10)||0));
        node.textContent = diff > 0 ? ('−' + diff + ' ' + journeyModelWord(diff)) : 'Без дополнительного отсечения';
        node.classList.toggle('is-zero', diff === 0);
    }

    function journeyConstraintNote(state) {
        const parts = [labels.passengers[state.passengers] || 'Вместимость'];
        if (state.brand) parts.push('бренд: ' + state.brand);
        if (state.availableOnly) parts.push('только в наличии');
        return parts.join(' · ');
    }

    function journeyFinalNote(state) {
        const parts = ['бюджет ' + formatShortRub(state.budget)];
        const precisionCount = precisionActiveItems(state).length;
        if (precisionCount) parts.push('экспертных настроек: ' + precisionCount);
        if (state.strictBudget) parts.push('строго в бюджете');
        return parts.join(' · ');
    }

    function journeyFinalistProduct(entry) {
        return entry && entry.product ? entry.product : null;
    }

    function journeyFinalistScore(entry, state) {
        return entry && entry.scored ? matchPercent(entry.scored, state) : 0;
    }

    function renderJourneyFinalists(entries, state) {
        currentJourneyFinalists = Array.isArray(entries) ? entries.slice(0,4) : [];
        activeJourneyFinalistIndex = 0;
        if (journeyFinalistsCount) {
            const n = currentJourneyFinalists.length;
            journeyFinalistsCount.textContent = n ? (n + ' ' + journeyFinalistWord(n)) : 'Нет финалистов';
        }
        if (!journeyFinalistsList) return;
        journeyFinalistsList.innerHTML = '';

        if (!currentJourneyFinalists.length) {
            const empty = document.createElement('div');
            empty.className = 'tlsc-journey-finalists__empty';
            empty.textContent = 'Финалисты появятся после изменения параметров.';
            journeyFinalistsList.appendChild(empty);
            if (journeyProgress) journeyProgress.style.width = '0%';
            return;
        }

        const fragment = document.createDocumentFragment();
        currentJourneyFinalists.forEach(function(entry, index) {
            const product = journeyFinalistProduct(entry);
            if (!product) return;
            const percent = journeyFinalistScore(entry, state);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'tlsc-journey-finalist';
            button.dataset.journeyFinalistIndex = String(index);
            button.style.setProperty('--finalist-index', String(index));
            button.setAttribute('aria-label', (index === 0 ? 'Рекомендация: ' : 'Финалист: ') + displayProductTitle(product));
            if (index === 0) button.classList.add('is-active','is-winner');

            const rank = document.createElement('span');
            rank.className = 'tlsc-journey-finalist__rank';
            rank.textContent = String(index + 1).padStart(2,'0');

            const media = document.createElement('span');
            media.className = 'tlsc-journey-finalist__media';
            const src = String(product.image || '').trim();
            if (src) {
                const img = document.createElement('img');
                img.src = src;
                img.alt = '';
                img.loading = 'lazy';
                media.appendChild(img);
            } else {
                const empty = document.createElement('i');
                empty.textContent = 'Фото';
                media.appendChild(empty);
            }

            const copy = document.createElement('span');
            copy.className = 'tlsc-journey-finalist__copy';
            const eyebrow = document.createElement('small');
            eyebrow.textContent = index === 0 ? 'Рекомендация' : (displayBrand(product) || product.section_top || 'Финалист');
            const title = document.createElement('strong');
            title.textContent = displayProductTitle(product);
            const meta = document.createElement('span');
            meta.className = 'tlsc-journey-finalist__meta';
            const score = document.createElement('b');
            score.textContent = percent + '%';
            const price = document.createElement('em');
            price.textContent = formatRub(parseInt(product.price,10)||0);
            meta.appendChild(score);
            meta.appendChild(price);
            const bar = document.createElement('i');
            bar.className = 'tlsc-journey-finalist__bar';
            const fill = document.createElement('b');
            fill.style.width = Math.max(0,Math.min(100,percent)) + '%';
            bar.appendChild(fill);
            copy.appendChild(eyebrow);
            copy.appendChild(title);
            copy.appendChild(meta);
            copy.appendChild(bar);

            const arrow = document.createElement('span');
            arrow.className = 'tlsc-journey-finalist__arrow';
            arrow.textContent = '→';

            button.appendChild(rank);
            button.appendChild(media);
            button.appendChild(copy);
            button.appendChild(arrow);
            fragment.appendChild(button);
        });
        journeyFinalistsList.appendChild(fragment);
        syncJourneyFinalistControls();
    }

    function syncJourneyFinalistControls() {
        const total = currentJourneyFinalists.length;
        if (journeyPrev) journeyPrev.disabled = total <= 1;
        if (journeyNext) journeyNext.disabled = total <= 1;
        if (journeyProgress) {
            const pct = total ? ((activeJourneyFinalistIndex + 1) / total) * 100 : 0;
            journeyProgress.style.width = pct + '%';
        }
        if (journeyFinalistsList) {
            Array.from(journeyFinalistsList.querySelectorAll('[data-journey-finalist-index]')).forEach(function(button) {
                const active = parseInt(button.dataset.journeyFinalistIndex,10) === activeJourneyFinalistIndex;
                button.classList.toggle('is-active', active);
                button.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
        }
    }

    function applyJourneyPreview(entry, index, instant) {
        const product = journeyFinalistProduct(entry);
        if (!product || !currentState) return;
        const percent = journeyFinalistScore(entry, currentState);
        const winner = currentJourneyFinalists[0];
        const winnerPercent = journeyFinalistScore(winner, currentState);
        const isWinner = index === 0 || (winner && winner.product && String(winner.product.id) === String(product.id));

        activeJourneyFinalistIndex = index;
        syncJourneyFinalistControls();
        if (journeyResultLabel) journeyResultLabel.textContent = isWinner ? 'Рекомендация' : ('Финалист ' + String(index + 1).padStart(2,'0'));
        if (journeyName) journeyName.textContent = displayProductTitle(product);
        if (journeyBrand) journeyBrand.textContent = displayBrand(product) || product.section_top || 'Turbolemons';
        if (journeyYear) journeyYear.textContent = product.model_year || '';
        if (journeyPrice) journeyPrice.textContent = formatRub(parseInt(product.price,10)||0);
        if (journeyMatch) journeyMatch.textContent = String(percent);
        if (journeyRing) journeyRing.style.setProperty('--match', String(percent));
        if (journeyLink) { journeyLink.hidden = false; journeyLink.href = product.url || '/catalog/'; }
        if (journeyWordmark) journeyWordmark.textContent = displayBrand(product) || 'Turbolemons';

        if (journeyVerdict) {
            if (isWinner) {
                journeyVerdict.textContent = matchCaptionFor(percent) + '. Это основная рекомендация — лучший общий баланс текущего сценария, характеристик и бюджета.';
            } else {
                const delta = percent - winnerPercent;
                const deltaText = delta === 0 ? 'с тем же процентом совпадения' : (delta > 0 ? ('на ' + delta + ' п.п. выше по совпадению') : ('на ' + Math.abs(delta) + ' п.п. ниже по совпадению'));
                journeyVerdict.textContent = 'Реальный финалист ' + deltaText + ' относительно основной рекомендации. Откройте карточку, чтобы сравнить модель подробнее.';
            }
        }

        const logo = String(product.brand_logo || '').trim();
        if (journeyLogo && logo) {
            journeyLogo.src = logo;
            journeyLogo.alt = displayBrand(product) || '';
            if (journeyLogoWrap) journeyLogoWrap.hidden = false;
        } else {
            if (journeyLogoWrap) journeyLogoWrap.hidden = true;
            if (journeyLogo) journeyLogo.removeAttribute('src');
        }

        const image = String(product.image || '').trim();
        if (journeyImage && image) {
            journeyImage.src = image;
            journeyImage.alt = product.name || displayProductTitle(product);
            journeyImage.hidden = false;
        } else if (journeyImage) {
            journeyImage.removeAttribute('src');
            journeyImage.alt = '';
            journeyImage.hidden = true;
        }

        if (journeyResult && !instant && !reduceMotion) {
            journeyResult.classList.remove('is-preview-out','is-preview-in');
            void journeyResult.offsetWidth;
            journeyResult.classList.add('is-preview-in');
            window.setTimeout(function(){ if (journeyResult) journeyResult.classList.remove('is-preview-in'); }, 620);
        }
    }

    function previewJourneyFinalist(index, instant) {
        const total = currentJourneyFinalists.length;
        if (!total) return;
        index = ((parseInt(index,10)||0) % total + total) % total;
        const entry = currentJourneyFinalists[index];
        const product = journeyFinalistProduct(entry);
        if (!product) return;
        const token = ++journeyPreviewToken;
        if (journeyPreviewTimer) {
            window.clearTimeout(journeyPreviewTimer);
            journeyPreviewTimer = null;
        }

        const src = String(product.image || '').trim();
        const finish = function() {
            if (token !== journeyPreviewToken) return;
            applyJourneyPreview(entry,index,instant);
        };

        if (instant || reduceMotion || !src || !journeyResult) {
            finish();
            return;
        }

        const preloader = new Image();
        const ready = function() {
            if (token !== journeyPreviewToken) return;
            journeyResult.classList.remove('is-preview-in');
            journeyResult.classList.add('is-preview-out');
            journeyPreviewTimer = window.setTimeout(function() {
                if (token !== journeyPreviewToken) return;
                journeyPreviewTimer = null;
                journeyResult.classList.remove('is-preview-out');
                finish();
            }, 150);
        };
        preloader.onload = ready;
        preloader.onerror = ready;
        preloader.src = src;
    }

    function renderSelectionJourney(selection, state, journey, instant) {
        if (!journeyRoot || !state) return;
        const data = journey || lastSelectionJourney || {};
        const catalogCount = Math.max(0, parseInt(data.catalog, 10) || products.length || 0);
        const compatibleCount = Math.max(0, parseInt(data.compatible, 10) || 0);
        const constrainedCount = Math.max(0, parseInt(data.constrained, 10) || 0);
        const scenarioCount = Math.max(0, parseInt(data.scenario, 10) || 0);
        const shortlist = Array.isArray(data.shortlist) ? data.shortlist : [];
        const finalistCount = shortlist.length || Math.max(0, parseInt(data.finalists, 10) || 0);

        animateJourneyCount('catalog', catalogCount, instant);
        animateJourneyCount('compatible', compatibleCount, instant);
        animateJourneyCount('constrained', constrainedCount, instant);
        animateJourneyCount('scenario', scenarioCount, instant);
        animateJourneyCount('finalists', finalistCount, instant);

        renderJourneyCloud('catalog', catalogCount, catalogCount);
        renderJourneyCloud('compatible', compatibleCount, catalogCount);
        renderJourneyCloud('constrained', constrainedCount, Math.max(1,compatibleCount));
        renderJourneyCloud('scenario', scenarioCount, Math.max(1,constrainedCount));
        renderJourneyCloud('finalists', finalistCount, Math.max(1,scenarioCount));

        setJourneyDelta('catalog', catalogCount, catalogCount);
        setJourneyDelta('compatible', catalogCount, compatibleCount);
        setJourneyDelta('constrained', compatibleCount, constrainedCount);
        setJourneyDelta('scenario', constrainedCount, scenarioCount);
        setJourneyDelta('finalists', scenarioCount, finalistCount);

        setJourneyText('[data-tlsc-journey-note="compatible"]', (labels.terrain[state.terrain] || 'Среда') + ' · ' + (labels.season[state.season] || 'Сезон'));
        setJourneyText('[data-tlsc-journey-note="constrained"]', journeyConstraintNote(state));
        setJourneyText('[data-tlsc-journey-note="scenario"]', (labels.ride[state.ride] || 'Стиль езды') + ' · отбор по сценарию');
        setJourneyText('[data-tlsc-journey-note="finalists"]', journeyFinalNote(state));

        if (journeyUpdateTimer) window.clearTimeout(journeyUpdateTimer);
        journeyRoot.classList.remove('is-updating');
        void journeyRoot.offsetWidth;
        journeyRoot.classList.add('is-updating');
        journeyUpdateTimer = window.setTimeout(function () {
            if (journeyRoot) journeyRoot.classList.remove('is-updating');
        }, 900);

        if (!selection || !selection.product) {
            currentJourneyFinalists = [];
            renderJourneyFinalists([], state);
            journeyRoot.classList.add('is-no-result');
            if (journeyResult) journeyResult.classList.add('is-no-result');
            if (journeyImage) { journeyImage.removeAttribute('src'); journeyImage.alt = ''; journeyImage.hidden = true; }
            if (journeyLogoWrap) journeyLogoWrap.hidden = true;
            if (journeyLogo) journeyLogo.removeAttribute('src');
            if (journeyName) journeyName.textContent = 'Нет точного совпадения';
            if (journeyBrand) journeyBrand.textContent = 'Turbolemons';
            if (journeyYear) journeyYear.textContent = '';
            if (journeyPrice) journeyPrice.textContent = 'Измените один параметр';
            if (journeyVerdict) journeyVerdict.textContent = 'Путь отбора показывает, на каком этапе текущие ограничения не оставили надёжной рекомендации.';
            if (journeyCaption) journeyCaption.textContent = 'Все значения рассчитаны по текущему сценарию.';
            if (journeyMatch) journeyMatch.textContent = '—';
            if (journeyRing) journeyRing.style.setProperty('--match', '0');
            if (journeyLink) journeyLink.hidden = true;
            if (journeyWordmark) journeyWordmark.textContent = 'Turbolemons';
            return;
        }

        journeyRoot.classList.remove('is-no-result');
        if (journeyResult) journeyResult.classList.remove('is-no-result');
        if (journeyCaption) journeyCaption.textContent = catalogCount + ' → ' + compatibleCount + ' → ' + constrainedCount + ' → ' + scenarioCount + ' → ' + finalistCount + ' → 1';
        renderJourneyFinalists(shortlist.length ? shortlist : [selection], state);
        previewJourneyFinalist(0, true);
    }

    function uniqueImages(list) {
        const seen = new Set();
        const out = [];
        (list || []).forEach(function (src) {
            src = String(src || '').trim();
            if (!src || seen.has(src)) return;
            seen.add(src);
            out.push(src);
        });
        return out.slice(0, 8);
    }

    function variantSwatch(color) {
        const text = normalize(color);
        const rules = [
            [/черн|black/, '#171717'], [/бел|white/, '#F4F4F0'], [/сереб|silver/, '#C8CBCB'],
            [/сер|grey|gray|графит/, '#777A78'], [/крас|red|бордов/, '#B52D2A'], [/син|blue|голуб/, '#315E8C'],
            [/зелен|green|лайм|lime/, '#8FAF2C'], [/желт|yellow|золот|gold/, '#D1A93C'], [/оранж|orange/, '#D66A2D'],
            [/фиолет|purple/, '#725A87'], [/беж|sand|песоч/, '#B9A98C'], [/камуф|camo/, '#77765D']
        ];
        for (let i = 0; i < rules.length; i++) if (rules[i][0].test(text)) return rules[i][1];
        return '#D8D8D2';
    }

    function activateTab(name) {
        const tabs = root.querySelector('[data-tlsc-tabs]');
        if (!tabs) return;
        const target = tabs.querySelector('[data-tlsc-tab="' + name + '"]');
        if (!target || target.hidden) name = 'recommendation';
        Array.from(tabs.querySelectorAll('[data-tlsc-tab]')).forEach(function (button) {
            button.classList.toggle('is-active', button.dataset.tlscTab === name);
        });
        Array.from(root.querySelectorAll('[data-tlsc-panel]')).forEach(function (panel) {
            panel.classList.toggle('is-active', panel.dataset.tlscPanel === name);
        });
    }

    function clearProductDetailsUI(product) {
        ++detailsToken;
        currentVariants = [];
        currentVariantIndex = -1;
        currentGalleryIndex = 0;
        currentGallery = [];
        renderGallery([], 0);

        if (variantsNode) variantsNode.hidden = true;
        if (colorChoices) colorChoices.innerHTML = '';
        if (colorName) colorName.textContent = '';
        if (colorStock) colorStock.textContent = '';

        if (accessoriesTab) accessoriesTab.hidden = true;
        if (accessoriesCount) accessoriesCount.textContent = '';
        if (accessoriesCaption) accessoriesCaption.textContent = 'Только подтверждённая совместимость';
        if (accessoriesNode) accessoriesNode.innerHTML = '';
        const activeAccessoryTab = root.querySelector('[data-tlsc-tab="accessories"].is-active');
        if (activeAccessoryTab) activateTab('recommendation');
    }

    function cartItemForOffer(offerId) {
        const id = Number(offerId || 0);
        if (id <= 0) return null;
        try {
            if (window.CartStore && Array.isArray(window.CartStore.items)) {
                return window.CartStore.items.find(function (item) {
                    return Number(item && item.offer_id || 0) === id;
                }) || null;
            }
            if (typeof CartStore !== 'undefined' && Array.isArray(CartStore.items)) {
                return CartStore.items.find(function (item) {
                    return Number(item && item.offer_id || 0) === id;
                }) || null;
            }
        } catch (e) {}
        return null;
    }

    function setCartButtonVisual(button, mode, count) {
        if (!button) return;

        const text = button.querySelector(
            '[data-cart-button-text], .product-detail__cart-text, .pm-btn-text'
        );

        if (mode === 'loading') {
            if (button.classList.contains('is-error')) {
                button.classList.remove('is-error');
            }
            button.disabled = true;
            button.setAttribute('aria-disabled', 'true');
            if (text && text.textContent !== 'Подготовка…') {
                text.textContent = 'Подготовка…';
            }
            return;
        }

        if (mode === 'disabled' || mode === 'error') {
            if (button.classList.contains('is-added')) {
                button.classList.remove('is-added');
            }
            button.classList.toggle('is-error', mode === 'error');
            button.disabled = true;
            button.setAttribute('aria-disabled', 'true');

            const label = mode === 'error' ? 'Выбрать в карточке' : 'Недоступно';
            if (text && text.textContent !== label) {
                text.textContent = label;
            }
            return;
        }

        if (button.classList.contains('is-error')) {
            button.classList.remove('is-error');
        }

        button.disabled = false;
        button.setAttribute('aria-disabled', 'false');

        if (mode === 'added') {
            if (!button.classList.contains('is-added')) {
                button.classList.add('is-added');
            }
            const nextCount = String(count || 1);
            if (button.dataset.cartCount !== nextCount) {
                button.dataset.cartCount = nextCount;
            }
            if (text && text.textContent !== 'В корзине') {
                text.textContent = 'В корзине';
            }
        } else {
            if (button.classList.contains('is-added')) {
                button.classList.remove('is-added');
            }
            if (button.dataset.cartCount !== '0') {
                button.dataset.cartCount = '0';
            }
            if (text && text.textContent !== 'В корзину') {
                text.textContent = 'В корзину';
            }
        }
    }

    function currentCartTargetId() {
        if (currentVariants.length && currentVariantIndex >= 0 && currentVariants[currentVariantIndex] && Number(currentVariants[currentVariantIndex].id || 0) > 0) {
            return Number(currentVariants[currentVariantIndex].id || 0);
        }
        if (currentSelection && currentSelection.product && Number(currentSelection.product.id || 0) > 0) {
            return Number(currentSelection.product.id || 0);
        }
        return 0;
    }

    function refreshCartButtonsFromStore() {
        const targetId = currentCartTargetId();
        cartButtons.forEach(function (button) {
            if (button.classList.contains('is-loading')) return;
            const buttonTarget = Number(button.dataset.offer || button.dataset.productId || 0);
            if (targetId <= 0 || buttonTarget <= 0 || buttonTarget !== targetId) return;
            const item = cartItemForOffer(targetId);
            setCartButtonVisual(button, item ? 'added' : 'ready', item ? item.count : 0);
        });
    }

    function prepareCartForProduct(product) {
        const productId = Number(product && product.id || 0);
        cartButtons.forEach(function (button) {
            if (productId > 0) button.dataset.productId = String(productId);
            else delete button.dataset.productId;
            delete button.dataset.offer;
            delete button.dataset.resolvedProductId;
            delete button.dataset.resolvedColor;
            setCartButtonVisual(button, productId > 0 ? 'loading' : 'disabled');
        });
    }

    function syncCartTarget(product, variant) {
        const targetId = Number(variant && variant.id || product && product.id || 0);
        cartButtons.forEach(function (button) {
            if (targetId <= 0) {
                delete button.dataset.productId;
                delete button.dataset.offer;
                setCartButtonVisual(button, 'disabled');
                return;
            }
            button.dataset.productId = String(targetId);
            button.dataset.offer = String(targetId);
            if (variant && variant.color) button.dataset.tlscColor = variant.color;
            else delete button.dataset.tlscColor;
            const item = cartItemForOffer(targetId);
            setCartButtonVisual(button, item ? 'added' : 'ready', item ? item.count : 0);
        });
    }

    function fallbackResolveCart(product) {
        const productId = Number(product && product.id || 0);
        if (productId <= 0) return Promise.resolve(false);

        const body = new URLSearchParams();
        body.set('product_id', String(productId));

        return fetch('/local/cart/ajax/resolve_offer.php?cache=' + Date.now(), {
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'X-Requested-With':'XMLHttpRequest'
            },
            body:body.toString(),
            credentials:'same-origin',
            cache:'no-store'
        }).then(function (response) {
            if (!response.ok) return false;
            return response.json();
        }).then(function (data) {
            const offerId = Number(data && data.success && data.offer_id || 0);
            if (offerId <= 0) return false;
            if (!currentSelection || String(currentSelection.product.id) !== String(productId)) return false;
            syncCartTarget(product, {
                id:offerId,
                color:String(data.color || ''),
                image:String(data.image || '')
            });
            return true;
        }).catch(function () {
            return false;
        });
    }

    function setGalleryCounter(index, total) {
        if (!galleryCounter) return;
        if (total <= 1) {
            galleryCounter.hidden = true;
            galleryCounter.textContent = '';
            return;
        }
        galleryCounter.hidden = false;
        galleryCounter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    }

    function renderGallery(images, activeIndex) {
        currentGallery = uniqueImages(images);
        currentGalleryIndex = Math.max(0, Math.min(currentGallery.length - 1, activeIndex || 0));
        setGalleryCounter(currentGalleryIndex, currentGallery.length);
        if (!galleryNode) return;
        galleryNode.innerHTML = '';
        galleryNode.hidden = currentGallery.length <= 1;
        if (currentGallery.length <= 1) return;

        const fragment = document.createDocumentFragment();
        currentGallery.forEach(function (src, index) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'tlsc-gallery__item' + (index === currentGalleryIndex ? ' is-active' : '');
            button.dataset.galleryIndex = String(index);
            button.setAttribute('aria-label', 'Фото ' + (index + 1) + ' из ' + currentGallery.length);
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.loading = index < 3 ? 'eager' : 'lazy';
            button.appendChild(img);
            fragment.appendChild(button);
        });
        galleryNode.appendChild(fragment);
    }

    function focusStageImage(src, alt, index) {
        src = String(src || '').trim();
        if (!src || !productImage) return;
        const token = ++mediaToken;
        if (result && !reduceMotion) result.classList.add('is-media-switching');
        const preload = new Image();
        preload.onload = function () {
            if (token !== mediaToken) return;
            productImage.src = src;
            productImage.alt = alt || '';
            productImage.hidden = false;
            if (productEmpty) productEmpty.hidden = true;
            if (result) result.classList.remove('is-image-missing');
            currentGalleryIndex = Math.max(0, index || 0);
            setGalleryCounter(currentGalleryIndex, currentGallery.length);
            if (galleryNode) {
                Array.from(galleryNode.querySelectorAll('[data-gallery-index]')).forEach(function (button) {
                    button.classList.toggle('is-active', parseInt(button.dataset.galleryIndex, 10) === currentGalleryIndex);
                });
            }
            window.setTimeout(function () {
                if (token === mediaToken && result) result.classList.remove('is-media-switching');
            }, reduceMotion ? 0 : 360);
        };
        preload.onerror = function () {
            if (token === mediaToken && result) result.classList.remove('is-media-switching');
        };
        preload.src = src;
    }

    function renderVariants(variants, product) {
        currentVariants = Array.isArray(variants) ? variants.filter(function (v) { return v && Number(v.id || 0) > 0; }) : [];
        currentVariantIndex = -1;
        if (!variantsNode || !colorChoices) return;
        colorChoices.innerHTML = '';

        if (!currentVariants.length) {
            variantsNode.hidden = true;
            syncCartTarget(product, null);
            return;
        }

        const coloredIndexes = [];
        currentVariants.forEach(function (variant, index) {
            if (variant.color) coloredIndexes.push(index);
        });
        variantsNode.hidden = coloredIndexes.length === 0;

        let initialIndex = coloredIndexes.find(function (index) {
            return currentVariants[index].available !== 'N';
        });
        if (!Number.isFinite(initialIndex)) {
            initialIndex = currentVariants.findIndex(function (variant) { return variant.available !== 'N'; });
        }
        if (initialIndex < 0) initialIndex = coloredIndexes.length ? coloredIndexes[0] : 0;

        if (coloredIndexes.length) {
            const fragment = document.createDocumentFragment();
            coloredIndexes.forEach(function (index) {
                const variant = currentVariants[index];
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'tlsc-color' + (variant.available === 'N' ? ' is-unavailable' : '');
                button.dataset.variantIndex = String(index);
                button.style.setProperty('--swatch', variantSwatch(variant.color));
                button.setAttribute('aria-label', 'Цвет: ' + variant.color + (variant.available === 'N' ? ', нет в наличии' : ''));
                button.setAttribute('aria-pressed', 'false');
                const dot = document.createElement('i');
                const label = document.createElement('span');
                label.textContent = variant.color;
                button.appendChild(dot);
                button.appendChild(label);
                fragment.appendChild(button);
            });
            colorChoices.appendChild(fragment);
        }

        applyVariant(initialIndex, product, false);
    }

    function applyVariant(index, product, instant) {
        const variant = currentVariants[index];
        if (!variant) return;
        currentVariantIndex = index;
        if (colorChoices) {
            Array.from(colorChoices.querySelectorAll('[data-variant-index]')).forEach(function (button) {
                const active = parseInt(button.dataset.variantIndex, 10) === index;
                button.classList.toggle('is-active', active);
                button.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
        }
        if (colorName) colorName.textContent = variant.color || '';
        if (colorStock) colorStock.textContent = variant.color ? (variant.available === 'N' ? 'Нет в наличии' : 'В наличии') : '';
        syncCartTarget(product, variant);

        const gallery = uniqueImages([variant.image].concat((product && product.__detailsGallery) || [], product && product.image));
        renderGallery(gallery, 0);
        if (variant.image) {
            if (instant || reduceMotion) {
                setStageImage({ image: variant.image, name: product && product.name || '' });
            } else {
                focusStageImage(variant.image, product && product.name || '', 0);
            }
        } else if (gallery.length) {
            if (instant || reduceMotion) setStageImage({ image: gallery[0], name: product && product.name || '' });
            else focusStageImage(gallery[0], product && product.name || '', 0);
        }

        const variantPrice = parseInt(variant.price, 10) || 0;
        const basePrice = parseInt(product && product.price, 10) || 0;
        const shownPrice = variantPrice || basePrice;
        animatePriceValue(shownPrice, Boolean(instant));
        if (priceRangeNode) priceRangeNode.textContent = variantPrice ? 'для выбранного цвета' : (basePrice ? 'ориентир для базовой комплектации' : 'точная стоимость зависит от выбранной версии');
        if (currentState && product) {
            updateBudgetFit(Object.assign({}, product, { price: shownPrice }), currentState);
            if (currentSelection) updatePassport(currentSelection, currentState, matchPercent(currentSelection.scored, currentState));
            const territoryVariantSrc = String(variant.image || (gallery.length ? gallery[0] : '') || product.image || '');
            if (currentSelection) renderTerritory(currentSelection,currentState,Boolean(instant),territoryVariantSrc);
        }
    }

    function renderAccessories(payload) {
        const items = payload && Array.isArray(payload.items) ? payload.items : [];
        if (!accessoriesTab || !accessoriesNode) return;
        accessoriesTab.hidden = items.length === 0;
        if (accessoriesCount) accessoriesCount.textContent = items.length ? String(payload.count || items.length) : '';
        if (accessoriesCaption) accessoriesCaption.textContent = items.length ? ((payload.count || items.length) + ' совместимых позиций') : 'Только подтверждённая совместимость';
        accessoriesNode.innerHTML = '';
        if (!items.length) {
            const active = root.querySelector('[data-tlsc-tab="accessories"].is-active');
            if (active) activateTab('recommendation');
            return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach(function (item) {
            const card = document.createElement('a');
            card.className = 'tlsc-accessory';
            card.href = item.url || '/catalog/aksessuary/';

            const media = document.createElement('div');
            media.className = 'tlsc-accessory__media';
            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name || '';
                img.loading = 'lazy';
                media.appendChild(img);
            } else {
                const empty = document.createElement('span');
                empty.textContent = 'Фото скоро';
                media.appendChild(empty);
            }

            const copy = document.createElement('div');
            copy.className = 'tlsc-accessory__copy';
            const meta = document.createElement('span');
            meta.textContent = String(item.section || 'Аксессуары').replace(/\s+/g, ' ').trim();
            const title = document.createElement('strong');
            title.textContent = String(item.name || 'Аксессуар').replace(/\s+/g, ' ').trim();
            const foot = document.createElement('div');
            const price = document.createElement('b');
            price.textContent = formatRub(parseInt(item.price, 10) || 0);
            const stock = document.createElement('em');
            stock.textContent = item.available === 'N' ? 'Под заказ' : 'В наличии';
            foot.appendChild(price);
            foot.appendChild(stock);
            if (item.article) {
                const article = document.createElement('small');
                article.textContent = item.article;
                copy.appendChild(meta); copy.appendChild(title); copy.appendChild(article); copy.appendChild(foot);
            } else {
                copy.appendChild(meta); copy.appendChild(title); copy.appendChild(foot);
            }
            card.appendChild(media);
            card.appendChild(copy);
            fragment.appendChild(card);
        });
        accessoriesNode.appendChild(fragment);
    }

    function detailsUrl(productId) {
        const url = new URL(window.location.href);
        url.search = '';
        url.hash = '';
        url.searchParams.set('tlsc_api', 'product_details');
        url.searchParams.set('product_id', String(productId));
        return url.toString();
    }

    function applyProductDetails(product, payload, token) {
        if (token !== detailsToken || !currentSelection || String(currentSelection.product.id) !== String(product.id)) return;
        const gallery = uniqueImages((payload.gallery || []).concat(product.image || ''));
        product.__detailsGallery = gallery;
        renderGallery(gallery, 0);
        renderVariants(payload.variants || [], product);

        // Если основное изображение товара отсутствует/не загрузилось, но в MORE_PHOTO
        // есть рабочая фотография, показываем её как основную. Это не позволяет сцене
        // оставаться пустой при фактически заполненной галерее.
        if (!currentVariants.length && gallery.length && productImage && (productImage.hidden || !productImage.getAttribute('src'))) {
            focusStageImage(gallery[0], product.name || '', 0);
        }

        renderAccessories(payload.accessories || { count:0, items:[] });
    }

    function loadProductDetails(product) {
        if (!product || !product.id) return;
        const token = ++detailsToken;
        const key = String(product.id);
        if (productDetailsCache.has(key)) {
            applyProductDetails(product, productDetailsCache.get(key), token);
            return;
        }
        fetch(detailsUrl(product.id), { credentials:'same-origin', headers:{ 'X-Requested-With':'XMLHttpRequest' } })
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function (payload) {
                if (!payload || !payload.ok) throw new Error('Некорректный ответ');
                productDetailsCache.set(key, payload);
                applyProductDetails(product, payload, token);
            })
            .catch(function () {
                if (token !== detailsToken) return;
                renderGallery(uniqueImages([product.image]), 0);
                if (variantsNode) variantsNode.hidden = true;
                renderAccessories({ count:0, items:[] });

                // Если ленивые детали не загрузились, не оставляем кнопку навечно
                // в состоянии «Подготовка…». Пробуем штатный resolver корзины,
                // который умеет получить точный offer_id по родительскому товару.
                // Если и он недоступен, корзину блокируем: безопаснее открыть карточку,
                // чем случайно добавить родителя или неверное торговое предложение.
                fallbackResolveCart(product).then(function (resolved) {
                    if (token !== detailsToken) return;
                    if (!resolved) cartButtons.forEach(function (button) {
                        setCartButtonVisual(button, 'error');
                    });
                });
            });
    }

    function brandKey(value) {
        let key = normalize(value)
            .replace(/[®™]/g, '')
            .replace(/\bbrp\b/g, ' ')
            .replace(/[^a-zа-я0-9]+/giu, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (/sea\s*doo/.test(key)) return 'sea-doo';
        if (/ski\s*doo/.test(key)) return 'ski-doo';
        if (/can\s*am/.test(key)) return 'can-am';
        if (/bmw\s*motorrad/.test(key)) return 'bmw-motorrad';
        return key;
    }

    function inferredBrandKey(product) {
        const direct = brandKey(product && product.brand);
        if (direct) return direct;
        const text = normalize([product && product.name, product && product.model, product && product.collection].join(' '));
        if (/sea[ -]?doo/.test(text)) return 'sea-doo';
        if (/ski[ -]?doo/.test(text)) return 'ski-doo';
        if (/can[ -]?am|\bspyder\b|\bryker\b|\bcanyon\b/.test(text)) return 'can-am';
        if (/bmw[ -]?motorrad/.test(text)) return 'bmw-motorrad';
        return '';
    }

    function displayBrand(product) {
        const key = inferredBrandKey(product);
        const canonical = {
            'sea-doo': 'BRP SEA-DOO',
            'ski-doo': 'BRP SKI-DOO',
            'can-am': 'BRP CAN-AM',
            'bmw-motorrad': 'BMW-MOTORRAD',
            'polaris': 'POLARIS',
            'kawasaki': 'KAWASAKI',
            'yamaha': 'YAMAHA',
            'ducati': 'DUCATI',
            'triumph': 'TRIUMPH'
        }[key];
        return canonical || String(product && product.brand || '').trim();
    }

    function productMatchesBrand(product, selectedValue) {
        const selected = brandKey(selectedValue);
        if (!selected) return true;
        return inferredBrandKey(product) === selected;
    }

    function categoryKey(product, type) {
        const text = normalize([product && product.category_name, product && product.category_code, product && product.section_name].join(' '));
        if (/тур[ -]?эндуро|tour[ -]?enduro/.test(text)) return 'tour_enduro';
        if (/суперспорт|supersport/.test(text)) return 'supersport';
        if (/эндуро|enduro/.test(text)) return 'enduro';
        if (/утилитар/.test(text)) return 'utility';
        if (/турист/.test(text)) return 'touring';
        if (/горн/.test(text)) return 'mountain';
        if (/кроссовер|crossover/.test(text)) return 'crossover';
        if (/спортив|\bsport/.test(text)) return 'sport';
        if (/круиз/.test(text)) return 'cruiser';
        if (/мотард/.test(text)) return 'motard';
        if (/нейк/.test(text)) return 'naked';
        if (/дорож/.test(text)) return 'road';

        /*
         * При появлении новой подкатегории подбор не выпадает из логики:
         * используем реальные теги назначения как безопасный fallback.
         */
        if (flagValue(product && product.sport_purpose) === 1) return 'sport';
        if (type === 'snow' && flagValue(product && product.deep_snow) === 1) return 'mountain';
        if (['buggy','atv'].includes(type) && flagValue(product && product.work_purpose) === 1) return 'utility';
        if (['buggy','atv','water','moto'].includes(type) && flagValue(product && product.travel_purpose) === 1) return type === 'moto' ? 'tour_enduro' : 'touring';
        return type === 'road' ? 'road' : (type || 'other');
    }

    function textOf(product) {
        /* Тип и назначение берём из структуры каталога; текст оставлен только как fallback. */
        return normalize([
            product.name, product.section_name, product.section_top,
            product.category_name, product.category_code, product.brand
        ].join(' '));
    }

    function parseSeats(value, product) {
        const direct = Number(value);
        if (Number.isFinite(direct) && direct > 0) return Math.max(0, Math.min(8, Math.round(direct)));
        const raw = normalize(value);
        const name = normalize(product && product.name);
        let match = raw.match(/(?:мест|seat|пассажир)[^0-9]{0,8}(\d+)/);
        if (!match) match = raw.match(/\b(\d+)\b/);
        let seats = match ? parseInt(match[1], 10) : 0;
        if (!seats) {
            const explicitUp = name.match(/\b([1-6])\s*[- ]?up\b/);
            if (explicitUp) seats = parseInt(explicitUp[1], 10);
        }
        return Math.max(0, Math.min(8, seats || 0));
    }

    function detectType(product, text) {
        const direct = normalize(product && product.vehicle_type);
        if (['buggy','snow','atv','water','moto','road'].includes(direct)) return direct;
        const top = normalize(product && product.section_top);
        const name = normalize(product && product.name);
        const t = text || textOf(product);
        if (/гидроцикл/.test(top + ' ' + name)) return 'water';
        if (/снегоход/.test(top + ' ' + name)) return 'snow';
        if (/багги|мотовездеход/.test(top + ' ' + name)) return 'buggy';
        if (/квадроцикл/.test(top + ' ' + name)) return 'atv';
        if (/трицикл/.test(top + ' ' + name)) return 'road';
        if (/мотоцикл/.test(top + ' ' + name)) return 'moto';
        if (/watercraft|jet ?ski/.test(t)) return 'water';
        return 'technique';
    }

    function finiteNumber(value) {
        const n = Number(value);
        return Number.isFinite(n) && n > 0 ? n : null;
    }

    function percentile(values, p) {
        if (!values.length) return null;
        const sorted = values.slice().sort(function(a,b){return a-b;});
        const index = (sorted.length - 1) * p;
        const lo = Math.floor(index), hi = Math.ceil(index);
        if (lo === hi) return sorted[lo];
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (index - lo);
    }

    const STAT_FIELDS = [
        'power','engine_displacement','ground_clearance','front_travel','rear_travel',
        'load_capacity','tank_capacity','trunk_capacity','weight','width','wheelbase','track_length',
        'track_width','lug_height','ski_base'
    ];

    function buildCatalogStats(items) {
        const grouped = { type:{}, category:{} };
        function push(group, bucket, key, value) {
            if (!group[bucket]) group[bucket] = {};
            if (!group[bucket][key]) group[bucket][key] = [];
            group[bucket][key].push(value);
        }
        items.forEach(function(product){
            const type = detectType(product, '');
            const category = categoryKey(product, type);
            const categoryBucket = type + '::' + category;
            STAT_FIELDS.forEach(function(key){
                const value = finiteNumber(product[key]);
                if (value == null) return;
                push(grouped.type, type, key, value);
                push(grouped.category, categoryBucket, key, value);
            });
        });
        function finalize(source) {
            const stats = {};
            Object.keys(source).forEach(function(bucket){
                stats[bucket] = {};
                STAT_FIELDS.forEach(function(key){
                    const values = source[bucket][key] || [];
                    if (!values.length) return;
                    const lo = percentile(values, values.length >= 20 ? 0.10 : 0);
                    const hi = percentile(values, values.length >= 20 ? 0.90 : 1);
                    stats[bucket][key] = { lo:lo, hi:hi, count:values.length };
                });
            });
            return stats;
        }
        return { type:finalize(grouped.type), category:finalize(grouped.category) };
    }

    const catalogStats = buildCatalogStats(products);

    function normAgainstStat(value, stat) {
        if (value == null || !stat || stat.lo == null || stat.hi == null) return null;
        if (stat.hi === stat.lo) return .5;
        return clamp01((value - stat.lo) / (stat.hi - stat.lo));
    }

    function normField(product, type, key, invert) {
        const value = finiteNumber(product && product[key]);
        if (value == null) return null;
        const typeStat = catalogStats.type[type] && catalogStats.type[type][key];
        const category = categoryKey(product, type);
        const categoryBucket = type + '::' + category;
        const categoryStat = catalogStats.category[categoryBucket] && catalogStats.category[categoryBucket][key];
        const typeNorm = normAgainstStat(value, typeStat);
        const categoryNorm = normAgainstStat(value, categoryStat);
        if (typeNorm == null && categoryNorm == null) return null;

        /*
         * Сравниваем модель прежде всего с её реальным классом каталога, но сохраняем
         * контекст всего типа техники. На маленькой подвыборке вес категории уменьшается.
         */
        let out = typeNorm == null ? categoryNorm : typeNorm;
        if (categoryNorm != null && typeNorm != null) {
            const count = Number(categoryStat && categoryStat.count) || 0;
            const categoryWeight = count >= 12 ? .72 : (count >= 6 ? .56 : (count >= 4 ? .40 : 0));
            out = categoryNorm * categoryWeight + typeNorm * (1 - categoryWeight);
        }
        out = clamp01(out);
        return invert ? 1 - out : out;
    }

    function featureState(value, positivePattern) {
        const raw = normalize(value);
        if (!raw) return null;
        if (/^(нет|no|none|отсутств)/.test(raw)) return 0;
        if (positivePattern) return positivePattern.test(raw) ? 1 : 0;
        return 1;
    }

    function flagValue(value) {
        if (value === null || value === undefined || value === '') return null;
        if (value === true || value === 'Y') return 1;
        if (value === false || value === 'N') return 0;
        const n = Number(value);
        return Number.isFinite(n) ? (n > 0 ? 1 : 0) : featureState(value);
    }

    function weightedMean(parts, fallback) {
        let sum = 0, weight = 0;
        parts.forEach(function(part){
            const value = part[0], w = part[1];
            if (value == null || !Number.isFinite(value) || !w) return;
            sum += Math.max(0, Math.min(1, value)) * w;
            weight += w;
        });
        return weight ? sum / weight : (fallback == null ? 0.5 : fallback);
    }


    function weightedGeometricMean(parts, fallback) {
        let logSum = 0, weight = 0;
        parts.forEach(function(part){
            const value = part[0], w = Number(part[1]) || 0;
            if (value == null || !Number.isFinite(value) || w <= 0) return;
            /*
             * Геометрическое среднее делает каждый выбранный параметр значимым:
             * очень слабая сторона не может полностью компенсироваться другой сильной.
             */
            const safe = Math.max(0.08, Math.min(1, value));
            logSum += Math.log(safe) * w;
            weight += w;
        });
        return weight ? Math.exp(logSum / weight) : (fallback == null ? 0.5 : fallback);
    }


    function weightedMetric(parts, fallback) {
        const neutral = fallback == null ? 0.5 : fallback;
        let sum = 0, knownWeight = 0, totalWeight = 0;
        parts.forEach(function(part){
            const value = part[0], w = Number(part[1]) || 0;
            if (!w) return;
            totalWeight += w;
            if (value == null || !Number.isFinite(value)) return;
            sum += clamp01(value) * w;
            knownWeight += w;
        });
        if (!knownWeight || !totalWeight) return { value:neutral, coverage:0 };
        const raw = sum / knownWeight;
        const coverage = Math.max(0, Math.min(1, knownWeight / totalWeight));
        /* Неполная карточка не получает преимущества только из-за отсутствующих слабых полей. */
        const trust = 0.62 + coverage * 0.38;
        return { value:clamp01(neutral + (raw - neutral) * trust), coverage:coverage };
    }

    function buildProfile(product) {
        const text = textOf(product);
        const type = detectType(product, text);
        const category = categoryKey(product, type);
        const seats = parseSeats(product.seats, product);

        /*
         * V11 получает эти признаки уже нормализованными на сервере. Fallback ниже
         * оставлен, чтобы страница не ломалась при коротком переходном кэше.
         */
        const driveText = normalize([product.drive, product.drive_modes].join(' '));
        const purpose = normalize(product.purpose);
        const reviewText = normalize(product.review);
        const additionalText = normalize([product.additional, product.case_type].join(' '));
        const traits = {
            fullDrive: flagValue(product.full_drive) != null ? flagValue(product.full_drive) === 1 : /полный|4wd|awd|4x4|6wd|6x6/.test(driveText),
            driveKnown: flagValue(product.drive_known) != null ? flagValue(product.drive_known) === 1 : !!driveText,
            diffLock: flagValue(product.diff_lock) != null ? flagValue(product.diff_lock) : featureState(product.diff_locks),
            powerSteering: flagValue(product.power_steering_flag) != null ? flagValue(product.power_steering_flag) : featureState(product.power_steering),
            heaters: flagValue(product.heaters_flag) != null ? flagValue(product.heaters_flag) : featureState(product.heaters),
            multimedia: flagValue(product.multimedia_flag) != null ? flagValue(product.multimedia_flag) : featureState(product.multimedia),
            windshield: flagValue(product.windshield_flag) != null ? flagValue(product.windshield_flag) : (reviewText && /ветров|лобов.*стекл|windshield/.test(reviewText) ? 1 : null),
            luggage: flagValue(product.luggage_flag) != null ? flagValue(product.luggage_flag) : featureState(product.luggage),
            cruise: flagValue(product.cruise_flag) != null ? flagValue(product.cruise_flag) : featureState(product.cruise_control),
            abs: flagValue(product.abs_flag) != null ? flagValue(product.abs_flag) : featureState(product.abs),
            quickshifter: flagValue(product.quickshifter_flag) != null ? flagValue(product.quickshifter_flag) : featureState(product.quickshifter),
            tcs: flagValue(product.tcs_flag) != null ? flagValue(product.tcs_flag) : featureState(product.tcs),
            ibr: flagValue(product.ibr_flag) != null ? flagValue(product.ibr_flag) : featureState(product.ibr),
            idf: flagValue(product.idf_flag) != null ? flagValue(product.idf_flag) : featureState(product.idf),
            cab: flagValue(product.cab_flag) != null ? flagValue(product.cab_flag) : (additionalText && /кабин|крыша|cab|roof/.test(additionalText) ? 1 : null),
            mudPurpose: flagValue(product.mud_purpose) != null ? flagValue(product.mud_purpose) : (purpose ? (/гряз|болот|mud|swamp/.test(purpose) ? 1 : 0) : null),
            deepSnow: flagValue(product.deep_snow) != null ? flagValue(product.deep_snow) : (purpose ? (/глубок.*снег|пухляк/.test(purpose) ? 1 : 0) : null),
            workPurpose: flagValue(product.work_purpose) != null ? flagValue(product.work_purpose) : (purpose ? (/работ|охот|рыбал|дач|груз/.test(purpose) ? 1 : 0) : null),
            travelPurpose: flagValue(product.travel_purpose) != null ? flagValue(product.travel_purpose) : (purpose ? (/путешеств|турист|семейн/.test(purpose) ? 1 : 0) : null),
            sportPurpose: flagValue(product.sport_purpose),
            familyPurpose: flagValue(product.family_purpose),
            beginnerPurpose: flagValue(product.beginner_purpose),
            winterPurpose: flagValue(product.winter_purpose)
        };
        return { text:text, type:type, category:category, seats:seats, traits:traits };
    }

    const profileCache = new Map();
    function getProfile(product) {
        const key = String(product.id || product.name || '');
        if (profileCache.has(key)) return profileCache.get(key);
        const profile = buildProfile(product);
        profileCache.set(key, profile);
        return profile;
    }

    function getState() {
        const fd = new FormData(controls);
        return {
            ride: fd.get('ride') || 'active',
            terrain: fd.get('terrain') || 'forest',
            season: fd.get('season') || 'summer',
            passengers: String(fd.get('passengers') || '2'),
            budget: parseInt(fd.get('budget') || '2000000', 10),
            priorityPower: parseInt(fd.get('priority_power') || '0', 10),
            priorityTerrain: parseInt(fd.get('priority_terrain') || '0', 10),
            priorityComfort: parseInt(fd.get('priority_comfort') || '0', 10),
            priorityPractical: parseInt(fd.get('priority_practical') || '0', 10),
            brand: String(fd.get('brand') || ''),
            availableOnly: fd.get('available_only') === '1',
            strictBudget: fd.get('strict_budget') === '1'
        };
    }

    function clamp01(value) {
        return Math.max(0, Math.min(1, Number(value) || 0));
    }

    function categoryBaseFit(category, ride) {
        const table = {
            utility:      {calm:.88, active:.72, extreme:.38, expedition:1.00},
            touring:      {calm:1.00, active:.86, extreme:.45, expedition:.94},
            sport:        {calm:.48, active:.96, extreme:1.00, expedition:.36},
            mountain:     {calm:.42, active:.86, extreme:1.00, expedition:.42},
            crossover:    {calm:.68, active:1.00, extreme:.86, expedition:.78},
            supersport:   {calm:.30, active:.82, extreme:1.00, expedition:.20},
            enduro:       {calm:.58, active:.92, extreme:.92, expedition:.68},
            tour_enduro:  {calm:.84, active:.92, extreme:.68, expedition:1.00},
            road:         {calm:.92, active:.82, extreme:.62, expedition:.82},
            cruiser:      {calm:1.00, active:.68, extreme:.38, expedition:.82},
            motard:       {calm:.48, active:.92, extreme:.96, expedition:.34},
            naked:        {calm:.65, active:1.00, extreme:.82, expedition:.48}
        };
        return (table[category] && table[category][ride] != null) ? table[category][ride] : 0.62;
    }

    function offroadMotoEligible(profile, terrain) {
        if (profile.type !== 'moto') return true;
        if (terrain === 'mud') return profile.category === 'enduro';
        return ['enduro','tour_enduro'].includes(profile.category);
    }

    function isFatalScenarioMismatch(profile, state) {
        if (profile.type === 'technique') return true;
        if (state.terrain === 'water') return profile.type !== 'water' || ['winter','all'].includes(state.season);
        if (state.terrain === 'snow') return profile.type !== 'snow' || ['summer','all'].includes(state.season);
        if (state.terrain === 'road') return !['road','moto'].includes(profile.type);

        if (['forest','mountain','mud','stone'].includes(state.terrain)) {
            if (['water','road','snow'].includes(profile.type)) return true;
            if (profile.type === 'moto' && !offroadMotoEligible(profile, state.terrain)) return true;
            return !['buggy','atv','moto'].includes(profile.type);
        }
        return false;
    }

    function platformFit(profile, state) {
        const type = profile.type;
        const terrain = state.terrain;
        const ride = state.ride;
        const requested = parseInt(state.passengers, 10) || 1;

        if (terrain === 'water') return type === 'water' ? 1 : 0;
        if (terrain === 'snow') return type === 'snow' ? 1 : 0;

        if (terrain === 'road') {
            let value = 0;
            if (type === 'moto') {
                value = ({calm:.88,active:1,extreme:1,expedition:.84}[ride] ?? .88);
            } else if (type === 'road') {
                value = ({calm:1,active:.76,extreme:.38,expedition:.94}[ride] ?? .78);
            }
            if (requested >= 2 && type === 'road') value += .03;
            if (requested >= 2 && type === 'moto') value -= .04;
            return clamp01(value);
        }

        const table = {
            forest: {
                buggy:{calm:.94,active:.88,extreme:.76,expedition:.98},
                atv:{calm:.90,active:1,extreme:.97,expedition:.91},
                moto:{calm:.56,active:.82,extreme:.91,expedition:.56},
                snow:{calm:.80,active:.89,extreme:.84,expedition:.82}
            },
            mountain: {
                buggy:{calm:.83,active:.89,extreme:.88,expedition:.86},
                atv:{calm:.85,active:.95,extreme:.94,expedition:.86},
                moto:{calm:.64,active:.90,extreme:.97,expedition:.68},
                snow:{calm:.82,active:.97,extreme:1,expedition:.76}
            },
            mud: {
                buggy:{calm:.92,active:.96,extreme:.98,expedition:.91},
                atv:{calm:.91,active:1,extreme:.97,expedition:.90},
                moto:{calm:.40,active:.68,extreme:.77,expedition:.38}
            },
            stone: {
                buggy:{calm:.88,active:.95,extreme:.98,expedition:.86},
                atv:{calm:.90,active:.99,extreme:.97,expedition:.84},
                moto:{calm:.56,active:.88,extreme:.96,expedition:.55}
            }
        };

        let value = table[terrain] && table[terrain][type]
            ? (table[terrain][type][ride] ?? .65)
            : .55;

        /*
         * Вместимость влияет не только как «достаточно мест / недостаточно».
         * Для одиночной активной езды более компактная платформа логичнее,
         * для 2+ человек — наоборот, преимущество смещается к багги/трициклам.
         */
        if (requested === 1 && ['active','extreme'].includes(ride)) {
            if (type === 'atv' || type === 'moto' || type === 'snow') value += .025;
            if (type === 'buggy') value -= .025;
        } else if (requested >= 2) {
            if (type === 'buggy') value += .04;
            if (type === 'moto') value -= .12;
            if (type === 'atv') value -= .035;
        }

        return clamp01(value);
    }

    function environmentFit(profile, state) {
        if (state.terrain === 'water') return profile.type === 'water' ? 1 : 0;
        if (state.terrain === 'snow') return profile.type === 'snow' ? 1 : 0;
        if (state.terrain === 'road') return profile.type === 'road' ? 1 : (profile.type === 'moto' ? .94 : 0);
        if (['forest','mountain','mud','stone'].includes(state.terrain)) {
            if (profile.type === 'snow') return 0;
            if (profile.type === 'buggy' || profile.type === 'atv') {
                return state.season === 'winter' && ['forest','mountain'].includes(state.terrain) ? .84 : 1;
            }
            if (profile.type === 'moto' && offroadMotoEligible(profile, state.terrain)) return state.terrain === 'mud' ? .68 : .78;
        }
        return 0;
    }

    function seasonFit(profile, state) {
        const season = state.season;
        if (profile.type === 'water') return ({summer:1, shoulder:.72, all:.48, winter:0}[season] ?? .6);
        if (profile.type === 'snow') {
            if (state.terrain === 'snow') return ({winter:1, shoulder:.58, all:.42, summer:0}[season] ?? .5);
            return season === 'winter' ? 1 : 0;
        }
        if (profile.type === 'road' || profile.type === 'moto') return ({summer:1, shoulder:.90, all:.68, winter:.38}[season] ?? .75);
        if (profile.type === 'buggy' || profile.type === 'atv') return ({summer:.96, shoulder:1, all:1, winter:.84}[season] ?? .9);
        return .7;
    }

    function capacityFit(profile, state) {
        const requested = parseInt(state.passengers, 10) || 1;
        const seats = parseInt(profile.seats, 10) || 0;
        const type = profile.type;
        const ride = state.ride;

        if (!seats) {
            return {
                value: requested === 1 ? .82 : .46,
                known:false,
                enough:null,
                seats:0,
                requested:requested
            };
        }

        if (seats < requested) {
            return {value:.05,known:true,enough:false,seats:seats,requested:requested};
        }

        const surplus = Math.max(0, seats - requested);
        if (!surplus) {
            return {value:1,known:true,enough:true,seats:seats,requested:requested};
        }

        const penaltyPerSeat = {
            buggy:{calm:.03,active:.10,extreme:.16,expedition:.025},
            atv:{calm:.05,active:.13,extreme:.17,expedition:.04},
            snow:{calm:.045,active:.13,extreme:.17,expedition:.04},
            water:{calm:.035,active:.085,extreme:.13,expedition:.03},
            moto:{calm:.012,active:.035,extreme:.05,expedition:.015},
            road:{calm:.015,active:.04,extreme:.055,expedition:.015}
        };
        const penalty = (penaltyPerSeat[type] && penaltyPerSeat[type][ride] != null)
            ? penaltyPerSeat[type][ride]
            : .06;

        return {
            value:Math.max(.50, 1 - surplus * penalty),
            known:true,
            enough:true,
            seats:seats,
            requested:requested
        };
    }

    function categoryFit(profile, state) {
        let fit = categoryBaseFit(profile.category, state.ride);
        const requested = parseInt(state.passengers,10) || 1;

        if (profile.type === 'snow') {
            if (state.terrain === 'mountain' && state.season === 'winter') {
                if (profile.category === 'mountain') fit += .16;
                if (profile.category === 'crossover') fit += .08;
                if (profile.category === 'utility' || profile.category === 'touring') fit -= .08;
            } else if (state.terrain === 'forest' && state.season === 'winter') {
                if (profile.category === 'crossover' || profile.category === 'utility') fit += .10;
                if (profile.category === 'mountain') fit -= .06;
            }
        }

        if (profile.type === 'water') {
            if (state.ride === 'extreme' && profile.category === 'sport') fit += .12;
            if ((state.ride === 'calm' || state.ride === 'expedition') && profile.category === 'touring') fit += .12;
        }

        if ((profile.type === 'buggy' || profile.type === 'atv') && state.terrain === 'mud' && profile.traits.mudPurpose === 1) {
            fit += .10;
        }

        /*
         * Количество людей меняет не только минимальное число мест, но и разумный
         * характер техники. Для одного активного райдера лишняя габаритность —
         * небольшой минус; для компании туристическая/утилитарная конфигурация логичнее.
         */
        const soloDynamic = ['active','extreme'].includes(state.ride);
        const dynamicCategories = ['sport','mountain','supersport','enduro','motard','naked','crossover'];
        const groupCategories = ['touring','utility','crossover','tour_enduro','road','cruiser'];

        if (requested === 1 && soloDynamic) {
            if (dynamicCategories.includes(profile.category)) fit += .035;
            if (['touring','utility','cruiser'].includes(profile.category)) fit -= .025;
        } else if (requested >= 2) {
            if (groupCategories.includes(profile.category)) fit += requested >= 3 ? .07 : .045;
            if (['supersport','motard','mountain'].includes(profile.category)) fit -= requested >= 3 ? .08 : .04;
            if (profile.category === 'sport' && requested >= 3) fit -= .035;
        }

        return clamp01(fit);
    }

    function realMetricFactors(product, profile, state) {
        const type = profile.type;
        let power = normField(product,type,'power',false);
        let powerCoverage = power == null ? 0 : 1;
        if (power == null) {
            const displacement = normField(product,type,'engine_displacement',false);
            if (displacement != null) {
                /* Объём — только слабый ориентир; особенно у снегоходов он не заменяет реальные л.с. */
                power = .5 + (displacement - .5) * .20;
                powerCoverage = .32;
            } else {
                power = .5;
            }
        }

        const clearance = normField(product,type,'ground_clearance',false);
        const frontTravel = normField(product,type,'front_travel',false);
        const rearTravel = normField(product,type,'rear_travel',false);
        const travelMetric = weightedMetric([[frontTravel,.5],[rearTravel,.5]], .5);
        const travel = travelMetric.value;
        const lowWeight = normField(product,type,'weight',true);
        const narrowWidth = normField(product,type,'width',true);
        const shortWheelbase = normField(product,type,'wheelbase',true);
        const load = normField(product,type,'load_capacity',false);
        const tank = normField(product,type,'tank_capacity',false);
        const trunk = normField(product,type,'trunk_capacity',false);
        const trackLength = normField(product,type,'track_length',false);
        const trackWidth = normField(product,type,'track_width',false);
        const lug = normField(product,type,'lug_height',false);

        let terrainMetric = {value:.5,coverage:0};
        if (type === 'buggy' || type === 'atv') {
            const fullDrive = profile.traits.driveKnown ? (profile.traits.fullDrive ? 1 : 0) : null;
            if (state.terrain === 'forest') {
                terrainMetric = weightedMetric([
                    [clearance,.22],[travel,.18],[narrowWidth,.21],[lowWeight,.10],
                    [fullDrive,.15],[profile.traits.diffLock,.08],[shortWheelbase,.03],[profile.traits.mudPurpose,.03]
                ], .55);
            } else if (state.terrain === 'mountain') {
                terrainMetric = weightedMetric([
                    [clearance,.24],[travel,.23],[lowWeight,.16],[power,.10],
                    [fullDrive,.16],[profile.traits.diffLock,.08],[shortWheelbase,.03]
                ], .56);
            } else if (state.terrain === 'mud') {
                terrainMetric = weightedMetric([
                    [clearance,.27],[travel,.16],[fullDrive,.18],[profile.traits.diffLock,.15],
                    [profile.traits.mudPurpose,.18],[lowWeight,.04],[power,.02]
                ], .57);
            } else if (state.terrain === 'stone') {
                terrainMetric = weightedMetric([
                    [clearance,.28],[travel,.27],[profile.traits.diffLock,.12],
                    [fullDrive,.12],[lowWeight,.09],[shortWheelbase,.07],[power,.05]
                ], .56);
            } else {
                terrainMetric = weightedMetric([[clearance,.30],[travel,.28],[fullDrive,.18],[profile.traits.diffLock,.12],[lowWeight,.12]], .55);
            }
        } else if (type === 'snow') {
            const narrowSkiBase = normField(product,type,'ski_base',true);
            if (state.terrain === 'mountain') {
                terrainMetric = weightedMetric([
                    [trackLength,.19],[lug,.25],[rearTravel,.17],[lowWeight,.19],
                    [power,.10],[narrowSkiBase,.07],[profile.traits.deepSnow,.03]
                ], .59);
            } else if (state.terrain === 'forest') {
                terrainMetric = weightedMetric([
                    [trackLength,.13],[trackWidth,.10],[lug,.12],[rearTravel,.14],
                    [lowWeight,.19],[narrowSkiBase,.19],[power,.06],[profile.traits.deepSnow,.07]
                ], .58);
            } else {
                terrainMetric = weightedMetric([
                    [trackLength,.21],[trackWidth,.14],[lug,.22],[rearTravel,.17],
                    [lowWeight,.09],[profile.traits.deepSnow,.17]
                ], .58);
            }
        } else if (type === 'water') {
            terrainMetric = weightedMetric([
                [lowWeight,.31],[power,.27],[profile.category === 'sport' ? 1 : .55,.16],
                [profile.traits.ibr,.13],[profile.traits.idf,.08],[shortWheelbase,.05]
            ], .58);
        } else if (type === 'moto' || type === 'road') {
            const handlingCategory = ['sport','supersport','motard','naked'].includes(profile.category) ? 1 : (['road','enduro','tour_enduro'].includes(profile.category) ? .72 : .48);
            terrainMetric = weightedMetric([
                [lowWeight,.23],[travel,.16],[shortWheelbase,.10],[handlingCategory,.24],
                [profile.traits.abs,.10],[profile.traits.tcs,.08],[profile.traits.quickshifter,.09]
            ], .55);
        }

        const categoryComfort = ({touring:1,utility:.76,crossover:.64,tour_enduro:.86,road:.82,cruiser:.94,naked:.52,sport:.38,supersport:.22,enduro:.40,motard:.38,mountain:.30}[profile.category] ?? .55);
        const seatComfort = profile.seats ? Math.min(1, profile.seats / (type === 'buggy' ? 4 : (type === 'water' ? 3 : 2))) : null;
        const comfortMetric = weightedMetric([
            [categoryComfort,.29],[seatComfort,.13],[profile.traits.heaters,.10],[profile.traits.multimedia,.09],
            [profile.traits.windshield,.08],[profile.traits.cruise,.08],[profile.traits.powerSteering,.07],
            [trunk,.06],[profile.traits.cab,.06],[profile.traits.familyPurpose,.04]
        ], .52);

        const categoryPractical = ({utility:1,touring:.86,crossover:.68,tour_enduro:.86,road:.68,cruiser:.62,enduro:.55,naked:.38,sport:.34,supersport:.20,motard:.28,mountain:.42}[profile.category] ?? .52);
        const seatPractical = profile.seats ? Math.min(1, profile.seats / (type === 'buggy' ? 4 : (type === 'water' ? 3 : 2))) : null;
        const practicalMetric = weightedMetric([
            [categoryPractical,.24],[load,.13],[trunk,.13],[tank,.12],[seatPractical,.10],
            [profile.traits.luggage,.08],[profile.traits.workPurpose,.09],[profile.traits.travelPurpose,.05],
            [profile.traits.idf,.03],[profile.traits.familyPurpose,.02],
            [profile.traits.driveKnown ? (profile.traits.fullDrive ? 1 : 0) : null,.01]
        ], .52);

        const coverage = {
            power:powerCoverage,
            terrain:terrainMetric.coverage,
            comfort:comfortMetric.coverage,
            practical:practicalMetric.coverage
        };
        const confidenceWeights = personalizedFeatureWeights(state);
        const dataConfidence = weightedMean([
            [coverage.power,confidenceWeights.power],
            [coverage.terrain,confidenceWeights.terrain],
            [coverage.comfort,confidenceWeights.comfort],
            [coverage.practical,confidenceWeights.practical]
        ], .5);
        return {
            power:clamp01(power), terrain:clamp01(terrainMetric.value), comfort:clamp01(comfortMetric.value), practical:clamp01(practicalMetric.value),
            coverage:coverage, dataConfidence:clamp01(dataConfidence)
        };
    }

    function baseFeatureWeights(ride) {
        return ({
            calm:{power:.07,terrain:.14,comfort:.49,practical:.30},
            active:{power:.28,terrain:.31,comfort:.23,practical:.18},
            extreme:{power:.48,terrain:.39,comfort:.07,practical:.06},
            expedition:{power:.05,terrain:.21,comfort:.28,practical:.46}
        }[ride] || {power:.25,terrain:.25,comfort:.25,practical:.25});
    }

    function personalizedFeatureWeights(state) {
        const weights = Object.assign({}, baseFeatureWeights(state.ride));
        const priorities = [
            ['power',state.priorityPower],
            ['terrain',state.priorityTerrain],
            ['comfort',state.priorityComfort],
            ['practical',state.priorityPractical]
        ];

        priorities.forEach(function(item){
            const level = precisionLevel(item[1]);
            if (level === 1) weights[item[0]] += .25;
            else if (level === 2) weights[item[0]] += .70;
        });

        return weights;
    }

    function featureFitByWeights(metrics, weights) {
        return weightedMean([
            [metrics.power,weights.power],
            [metrics.terrain,weights.terrain],
            [metrics.comfort,weights.comfort],
            [metrics.practical,weights.practical]
        ], .5);
    }

    function rideFeatureFit(metrics, ride) {
        return featureFitByWeights(metrics, baseFeatureWeights(ride));
    }

    function personalizedFeatureFit(metrics, state) {
        return featureFitByWeights(metrics, personalizedFeatureWeights(state));
    }

    function priorityGate(metrics, state) {
        let gate = 1;
        [
            ['power',state.priorityPower],
            ['terrain',state.priorityTerrain],
            ['comfort',state.priorityComfort],
            ['practical',state.priorityPractical]
        ].forEach(function(item){
            const level = precisionLevel(item[1]);
            if (level !== 2) return;
            const metric = clamp01(metrics[item[0]] == null ? .5 : metrics[item[0]]);
            /*
             * «Максимум» означает не просто больший вес. Слабое значение выбранной
             * характеристики получает мягкий порог, но не превращается в жёсткий фильтр.
             */
            if (metric < .60) {
                gate *= .82 + (metric / .60) * .18;
            }
        });
        return Math.max(.78, Math.min(1, gate));
    }

    function precisionLevel(value) {
        const n = Number(value);
        if (!Number.isFinite(n)) return 0;
        return Math.max(0, Math.min(2, Math.round(n)));
    }



    function budgetFitScore(price, budgetValue) {
        if (!price || !budgetValue) return .45;
        const ratio = price / budgetValue;
        if (ratio <= 1.00) return 1.00;
        if (ratio <= 1.05) return .78;
        if (ratio <= 1.12) return .58;
        if (ratio <= 1.20) return .34;
        if (ratio <= 1.35) return .16;
        return .04;
    }


    function metricPrioritySatisfaction(metrics, state, onlyMaximum) {
        const parts = [];
        [
            ['power',state.priorityPower],
            ['terrain',state.priorityTerrain],
            ['comfort',state.priorityComfort],
            ['practical',state.priorityPractical]
        ].forEach(function(item){
            const level = precisionLevel(item[1]);
            if (!level || (onlyMaximum && level !== 2)) return;
            parts.push([clamp01(metrics[item[0]] == null ? .5 : metrics[item[0]]), level]);
        });
        return parts.length ? weightedGeometricMean(parts,.5) : 1;
    }

    function activePriorityWeight(state) {
        let weight = 0;
        [state.priorityPower,state.priorityTerrain,state.priorityComfort,state.priorityPractical]
            .forEach(function(value){
                const level=precisionLevel(value);
                if (level===1) weight += .11;
                else if (level===2) weight += .20;
            });
        return Math.min(.32,weight);
    }

    function scoreProduct(product, state) {
        const profile = getProfile(product);
        const price = parseInt(product.price, 10) || 0;
        const scenarioFatal = isFatalScenarioMismatch(profile, state);
        const capacity = capacityFit(profile, state);

        if (scenarioFatal) {
            return {
                score:-10000,fitScore:-10000,baseFitScore:-10000,fatal:true,
                fatalReason:'scenario',
                type:profile.type,seats:profile.seats,profile:profile,price:price,
                productBrand:displayBrand(product),capacity:capacity
            };
        }

        const metrics = realMetricFactors(product, profile, state);
        const environment = environmentFit(profile, state);
        const platform = platformFit(profile, state);
        const category = categoryFit(profile, state);
        const season = seasonFit(profile, state);
        const baseFeature = rideFeatureFit(metrics, state.ride);
        const personalFeature = personalizedFeatureFit(metrics, state);
        const pGate = priorityGate(metrics, state);

        /*
         * V13: многокритериальная модель решения с премиальным интерфейсом.
         * Геометрическое среднее не позволяет одному сильному параметру «перекупить»
         * слабую совместимость по среде, назначению или вместимости.
         */
        const baseFit = weightedGeometricMean([
            [environment,.22],
            [platform,.18],
            [category,.17],
            [baseFeature,.20],
            [season,.10],
            [capacity.value,.13]
        ], .5);

        const priorityWeight = activePriorityWeight(state);
        const prioritySat = metricPrioritySatisfaction(metrics,state,false);
        const personalizedFit = weightedGeometricMean([
            [environment,.22],
            [platform,.18],
            [category,.17],
            [personalFeature,.20],
            [season,.10],
            [capacity.value,.13],
            [prioritySat,priorityWeight]
        ], .5) * pGate;

        /*
         * V26: неполные данные не получают ложную точность. Вместо простого штрафа
         * стягиваем оценку к нейтральной середине: чем меньше подтверждённых полей,
         * тем меньше алгоритм уверен в экстремально высокой/низкой оценке.
         */
        const confidence = metrics.dataConfidence == null ? .5 : clamp01(metrics.dataConfidence);
        const reliability = .74 + confidence * .26;
        const shrinkFit = function(value){
            return clamp01(.5 + (clamp01(value) - .5) * reliability);
        };

        const baseFitScore = shrinkFit(baseFit) * 100;
        const fitScore = shrinkFit(personalizedFit) * 100;

        return {
            score:fitScore,
            fitScore:fitScore,
            baseFitScore:baseFitScore,
            primaryScore:baseFitScore,
            precisionScore:fitScore-baseFitScore,
            fatal:false,
            type:profile.type,
            seats:profile.seats,
            profile:profile,
            price:price,
            productBrand:displayBrand(product),
            metricRaw:metrics,
            capacity:capacity,
            components:{
                environment:environment,
                platform:platform,
                category:category,
                season:season,
                ride:personalFeature,
                baseRide:baseFeature,
                capacity:capacity.value,
                priorityGate:pGate,
                prioritySatisfaction:prioritySat
            }
        };
    }

    function matchPercent(scored, state) {
        if (!scored || scored.fatal) return 0;
        const confidence = scored.metricRaw && scored.metricRaw.dataConfidence != null
            ? clamp01(scored.metricRaw.dataConfidence)
            : .5;
        let percent = Math.round(Number(scored.fitScore) || 0);

        /*
         * Круг означает именно совпадение со сценарием. Цена отображается отдельно
         * и не может искусственно поднять/уронить этот процент. Низкая полнота данных
         * ограничивает максимум, чтобы 97% не появлялись из догадок.
         */
        let confidenceCap = 98;
        if (confidence < .30) confidenceCap = 82;
        else if (confidence < .45) confidenceCap = 87;
        else if (confidence < .60) confidenceCap = 92;
        else if (confidence < .75) confidenceCap = 95;
        percent = Math.min(percent, confidenceCap);
        return Math.max(35, Math.min(98, percent));
    }

    function metricSet(type, state, scored) {
        const raw = scored && scored.metricRaw ? scored.metricRaw : {power:.5,terrain:.5,comfort:.5,practical:.5};
        const toTen = function(value){ return Math.round(clamp01(value) * 100) / 10; };
        return {power:toTen(raw.power),terrain:toTen(raw.terrain),comfort:toTen(raw.comfort),universal:toTen(raw.practical)};
    }

    function metricDisplaySet(scored, state) {
        const metrics = metricSet(scored && scored.type, state, scored);
        const coverage = scored && scored.metricRaw && scored.metricRaw.coverage ? scored.metricRaw.coverage : {};
        const thresholds = {power:.45,terrain:.40,comfort:.36,practical:.36};
        return {
            power:(Number(coverage.power)||0) >= thresholds.power ? metrics.power : null,
            terrain:(Number(coverage.terrain)||0) >= thresholds.terrain ? metrics.terrain : null,
            comfort:(Number(coverage.comfort)||0) >= thresholds.comfort ? metrics.comfort : null,
            universal:(Number(coverage.practical)||0) >= thresholds.practical ? metrics.universal : null
        };
    }

    function reasonSet(product, state, scored) {
        const metrics = metricSet(scored.type, state, scored);
        const displayMetrics = metricDisplaySet(scored, state);
        const categoryName = String(product.category_name || product.section_name || '').trim();
        const terrainTitle = {
            forest:'Под лесные маршруты', mountain:'Под горный рельеф', mud:'Под грязь и бездорожье',
            stone:'Под каменистое покрытие', snow:'Под снежный маршрут', water:'Под воду', road:'Под дорогу'
        }[state.terrain] || 'Под выбранные условия';
        let realFacts = [];
        if (finiteNumber(product.ground_clearance)) realFacts.push('просвет ' + Math.round(product.ground_clearance) + ' мм');
        if (finiteNumber(product.power)) realFacts.push('мощность ' + Math.round(product.power) + ' л.с.');
        if (finiteNumber(product.track_length)) realFacts.push('гусеница ' + Math.round(product.track_length) + ' мм');
        if (finiteNumber(product.trunk_capacity)) realFacts.push('багаж ' + formatUiNumber(product.trunk_capacity, 1) + ' л');
        const terrainText = (categoryName ? 'Категория каталога: «' + categoryName + '». ' : '') +
            'Проходимость/управляемость рассчитана по реальным характеристикам модели' +
            (realFacts.length ? ': ' + realFacts.slice(0,2).join(', ') + '.' : '.') ;

        const rideTitle = {calm:'Комфорт важнее агрессии',active:'Баланс для активной езды',extreme:'Ставка на производительность',expedition:'Ставка на автономность'}[state.ride];
        const metricFacts = [];
        if (displayMetrics.power != null) metricFacts.push('мощность ' + formatMetricValue(displayMetrics.power) + '/10');
        if (displayMetrics.terrain != null) metricFacts.push((state.terrain === 'water' ? 'манёвренность ' : (state.terrain === 'road' ? 'управляемость ' : 'проходимость ')) + formatMetricValue(displayMetrics.terrain) + '/10');
        if (displayMetrics.comfort != null) metricFacts.push('комфорт ' + formatMetricValue(displayMetrics.comfort) + '/10');
        if (displayMetrics.universal != null) metricFacts.push('практичность ' + formatMetricValue(displayMetrics.universal) + '/10');
        const rideText = metricFacts.length
            ? 'По подтверждённым данным каталога: ' + metricFacts.join(', ') + '.'
            : 'Характер модели рассчитан по категории и доступным данным; точных характеристик в карточке недостаточно для числовой оценки.';

        const requested=parseInt(state.passengers,10)||1, price=parseInt(product.price,10)||0, budgetValue=parseInt(state.budget,10)||0;
        const seatCopy=scored.seats>0?' Вместимость: '+scored.seats+' чел.; нужно: '+requested+(requested>=3?'+':'')+'.':' Вместимость не заполнена — модель участвует только как вариант с пониженной уверенностью.';
        let scenarioTitle='Бюджет учтён', scenarioText='Цена применяется после отбора действительно подходящих по сценарию моделей.'+seatCopy;
        if(!price){scenarioTitle='Цена по запросу';scenarioText='Стоимость в каталоге не заполнена, поэтому такая модель не получает ценового преимущества.'+seatCopy;}
        else if(price<=budgetValue){scenarioTitle='В пределах бюджета';scenarioText='Модель укладывается в лимит. Запас: '+formatRubAmount(budgetValue-price)+'.'+seatCopy;}
        else{scenarioTitle='Ближайший разумный вариант';scenarioText='Среди близких по сценарию моделей это один из ближайших вариантов к бюджету. Превышение: '+formatRubAmount(price-budgetValue)+'.'+seatCopy;}
        const precisionItems=precisionActiveItems(state); if(precisionItems.length) scenarioText+=' Дополнительно учтено: '+precisionItems.join(', ')+'.';
        const confidence = scored.metricRaw && scored.metricRaw.dataConfidence != null ? clamp01(scored.metricRaw.dataConfidence) : .5;
        if (confidence < .55) scenarioText += ' Часть технических полей карточки не заполнена — уверенность расчёта автоматически снижена.';
        return [[terrainTitle,terrainText],[rideTitle,rideText],[scenarioTitle,scenarioText]];
    }
    function matchCaptionFor(percent) {
        if (percent >= 95) return 'Практически идеально';
        if (percent >= 90) return 'Отлично подходит';
        if (percent >= 83) return 'Очень хорошее совпадение';
        if (percent >= 74) return 'Хорошо подходит';
        if (percent >= 64) return 'Подходит с компромиссами';
        return 'Слабое совпадение';
    }

    function formatRub(value) {
        const n = parseInt(value, 10) || 0;
        if (!n) return 'Цена по запросу';
        return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(n) + ' ₽';
    }

    function formatRubAmount(value) {
        const n = Math.max(0, parseInt(value, 10) || 0);
        return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(n) + ' ₽';
    }

    function formatShortRub(value) {
        const n = parseInt(value, 10) || 0;
        if (n >= 1000000) {
            const m = Math.round(n / 100000) / 10;
            return String(m).replace('.', ',') + ' млн ₽';
        }
        return Math.round(n / 1000) + ' тыс. ₽';
    }

    function setBudgetVisual() {
        if (!budget) return;
        const min = parseInt(budget.min, 10) || 0;
        const max = parseInt(budget.max, 10) || 1;
        const value = parseInt(budget.value, 10) || min;
        const progress = ((value - min) / Math.max(1, (max - min))) * 100;
        budget.style.setProperty('--progress', Math.round(progress * 10) / 10 + '%');
        if (budgetLabel) budgetLabel.textContent = formatShortRub(value);

        const minNode = root.querySelector('[data-tlsc-budget-min]');
        const midNode = root.querySelector('[data-tlsc-budget-mid]');
        const maxNode = root.querySelector('[data-tlsc-budget-max]');
        if (minNode) minNode.textContent = formatShortRub(min);
        if (midNode) midNode.textContent = formatShortRub(Math.round(((min + max) / 2) / 250000) * 250000);
        if (maxNode) maxNode.textContent = formatShortRub(max);
    }

    function updateBudgetFit(product, state) {
        const price = parseInt(product && product.price, 10) || 0;
        const limit = parseInt(state && state.budget, 10) || 0;
        if (!budgetFitWrap || !budgetFit || !budgetDelta) return;

        budgetFitWrap.classList.remove('is-ok', 'is-near', 'is-over', 'is-unknown');
        if (!price || !limit) {
            budgetFitWrap.classList.add('is-unknown');
            budgetFit.textContent = 'Цена по запросу';
            budgetDelta.textContent = 'стоимость не участвует в ценовой части оценки';
            return;
        }

        if (price <= limit) {
            budgetFitWrap.classList.add('is-ok');
            budgetFit.textContent = 'В бюджете';
            budgetDelta.textContent = 'запас ' + formatRubAmount(limit - price);
            return;
        }

        const over = price - limit;
        const ratio = price / limit;
        budgetFitWrap.classList.add(ratio <= 1.12 ? 'is-near' : 'is-over');
        budgetFit.textContent = ratio <= 1.12 ? 'Немного выше' : 'Выше бюджета';
        budgetDelta.textContent = '+' + formatRubAmount(over);
    }


    function updateMetrics(metrics, state, scored) {
        const displayMetrics = metricDisplaySet(scored, state);
        Object.keys(metrics).forEach(function (key) {
            const bar = root.querySelector('[data-tlsc-metric="' + key + '"]');
            const valueNode = root.querySelector('[data-tlsc-metric-value="' + key + '"]');
            const row = bar ? bar.closest('.tlsc-metric') : null;
            const value = displayMetrics[key];
            const known = value !== null && value !== undefined && Number.isFinite(Number(value));
            if (bar) bar.style.setProperty('--value', known ? formatUiNumber(value * 10, 1).replace(',', '.') + '%' : '0%');
            if (valueNode) valueNode.textContent = known ? formatMetricValue(value) + '/10' : '—';
            if (row) row.classList.toggle('is-unknown', !known);
        });

        if (metricLabelTerrain) {
            if (state.terrain === 'water') metricLabelTerrain.textContent = 'Манёвренность';
            else if (state.terrain === 'road') metricLabelTerrain.textContent = 'Управляемость';
            else metricLabelTerrain.textContent = 'Проходимость';
        }
    }

    function updateReasons(reasons) {
        reasons.forEach(function (reason, index) {
            if (reasonTitles[index]) reasonTitles[index].textContent = reason[0];
            if (reasonTexts[index]) reasonTexts[index].textContent = reason[1];
        });
    }

    function candidateTieBreak(a, b) {
        const availability = (String(b.product.available) !== 'N' ? 1 : 0) - (String(a.product.available) !== 'N' ? 1 : 0);
        if (availability) return availability;

        const ac = a.scored && a.scored.metricRaw ? Number(a.scored.metricRaw.dataConfidence) || 0 : 0;
        const bc = b.scored && b.scored.metricRaw ? Number(b.scored.metricRaw.dataConfidence) || 0 : 0;
        if (Math.abs(ac-bc) > .03) return bc-ac;

        const image = (b.product.image ? 1 : 0) - (a.product.image ? 1 : 0);
        if (image) return image;

        const ap = parseInt(a.product.price,10)||0, bp = parseInt(b.product.price,10)||0;
        if (ap && bp && ap !== bp) return ap - bp;

        const sortDiff = (parseInt(a.product.sort,10)||500) - (parseInt(b.product.sort,10)||500);
        if (sortDiff) return sortDiff;

        return (parseInt(a.product.id,10)||0) - (parseInt(b.product.id,10)||0);
    }


    function fitComparator(a, b) {
        const diff = b.scored.fitScore - a.scored.fitScore;
        /* Разница до 1.25 балла — практически ничья: выбираем более подтверждённую карточку. */
        if (Math.abs(diff) > 1.25) return diff;
        const tie = candidateTieBreak(a,b);
        if (tie) return tie;
        return diff;
    }

    function chooseBestAffordable(candidates, state) {
        if (!candidates.length) return null;
        const sorted = candidates.slice().sort(fitComparator);
        const topFit = sorted[0].scored.fitScore;

        /*
         * При почти одинаковой пригодности считаем варианты технически близкими.
         * Если пользователь поставил «Максимум», сначала соблюдаем этот явный
         * приоритет, затем наличие и только потом более низкую цену.
         */
        const equivalent = sorted.filter(function(entry){
            return entry.scored.fitScore >= topFit - 1.4;
        });
        const hasMaximum = [
            state.priorityPower,state.priorityTerrain,state.priorityComfort,state.priorityPractical
        ].some(function(value){ return precisionLevel(value) === 2; });

        equivalent.sort(function(a,b){
            if (hasMaximum) {
                const as=prioritySatisfaction(a,state,true), bs=prioritySatisfaction(b,state,true);
                if (Math.abs(as-bs)>.02) return bs-as;
            }
            const availability = (String(b.product.available)!=='N'?1:0) - (String(a.product.available)!=='N'?1:0);
            if (availability) return availability;
            const ap=parseInt(a.product.price,10)||Number.MAX_SAFE_INTEGER;
            const bp=parseInt(b.product.price,10)||Number.MAX_SAFE_INTEGER;
            if (ap!==bp) return ap-bp;
            return fitComparator(a,b);
        });
        return equivalent[0] || sorted[0];
    }

    function adaptiveScoreBand(entries, scoreKey, options) {
        options = options || {};
        if (!entries || !entries.length) return [];
        const getter = function(entry){ return Number(entry && entry.scored && entry.scored[scoreKey]); };
        const scores = entries.map(getter).filter(Number.isFinite);
        if (!scores.length) return [];
        const best = Math.max.apply(null, scores);
        const delta = Number(options.delta) || 8;
        const quantile = Number(options.quantile);
        const minScore = Number.isFinite(Number(options.minScore)) ? Number(options.minScore) : 0;
        let floor = Math.max(minScore, best - delta);
        if (scores.length >= (Number(options.quantileMinSize) || 16) && Number.isFinite(quantile)) {
            floor = Math.max(floor, percentile(scores, quantile));
        }
        let band = entries.filter(function(entry){
            const score = getter(entry);
            return Number.isFinite(score) && score >= floor;
        });
        const minKeep = Math.min(entries.length, Math.max(1, Number(options.minKeep) || 4));
        if (band.length < minKeep) {
            band = entries.slice().sort(function(a,b){
                const d = getter(b) - getter(a);
                return Math.abs(d) > .001 ? d : candidateTieBreak(a,b);
            }).slice(0,minKeep);
        }
        return band;
    }

    function prioritySatisfaction(entry, state, onlyMaximum) {
        const metrics = entry && entry.scored && entry.scored.metricRaw ? entry.scored.metricRaw : null;
        if (!metrics) return .5;
        return metricPrioritySatisfaction(metrics,state,!!onlyMaximum);
    }

    function chooseSoftBudgetCandidate(finalBand, scenarioPool, state) {
        if (!finalBand.length) return null;
        const budgetValue = Math.max(0, parseInt(state.budget,10)||0);
        const pricedFinal = finalBand.filter(function(entry){ return (parseInt(entry.product.price,10)||0) > 0; });
        const unknownFinal = finalBand.filter(function(entry){ return (parseInt(entry.product.price,10)||0) <= 0; });

        if (!budgetValue) {
            return chooseBestAffordable(pricedFinal.length ? pricedFinal : unknownFinal,state);
        }

        const affordableFinal = pricedFinal.filter(function(entry){
            return (parseInt(entry.product.price,10)||0) <= budgetValue;
        });
        if (affordableFinal.length) return chooseBestAffordable(affordableFinal,state);

        const affordableScenario = scenarioPool.filter(function(entry){
            const price = parseInt(entry.product.price,10)||0;
            return price > 0 && price <= budgetValue;
        });
        const bestAffordableScenario = affordableScenario.length ? chooseBestAffordable(affordableScenario,state) : null;

        /* До +15% — допустимый мягкий выход за бюджет среди настоящих финалистов. */
        const nearBudget = pricedFinal.filter(function(entry){
            return (parseInt(entry.product.price,10)||0) <= budgetValue * 1.15;
        });
        if (nearBudget.length) {
            const near = chooseBestAffordable(nearBudget,state);
            if (!bestAffordableScenario || near.scored.fitScore >= bestAffordableScenario.scored.fitScore - 2.5) return near;
        }

        /*
         * +15…25% допускаем только когда прирост сценарного fit действительно заметен.
         * Иначе главным становится подтверждённый вариант внутри бюджета.
         */
        const stretch = pricedFinal.filter(function(entry){
            const price = parseInt(entry.product.price,10)||0;
            return price > budgetValue * 1.15 && price <= budgetValue * 1.25;
        });
        if (stretch.length) {
            const stretchBest = chooseBestAffordable(stretch,state);
            if (!bestAffordableScenario || stretchBest.scored.fitScore >= bestAffordableScenario.scored.fitScore + 6) {
                return stretchBest;
            }
        }

        if (bestAffordableScenario) {
            const bestFinalScore = finalBand[0] ? Number(finalBand[0].scored.fitScore)||0 : 0;
            if (bestAffordableScenario.scored.fitScore >= Math.max(48,bestFinalScore-14)) return bestAffordableScenario;
            /* Даже при большем разрыве >25% не перекупает бюджет: пользователь увидит дорогую модель в альтернативах. */
            return bestAffordableScenario;
        }

        /* Если во всём сценарном пуле вообще нет техники в бюджете — показываем ближайший реальный вариант. */
        if (pricedFinal.length) {
            const minPrice = Math.min.apply(null, pricedFinal.map(function(entry){
                return parseInt(entry.product.price,10)||Number.MAX_SAFE_INTEGER;
            }));
            const nearest = pricedFinal.filter(function(entry){
                return (parseInt(entry.product.price,10)||Number.MAX_SAFE_INTEGER) <= minPrice * 1.04;
            });
            return chooseBestAffordable(nearest,state);
        }
        return chooseBestAffordable(unknownFinal,state);
    }

    function shortlistFamilyKey(product) {
        const type = detectType(product,'');
        const category = categoryKey(product,type);
        const collection = normalize(product && product.collection);
        const engine = normalize(product && product.engine_model);
        return {
            type:type,
            category:category,
            collection:collection,
            engine:engine,
            brand:inferredBrandKey(product)
        };
    }

    function buildJourneyShortlist(winner, candidates, state) {
        if (!winner || !winner.product) return [];
        const winnerId = String(winner.product.id);
        const unique = [];
        const seenIds = new Set();
        (candidates || []).forEach(function(entry){
            if (!entry || !entry.product) return;
            const id = String(entry.product.id || '');
            if (!id || seenIds.has(id)) return;
            seenIds.add(id);
            unique.push(entry);
        });
        if (!seenIds.has(winnerId)) unique.unshift(winner);

        const selected = [winner];
        const selectedIds = new Set([winnerId]);
        const winnerFit = Number(winner.scored && winner.scored.fitScore) || 0;
        while (selected.length < 4) {
            let best = null, bestValue = -Infinity;
            unique.forEach(function(entry){
                const id = String(entry.product.id || '');
                if (!id || selectedIds.has(id)) return;
                const entryFit = Number(entry.scored && entry.scored.fitScore) || 0;
                if (entryFit < Math.max(48,winnerFit-8)) return;
                const meta = shortlistFamilyKey(entry.product);
                const conf = entry.scored && entry.scored.metricRaw ? Number(entry.scored.metricRaw.dataConfidence)||0 : 0;
                const price = parseInt(entry.product.price,10)||0;
                let diversity = 0;
                selected.forEach(function(chosen){
                    const other = shortlistFamilyKey(chosen.product);
                    if (meta.collection && other.collection && meta.collection !== other.collection) diversity += 1.8;
                    if (meta.category !== other.category) diversity += 1.25;
                    if (meta.brand && other.brand && meta.brand !== other.brand) diversity += .45;
                    if (meta.engine && other.engine && meta.engine !== other.engine) diversity += .35;
                });
                if (price && winner.product.price) {
                    const ratio = price / Math.max(1,parseInt(winner.product.price,10)||1);
                    if (ratio <= .90 || ratio >= 1.10) diversity += .55;
                }
                const imageBonus = entry.product.image ? .35 : 0;
                const value = (Number(entry.scored.fitScore)||0) + diversity + conf*.8 + imageBonus;
                if (value > bestValue) { bestValue=value; best=entry; }
            });
            if (!best) break;
            selected.push(best);
            selectedIds.add(String(best.product.id));
        }
        return selected;
    }

    function chooseProduct(state) {
        lastSelectionJourney = {catalog:products.length,compatible:0,constrained:0,scenario:0,finalists:0,result:0,shortlist:[]};
        if (!products.length) return null;

        /* 1. Физическая и сценарная совместимость. */
        let ranked = products.map(function(product){
            const scored = scoreProduct(product,state);
            return {product:product,scored:scored};
        }).filter(function(entry){ return !entry.scored.fatal; });
        lastSelectionJourney.compatible = ranked.length;

        /* 2. Явные ограничения пользователя — жёсткие и предсказуемые. */
        if (state.availableOnly) {
            ranked = ranked.filter(function(entry){ return String(entry.product.available) !== 'N'; });
        }
        if (state.brand) {
            ranked = ranked.filter(function(entry){ return productMatchesBrand(entry.product,state.brand); });
        }
        if (!ranked.length) return null;

        /*
         * 3. Вместимость.
         * Для 2+ человек неизвестное число мест не подменяет подтверждённые данные.
         * Если в этой выборке вообще есть известная вместимость, но достаточных мест нет,
         * честнее показать отсутствие совпадения, чем рекомендовать потенциально тесную модель.
         */
        const requestedSeats = parseInt(state.passengers,10) || 1;
        if (requestedSeats >= 2) {
            const knownEnough = ranked.filter(function(entry){
                return entry.scored.capacity && entry.scored.capacity.known && entry.scored.capacity.enough === true;
            });
            const anyKnown = ranked.some(function(entry){
                return entry.scored.capacity && entry.scored.capacity.known;
            });
            if (knownEnough.length) ranked = knownEnough;
            else if (anyKnown) return null;
            else ranked = ranked.filter(function(entry){
                return entry.scored.capacity && !entry.scored.capacity.known;
            });
        }
        if (!ranked.length) return null;
        lastSelectionJourney.constrained = ranked.length;

        /*
         * 4. Базовый сценарный коридор строится без дополнительных приоритетов.
         * Это защищает тип техники, назначение, сезон и вместимость от переопределения
         * одной желаемой характеристикой.
         */
        ranked.sort(function(a,b){
            const d = b.scored.baseFitScore - a.scored.baseFitScore;
            return Math.abs(d) > .001 ? d : candidateTieBreak(a,b);
        });

        const bestBaseScore = ranked[0].scored.baseFitScore;
        if (!Number.isFinite(bestBaseScore) || bestBaseScore < 48) return null;

        const maxPriorityKeys = [
            state.priorityPower,state.priorityTerrain,state.priorityComfort,state.priorityPractical
        ].filter(function(v){ return precisionLevel(v) === 2; }).length;

        let scenarioPool = adaptiveScoreBand(ranked,'baseFitScore',{
            minScore:48,
            delta:maxPriorityKeys ? 7.0 : 8.5,
            quantile:maxPriorityKeys ? .82 : .76,
            quantileMinSize:16,
            minKeep:4
        });
        if (!scenarioPool.length) return null;
        lastSelectionJourney.scenario = scenarioPool.length;

        /*
         * «Максимум» — контекстный запрос на верхнюю часть реально достижимого
         * диапазона характеристики среди уже подходящих моделей.
         */
        if (maxPriorityKeys) {
            const withSat = scenarioPool.map(function(entry){
                return {entry:entry,sat:prioritySatisfaction(entry,state,true)};
            }).sort(function(a,b){
                const d=b.sat-a.sat;
                if (Math.abs(d)>.001) return d;
                return b.entry.scored.baseFitScore-a.entry.scored.baseFitScore;
            });
            const bestSat = withSat[0] ? withSat[0].sat : 1;
            let preferred = withSat.filter(function(x){ return x.sat >= bestSat - .18; }).map(function(x){ return x.entry; });
            if (preferred.length < 3) preferred = withSat.slice(0,Math.min(3,withSat.length)).map(function(x){ return x.entry; });
            if (preferred.length) scenarioPool = preferred;
        }
        lastSelectionJourney.scenario = scenarioPool.length;

        /* 5. Персонализированный fit после реального изменения весов характеристик. */
        scenarioPool.sort(fitComparator);
        let finalBand = adaptiveScoreBand(scenarioPool,'fitScore',{
            minScore:48,
            delta:maxPriorityKeys ? 4.5 : 5.5,
            quantile:maxPriorityKeys ? .90 : .87,
            quantileMinSize:12,
            minKeep:4
        }).sort(fitComparator);
        if (!finalBand.length) finalBand = scenarioPool.slice(0,Math.min(4,scenarioPool.length));
        /*
         * bestFinalScore нужен дальше не только для UI, но и для budget/alternatives.
         * В V26 при переходе на adaptiveScoreBand это объявление случайно было удалено,
         * из-за чего первый recalculate() падал с ReferenceError и весь интерфейс
         * переставал реагировать на изменения. Держим значение в общей области chooseProduct().
         */
        const bestFinalScore = finalBand[0] ? (Number(finalBand[0].scored.fitScore) || 0) : 0;
        lastSelectionJourney.finalists = finalBand.length;

        const budgetValue = Math.max(0, parseInt(state.budget,10) || 0);
        let winner = null;
        let pool = finalBand;
        let journeyCandidatePool = finalBand.slice();

        /*
         * 6. Бюджет применяется последним.
         * Строгий режим ищет лучшую модель во всём сценарном пуле внутри лимита,
         * а не только среди самых дорогих/топовых вариантов.
         */
        if (state.strictBudget) {
            pool = scenarioPool.filter(function(entry){
                const price=parseInt(entry.product.price,10)||0;
                return price>0 && price<=budgetValue;
            });
            journeyCandidatePool = pool.slice();
            if (!pool.length) {
                lastSelectionJourney.finalists = 0;
                lastSelectionJourney.shortlist = [];
                return null;
            }
            winner = chooseBestAffordable(pool,state);
        } else {
            /*
             * В мягком режиме бюджет иногда возвращает близкий по сценарию вариант
             * из scenarioPool, даже если он чуть ниже верхнего finalBand. Для блока
             * «Как мы пришли…» считаем финалистами объединение обеих реально
             * рассматриваемых групп — победитель всегда находится внутри этого числа.
             */
            const bestFinalForJourney = finalBand[0] ? finalBand[0].scored.fitScore : 0;
            const affordableJourney = scenarioPool.filter(function(entry){
                const price=parseInt(entry.product.price,10)||0;
                return price>0 && price<=budgetValue && entry.scored.fitScore >= Math.max(48,bestFinalForJourney-10);
            });
            journeyCandidatePool = finalBand.concat(affordableJourney);
            winner = chooseSoftBudgetCandidate(finalBand,scenarioPool,state);
        }

        if (!winner) {
            lastSelectionJourney.finalists = 0;
            lastSelectionJourney.shortlist = [];
            return null;
        }
        const journeyShortlist = buildJourneyShortlist(winner, journeyCandidatePool, state);
        lastSelectionJourney.finalists = journeyShortlist.length;
        lastSelectionJourney.shortlist = journeyShortlist;
        lastSelectionJourney.result = 1;

        const outputRanked = state.strictBudget
            ? ranked.filter(function(entry){
                const p=parseInt(entry.product.price,10)||0;
                return p>0 && p<=budgetValue;
            })
            : ranked;

        return {
            product:winner.product,
            scored:winner.scored,
            ranked:outputRanked,
            scenarioPool:scenarioPool,
            pool:pool,
            bestScore:bestFinalScore,
            bestBaseScore:bestBaseScore,
            journey:Object.assign({}, lastSelectionJourney)
        };
    }

    function scenarioName(state) {
        const names = {
            water: { calm: 'Комфорт на воде', active: 'Активная вода', extreme: 'Спортивная вода', expedition: 'Дальний водный маршрут' },
            snow: { calm: 'Спокойный снег', active: 'Активный снег', extreme: 'Горный снег', expedition: 'Снежная экспедиция' },
            road: { calm: 'Дорожный туризм', active: 'Активная дорога', extreme: 'Динамичная дорога', expedition: 'Дальний маршрут' },
            mud: { calm: 'Уверенное бездорожье', active: 'Активная грязь', extreme: 'Экстремальная грязь', expedition: 'Тяжёлая экспедиция' },
            mountain: { calm: 'Горный маршрут', active: 'Активные горы', extreme: 'Экстремальные горы', expedition: 'Горная экспедиция' },
            stone: { calm: 'Сложный рельеф', active: 'Каменистый маршрут', extreme: 'Каменный штурм', expedition: 'Экспедиционный рельеф' },
            forest: { calm: 'Спокойный маршрут', active: 'Активный маршрут', extreme: 'Спортивный лес', expedition: 'Лесная экспедиция' }
        };
        return (names[state.terrain] && names[state.terrain][state.ride]) || 'Персональный сценарий';
    }

    function updateScene(state) {
        root.dataset.terrain = state.terrain;
        root.dataset.ride = state.ride;
        root.dataset.season = state.season;
        root.dataset.passengers = state.passengers;
        syncScenarioStrip(state);
        if (budget) {
            const min = parseInt(budget.min, 10) || 0;
            const max = parseInt(budget.max, 10) || 1;
            const pct = ((state.budget - min) / Math.max(1, max - min)) * 100;
            root.style.setProperty('--budget-level', Math.round(Math.max(0, Math.min(100, pct)) * 10) / 10 + '%');
        }
    }


    function animatePriceValue(value, instant) {
        value = Math.max(0, parseInt(value, 10) || 0);
        if (!priceNode) return;
        if (priceRaf) cancelAnimationFrame(priceRaf);
        priceRaf = null;
        if (!value) {
            priceNode.textContent = 'Цена по запросу';
            lastDisplayedPrice = 0;
            return;
        }
        if (instant || reduceMotion || !lastDisplayedPrice) {
            priceNode.textContent = formatRub(value);
            lastDisplayedPrice = value;
            return;
        }
        const from = lastDisplayedPrice;
        const started = performance.now();
        const duration = 280;
        function frame(now) {
            const t = Math.min(1, (now - started) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.round((from + (value - from) * eased) / 1000) * 1000;
            priceNode.textContent = formatRub(current);
            if (t < 1) priceRaf = requestAnimationFrame(frame);
            else { lastDisplayedPrice = value; priceRaf = null; }
        }
        priceRaf = requestAnimationFrame(frame);
    }

    function animateMatch(percent, instant) {
        if (matchRing) matchRing.style.setProperty('--match', percent);
        if (!matchNode) return;
        if (instant || reduceMotion) {
            matchNode.textContent = percent;
            lastMatch = percent;
            return;
        }
        const from = Number.isFinite(lastMatch) ? lastMatch : percent;
        const start = performance.now();
        const duration = 380;
        function frame(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            matchNode.textContent = Math.round(from + (percent - from) * eased);
            if (t < 1) requestAnimationFrame(frame);
            else lastMatch = percent;
        }
        requestAnimationFrame(frame);
    }





    function profileClamp(value) {
        value = Number(value);
        if (!Number.isFinite(value)) return 50;
        return Math.max(12, Math.min(100, Math.round(value)));
    }

    function profileRadarCoordinates(values) {
        const list = [values.drive, values.terrain, values.comfort, values.range, values.practical];
        const cx = 150, cy = 140, maxR = 100;
        return list.map(function (value, index) {
            const angle = (-90 + index * 72) * Math.PI / 180;
            const radius = maxR * (profileClamp(value) / 100);
            return {
                x: cx + Math.cos(angle) * radius,
                y: cy + Math.sin(angle) * radius
            };
        });
    }

    function profileRadarValues(selection, state) {
        if (!selection || !selection.scored) {
            return { drive:12, terrain:12, comfort:12, range:12, practical:12 };
        }

        const product = selection.product || {};
        const scored = selection.scored;
        const metrics = metricSet(scored.type, state, scored);
        const components = scored.components || {};
        const profile = scored.profile || getProfile(product);
        const rideFit = clamp01(components.ride == null ? .5 : components.ride);

        /*
         * Динамика — не только л.с.: учитываем итоговую пригодность характера
         * техники к выбранному темпу. Основой всё равно остаётся реальная power-метрика.
         */
        const drive = ((metrics.power * .78) + (rideFit * 10 * .22)) * 10;

        /* Рельеф / комфорт / практичность уже рассчитаны из реальных свойств карточки. */
        const terrain = metrics.terrain * 10;
        const comfort = metrics.comfort * 10;
        const practical = metrics.universal * 10;

        /*
         * Автономность: при наличии объёма бака используем его положение внутри
         * ассортимента того же типа техники; при неполных данных осторожно
         * опираемся на практичность/комфорт, не выдумывая абсолютный запас хода.
         */
        const tankNorm = normField(product, profile.type, 'tank_capacity', false);
        const range = tankNorm == null
            ? (metrics.universal * .68 + metrics.comfort * .32) * 10
            : ((tankNorm * 10 * .68) + (metrics.universal * .22) + (metrics.comfort * .10)) * 10;

        return {
            drive: profileClamp(drive),
            terrain: profileClamp(terrain),
            comfort: profileClamp(comfort),
            range: profileClamp(range),
            practical: profileClamp(practical)
        };
    }

    function profileHeadline(values) {
        const entries = [
            ['drive', values.drive, 'Выраженный драйв'],
            ['terrain', values.terrain, 'Акцент на проходимость'],
            ['comfort', values.comfort, 'Комфортный характер'],
            ['range', values.range, 'Дальний сценарий'],
            ['practical', values.practical, 'Практичный профиль']
        ].sort(function (a, b) { return b[1] - a[1]; });

        const spread = entries[0][1] - entries[entries.length - 1][1];
        if (spread <= 17) return 'Сбалансированный характер';
        return entries[0][2];
    }

    function renderRadarProfile(selection, state) {
        const values = profileRadarValues(selection, state || currentState || getState());
        const coords = profileRadarCoordinates(values);

        if (profileShape) {
            profileShape.setAttribute('points', coords.map(function (point) {
                return point.x.toFixed(1) + ',' + point.y.toFixed(1);
            }).join(' '));
        }

        profileDots.forEach(function (dot, index) {
            const point = coords[index];
            if (!point) return;
            dot.setAttribute('cx', point.x.toFixed(1));
            dot.setAttribute('cy', point.y.toFixed(1));
        });

        if (!selection) {
            if (profileTitle) profileTitle.textContent = 'Нет данных для профиля';
            if (profileText) profileText.textContent = 'Измените параметры, чтобы увидеть характер подходящей модели.';
        } else {
            if (profileTitle) profileTitle.textContent = profileHeadline(values);
            if (profileText) {
                profileText.textContent = 'Форма строится по реальным характеристикам выбранной модели. Чем дальше вершина от центра, тем сильнее выражено соответствующее качество.';
            }
        }

        if (profileLegend) {
            profileLegend.innerHTML = '';
            [
                ['Динамика', values.drive],
                ['Проходимость', values.terrain],
                ['Комфорт', values.comfort],
                ['Автономность', values.range],
                ['Практичность', values.practical]
            ].forEach(function (item) {
                const node = document.createElement('div');
                node.className = 'tlsc-profile-stat';
                const value10 = (item[1] / 10).toLocaleString('ru-RU', { maximumFractionDigits:1 });
                node.innerHTML = '<span>' + item[0] + '</span><i><b style="width:' + item[1] + '%"></b></i><strong>' + value10 + '<small>/10</small></strong>';
                profileLegend.appendChild(node);
            });
        }
    }

    function sampleEntries(entries, maxCount) {
        if (entries.length <= maxCount) return entries.slice();
        const sampled = [];
        const step = (entries.length - 1) / (maxCount - 1);
        for (let i = 0; i < maxCount; i++) sampled.push(entries[Math.round(i * step)]);
        return sampled;
    }

    function renderMarket(selection, state) {
        const min = budget ? (parseInt(budget.min, 10) || 0) : 0;
        const max = budget ? (parseInt(budget.max, 10) || 1) : 1;
        const priced = (selection.ranked || []).filter(function (entry) {
            const p = parseInt(entry.product.price, 10) || 0;
            return entry.scored.fitScore >= selection.bestScore - 18 && p >= min && p <= max;
        }).sort(function (a,b) { return (parseInt(a.product.price,10)||0) - (parseInt(b.product.price,10)||0); });
        const visible = sampleEntries(priced, 36);
        const affordableCount = priced.filter(function (entry) { return (parseInt(entry.product.price,10)||0) <= state.budget; }).length;
        if (budgetMarketLabel) budgetMarketLabel.textContent = priced.length + ' подходящих моделей · ' + affordableCount + ' в бюджете';
        if (budgetMapLabel) budgetMapLabel.textContent = formatShortRub(state.budget);
        const cursorLeft = ((state.budget - min) / Math.max(1, max - min)) * 100;
        if (budgetCursor) budgetCursor.style.left = Math.max(0, Math.min(100, cursorLeft)) + '%';

        function fill(container, detailed) {
            if (!container) return;
            container.innerHTML = '';
            const frag = document.createDocumentFragment();
            visible.forEach(function (entry) {
                const price = parseInt(entry.product.price, 10) || 0;
                const left = ((price - min) / Math.max(1, max - min)) * 100;
                const dot = document.createElement(detailed ? 'button' : 'i');
                if (detailed) dot.type = 'button';
                dot.className = detailed ? 'tlsc-budget-map-point' : 'tlsc-market-dot';
                if (price <= state.budget) dot.classList.add('is-affordable');
                if (String(entry.product.id) === String(selection.product.id)) dot.classList.add('is-current');
                dot.style.left = Math.max(0, Math.min(100, left)) + '%';
                if (detailed) dot.dataset.price = String(price);
                dot.title = (entry.product.name || 'Модель') + ' · ' + formatRub(price);
                if (detailed) {
                    const label = document.createElement('span');
                    label.textContent = (entry.product.name || 'Модель') + ' · ' + formatShortRub(price);
                    dot.appendChild(label);
                }
                frag.appendChild(dot);
            });
            container.appendChild(frag);
        }
        fill(marketMiniPoints, false);
        fill(budgetMapPoints, true);
    }

    function candidateRecord(entry, state) {
        const metrics = metricSet(entry.scored.type, state, entry.scored);
        const displayMetrics = metricDisplaySet(entry.scored, state);
        return { entry:entry, metrics:metrics, displayMetrics:displayMetrics, match:matchPercent(entry.scored,state), price:parseInt(entry.product.price,10)||0, role:'' };
    }

    function buildAlternatives(selection, state) {
        const mainMatch = matchPercent(selection.scored, state);
        const mainPrice = parseInt(selection.product.price, 10) || 0;
        const records = (selection.ranked || []).filter(function (entry) {
            return String(entry.product.id) !== String(selection.product.id) && entry.scored.fitScore >= selection.scored.fitScore - 9;
        }).map(function (entry) { return candidateRecord(entry, state); }).filter(function (record) {
            return record.match >= mainMatch - 9;
        });
        const chosen = [];
        const used = new Set();
        function pick(role, sorter, filter) {
            const pool = records.filter(function (r) { return !used.has(String(r.entry.product.id)) && (!filter || filter(r)); }).sort(sorter);
            if (!pool.length) return;
            const best = pool[0]; best.role = role; used.add(String(best.entry.product.id)); chosen.push(best);
        }
        pick('Выгоднее', function(a,b){
            const as = (mainPrice && a.price && a.price < mainPrice ? (mainPrice-a.price)/100000*2 : -20) + a.match;
            const bs = (mainPrice && b.price && b.price < mainPrice ? (mainPrice-b.price)/100000*2 : -20) + b.match;
            return bs-as;
        }, function(r){ return r.price>0 && (!mainPrice || r.price < mainPrice) && r.price <= state.budget; });
        pick('Больше возможностей', function(a,b){ return ((b.metrics.power+b.metrics.terrain)*12+b.match)-((a.metrics.power+a.metrics.terrain)*12+a.match); }, function(r){ return (!r.price || r.price <= state.budget*1.3) && (r.displayMetrics.power != null || r.displayMetrics.terrain != null); });
        pick('Больше комфорта', function(a,b){ return ((b.metrics.comfort*16+b.metrics.universal*7)+b.match)-((a.metrics.comfort*16+a.metrics.universal*7)+a.match); }, function(r){ return (!r.price || r.price <= Math.max(state.budget * 1.3, mainPrice * 1.2)) && (r.displayMetrics.comfort != null || r.displayMetrics.universal != null); });
        if (chosen.length < 3) pick('Ближайшая альтернатива', function(a,b){ return b.entry.scored.score-a.entry.scored.score; }, function(r){ return !r.price || r.price <= Math.max(state.budget*1.5, mainPrice*1.35); });
        return chosen.slice(0,3);
    }

    function formatUiNumber(value, maxDecimals) {
        const n = Number(value);
        if (!Number.isFinite(n)) return '0';
        const decimals = Math.max(0, Math.min(2, Number(maxDecimals) || 0));
        const factor = Math.pow(10, decimals);
        const rounded = Math.round((n + Number.EPSILON) * factor) / factor;
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals
        }).format(rounded);
    }

    function formatMetricValue(value) {
        if (value === null || value === undefined || !Number.isFinite(Number(value))) return '—';
        return formatUiNumber(value, 1);
    }

    function diffText(value, suffix) {
        const raw = Number(value);
        if (!Number.isFinite(raw)) return 'нет данных';
        const decimals = suffix === '%' ? 0 : 1;
        const factor = Math.pow(10, decimals);
        const rounded = Math.round((raw + Number.EPSILON) * factor) / factor;
        if (Math.abs(rounded) < (decimals ? 0.05 : 0.5)) return 'без изменений';
        return (rounded > 0 ? '+' : '−') + formatUiNumber(Math.abs(rounded), decimals) + suffix;
    }

    function renderAlternative(index, selection, state) {
        const alt = currentAlternatives[index];
        const mainMetrics = metricSet(selection.scored.type, state, selection.scored);
        const mainDisplayMetrics = metricDisplaySet(selection.scored, state);
        const mainMatch = matchPercent(selection.scored,state);
        const mainPrice = parseInt(selection.product.price,10)||0;
        const mainImg = root.querySelector('[data-tlsc-compare-main-image]');
        const mainName = root.querySelector('[data-tlsc-compare-main-name]');
        const mainPriceNode = root.querySelector('[data-tlsc-compare-main-price]');
        if (mainImg) { const src=String(selection.product.image||''); if(src){mainImg.src=src;mainImg.alt=selection.product.name||'';mainImg.hidden=false}else{mainImg.removeAttribute('src');mainImg.alt='';mainImg.hidden=true} }
        if (mainName) mainName.textContent=displayProductTitle(selection.product);
        if (mainPriceNode) mainPriceNode.textContent=formatRub(mainPrice);
        if (!alt) return;
        const p=alt.entry.product;
        const altImg=root.querySelector('[data-tlsc-compare-alt-image]');
        const altName=root.querySelector('[data-tlsc-compare-alt-name]');
        const altPrice=root.querySelector('[data-tlsc-compare-alt-price]');
        const altRole=root.querySelector('[data-tlsc-compare-role]');
        const altLink=root.querySelector('[data-tlsc-compare-alt-link]');
        if(altImg){const src=String(p.image||'');if(src){altImg.src=src;altImg.alt=p.name||'';altImg.hidden=false}else{altImg.removeAttribute('src');altImg.alt='';altImg.hidden=true}} if(altName)altName.textContent=displayProductTitle(p); if(altPrice)altPrice.textContent=formatRub(alt.price); if(altRole)altRole.textContent=alt.role; if(altLink)altLink.href=p.url||'/catalog/';
        if (compareTable) {
            const rows=[
                ['Цена', alt.price && mainPrice ? (alt.price-mainPrice) : null, ' ₽', true],
                ['Совпадение', alt.match-mainMatch, '%', false],
                ['Мощность', alt.displayMetrics.power != null && mainDisplayMetrics.power != null ? alt.displayMetrics.power-mainDisplayMetrics.power : null, '', false],
                [state.terrain==='water'?'Манёвренность':state.terrain==='road'?'Управляемость':'Проходимость', alt.displayMetrics.terrain != null && mainDisplayMetrics.terrain != null ? alt.displayMetrics.terrain-mainDisplayMetrics.terrain : null, '', false],
                ['Комфорт', alt.displayMetrics.comfort != null && mainDisplayMetrics.comfort != null ? alt.displayMetrics.comfort-mainDisplayMetrics.comfort : null, '', false]
            ];
            compareTable.innerHTML='';
            rows.forEach(function(row){
                const node=document.createElement('div');node.className='tlsc-compare-row';
                const value=row[1];let text;let cls='';
                if(value === null){
                    text='нет данных';
                } else if(row[3] && value){
                    text=(value<0?'дешевле на ':'дороже на ')+formatRubAmount(Math.abs(value));
                    cls=value>0?'is-minus':'is-plus';
                } else {
                    text=diffText(value,row[2]);
                    cls=value>0?'is-plus':value<0?'is-minus':'';
                }
                node.innerHTML='<span>'+row[0]+'</span><strong class="'+cls+'">'+text+'</strong>';compareTable.appendChild(node);
            });
        }
        const verdictNode=root.querySelector('[data-tlsc-compare-verdict]');
        if(verdictNode){
            const priceDiff=alt.price&&mainPrice?alt.price-mainPrice:0;
            const advantages=[];
            if(mainDisplayMetrics.power!=null && alt.displayMetrics.power!=null && mainDisplayMetrics.power>alt.displayMetrics.power)advantages.push('мощности');
            if(mainDisplayMetrics.terrain!=null && alt.displayMetrics.terrain!=null && mainDisplayMetrics.terrain>alt.displayMetrics.terrain)advantages.push(state.terrain==='water'?'манёвренности':state.terrain==='road'?'управляемости':'проходимости');
            if(mainDisplayMetrics.comfort!=null && alt.displayMetrics.comfort!=null && mainDisplayMetrics.comfort>alt.displayMetrics.comfort)advantages.push('комфорту');
            if(mainDisplayMetrics.universal!=null && alt.displayMetrics.universal!=null && mainDisplayMetrics.universal>alt.displayMetrics.universal)advantages.push('практичности');
            let verdict='<strong>Почему основная модель выше:</strong> ';
            if(priceDiff<0){verdict+='альтернатива экономит '+formatRubAmount(Math.abs(priceDiff))+', но основной вариант ';}
            else if(priceDiff>0){verdict+='альтернатива дороже на '+formatRubAmount(priceDiff)+', а основной вариант ';}
            else{verdict+='основной вариант ';}
            if(advantages.length)verdict+='сильнее по '+advantages.slice(0,2).join(' и ')+' и лучше держит баланс выбранного сценария.';
            else if(mainMatch>alt.match)verdict+='даёт более цельное совпадение со сценарием: +' + formatUiNumber(mainMatch-alt.match, 0) + ' п.п. по общей оценке.';
            else verdict+='лучше укладывается в ограничения по бюджету, сценарию и доступности, даже если отдельные характеристики альтернативы выше.';
            verdictNode.innerHTML=verdict;
        }
        Array.from(compareSelector ? compareSelector.querySelectorAll('button') : []).forEach(function(btn,i){btn.classList.toggle('is-active',i===index)});
    }

    function renderComparison(selection, state) {
        currentAlternatives=buildAlternatives(selection,state);activeAlternativeIndex=0;
        if(compareCount)compareCount.textContent=currentAlternatives.length?String(currentAlternatives.length):'';
        if(compareSelector){compareSelector.innerHTML='';currentAlternatives.forEach(function(alt,index){const b=document.createElement('button');b.type='button';b.dataset.altIndex=String(index);b.textContent=alt.role+' · '+formatShortRub(alt.price);if(index===0)b.classList.add('is-active');compareSelector.appendChild(b)})}
        if(compareEmpty)compareEmpty.classList.toggle('is-visible',!currentAlternatives.length);
        const compareBody=root.querySelector('.tlsc-compare');
        const verdictNode=root.querySelector('[data-tlsc-compare-verdict]');
        if(compareBody)compareBody.style.display=currentAlternatives.length?'grid':'none';
        if(compareTable){compareTable.style.display=currentAlternatives.length?'grid':'none';if(!currentAlternatives.length)compareTable.innerHTML='';}
        if(verdictNode && !currentAlternatives.length) verdictNode.innerHTML='';
        if(currentAlternatives.length)renderAlternative(0,selection,state);
    }

    function improvementCopy(current, next, state, nextState) {
        if (!next) return 'Подходящих моделей не найдено.';
        if (String(current.product.id) === String(next.product.id)) return 'Рекомендация не меняется: текущий бюджет уже хорошо соответствует этому сценарию.';
        const nowMetrics=metricSet(current.scored.type,state,current.scored);const nextMetrics=metricSet(next.scored.type,nextState,next.scored);
        const gains=[];
        if(nextMetrics.power>nowMetrics.power)gains.push('мощность +' + formatMetricValue(nextMetrics.power-nowMetrics.power));
        if(nextMetrics.terrain>nowMetrics.terrain){const terrainWord=state.terrain==='water'?'манёвренность':state.terrain==='road'?'управляемость':'проходимость';gains.push(terrainWord + ' +' + formatMetricValue(nextMetrics.terrain-nowMetrics.terrain));}
        if(nextMetrics.comfort>nowMetrics.comfort)gains.push('комфорт +' + formatMetricValue(nextMetrics.comfort-nowMetrics.comfort));
        if(nextMetrics.universal>nowMetrics.universal)gains.push('практичность +' + formatMetricValue(nextMetrics.universal-nowMetrics.universal));
        return gains.length ? 'Откроется другая модель: '+gains.slice(0,2).join(', ')+'.' : 'Откроется близкая модель другого исполнения — сравните оснащение и стоимость.';
    }

    function renderUpgrades(selection,state){
        if(!upgradesNode||!budget)return;upgradesNode.innerHTML='';
        const max=parseInt(budget.max,10)||state.budget;const increments=[500000,1000000];
        increments.forEach(function(inc){
            const target=Math.min(max,state.budget+inc);if(target<=state.budget)return;
            const nextState=Object.assign({},state,{budget:target});const next=chooseProduct(nextState);
            const card=document.createElement('article');card.className='tlsc-upgrade';
            const same=next&&String(next.product.id)===String(selection.product.id);
            const title=same?'Бюджет уже оптимален':(next?next.product.name:'Нет новой модели');
            card.innerHTML='<span>Что даст +'+formatShortRub(target-state.budget)+'</span><strong>'+title+'</strong><p>'+improvementCopy(selection,next,state,nextState)+'</p><button type="button" data-budget-target="'+target+'">Проверить этот бюджет</button>';
            upgradesNode.appendChild(card);
        });
        if(!upgradesNode.children.length){const card=document.createElement('article');card.className='tlsc-upgrade';card.innerHTML='<span>Предел шкалы</span><strong>Бюджет уже максимальный</strong><p>Увеличьте диапазон на странице, если хотите анализировать более дорогие модели.</p>';upgradesNode.appendChild(card)}
    }

    function renderWhatIf(state){
        if(!whatIfNode)return;whatIfNode.innerHTML='';
        const actions=[];
        actions.push({label:state.season==='winter'?'А если летом?':'А если зимой?',name:'season',value:state.season==='winter'?'summer':'winter'});
        actions.push({label:state.passengers==='3'?'А если вдвоём?':'А если втроём?',name:'passengers',value:state.passengers==='3'?'2':'3'});
        if(budget && state.budget < (parseInt(budget.max,10)||state.budget)) actions.push({label:'+500 тыс. к бюджету',name:'budget',value:Math.min(parseInt(budget.max,10),state.budget+500000)});
        if(state.ride!=='extreme')actions.push({label:'А если экстремальнее?',name:'ride',value:'extreme'});else actions.push({label:'А если спокойнее?',name:'ride',value:'active'});
        actions.slice(0,4).forEach(function(a){const b=document.createElement('button');b.type='button';b.dataset.whatifName=a.name;b.dataset.whatifValue=String(a.value);b.textContent=a.label;whatIfNode.appendChild(b)});
    }

    function selectedVariant() {
        return currentVariantIndex >= 0 && currentVariants[currentVariantIndex] ? currentVariants[currentVariantIndex] : null;
    }

    function updatePassport(selection,state,percent){
        if(!passport||!selection||!selection.product)return;
        const product=selection.product;
        const variant=selectedVariant();
        const shownPrice=parseInt(variant&&variant.price,10)||parseInt(product.price,10)||0;
        const set=function(sel,val){const n=passport.querySelector(sel);if(n)n.textContent=val||''};

        set('[data-tlsc-passport-profile]',scenarioName(state));
        set('[data-tlsc-passport-match]',percent+'%');
        set('[data-tlsc-passport-match-caption]',matchCaptionFor(percent));
        set('[data-tlsc-passport-name]',displayProductTitle(product));
        set('[data-tlsc-passport-price]',formatRub(shownPrice));
        set('[data-tlsc-passport-brand]',displayBrand(product)||product.section_top||'Turbolemons');
        set('[data-tlsc-passport-year]',product.model_year||'');

        const ring=passport.querySelector('[data-tlsc-passport-match-ring]');
        if(ring)ring.style.setProperty('--match',String(Math.max(0,Math.min(100,percent))));

        const img=passport.querySelector('[data-tlsc-passport-image]');
        if(img){
            const src=String((variant&&variant.image)||product.image||'').trim();
            if(src){img.src=src;img.alt=product.name||'';img.hidden=false}
            else{img.removeAttribute('src');img.alt='';img.hidden=true}
        }

        const logoWrap=passport.querySelector('[data-tlsc-passport-brand-logo-wrap]');
        const logoImg=passport.querySelector('[data-tlsc-passport-brand-logo]');
        const logo=String(product.brand_logo||'').trim();
        if(logoWrap&&logoImg&&logo){
            if(logoImg.getAttribute('src')!==logo)logoImg.src=logo;
            logoImg.alt=displayBrand(product)||'';
            logoWrap.hidden=false;
        }else{
            if(logoWrap)logoWrap.hidden=true;
            if(logoImg){logoImg.removeAttribute('src');logoImg.alt=''}
        }

        const productLinkNode=passport.querySelector('[data-tlsc-passport-link]');
        if(productLinkNode){
            productLinkNode.href=product.url||'/catalog/';
            productLinkNode.setAttribute('aria-label','Открыть модель: '+(product.name||''));
        }

        const facts=passport.querySelector('[data-tlsc-passport-facts]');
        if(facts){
            facts.innerHTML='';
            const factItems=[
                ['Стиль',labels.ride[state.ride]],
                ['Среда',labels.terrain[state.terrain]],
                ['Сезон',labels.season[state.season]],
                ['Вместимость',labels.passengers[state.passengers]],
                ['Бюджет',formatShortRub(state.budget)]
            ];
            if(variant&&variant.color)factItems.push(['Цвет',variant.color]);
            const precisionItems=precisionActiveItems(state);
            if(precisionItems.length)factItems.push(['Экспертные настройки',precisionItems.join(', ')]);
            factItems.forEach(function(item){
                const n=document.createElement('div');
                n.className='tlsc-passport-fact';
                const label=document.createElement('span');
                const value=document.createElement('strong');
                label.textContent=item[0]||'';
                value.textContent=item[1]||'';
                n.appendChild(label);n.appendChild(value);facts.appendChild(n);
            });
        }
    }

    function passportText(){
        if(!currentSelection||!currentState)return'';
        const p=currentSelection.product;const percent=matchPercent(currentSelection.scored,currentState);const variant=selectedVariant();const shownPrice=parseInt(variant&&variant.price,10)||parseInt(p.price,10)||0;
        const lines=['Подбор Turbolemons',scenarioName(currentState),'Рекомендация: '+(p.name||''),'Совпадение: '+percent+'%','Стоимость: '+formatRub(shownPrice),'Стиль: '+labels.ride[currentState.ride],'Среда: '+labels.terrain[currentState.terrain],'Сезон: '+labels.season[currentState.season],'Вместимость: '+labels.passengers[currentState.passengers],'Бюджет: '+formatRub(currentState.budget)];if(variant&&variant.color)lines.push('Цвет: '+variant.color);const precisionItems=precisionActiveItems(currentState);if(precisionItems.length)lines.push('Экспертные настройки: '+precisionItems.join(', '));lines.push(p.url||'');return lines.join('\n');
    }

    function setPassportStatus(text){const n=passport&&passport.querySelector('[data-tlsc-passport-status]');if(n)n.textContent=text||''}
    function copyPassport(){const text=passportText();if(!text)return;const done=function(){setPassportStatus('Подбор скопирован — его можно отправить менеджеру.')};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(function(){})}else{const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){}t.remove()}}
    function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight,maxLines){const words=String(text||'').split(/\s+/);let line='',lines=0;for(let i=0;i<words.length;i++){const test=line?line+' '+words[i]:words[i];if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;lines++;line=words[i];if(lines>=maxLines)return y}else line=test}if(line&&lines<maxLines){ctx.fillText(line,x,y);y+=lineHeight}return y}
    function savePassport(){
        if(!currentSelection||!currentState)return;
        const canvas=document.createElement('canvas');canvas.width=1400;canvas.height=900;const ctx=canvas.getContext('2d');
        function drawBase(){
            ctx.fillStyle='#ffffff';ctx.fillRect(0,0,1400,900);ctx.fillStyle='#D2FF00';ctx.fillRect(0,0,1400,18);ctx.fillStyle='#171717';
            ctx.font='700 30px Arial';ctx.fillText('TURBOLEMONS · ПАСПОРТ ПОДБОРА',70,85);
            ctx.font='700 70px Arial';wrapCanvasText(ctx,scenarioName(currentState).toUpperCase(),70,180,720,74,2);
            const percent=matchPercent(currentSelection.scored,currentState);ctx.font='700 80px Arial';ctx.fillText(percent+'%',1120,175);
            ctx.font='700 24px Arial';ctx.fillText('РЕКОМЕНДАЦИЯ',70,360);ctx.font='700 40px Arial';wrapCanvasText(ctx,currentSelection.product.name,70,420,720,48,3);
            ctx.font='700 40px Arial';const variant=selectedVariant();const shownPrice=parseInt(variant&&variant.price,10)||parseInt(currentSelection.product.price,10)||0;ctx.fillText(formatRub(shownPrice),70,585);ctx.font='500 22px Arial';ctx.fillStyle='#5A5A5A';
            const fact='Стиль: '+labels.ride[currentState.ride]+'   ·   Среда: '+labels.terrain[currentState.terrain]+'   ·   Сезон: '+labels.season[currentState.season];wrapCanvasText(ctx,fact,70,675,1220,34,2);
            ctx.fillText('Вместимость: '+labels.passengers[currentState.passengers]+'   ·   Бюджет: '+formatShortRub(currentState.budget),70,755);ctx.fillStyle='#171717';ctx.fillRect(70,820,1260,1);ctx.font='500 18px Arial';ctx.fillStyle='#777777';ctx.fillText('Рекомендация сформирована по данным каталога и выбранному сценарию.',70,855);
        }
        function finish(){try{const a=document.createElement('a');a.download='turbolemons-podbor.png';a.href=canvas.toDataURL('image/png');a.click();setPassportStatus('Карточка сохранена.')}catch(e){setPassportStatus('Не удалось сохранить карточку в этом браузере.')}}
        drawBase();
        const activeVariant=selectedVariant();const src=(activeVariant&&activeVariant.image)||currentSelection.product.image||'';
        if(!src){finish();return;}
        const img=new Image();
        img.onload=function(){
            try{
                const box={x:860,y:300,w:450,h:360};const ratio=Math.min(box.w/img.naturalWidth,box.h/img.naturalHeight);const w=img.naturalWidth*ratio,h=img.naturalHeight*ratio;
                ctx.fillStyle='#FAFAF7';ctx.fillRect(box.x,box.y,box.w,box.h);ctx.drawImage(img,box.x+(box.w-w)/2,box.y+(box.h-h)/2,w,h);
            }catch(e){}
            finish();
        };
        img.onerror=finish;img.src=src;
    }


    function updateExtended(selection,state,percent){renderMarket(selection,state);renderComparison(selection,state);renderRadarProfile(selection,state);updatePassport(selection,state,percent)}

    function setStageImage(product) {
        if (!productImage) return;
        const src = String(product && product.image || '').trim();
        if (result) result.classList.toggle('is-image-missing', !src);
        if (src) {
            productImage.src = src;
            productImage.alt = String(product && product.name || '');
            productImage.hidden = false;
            if (productEmpty) productEmpty.hidden = true;
        } else {
            productImage.removeAttribute('src');
            productImage.alt = '';
            productImage.hidden = true;
            if (productEmpty) productEmpty.hidden = false;
        }
    }

    function clearComparisonState() {
        currentAlternatives = [];
        activeAlternativeIndex = 0;
        if (compareSelector) compareSelector.innerHTML = '';
        if (compareCount) compareCount.textContent = '';
        if (compareEmpty) compareEmpty.classList.add('is-visible');
        const compareBody = root.querySelector('.tlsc-compare');
        if (compareBody) compareBody.style.display = 'none';
        if (compareTable) { compareTable.innerHTML = ''; compareTable.style.display = 'none'; }
        const verdictNode = root.querySelector('[data-tlsc-compare-verdict]');
        if (verdictNode) verdictNode.innerHTML = '';
        ['[data-tlsc-compare-main-image]','[data-tlsc-compare-alt-image]'].forEach(function (sel) {
            const img = root.querySelector(sel); if (img) { img.removeAttribute('src'); img.alt = ''; }
        });
        ['[data-tlsc-compare-main-name]','[data-tlsc-compare-main-price]','[data-tlsc-compare-alt-name]','[data-tlsc-compare-alt-price]'].forEach(function (sel) {
            const node = root.querySelector(sel); if (node) node.textContent = '';
        });
    }

    function clearExtendedForNoResult() {
        if (marketMiniPoints) marketMiniPoints.innerHTML = '';
        if (budgetMapPoints) budgetMapPoints.innerHTML = '';
        if (budgetMarketLabel) budgetMarketLabel.textContent = 'Нет подходящих моделей для текущих ограничений';
        if (budgetMapLabel) budgetMapLabel.textContent = formatShortRub(currentState ? currentState.budget : 0);
        if (budgetCursor) budgetCursor.style.left = '0%';
        renderRadarProfile(null, currentState);
        clearComparisonState();
        if (passport && passport.classList.contains('is-open')) {
            passport.classList.remove('is-open');
            passport.setAttribute('aria-hidden', 'true');
            document.documentElement.style.overflow = '';
        }
    }

    function applyProduct(selection, state, instant) {
        if (!selection) return;
        const token = ++switchToken;
        const product = selection.product;
        const scored = selection.scored;
        const percent = matchPercent(scored, state);
        const metrics = metricSet(scored.type, state, scored);
        const reasons = reasonSet(product, state, scored);
        const isSame = String(currentProductId) === String(product.id);
        const productChanged = !isSame;

        if (productTransitionTimer) {
            window.clearTimeout(productTransitionTimer);
            productTransitionTimer = null;
        }
        if (result) result.classList.remove('is-no-result','is-switching','is-switching-out','is-switching-in');
        if (noResultStage) noResultStage.hidden = true;

        if (productChanged || instant) prepareCartForProduct(product);
        currentSelection = selection;
        currentState = state;
        currentMetrics = metrics;
        updateScene(state);
        if (productChanged || instant) clearProductDetailsUI(product);

        function commitVisuals() {
            if (token !== switchToken) return;

            updateMetrics(metrics, state, scored);
            updateReasons(reasons);
            updateBudgetFit(product, state);
            updateExtended(selection, state, percent);
            renderTerritory(selection, state, instant);
            animateMatch(percent, instant);
            if (matchCaption) matchCaption.textContent = matchCaptionFor(percent);

            const price = parseInt(product.price, 10) || 0;
            animatePriceValue(price, instant);
            if (priceRangeNode) priceRangeNode.textContent = price > 0 ? 'ориентир для базовой комплектации' : 'точная стоимость зависит от выбранной версии';
            if (productBrand) productBrand.textContent = displayBrand(product) || product.section_top || 'Turbolemons';
            if (productYear) productYear.textContent = product.model_year || '';
            if (productName) productName.textContent = displayProductTitle(product);
            if (productSubtitle) productSubtitle.textContent = productSubtitleText(product);
            syncStageCopy(product);
            setStageImage(product);

            if (productLink) {
                productLink.href = product.url || '/catalog/';
                productLink.setAttribute('aria-label', 'Открыть в каталоге: ' + (product.name || 'подобранная модель'));
            }

            currentProductId = product.id;
            lastMatch = percent;
            renderSelectionJourney(selection, state, selection.journey || lastSelectionJourney, instant);

            if (productChanged || instant) loadProductDetails(product);
            else if (currentVariantIndex >= 0) applyVariant(currentVariantIndex, product, true);

            if (result && productChanged && !instant && !reduceMotion) {
                result.classList.remove('is-switching-out','is-switching-in');
                void result.offsetWidth;
                result.classList.add('is-switching','is-switching-in');
                productTransitionTimer = window.setTimeout(function () {
                    if (token !== switchToken || !result) return;
                    result.classList.remove('is-switching','is-switching-in');
                    productTransitionTimer = null;
                }, 560);
            } else if (result) {
                result.classList.remove('is-switching','is-switching-out','is-switching-in');
                pulseResult();
            }
        }

        if (isSame || instant || !productImage) {
            commitVisuals();
            return;
        }

        const nextSrc = String(product.image || '').trim();
        if (!nextSrc) {
            if (result && !reduceMotion) {
                result.classList.add('is-switching','is-switching-out');
                productTransitionTimer = window.setTimeout(commitVisuals, 150);
            } else {
                commitVisuals();
            }
            return;
        }

        /*
         * Сначала полностью загружаем следующую фотографию. Старая модель остаётся
         * на сцене до готовности нового изображения — переход не показывает пустой экран.
         */
        const nextImage = new Image();
        nextImage.onload = function () {
            if (token !== switchToken) return;
            if (result && !reduceMotion) {
                result.classList.add('is-switching','is-switching-out');
                productTransitionTimer = window.setTimeout(function () {
                    productTransitionTimer = null;
                    commitVisuals();
                }, 180);
            } else {
                commitVisuals();
            }
        };
        nextImage.onerror = function () {
            if (token !== switchToken) return;
            product.image = '';
            if (result && !reduceMotion) {
                result.classList.add('is-switching','is-switching-out');
                productTransitionTimer = window.setTimeout(function () {
                    productTransitionTimer = null;
                    commitVisuals();
                }, 150);
            } else {
                commitVisuals();
            }
        };
        nextImage.src = nextSrc;
    }

    function pulseResult(){if(!result||reduceMotion)return;result.classList.remove('is-pulse');void result.offsetWidth;result.classList.add('is-pulse');window.setTimeout(function(){result.classList.remove('is-pulse')},420)}

    function diagnoseNoResult(state) {
        if (state.terrain === 'water' && ['winter','all'].includes(state.season)) {
            return {
                text:state.season === 'winter'
                    ? 'Для водного сценария зимой точного совпадения нет: гидроциклы сезонно несовместимы с этим запросом.'
                    : 'Одна гидроциклетная модель не может честно закрыть водный сценарий круглый год, поэтому точную рекомендацию не показываем.',
                action:'Выберите лето или весну / осень.'
            };
        }
        if (state.terrain === 'snow' && ['summer','all'].includes(state.season)) {
            return {
                text:state.season === 'summer'
                    ? 'Для снежного сценария летом точного совпадения нет: снегоходы сезонно несовместимы с этим запросом.'
                    : 'Снегоход не является круглогодичной техникой, поэтому для «Снег + круглый год» точной рекомендации нет.',
                action:'Выберите зиму или весну / осень.'
            };
        }

        let compatible = products.filter(function(product){
            return !isFatalScenarioMismatch(getProfile(product), state);
        });
        if (!compatible.length) {
            return {
                text:'В каталоге нет техники, технически совместимой с этой комбинацией среды и сезона.',
                action:'Измените среду или сезон.'
            };
        }

        if (state.brand) {
            const branded = compatible.filter(function(product){ return productMatchesBrand(product,state.brand); });
            if (!branded.length) {
                return {
                    text:'У бренда «'+state.brand+'» сейчас нет модели, совместимой с выбранной средой и сезоном.',
                    action:'Выберите другой бренд или оставьте «Любой бренд».'
                };
            }
            compatible = branded;
        }

        const requested = parseInt(state.passengers,10) || 1;
        if (requested >= 2) {
            const withKnownSeats = compatible.map(function(product){return {product:product,seats:getProfile(product).seats};})
                .filter(function(item){return item.seats>0;});
            const enough = withKnownSeats.filter(function(item){return item.seats>=requested;});
            if (withKnownSeats.length && !enough.length) {
                return {
                    text:'Среди совместимых моделей нет подтверждённой вместимости на '+(requested>=3?'3 и более человек':'2 человека')+'.',
                    action:'Уменьшите требуемую вместимость или измените среду.'
                };
            }
            if (enough.length) compatible = enough.map(function(item){return item.product;});
        }

        if (state.availableOnly) {
            const available = compatible.filter(function(product){ return String(product.available)!=='N'; });
            if (!available.length) {
                return {
                    text:'Подходящие модели есть, но среди них сейчас нет доступных к покупке вариантов.',
                    action:'Отключите «Только в наличии» или измените параметры.'
                };
            }
            compatible = available;
        }

        if (state.strictBudget) {
            const qualityEntries = compatible.map(function(product){return {product:product,scored:scoreProduct(product,state),price:parseInt(product.price,10)||0};})
                .filter(function(item){return !item.scored.fatal;});
            qualityEntries.sort(function(a,b){return b.scored.baseFitScore-a.scored.baseFitScore;});
            const bestBase = qualityEntries.length ? qualityEntries[0].scored.baseFitScore : -10000;
            const exactEnough = qualityEntries.filter(function(item){return item.scored.baseFitScore>=bestBase-18;});
            const priced = exactEnough.filter(function(item){return item.price>0;});
            const inside = priced.filter(function(item){return item.price<=state.budget;});
            if (!inside.length) {
                const minPrice = priced.length ? Math.min.apply(null,priced.map(function(item){return item.price;})) : 0;
                return {
                    text:minPrice
                        ? 'Точные по сценарию модели есть, но минимальная стоимость среди них — '+formatRub(minPrice)+', что выше строгого бюджета.'
                        : 'Точные по сценарию модели есть, но для них не заполнена цена, поэтому строгий бюджет применить невозможно.',
                    action:minPrice ? 'Увеличьте бюджет минимум до '+formatShortRub(minPrice)+' или отключите строгий лимит.' : 'Отключите «Строго в бюджете».'
                };
            }
        }

        return {
            text:'Текущие ограничения не оставили достаточно надёжного варианта для рекомендации.',
            action:'Измените один из параметров или ослабьте дополнительное ограничение.'
        };
    }

    function renderNoResult(state){
        // Отменяем любой незавершённый preload предыдущей модели, иначе его
        // onload мог вернуть старую картинку уже после состояния «нет результата».
        ++switchToken;
        if (productTransitionTimer) {
            window.clearTimeout(productTransitionTimer);
            productTransitionTimer = null;
        }
        currentSelection = null;
        currentState = state;
        currentMetrics = null;
        currentProductId = null;
        updateScene(state);
        renderTerritory(null,state,false);
        if (result) {
            result.classList.add('is-no-result');
            result.classList.remove('is-switching', 'is-switching-out', 'is-switching-in', 'is-pulse');
            result.classList.remove('is-image-missing');
        }
        clearProductDetailsUI(null);
        if (noResultStage) noResultStage.hidden = false;
        if (productImage) { productImage.removeAttribute('src'); productImage.alt = ''; productImage.hidden = true; }
        if (productEmpty) productEmpty.hidden = true;
        if (productBrand) productBrand.textContent = '';
        if (productYear) productYear.textContent = '';
        syncStageCopy(null);

        updateMetrics({power:0,terrain:0,comfort:0,universal:0},state);
        animateMatch(0,true);
        if(productName)productName.textContent='Нет точного совпадения';
        const diagnosis = diagnoseNoResult(state);
        if(productSubtitle) productSubtitle.textContent = diagnosis.text;
        if(matchNode)matchNode.textContent='—';
        if(matchCaption)matchCaption.textContent='Измените один параметр';
        if(priceRaf)cancelAnimationFrame(priceRaf);priceRaf=null;lastDisplayedPrice=0;if(priceNode)priceNode.textContent='—';
        if(priceRangeNode)priceRangeNode.textContent='';
        if(budgetFitWrap)budgetFitWrap.className='tlsc-price__fit is-unknown';
        if(budgetFit)budgetFit.textContent='Нет варианта';
        if(budgetDelta)budgetDelta.textContent='измените один из параметров';
        if(productLink)productLink.href='/catalog/';
        prepareCartForProduct(null);

        clearExtendedForNoResult();
        if(upgradesNode)upgradesNode.innerHTML='<article class="tlsc-upgrade"><span>Что можно изменить</span><strong>Следующий логичный шаг</strong><p>'+diagnosis.action+'</p></article>';
        renderWhatIf(state);
        renderSelectionJourney(null, state, lastSelectionJourney, false);
    }

    function precisionActiveItems(state) {
        const items = [];
        const terrainName = state.terrain === 'water' ? 'манёвренность' : (state.terrain === 'road' ? 'управляемость' : 'проходимость');
        const addPriority = function (name, value) {
            const level = precisionLevel(value);
            if (!level) return;
            items.push(name + ': ' + (level === 2 ? 'максимум' : 'важно'));
        };
        addPriority('мощность', state.priorityPower);
        addPriority(terrainName, state.priorityTerrain);
        addPriority('комфорт', state.priorityComfort);
        addPriority('практичность', state.priorityPractical);
        if (state.brand) items.push('бренд: ' + state.brand);
        if (state.availableOnly) items.push('только в наличии');
        if (state.strictBudget) items.push('строго в бюджете');
        return items;
    }

    function updatePrecisionUI(state) {
        const items = precisionActiveItems(state);
        if (terrainPriorityName) {
            terrainPriorityName.textContent = state.terrain === 'water' ? 'Манёвренность' : (state.terrain === 'road' ? 'Управляемость' : 'Проходимость');
        }
        if (precisionSummary) {
            precisionSummary.textContent = items.length ? ('Учитываем: ' + items.slice(0, 3).join(', ') + (items.length > 3 ? ' +' + (items.length - 3) : '')) : 'Необязательно · без дополнительных ограничений';
        }
        if (precisionStatus) {
            const n = items.length;
            const word = n === 1 ? 'настройка' : (n >= 2 && n <= 4 ? 'настройки' : 'настроек');
            precisionStatus.textContent = n ? (n + ' ' + word) : 'Без настроек';
        }
        if (refineWrap) refineWrap.classList.toggle('has-active', items.length > 0);
    }

    function resetPrecision() {
        if (!controls) return;
        ['priority_power','priority_terrain','priority_comfort','priority_practical'].forEach(function (name) {
            const neutral = controls.querySelector('input[name="' + name + '"][value="0"]');
            if (neutral) neutral.checked = true;
        });
        if (brandSelect) brandSelect.value = '';
        const available = controls.querySelector('input[name="available_only"]');
        const strict = controls.querySelector('input[name="strict_budget"]');
        if (available) available.checked = false;
        if (strict) strict.checked = false;
        recalculate();
    }

    function recalculate(options){const state=getState();setBudgetVisual();updatePrecisionUI(state);const selection=chooseProduct(state);if(selection)applyProduct(selection,state,Boolean(options&&options.instant));else renderNoResult(state)}

    function populateBrands(){
        if(!brandSelect)return;
        const byKey=new Map();
        products.forEach(function(p){
            const key=inferredBrandKey(p);
            if(!key)return;
            const label=displayBrand(p)||key;
            if(!byKey.has(key))byKey.set(key,label);
        });
        Array.from(byKey.entries()).sort(function(a,b){return a[1].localeCompare(b[1],'ru')}).forEach(function(item){
            const option=document.createElement('option');option.value=item[1];option.textContent=item[1];brandSelect.appendChild(option);
        });
    }

    function setRadio(name,value){const input=controls&&controls.querySelector('input[name="'+name+'"][value="'+value+'"]');if(input){input.checked=true;return true}return false}

    if (territoryFarPrev) territoryFarPrev.addEventListener('click',function(){territoryChooseTerrain(territoryFarPrev.dataset.terrainTarget);});
    if (territoryPrev) territoryPrev.addEventListener('click',function(){territoryChooseTerrain(territoryPrev.dataset.terrainTarget);});
    if (territoryNext) territoryNext.addEventListener('click',function(){territoryChooseTerrain(territoryNext.dataset.terrainTarget);});
    if (territoryFarNext) territoryFarNext.addEventListener('click',function(){territoryChooseTerrain(territoryFarNext.dataset.terrainTarget);});
    initTerritoryMotion();

    if(controls){
        controls.addEventListener('change',function(event){const control=event.target&&event.target.closest?event.target.closest('.tlsc-control'):null;if(control){control.classList.remove('is-updated');void control.offsetWidth;control.classList.add('is-updated');window.setTimeout(function(){control.classList.remove('is-updated')},420)}recalculate()});
        controls.addEventListener('input',function(event){if(event.target===budget){setBudgetVisual();clearTimeout(budgetTimer);budgetTimer=window.setTimeout(function(){recalculate();budgetTimer=null},70)}})
    }

    if(precisionToggle&&precisionPanel){precisionToggle.addEventListener('click',function(){const open=precisionToggle.getAttribute('aria-expanded')!=='true';precisionToggle.setAttribute('aria-expanded',open?'true':'false');precisionPanel.classList.toggle('is-open',open);precisionPanel.setAttribute('aria-hidden',open?'false':'true');if(refineWrap)refineWrap.classList.toggle('is-open',open)})}
    if(precisionReset){precisionReset.addEventListener('click',resetPrecision)}

    const tabs=root.querySelector('[data-tlsc-tabs]');if(tabs){tabs.addEventListener('click',function(event){const btn=event.target.closest('[data-tlsc-tab]');if(!btn||btn.hidden)return;activateTab(btn.dataset.tlscTab)})}
    if(galleryNode){galleryNode.addEventListener('click',function(event){const btn=event.target.closest('[data-gallery-index]');if(!btn||!currentSelection)return;const index=parseInt(btn.dataset.galleryIndex,10)||0;const src=currentGallery[index];if(src)focusStageImage(src,currentSelection.product.name||'',index)})}
    if(colorChoices){colorChoices.addEventListener('click',function(event){const btn=event.target.closest('[data-variant-index]');if(!btn||!currentSelection)return;const index=parseInt(btn.dataset.variantIndex,10);if(Number.isFinite(index))applyVariant(index,currentSelection.product,false)})}
    if(compareSelector){compareSelector.addEventListener('click',function(event){const btn=event.target.closest('[data-alt-index]');if(!btn||!currentSelection||!currentState)return;activeAlternativeIndex=parseInt(btn.dataset.altIndex,10)||0;renderAlternative(activeAlternativeIndex,currentSelection,currentState)})}
    if(whatIfNode){whatIfNode.addEventListener('click',function(event){const btn=event.target.closest('[data-whatif-name]');if(!btn)return;const name=btn.dataset.whatifName;const value=btn.dataset.whatifValue;if(name==='budget'&&budget){budget.value=value}else setRadio(name,value);recalculate()})}
    if(upgradesNode){upgradesNode.addEventListener('click',function(event){const btn=event.target.closest('[data-budget-target]');if(!btn||!budget)return;budget.value=btn.dataset.budgetTarget;recalculate();const profileTab=root.querySelector('[data-tlsc-tab="profile"]');if(profileTab)profileTab.click()})}
    if(budgetMapPoints){budgetMapPoints.addEventListener('click',function(event){const point=event.target.closest('[data-price]');if(!point||!budget)return;budget.value=point.dataset.price;recalculate()})}

    if (journeyFinalistsList) {
        journeyFinalistsList.addEventListener('click', function(event) {
            const button = event.target.closest('[data-journey-finalist-index]');
            if (!button) return;
            previewJourneyFinalist(parseInt(button.dataset.journeyFinalistIndex,10)||0, false);
        });
    }
    if (journeyPrev) journeyPrev.addEventListener('click', function(){ previewJourneyFinalist(activeJourneyFinalistIndex - 1, false); });
    if (journeyNext) journeyNext.addEventListener('click', function(){ previewJourneyFinalist(activeJourneyFinalistIndex + 1, false); });
    if (journeyFinalistsList) {
        journeyFinalistsList.addEventListener('keydown', function(event) {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            const direction = (event.key === 'ArrowDown' || event.key === 'ArrowRight') ? 1 : -1;
            previewJourneyFinalist(activeJourneyFinalistIndex + direction, false);
            const active = journeyFinalistsList.querySelector('.tlsc-journey-finalist.is-active');
            if (active) active.focus();
        });
    }

    Array.from(root.querySelectorAll('[data-tlsc-passport-open]')).forEach(function(btn){btn.addEventListener('click',function(){if(!passport||!currentSelection)return;updatePassport(currentSelection,currentState,matchPercent(currentSelection.scored,currentState));passport.classList.add('is-open');passport.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';const card=passport.querySelector('.tlsc-passport__card');if(card)card.scrollTop=0;const close=passport.querySelector('.tlsc-passport__close');if(close)window.setTimeout(function(){try{close.focus({preventScroll:true})}catch(e){close.focus()}},0);setPassportStatus('')})});
    Array.from(root.querySelectorAll('[data-tlsc-passport-close]')).forEach(function(btn){btn.addEventListener('click',function(){if(!passport)return;passport.classList.remove('is-open');passport.setAttribute('aria-hidden','true');document.documentElement.style.overflow=''})});
    const copyBtn=passport&&passport.querySelector('[data-tlsc-passport-copy]');if(copyBtn)copyBtn.addEventListener('click',copyPassport);const saveBtn=passport&&passport.querySelector('[data-tlsc-passport-save]');if(saveBtn)saveBtn.addEventListener('click',savePassport);const shareBtn=passport&&passport.querySelector('[data-tlsc-passport-share]');if(shareBtn)shareBtn.addEventListener('click',function(){const text=passportText();if(navigator.share){navigator.share({title:'Подбор Turbolemons',text:text,url:currentSelection&&currentSelection.product.url?currentSelection.product.url:location.href}).then(function(){setPassportStatus('Подбор отправлен.')}).catch(function(){})}else copyPassport()});
    document.addEventListener('keydown',function(event){if(event.key==='Escape'&&passport&&passport.classList.contains('is-open')){passport.classList.remove('is-open');passport.setAttribute('aria-hidden','true');document.documentElement.style.overflow=''}});


    // V17.1 HOTFIX:
    // Не наблюдаем за class самой cart-кнопки через MutationObserver:
    // это могло создавать рекурсивный цикл class -> observer -> class.
    // Состояние синхронизируем безопасно по CartStore.
    function safeRefreshCartButtonsFromStore() {
        refreshCartButtonsFromStore();
    }

    if (cartButtons.length) {
        // После клика даём штатному cart.js закончить запрос,
        // затем несколько раз синхронизируем подпись и цвет кнопки.
        document.addEventListener('click', function (event) {
            const cartButton = event.target && event.target.closest
                ? event.target.closest('[data-tlsc-cart]')
                : null;

            if (!cartButton) return;

            [350, 800, 1500].forEach(function (delay) {
                window.setTimeout(safeRefreshCartButtonsFromStore, delay);
            });
        });

        // Если товар удалили из боковой корзины — CartStore обновится,
        // и кнопка автоматически вернётся в состояние «В корзину».
        window.setInterval(function () {
            if (document.visibilityState === 'visible') {
                safeRefreshCartButtonsFromStore();
            }
        }, 1400);

        window.addEventListener('focus', safeRefreshCartButtonsFromStore, { passive:true });

        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                safeRefreshCartButtonsFromStore();
            }
        });

        [
            'pm-cart-updated',
            'pmcart:updated',
            'promminer-cart-updated',
            'cart:updated'
        ].forEach(function (eventName) {
            document.addEventListener(eventName, safeRefreshCartButtonsFromStore);
            window.addEventListener(eventName, safeRefreshCartButtonsFromStore);
        });
    }


    if (journeyRoot) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            journeyRoot.classList.add('is-entered');
        } else {
            const journeyObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (!entry.isIntersecting) return;
                    journeyRoot.classList.add('is-entered');
                    observer.unobserve(entry.target);
                });
            }, {threshold:.18, rootMargin:'0px 0px -8% 0px'});
            journeyObserver.observe(journeyRoot);
        }
    }

    const reveals=Array.from(root.querySelectorAll('[data-tlsc-reveal]'));if(reduceMotion||!('IntersectionObserver'in window)){reveals.forEach(function(node){node.classList.add('is-visible')})}else{const observer=new IntersectionObserver(function(entries,obs){entries.forEach(function(entry){if(!entry.isIntersecting)return;entry.target.classList.add('is-visible');obs.unobserve(entry.target)})},{threshold:.1,rootMargin:'0px 0px -4% 0px'});reveals.forEach(function(node){observer.observe(node)})}
    window.addEventListener('resize',function(){if(resizeRaf)cancelAnimationFrame(resizeRaf);resizeRaf=requestAnimationFrame(function(){resizeRaf=null})},{passive:true});

    populateBrands();setBudgetVisual();recalculate({instant:true});root.classList.add('is-ready');
});

/* End */
;; /* /local/templates/turbolemons-template/js/turbolemons-smart-calculator.js?1788949672221848*/
