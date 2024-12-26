'use client'

import { MapPin, Star, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import axios from "axios"
import { useState } from 'react'
import { Loading } from './loading'
import { useTransition, useTrail, animated } from 'react-spring';
import ImageComponent from './image-component'
import DiscreteRangeSlider from "@/components/slider";
import Map from './naver-map'
import { NextProviders } from '@/app/providers'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";

type Restaurant = {
  idx: number,
  name: string, vector_score: number,
  addr: string | '',
  dist: number | 0,
  reqtime: number | 0,
  category0: string,
  route: number[][],
}

export function RestaurantRecommender() {
  const contents = [0, 1];

  const [searchTerm, setSearchTerm] = useState('');
  const [res, setRes] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [trailKey, setTrailKey] = useState(false);  // trail 애니메이션 키를 위한 상태 추가  
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [range, setRange] = useState<[number, number]>([20, 80]);

  const handleRangeUpdate = (newRange: [number, number]) => {
    setRange(newRange);
  };

  const handleCardClick = (id: number) => {
    // 클릭된 카드가 이미 열려 있으면 닫고, 그렇지 않으면 열기
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  const transitions = useTransition(expandedCardId, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 416 }, // 원하는 높이로 설정
    leave: { opacity: 0, height: 0 },
    config: {
      duration: 300, // 애니메이션의 지속 시간 설정
    },
    onRest: () => {
      if (expandedCardId === null) {
        // 애니메이션이 끝난 후에만 상태를 업데이트
        setExpandedCardId(null);
      }
    },
  });

  // useTrail을 사용하여 각 항목에 순차적인 애니메이션 적용
  const trail = useTrail(res.length, {
    from: { opacity: Number(trailKey) },
    to: { opacity: Number(!trailKey) },
    config: { duration: 1000 },
    delay: 500, // 각 항목이 0.5초 간격으로 등장
  });

  const makeAxios = () => {
    const request = axios.create({
      baseURL: "https://api.what-to-eat-hanam.site/",
      timeout: 100000,
    });

    request.interceptors.request.use(
      (config) => { setLoading(true); setTrailKey(true); return config; }
    );

    request.interceptors.response.use(
      (config) => { setLoading(false); setTrailKey(false); return config; }
    );

    return [request];
  };

  const predict = async () => {
    const [request] = makeAxios();

    try {
      // console.log(range[0], range[1])
      const response = await request.post("predict",
        {
          "text": searchTerm,
          "range_start": range[0],
          "range_end": range[1],
        });
      setRes(response.data["vals"]);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">하남 맛집 추천 시스템</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="원하는 맛집에 대한 설명을 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}  // 검색어를 업데이트
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              predict();  // Enter 키를 눌렀을 때 검색 수행
            }
          }}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      <div className="relative">
        <DiscreteRangeSlider range={range} onRangeChange={handleRangeUpdate} />
      </div>

      {loading && <Loading />}

      {!loading && res.length > 0 && (
        <div className="space-y-4">
          {trail.map((style, index) => (
            <animated.div key={res[index].idx} style={style}>  {/* key에 trailKey를 포함시켜 애니메이션을 재시작 */}
              <div key={index}>
                <Swiper
                  effect="cards" // 카드 효과 활성화
                  grabCursor={true} // 드래그 커서 표시
                >
                  {contents.map((content, innerIndex) => (
                    <SwiperSlide
                      key={innerIndex}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "16px",
                        backgroundColor: "#FFFFFF",
                        minHeight: "152px",
                      }}
                    >
                      {content == 0 && <Card onClick={() => handleCardClick(index)}>
                        <CardContent className="p-4 h-38 flex items-start space-x-4 cursor-pointer">
                          <ImageComponent imageName={res[index].category0 + (res[index].name.length % 5).toString()}></ImageComponent>
                          <div className="flex-1 space-y-1">
                            <h2 className="font-semibold">{res[index].name}</h2>
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-1 mr-1 flex-shrink-0" />
                              <p className="text-sm">{res[index].addr}</p>
                            </div>
                            <p className="text-sm">{res[index].dist + "m, " + "걸어서 " + Math.trunc(res[index].reqtime / 60) + "분 " + res[index].reqtime % 60 + "초 소요"}</p>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <p className="text-sm">{2 - res[index].vector_score}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>}
                      {content == 1 && <Card onClick={() => handleCardClick(index)}>
                        <CardContent className="p-4 h-38 flex items-start space-x-4 cursor-pointer">
                          {""}
                        </CardContent>
                      </Card>}
                    </SwiperSlide>))}
                </Swiper>

                {/* useTransition을 이용해 컴포넌트의 마운트 및 언마운트를 제어 */}
                {transitions(
                  (style, item) =>
                    item === index && (
                      <animated.div
                        style={{
                          ...style,
                          position: 'relative',
                          // overflow: 'hidden',  // 내용이 넘치는 부분 숨기기
                        }}
                        className="p-4 border rounded-md bg-gray-100"
                      >
                        <NextProviders>{<Map route={res[index].route}></Map>}</NextProviders>
                      </animated.div>
                    ))}
              </div>
            </animated.div>
          ))}
        </div>
      )}
    </div>
  );
}
