ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.677573, 37.565831], // Координаты Профсоюзная 22/10к1
        zoom: 16
    });

    var myPlacemark = new ymaps.Placemark([55.677573, 37.565831], {
        hintContent: 'Cyber Club',
        balloonContent: 'Профсоюзная улица 22/10 к1'
    }, {
        preset: 'islands#pinkDotIcon' 
    });

    myMap.geoObjects.add(myPlacemark);
    
    myMap.behaviors.disable('scrollZoom');
}