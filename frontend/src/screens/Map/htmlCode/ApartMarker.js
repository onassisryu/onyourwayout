const ApartMarker = (key, markers, location) => {
  console.log('지도로딩중', key);
  console.log(markers);
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}"></script>
        <style>
          #map {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const markers = ${JSON.stringify(markers)};
          kakao.maps.load(() => {
            const container = document.getElementById('map');
            const options = {
              center: new kakao.maps.LatLng(${location.aptLat}, ${location.aptLng}),
              level: 3,
            };
            const map = new kakao.maps.Map(container, options);

            
            var bounds = new kakao.maps.LatLngBounds();    
            if(markers[0].lat> 0){
            markers.forEach((markerObj) => {
              const markerPosition = new kakao.maps.LatLng(markerObj.lat, markerObj.lng);
              const marker = new kakao.maps.Marker({
                position: markerPosition,
              });
              bounds.extend(markerPosition);
              marker.setMap(map);

              // 마커를 클릭했을 때 이벤트 처리
              kakao.maps.event.addListener(marker, 'click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify(markerObj));
              });
            });
            map.setBounds(bounds);
          };
          });
        </script>
      </body>
    </html>
  `;
};

export default ApartMarker;
