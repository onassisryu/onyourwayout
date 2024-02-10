const Map = (key, markers) => {
  console.log('지도로딩중');
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
                center: new kakao.maps.LatLng(${markers[0].lat}, ${markers[0].lng}), // 초기 지도 중심 좌표 설정
                level: 3, // 초기 지도 확대 레벨 설정
              };
              const map = new kakao.maps.Map(container, options);
              var bounds = new kakao.maps.LatLngBounds();    
              markers.forEach((markerObj) => {
                const markerPosition = new kakao.maps.LatLng(markerObj.lat, markerObj.lng);
                const marker = new kakao.maps.Marker({
                  position: markerPosition,
                });
                bounds.extend(markerPosition);
                marker.setMap(map);
              });
            });
            map.setBounds(bounds);
        </script>
      </body>
    </html>
    `;
};
export default Map;
