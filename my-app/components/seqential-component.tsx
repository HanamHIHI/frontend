import React, { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';

const SequentialFadeIn: React.FC = () => {
  const [items, setItems] = useState<number[]>([]);

  // useEffect to trigger the items in sequence
  useEffect(() => {
    const timeout1 = setTimeout(() => setItems([1]), 500);
    const timeout2 = setTimeout(() => setItems([1, 2]), 1500);
    const timeout3 = setTimeout(() => setItems([1, 2, 3]), 2500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  // useTransition for animating items
  const transitions = useTransition(items, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      {transitions((style, item) => (
        <animated.div key={item} style={{ ...style, marginBottom: '20px' }}>
          <div style={{ width: '200px', height: '100px', backgroundColor: 'lightblue', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Div {item}
          </div>
        </animated.div>
      ))}
    </div>
  );
};

export default SequentialFadeIn;