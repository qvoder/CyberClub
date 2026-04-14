(function() {
    var path = window.location.pathname;
    var fileName = path.substring(path.lastIndexOf('/') + 1);
    if (fileName === '') fileName = 'index.html';
    
    var baseUrl = window.location.protocol + '//' + window.location.host;
    
    var seoConfig = {
        'index.html': {
            title: 'Кибертека – компьютерный клуб с двумя филиалами в Москве',
            description: 'Киберклуб «Кибертека» на Профсоюзной и Бауманской. Мощные ПК, PS5, зоны для командной игры, круглосуточно. Бронируйте место онлайн!',
            keywords: 'киберклуб, компьютерный клуб Москва, кибертека, аренда ПК, PS5 Москва, игровой клуб',
            canonical: baseUrl + '/',
            ogTitle: 'Кибертека – компьютерный клуб с двумя филиалами',
            ogDescription: 'Мощные ПК, PS5, киберспортивные зоны, круглосуточно. Выберите свой филиал и бронируйте место.',
            ogType: 'website'
        },
        'bauman.html': {
            title: 'Кибертека на Бауманской – круглосуточный компьютерный клуб | Москва',
            description: 'Компьютерный клуб на Бауманской (Спартаковская 21). Зоны «Стандарт», «Стандарт+», Boot Camp, PS5. Цены от 140 ₽/час. Бронируйте ПК 24/7.',
            keywords: 'киберклуб Бауманская, компьютерный клуб метро Бауманская, аренда ПК Бауманская, кибертека бауманская',
            canonical: baseUrl + '/bauman.html',
            ogTitle: 'Кибертека на Бауманской',
            ogDescription: 'Мощные ПК, зоны для киберспорта, PS5, круглосуточно. Адрес: Спартаковская 21.',
            ogType: 'website'
        },
        'profbauman.html': {
            title: 'Цены и тарифы на компьютерный клуб Кибертека (Бауманская)',
            description: 'Тарифы на зоны Стандарт, Стандарт+, Boot Camp, PS5. Цены от 140 ₽/час, скидки до 40%. Актуальные цены на Бауманской.',
            keywords: 'цены компьютерный клуб, тарифы киберклуба, сколько стоит час в кибертеке, прайс киберклуба Бауманская',
            canonical: baseUrl + '/profbauman.html',
            ogTitle: 'Цены и тарифы | Кибертека на Бауманской',
            ogDescription: 'Тарифы от 140 ₽/час, скидки до 40%. Выберите зону и забронируйте ПК онлайн.',
            ogType: 'website'
        },
        'baumanstandart.html': {
            title: 'Зона Стандарт – характеристики ПК и цены | Кибертека на Бауманской',
            description: 'Общая зона Стандарт: процессор AMD Ryzen 7 2700X, видеокарта GTX 1080, монитор 27″ 144 Гц. Цена от 140 ₽/час. Бронируйте ПК онлайн.',
            keywords: 'зона стандарт киберклуб, пк характеристики, цена компьютера в кибертеке, игровой компьютер аренда',
            canonical: baseUrl + '/baumanstandart.html',
            ogTitle: 'Зона Стандарт | Кибертека на Бауманской',
            ogDescription: 'Мощные ПК, демократичные цены. Идеально для игр и киберспорта.',
            ogType: 'website'
        },
        'baumanstandartplus.html': {
            title: 'Зона Стандарт+ – улучшенные ПК и мониторы 165 Гц | Кибертека Бауманская',
            description: 'Зона Стандарт+: Intel Core i7-10700K, RTX 2080, монитор 32″ 165 Гц. Тарифы от 240 ₽/час. Идеально для киберспорта.',
            keywords: 'стандарт плюс киберклуб, мощные компьютеры аренда, лучшие места в компьютерном клубе',
            canonical: baseUrl + '/baumanstandartplus.html',
            ogTitle: 'Зона Стандарт+ | Кибертека на Бауманской',
            ogDescription: 'Максимальная производительность для профессиональных игроков.',
            ogType: 'website'
        },
        'baumanBoot.html': {
            title: 'Boot Camp – отдельная комната на 5–10 человек | Кибертека Бауманская',
            description: 'VIP-зона Boot Camp: изолированная комната, лучшие ПК, мониторы 240 Гц. Цены от 140 ₽/час. Идеально для командной игры и турниров.',
            keywords: 'отдельная комната компьютерный клуб, boot camp киберклуб, аренда комнаты для киберспорта',
            canonical: baseUrl + '/baumanBoot.html',
            ogTitle: 'Boot Camp – VIP-зона | Кибертека Бауманская',
            ogDescription: 'Приватная комната с топовыми компьютерами для команды до 10 человек.',
            ogType: 'website'
        },
        'profsouz.html': {
            title: 'Кибертека на Профсоюзной – круглосуточный компьютерный клуб | Москва',
            description: 'Компьютерный клуб на Профсоюзной улице 22/10к1. Зоны Стандарт, Стандарт+, Boot Camp, PS5. Цены от 140 ₽/час. Бронируйте ПК 24/7.',
            keywords: 'киберклуб Профсоюзная, компьютерный клуб метро Профсоюзная, аренда ПК Профсоюзная, кибертека профсоюзная',
            canonical: baseUrl + '/profsouz.html',
            ogTitle: 'Кибертека на Профсоюзной',
            ogDescription: 'Мощные ПК, киберспортивные зоны, PS5, круглосуточно. Адрес: Профсоюзная 22/10к1.',
            ogType: 'website'
        },
        'profprice.html': {
            title: 'Цены и тарифы компьютерного клуба Кибертека (Профсоюзная)',
            description: 'Тарифы Стандарт, Стандарт+, PS5. Скидки по утрам и в пн–ср до 40%. Актуальные цены на Профсоюзной.',
            keywords: 'цены компьютерный клуб профсоюзная, тарифы кибертеки, сколько стоит час в кибертеке на профсоюзной',
            canonical: baseUrl + '/profprice.html',
            ogTitle: 'Цены и тарифы | Кибертека на Профсоюзной',
            ogDescription: 'Тарифы от 140 ₽/час, скидки до 40%. Выберите зону и забронируйте ПК онлайн.',
            ogType: 'website'
        },
        'profstandart.html': {
            title: 'Зона Стандарт – характеристики и цены | Кибертека на Профсоюзной',
            description: 'Общая зона Стандарт: AMD Ryzen 7 2700X, GTX 1080, 16 ГБ DDR4, монитор 27″ 144 Гц. Цена от 140 ₽/час. Бронирование онлайн.',
            keywords: 'зона стандарт профсоюзная, пк для игр аренда, игровой клуб профсоюзная цены',
            canonical: baseUrl + '/profstandart.html',
            ogTitle: 'Зона Стандарт | Кибертека на Профсоюзной',
            ogDescription: 'Надёжные компьютеры с отличной производительностью для любых игр.',
            ogType: 'website'
        },
        'profstandartplus.html': {
            title: 'Зона Стандарт+ – мощные ПК и большой монитор | Кибертека Профсоюзная',
            description: 'Зона Стандарт+: Intel Core i7-10700K, RTX 2080, 32″ 165 Гц. Тарифы от 240 ₽/час. Бронируйте лучшие места.',
            keywords: 'стандарт плюс профсоюзная, аренда мощного пк, киберспортивный компьютер',
            canonical: baseUrl + '/profstandartplus.html',
            ogTitle: 'Зона Стандарт+ | Кибертека на Профсоюзной',
            ogDescription: 'Максимальная мощность для киберспорта и стримов.',
            ogType: 'website'
        }
    };
    
    function setMetaTag(name, content, isProperty = false) {
        if (!content) return;
        var selector = isProperty ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
        var meta = document.querySelector(selector);
        if (!meta) {
            meta = document.createElement('meta');
            if (isProperty) meta.setAttribute('property', name);
            else meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }
    

    function setTitle(title) {
        if (!title) return;
        if (document.title !== title) document.title = title;
    }
    
    function setCanonical(href) {
        if (!href) return;
        var link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', href);
    }
    
    var config = seoConfig[fileName];
    if (!config) {
        console.warn('SEO: нет конфигурации для страницы', fileName);
        return;
    }
  
    setTitle(config.title);
    setMetaTag('description', config.description);
    setMetaTag('keywords', config.keywords);
    setCanonical(config.canonical);

    setMetaTag('og:title', config.ogTitle || config.title, true);
    setMetaTag('og:description', config.ogDescription || config.description, true);
    setMetaTag('og:url', config.canonical, true);
    setMetaTag('og:type', config.ogType || 'website', true);
    

    setMetaTag('robots', 'index, follow');
    

    console.log('SEO: метатеги обновлены для', fileName);
})();