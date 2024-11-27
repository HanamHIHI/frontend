import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";

const SwipeableCards = () => {
  const contents = ["First", "Second", "Third"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Swiper
        effect="cards" // 카드 효과 활성화
        grabCursor={true} // 드래그 커서 표시
        style={{
          width: "300px",
          height: "400px",
        }}
      >
        {contents.map((content, index) => (
          <SwiperSlide
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "16px",
              backgroundColor: index % 2 === 0 ? "#FFD700" : "#4CAF50",
              color: "#FFF",
              fontSize: "24px",
            }}
          >
            {content}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwipeableCards;
