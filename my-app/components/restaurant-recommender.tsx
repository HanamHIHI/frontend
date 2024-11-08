'use client'

import { MapPin, Star, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import axios from "axios"
import { useState } from 'react'

type Restaurant = {
  id: number
  name: string
  review_score: number
  category_score: number
  total_score: number
  addr: string | ''
  dist: string | ''
  reqtime: string | ''
}

export function RestaurantRecommender() {

  const [searchTerm, setSearchTerm] = useState('');
  const [res, setRes] = useState<Restaurant[]>([]);

  // const activatePredict = (e: KeyboardEvent<HTMLInputElement>) => {
  //   if(e.key == "Enter") {
  //     predict();
  //   }
  // }

  const predict = async () => {
    const url = `http://localhost:8000/predict/`
    try {
      const response = await axios.post(url, { text: searchTerm })
      // return reponse
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
            if (e.key === "Enter") predict();
          }}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>

      <div className="space-y-4">
        {res.map(restaurant => (
          <Card key={restaurant.id}>
            <CardContent className="p-4 flex items-start space-x-4">
              <img
                src={"../app/favicon.ico"}
                alt={restaurant.name}
                className="w-24 h-24 rounded-md object-cover"
              />
              <div className="flex-1 space-y-1">
                <h2 className="font-semibold">{restaurant.name}</h2>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1 mr-1 flex-shrink-0" />
                  <p className="text-sm">{restaurant.addr}</p>
                </div>
                <p className="text-sm">{restaurant.dist + " " + restaurant.reqtime}</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <p className="text-sm">{restaurant.total_score}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}