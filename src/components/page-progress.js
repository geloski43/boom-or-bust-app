import React from 'react';
import { Text, Stack, ZStack, IconButton } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { AntDesign } from '@expo/vector-icons';

const PageProgress = ({ progress, moveToTop }) => {
  return (
    <Stack
      my="1"
      px="2"
      borderRadius="sm"
      bg="blueGray.300"
      _dark={{ bg: 'blueGray.800' }}
      direction="row"
      alignSelf="flex-end"
    >
      <IconButton
        alignSelf="center"
        onPress={moveToTop}
        _icon={{
          as: AntDesign,
          name: 'arrowup',
          size: 'xs',
          color: 'lightBlue.800',
        }}
      />
      <ZStack mx="3" justifyContent="center" mb="-1" pt="1">
        <Text
          alignSelf="center"
          bg="muted.300"
          mt="8"
          fontSize="10px"
          fontFamily="Oswald-Bold"
          borderRadius="md"
          _dark={{ bg: 'warning.800' }}
        >
          {progress}%
        </Text>
        <AnimatedCircularProgress
          size={38}
          width={5}
          backgroundWidth={5}
          fill={progress}
          tintColor="#00ff00"
          tintColorSecondary="#ff0000"
          backgroundColor="#43688f"
          arcSweepAngle={240}
          rotation={240}
          lineCap="round"
        />
      </ZStack>
    </Stack>
  );
};
export default PageProgress;
