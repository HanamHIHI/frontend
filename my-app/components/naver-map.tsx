import { useState, useEffect, useRef } from "react";

type Address = {
  route: number[][]
};

const Map: React.FC<Address> = ({ route }) => {
  const testFlag = false;

  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 37.5739531, lng: 127.1940553 }); // 사용자 위치 상태
  const locationRef = useRef(location);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  
  const customControl = new naver.maps.CustomControl('<button><img src="/current-circle-blue.svg" width="10%" height="10%" style="margin: 0 0 22.4px 10px"></img></button>', {
    position: naver.maps.Position.LEFT_BOTTOM
  });
  const locationControl = new naver.maps.CustomControl('<button><img src="/triangle.svg" width="10%" height="10%" style="margin: 0 0 22.4px 10px"></img></button>', {
    position: naver.maps.Position.LEFT_TOP
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

    // setLocationMarker(() => {
    //   console.log("locationMarker rendered!");

    //   return new naver.maps.Marker({ position: new naver.maps.LatLng(0, 0), map: mapRef.current! });
    // });
    
    const handleLocationMove = function () {
      setLocation((preLocation) => ({ // 와.... location의 불변성 유지 필요....
        ...preLocation,
        lat: preLocation.lat+0.005,
        lng: preLocation.lng,
      })); // 상태 업데이트
    };
    naver.maps.Event.addDOMListener(locationControl.getElement(), "click", handleLocationMove);

    naver.maps.Event.once(mapRef.current, 'init', function () {
      customControl.setMap(mapRef.current);
      testFlag && locationControl.setMap(mapRef.current);
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
        setLocation((preLocation) => ({ // 와.... location의 불변성 유지 필요....
          ...preLocation,
          lat: newLocation.lat,
          lng: newLocation.lng,
        })); // 상태 업데이트
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
    locationRef.current = location;

    if (location && mapRef.current) {
      if (!markerRef.current) {
        markerRef.current = new naver.maps.Marker({
          position: location,
          map: mapRef.current,
        });
      } else {
        markerRef.current.setPosition(new naver.maps.LatLng(location.lat, location.lng));
      }
    }
    const handleCenterMove = function () {    
      if (locationRef.current && mapRef.current) {
        mapRef.current.setCenter(new naver.maps.LatLng(locationRef.current.lat, locationRef.current.lng));
      }
    };
    
    naver.maps.Event.removeDOMListener(customControl.getElement(), "click", handleCenterMove);
    naver.maps.Event.addDOMListener(customControl.getElement(), "click", handleCenterMove);
  }, [location]);

  return (
    <>
      <div id="my-comp" className="max-w-96 h-96 items-center rounded-md"></div>
    </>
  );
};

export default Map;