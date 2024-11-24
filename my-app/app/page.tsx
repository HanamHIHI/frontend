'use client'
// import { MapInformation } from '@/components/naver-map';
import { RestaurantRecommender } from '../components/restaurant-recommender';

export default function Home() {
  return (
    // <MapInformation latitude={37.3595704} longitude={127.105399}></MapInformation>
    <RestaurantRecommender></RestaurantRecommender>
  );
}