'use client'

// import { ChevronDown, MapPin, Star } from 'lucide-react'
// import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
import axios from "axios"
import { useEffect, useState } from 'react'

type Restaurant = {
  id: number
  name: string
  review_score: number
  category_score: number
  total_score: number
}

export function RestaurantRecommender() {
  // const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)

  // const cuisineTypes = Array.from(new Set(restaurants.map(r => r.cuisine)))
  
  // const filteredRestaurants = selectedCuisine
  //   ? restaurants.filter(r => r.cuisine === selectedCuisine)
  //   : restaurants

  const [res, setRes] = useState<Restaurant[]>([]);

  const predict = async () => {
    const url = `http://localhost:8000/predict/`
    try {
      const response = await axios.post(url, new URLSearchParams({
        "text": "비가 오는 날 출출할 때 가기 좋은 식당이에요"
      }))
      // return reponse
      setRes(response.data["vals"]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    predict();
  }, [])

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Restaurant Recommender</h1>
      
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedCuisine || 'Filter by cuisine'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuItem onSelect={() => setSelectedCuisine(null)}>
            All Cuisines
          </DropdownMenuItem>
          {cuisineTypes.map(cuisine => (
            <DropdownMenuItem key={cuisine} onSelect={() => setSelectedCuisine(cuisine)}>
              {cuisine}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu> */}

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
                {/* <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm">{restaurant.rating}</span>
                </div> */}
                <p className="text-sm">{restaurant.review_score}</p>
                <p className="text-sm">{restaurant.category_score}</p>
                <p className="text-sm">{restaurant.total_score}</p>
                {/* <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1 mr-1 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{restaurant.address}</p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}