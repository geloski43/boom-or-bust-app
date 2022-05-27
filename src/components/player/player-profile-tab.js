import React from 'react';
import {
  Text,
  VStack,
  Stack,
  Container,
  Link,
  Center,
  WarningOutlineIcon,
  Spinner,
  HStack,
} from 'native-base';

const PlayerProfileTab = ({
  playerProfile,
  isLoading,
  initialMount,
  averages,
}) => {
  const padding = averages.length > 0 ? '0%' : '25%';
  return (
    <>
      {!isLoading ? (
        <>
          {playerProfile && playerProfile.length > 0 ? (
            <VStack flex={1} space={3}>
              {playerProfile.map((v, i) => (
                <Container p="2" flex={1} key={i} alignItems="flex-start">
                  {v.label !== 'Instance of' && (
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: 'warmGray.200',
                      }}
                      fontFamily="Oswald-SemiBold"
                    >
                      {v.label}:
                    </Text>
                  )}

                  {typeof v.value === 'string' &&
                  v.data_type !== 'instagram_profile' &&
                  v.data_type !== 'twitter_profile' &&
                  v.data_type !== 'official_website' &&
                  v.data_type !== 'facebook_profile' ? (
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: 'warmGray.200',
                      }}
                      fontWeight="400"
                    >
                      {v.value}
                    </Text>
                  ) : (
                    <Link
                      href={
                        v.data_type === 'instagram_profile'
                          ? `https://www.instagram.com/${v.value}`
                          : v.data_type === 'twitter_profile'
                          ? `https://twitter.com/${v.value}`
                          : v.data_type === 'facebook_profile'
                          ? `https://www.facebook.com/${v.value}`
                          : v.data_type === 'official_website'
                          ? v.value
                          : null
                      }
                    >
                      {v.data_type === 'instagram_profile'
                        ? `https://www.instagram.com/${v.value}`
                        : v.data_type === 'twitter_profile'
                        ? `https://twitter.com/${v.value}`
                        : v.data_type === 'facebook_profile'
                        ? `https://www.facebook.com/${v.value}`
                        : v.data_type === 'official_website'
                        ? v.value
                        : null}
                    </Link>
                  )}
                </Container>
              ))}
            </VStack>
          ) : (
            <>
              {!initialMount && (
                <Stack
                  py="25%"
                  direction="row"
                  justifyContent="center"
                  space={2}
                >
                  <WarningOutlineIcon mt="1" size="xs" color="red.400" />
                  <Text
                    fontSize="15px"
                    fontFamily="Oswald-Regular"
                    color="red.400"
                  >
                    No profile data available
                  </Text>
                </Stack>
              )}
            </>
          )}
        </>
      ) : (
        <Center py={padding}>
          <HStack space={2} justifyContent="center">
            <Spinner color="blueGray.700" _dark={{ color: 'blueGray.200' }} />
            <Text
              fontFamily="Oswald-Bold"
              color="blueGray.700"
              _dark={{ color: 'blueGray.200' }}
              fontSize="md"
            >
              Loading profile
            </Text>
          </HStack>
        </Center>
      )}
    </>
  );
};

export default PlayerProfileTab;
