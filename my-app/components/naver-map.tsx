import { useState, useEffect, useRef } from "react";

type Address = {
  route: number[][]
};

const Map: React.FC<Address> = ({ route }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 37.5739531, lng: 127.1940553 }); // 사용자 위치 상태
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const customControl = new naver.maps.CustomControl('<a href="#" class="btn_mylct"><img src="/current-circle-blue.svg" width="10%" height="10%" style="margin: 0 0 22.4px 10px"></img></a>', {
    position: naver.maps.Position.LEFT_BOTTOM
  });

  const initMapSetting = () => {
    mapRef.current = new naver.maps.Map("my-comp", {
      center: new naver.maps.LatLng(37.5739531, 127.1940553),
      zoom: 17,
    });

    const mapMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(route[route.length - 1][1], route[route.length - 1][0]),
      map: mapRef.current,
    });
    const startMapMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(37.5739531, 127.1940553),
      map: mapRef.current,
    });
    const polylinePath = [];
    for (const value of route) {
      polylinePath.push(new naver.maps.LatLng(value[1], value[0]));
    }
    const polyline = new naver.maps.Polyline({
      map: mapRef.current,
      path: polylinePath,
      strokeWeight: 2,
      strokeLineCap: "round",
      strokeLineJoin: "round",
      startIcon: 3,
      endIcon: 1,
    });

    naver.maps.Event.once(mapRef.current, 'init', function () {
      customControl.setMap(mapRef.current);
    });
    return [mapMarker, startMapMarker, polyline];
  }

  useEffect(() => {
    initMapSetting();

    // Geolocation API를 사용해 사용자 위치 추적
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation); // 상태 업데이트
      },
      (error) => {
        console.error("Error getting location:", error.message);
      },
      { enableHighAccuracy: true }
    );

    // 클린업: 위치 추적 중지
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [])

  useEffect(() => {
    if (location && mapRef.current) {
      if (!markerRef.current) {
        markerRef.current = new naver.maps.Marker({
          position: location,
          map: mapRef.current,
        });
      }
    } {
      markerRef.current?.setPosition(new naver.maps.LatLng(location.lat, location.lng));
    }
  }, [location]);

  useEffect(() => {
    const handleCenterMove = function () { mapRef.current!.setCenter(new naver.maps.LatLng(location.lat, location.lng)); }
    naver.maps.Event.clearListeners(customControl, "click");
    naver.maps.Event.addDOMListener(customControl.getElement(), 'click', handleCenterMove);
  }, [mapRef.current?.getCenter()]);

  return (
    <>
      <div id="my-comp" className="max-w-96 h-96 items-center rounded-md"></div>
    </>
  );
};

export default Map;