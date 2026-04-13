ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.773170, 37.677643], 
        zoom: 16
    });

    var myPlacemark = new ymaps.Placemark([55.773170, 37.677643], {
        hintContent: 'Cyber Club New',
        balloonContent: 'Спартаковская 21)'
    }, {
        preset: 'islands#pinkDotIcon' 
    });

    myMap.geoObjects.add(myPlacemark);
    
   
    myMap.behaviors.disable('scrollZoom');
}