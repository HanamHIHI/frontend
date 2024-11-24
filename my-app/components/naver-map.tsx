"use client";
import { useEffect } from "react";

type Address = {
  address: string,
  route: number[][]
};

const Map: React.FC<Address> = ({ address, route }) => {
  const initMap = (x: number, y: number) => {
    const map = new naver.maps.Map("my-comp", {
      center: new naver.maps.LatLng(37.5739531, 127.1940553),
      zoom: 17,
    });

    const markers: naver.maps.Marker[] = [];
    const mapMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(x, y),
      map: map,
    });
    const startMapMarker = new naver.maps.Marker({
      // Latitude : 37.5739531
      // Longitude : 127.1940553
      position: new naver.maps.LatLng(37.5739531, 127.1940553),
      map: map,
    });
    markers.push(mapMarker);
    markers.push(startMapMarker);

    const polylinePath = [];
    for (const value of route) {
      polylinePath.push(new naver.maps.LatLng(value[1], value[0]));
    }
    console.log(polylinePath);

    const polyline = new naver.maps.Polyline({
      map: map,
      path: polylinePath,
      strokeWeight: 2,
      strokeColor: "#032807",
      strokeLineCap: "round",
      strokeLineJoin: "round",
      startIcon: 3,
      endIcon: 1,
    });
    console.log(polyline);

    return [map, markers, polyline];
  };

  useEffect(() => {
    naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        const result = response.v2.addresses[0];
        const x = Number(result.x);
        const y = Number(result.y);

        initMap(y, x);
      }
    );
  }, []);

  return (
    <>
      <div id="my-comp" className="max-w-96 h-96 items-center rounded-md"></div>
    </>
  );
};

export default Map;