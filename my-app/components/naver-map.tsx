import { useState, useEffect, useRef } from "react";

type Address = {
  address: string,
  route: number[][]
};

const Map: React.FC<Address> = ({ address, route }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null); // 사용자 위치 상태
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);

  const initMapSetting = () => {
    if(mapRef.current) {
      const mapMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(x, y),
        map: mapRef.current,
      });
      const startMapMarker = new naver.maps.Marker({
        // Latitude : 37.5739531
        // Longitude : 127.1940553
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

      return [mapMarker, startMapMarker, polyline];
    }
  }

  useEffect(() => {
    naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        const result = response.v2.addresses[0];
        setX(Number(result.x));
        setY(Number(result.y));
      }
    );

    mapRef.current = new naver.maps.Map("my-comp", {
      center: new naver.maps.LatLng(37.5739531, 127.1940553),
      zoom: 17,
    });

    initMapSetting();

    // Geolocation API를 사용해 사용자 위치 추적
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation); // 상태 업데이트
        // console.log("User location updated:", newLocation);
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
      markerRef.current?.setPosition(new naver.maps.LatLng(location!.lat, location!.lng))
    }
  }, [location]);

  return (
    <>
      <div id="my-comp" className="max-w-96 h-96 items-center rounded-md"></div>
    </>
  );
};

export default Map;