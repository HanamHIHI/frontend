import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

type ImageComponentProps = {
  imageName: string;
};

const ImageComponent: React.FC<ImageComponentProps> = ({ imageName }) => {
  const [imageSrc, setImageSrc] = useState<string>('');

  const fetchImage = async () => {
    try {
      const response = await axios.get(`https://api.what-to-eat-hanam.site/images/${imageName}`, {
        responseType: 'blob', // Ensure the response is a blob for image data
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImageSrc(imageUrl);
    } catch (error) {
      console.error('Error fetching the image:', error);
    }
  };

  fetchImage();

  return <Image width={24} height={24} src={imageSrc} alt={imageName} />;
};

export default ImageComponent;
