const ApartMarker = (key, markers) => {
  console.log(markers[0].x);
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
  
            // Kakao 지도 API 초기화
            kakao.maps.load(() => {
              const container = document.getElementById('map');
              const options = {
                center: new kakao.maps.LatLng(37.499604, 127.047061), // 초기 지도 중심 좌표 설정
                level: 3, // 초기 지도 확대 레벨 설정
              };
              const map = new kakao.maps.Map(container, options);
  
              // 화장실 위치에 마커 생성
              markers.forEach((markerObj) => {
                const markerPosition = new kakao.maps.LatLng(markerObj.y, markerObj.x);
                const marker = new kakao.maps.Marker({
                  position: markerPosition,
                });
                marker.setMap(map);
              });
            });
          </script>
        </body>
      </html>
    `;
};
export default ApartMarker;
