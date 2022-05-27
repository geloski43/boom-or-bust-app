import React from 'react';
import {
  Skeleton,
  VStack,
  Stack,
  Center,
  HStack,
  Box,
  Flex,
} from 'native-base';
import { Animated } from 'react-native';

export const GamePlaceholder = () => {
  return (
    <Box
      mt="10"
      rounded="sm"
      borderWidth="1"
      p="2"
      overflow="hidden"
      borderColor="coolGray.200"
      backgroundColor="gray.200"
      _dark={{
        borderColor: 'coolGray.600',
        backgroundColor: 'gray.500',
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
    >
      <Center>
        <Skeleton h="20px" w="100px" />
      </Center>
      <Stack justifyContent="space-between" direction="row">
        <Stack alignItems="center" mx="2" direction="column" space={3}>
          <Skeleton
            borderWidth={1}
            borderColor="coolGray.200"
            endColor="warmGray.50"
            size="100px"
            rounded="sm"
          />
          <Skeleton.Text lines={1} w="100px" />
          <Skeleton.Text lines={1} w="5" />
        </Stack>
        <Stack alignItems="center" space={3} mx="2" direction="column">
          <Skeleton
            borderWidth={1}
            borderColor="coolGray.200"
            endColor="warmGray.50"
            size="100px"
            rounded="sm"
          />
          <Skeleton.Text lines={1} w="100px" />
          <Skeleton.Text lines={1} w="5" />
        </Stack>
      </Stack>
      <Skeleton.Text alignSelf="center" lines={1} w="10" />

      <Stack space={2} alignItems="center" mt="6" direction="column">
        <Skeleton.Text lines={1} w="85px" />
        <Skeleton.Text lines={1} w="65px" />
      </Stack>
    </Box>
  );
};

export const GamesPlaceholder = () => {
  return (
    <>
      <HStack justifyContent="space-around">
        <Skeleton
          w="180px"
          px="1"
          my="2"
          rounded="sm"
          startColor="warmGray.500"
        />
        <Skeleton
          w="180px"
          px="1"
          my="2"
          rounded="sm"
          startColor="warmGray.500"
        />
      </HStack>
      <>
        {Array.from(Array(7).keys()).map((v, i) => (
          <Box
            my="1"
            rounded="sm"
            p="2"
            key={i}
            borderWidth="1"
            overflow="hidden"
            borderColor="coolGray.200"
            backgroundColor="gray.200"
            _dark={{
              borderColor: 'coolGray.600',
              backgroundColor: 'gray.500',
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
          >
            <Skeleton
              alignSelf="center"
              w="100px"
              h="20px"
              endColor="warmGray.50"
            />
            <HStack justifyContent="space-between">
              <VStack space={2} px="2">
                <HStack space={3}>
                  <Skeleton
                    borderWidth={1}
                    borderColor="coolGray.200"
                    endColor="warmGray.50"
                    size={25}
                    rounded="sm"
                  />
                  <Skeleton.Text
                    endColor="warmGray.50"
                    alignSelf="flex-end"
                    lines={1}
                    w="10"
                  />
                  <Skeleton.Text
                    endColor="warmGray.50"
                    alignSelf="flex-end"
                    lines={1}
                    w="5"
                  />
                </HStack>
                <HStack space={3}>
                  <Skeleton
                    borderWidth={1}
                    borderColor="coolGray.200"
                    endColor="warmGray.50"
                    size={25}
                    rounded="sm"
                  />
                  <Skeleton.Text
                    endColor="warmGray.50"
                    alignSelf="flex-end"
                    lines={1}
                    w="10"
                  />
                  <Skeleton.Text
                    endColor="warmGray.50"
                    alignSelf="flex-end"
                    lines={1}
                    w="5"
                  />
                </HStack>
              </VStack>
              <VStack justifyContent="flex-end">
                <Skeleton.Text endColor="warmGray.50" lines={2} w="20" />
              </VStack>
            </HStack>
          </Box>
        ))}
      </>
    </>
  );
};

export const PlayersPlaceholder = () => {
  return (
    <>
      <HStack justifyContent="space-around">
        <Skeleton
          w="180px"
          px="1"
          my="2"
          rounded="sm"
          startColor="warmGray.500"
        />
        <Skeleton
          w="180px"
          px="1"
          my="2"
          rounded="sm"
          startColor="warmGray.500"
        />
      </HStack>
      <Box alignItems="center">
        {Array.from(Array(4).keys()).map((v, i) => (
          <Flex m="1" mx="2" h={170} key={i} direction="row">
            <Center
              m="1"
              w="50%"
              rounded="sm"
              borderWidth="1"
              overflow="hidden"
              borderColor="coolGray.200"
              backgroundColor="gray.200"
              _dark={{
                borderColor: 'coolGray.600',
                backgroundColor: 'gray.500',
              }}
              _web={{
                shadow: 2,
                borderWidth: 0,
              }}
            >
              <VStack space={2} alignItems="center">
                <Skeleton
                  borderColor="coolGray.200"
                  endColor="warmGray.50"
                  size="70px"
                  rounded="sm"
                />
                <Stack mt="5" alignItems="center" space={2} direction="column">
                  <Skeleton.Text lines={1} w="80px" />
                  <Skeleton.Text lines={1} w="100px" />
                </Stack>
              </VStack>
            </Center>

            <Center
              m="1"
              w="50%"
              rounded="sm"
              borderWidth="1"
              overflow="hidden"
              borderColor="coolGray.200"
              backgroundColor="gray.200"
              _dark={{
                borderColor: 'coolGray.600',
                backgroundColor: 'gray.500',
              }}
              _web={{
                shadow: 2,
                borderWidth: 0,
              }}
            >
              <VStack space={2} alignItems="center">
                <Skeleton
                  borderColor="coolGray.200"
                  endColor="warmGray.50"
                  size="70px"
                  rounded="sm"
                />

                <Stack mt="5" alignItems="center" space={2} direction="column">
                  <Skeleton.Text lines={1} w="80px" />
                  <Skeleton.Text lines={1} w="100px" />
                </Stack>
              </VStack>
            </Center>
          </Flex>
        ))}
      </Box>
    </>
  );
};

export const TeamPlaceholder = () => {
  return (
    <Box mt="10" alignItems="center">
      <VStack
        w="100%"
        maxW="400"
        borderWidth="1"
        space={8}
        overflow="hidden"
        rounded="sm"
        _dark={{
          borderColor: 'coolGray.500',
        }}
        _light={{
          borderColor: 'coolGray.200',
        }}
      >
        <VStack alignItems="flex-end">
          <Skeleton
            m="4"
            borderWidth={1}
            borderColor="coolGray.200"
            endColor="warmGray.50"
            size="20"
            rounded="sm"
          />
          <Skeleton.Text mx="4" mb="4" lines={1} w="24" />
        </VStack>

        <Skeleton h="500px" />
      </VStack>
    </Box>
  );
};

export const TeamsPlaceholder = () => {
  return (
    <>
      <HStack justifyContent="flex-end">
        <Skeleton
          w="150px"
          px="1"
          my="2"
          rounded="sm"
          startColor="warmGray.500"
        />
        <Skeleton
          w="150px"
          px="1"
          my="2"
          rounded="sm"
          startColor="warmGray.500"
        />
      </HStack>
      {Array.from(Array(10).keys()).map((v, i) => (
        <HStack
          py="2"
          key={i}
          px="4"
          borderWidth="1"
          space={6}
          rounded="sm"
          alignItems="center"
          _dark={{
            borderColor: 'coolGray.500',
          }}
          _light={{
            borderColor: 'coolGray.200',
          }}
        >
          <Skeleton
            borderWidth={1}
            borderColor="coolGray.200"
            startColor="warmGray.500"
            size="50px"
            rounded="full"
          />
          <VStack flex="1" space="2">
            <Skeleton
              w="100px"
              h="3"
              rounded="full"
              startColor="warmGray.500"
            />
            <Skeleton h="3" w="50px" rounded="full" startColor="warmGray.500" />
          </VStack>
          <VStack alignItems="flex-end" flex="1" space="2">
            <Skeleton
              w="100px"
              h="3"
              rounded="full"
              startColor="warmGray.500"
            />
            <Skeleton h="3" w="50px" rounded="full" startColor="warmGray.500" />
          </VStack>
        </HStack>
      ))}
    </>
  );
};

export const PlayerHeaderPlaceholder = () => {
  return (
    <Animated.View
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 4,
      }}
    >
      <Skeleton
        borderWidth={1}
        borderColor="coolGray.200"
        startColor="warmGray.300"
        size="90px"
        rounded="sm"
        mb="8"
      />
      <Skeleton.Text startColor="warmGray.200" m="1" lines={1} w="125px" />
      <Skeleton.Text startColor="warmGray.200" m="1" lines={1} w="150px" />
      <Skeleton.Text startColor="warmGray.200" m="1" lines={1} w="150px" />
      <Skeleton.Text startColor="warmGray.200" m="1" lines={1} w="150px" />
      <Skeleton.Text
        startColor="warmGray.200"
        m="1"
        lines={1}
        ml="6"
        w="105px"
      />
    </Animated.View>
  );
};
