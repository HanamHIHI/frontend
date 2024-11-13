import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTransition, animated } from 'react-spring';

type CardItem = {
  id: number;
  title: string;
  content: string;
};

const cards: CardItem[] = [
  { id: 1, title: 'Card 1', content: 'Expanded content for Card 1' },
  { id: 2, title: 'Card 2', content: 'Expanded content for Card 2' },
  { id: 3, title: 'Card 3', content: 'Expanded content for Card 3' },
  { id: 4, title: 'Card 4', content: 'Expanded content for Card 4' },
  { id: 5, title: 'Card 5', content: 'Expanded content for Card 5' },
];

export function ExpandableCard() {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    // 클릭된 카드가 이미 열려 있으면 닫고, 그렇지 않으면 열기
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  // useTransition을 사용하여 카드가 열리고 닫히는 애니메이션을 처리
  const transitions = useTransition(expandedCardId, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 100 }, // 카드가 열릴 때
    leave: { opacity: 0, height: 0 }, // 카드가 닫힐 때
    config: { tension: 200, friction: 20 },
    onRest: () => {
      // 애니메이션 완료 후에 상태 변경
    }
  });

  return (
    <div className="space-y-4">
      {cards.map(card => (
        <div key={card.id}>
          <Card onClick={() => handleCardClick(card.id)} className="cursor-pointer">
            <CardContent className="p-4">
              <h2 className="font-semibold">{card.title}</h2>
              <p>Click to show more details.</p>
            </CardContent>
          </Card>

          {/* 클릭된 카드만 펼쳐지고 닫힘 */}
          {transitions((style, item) =>
            item === card.id ? (
              <animated.div style={style} className="p-4 border rounded-md bg-gray-100">
                <h3 className="font-medium">{card.title}</h3>
                <p>{card.content}</p>
              </animated.div>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
}
