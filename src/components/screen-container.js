import React from 'react';
import { useColorModeValue } from 'native-base';
import AnimatedColorBox from './animated-color-box';
import MastHead from './masthead';
import NavBar from './navbar';

const ScreenContainer = ({ children, image, title }) => {
  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'primary.900')}
      w="full"
    >
      <MastHead image={image}>
        <NavBar title={title} />
      </MastHead>
      {children}
    </AnimatedColorBox>
  );
};

export default ScreenContainer;
