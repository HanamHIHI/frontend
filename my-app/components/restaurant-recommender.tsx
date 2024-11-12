'use client'

import { MapPin, Star, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import axios from "axios"
import { useState } from 'react'
import { Loading } from './loading'
import { useTrail, animated } from 'react-spring';

type Restaurant = {
  id: number,
  name: string,
  review_score: number,
  category_score: number,
  total_score: number,
  addr: string | '',
  dist: string | '',
  reqtime: string | '',
}

export function RestaurantRecommender() {

  const [searchTerm, setSearchTerm] = useState('');
  const [res, setRes] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  // useTrail을 사용하여 각 항목에 순차적인 애니메이션 적용
  const trail = useTrail(res.length, {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
    delay: 500, // 각 항목이 0.5초 간격으로 등장
  });

  const makeAxios = () => {
    const request = axios.create({
      baseURL: "https://api.what-to-eat-hanam.site/",
      // data: { "text": searchTerm },
      timeout: 100000,
    });

    request.interceptors.request.use(
      (config) => { setLoading(true); return config; }
    );

    request.interceptors.response.use(
      (config) => { setLoading(false); return config; }
    );

    return [request];
  };

  const predict = async () => {
    const [request] = makeAxios();

    try {
      const response = await request.post("predict", { "text": searchTerm });
      setRes(response.data["vals"]);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">

      <h1 className="text-2xl font-bold text-center">Restaurant Recommender</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search restaurants or cuisines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              predict();
            }
          }}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>

      {loading && <Loading />}

      {!loading &&
        <div className="space-y-4">
          {trail.map((style, index) => (
            <animated.div key={res[index].id} style={style}>
            <Card key={res[index].id}>
              <CardContent className="p-4 flex items-start space-x-4">
                <img
                  src={"../app/favicon.ico"}
                  alt={res[index].name}
                  className="w-24 h-24 rounded-md object-cover"
                />
                <div className="flex-1 space-y-1">
                  <h2 className="font-semibold">{res[index].name}</h2>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 mr-1 flex-shrink-0" />
                    <p className="text-sm">{res[index].addr}</p>
                  </div>
                  <p className="text-sm">{res[index].dist + " " + res[index].reqtime}</p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <p className="text-sm">{res[index].total_score}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </animated.div>
          ))}
        </div>
      }
    </div>
  )
}