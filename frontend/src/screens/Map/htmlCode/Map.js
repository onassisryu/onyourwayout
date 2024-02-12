const Map = (key, location) => {
  console.log('지도로딩중', location);
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
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(${location?.latitude}, ${location?.longitude}), // 현재 위치를 기준으로 지도를 보여준다.
            level: 3,
          };
          const map = new kakao.maps.Map(container, options);
          const markerPosition = new kakao.maps.LatLng(${location?.latitude}, ${location?.longitude});
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map); // 현재 위치에 마커를 찍는다.
        </script>
      </body>
    </html>
    `;
};
export default Map;
