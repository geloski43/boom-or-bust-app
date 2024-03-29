import React, { useState } from 'react';
import { Box, Image } from 'native-base';
import { Dimensions } from 'react-native';

// const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Masthead = ({ image, children }) => {
  const [imageStatus, setImageStatus] = useState('Not Loaded');

  return (
    <Box h={`${screenHeight * 0.17}px`} pb={5}>
      <Image
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        w="full"
        h={`${screenHeight * 0.113}px`}
        resizeMode="cover"
        source={image}
        alt="masthead image"
      />

      {children}
      <Box flex={1} />
    </Box>
  );
};

export default Masthead;
