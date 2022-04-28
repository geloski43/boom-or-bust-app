import React from 'react';
import {
  Heading,
  Stack,
  VStack,
  Text,
  Box,
  Image,
  ScrollView,
  Container,
  Link,
} from 'native-base';

const TeamProfile = ({ teamBasicInfo, teamDetailedInfo }) => {
  return (
    <Box flex={1} my="5" alignItems="center">
      <Box
        minW="90%"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: 'coolGray.600',
          backgroundColor: 'gray.700',
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}
      >
        <Stack p="4" space={3}>
          <VStack alignItems="flex-end">
            <Image
              key={teamBasicInfo.city}
              size="20"
              resizeMode={'contain'}
              borderRadius="sm"
              source={teamBasicInfo.logo}
              alt="Alternate Text"
            />
            <Heading fontFamily="Oswald-Bold" size="xs">
              {teamBasicInfo.full_name}
            </Heading>
          </VStack>
          <ScrollView>
            <VStack space={4} justifyContent="space-between">
              {teamDetailedInfo &&
                teamDetailedInfo.map((v, i) => (
                  <Container key={i} alignItems="flex-start">
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
          </ScrollView>
        </Stack>
      </Box>
    </Box>
  );
};

export default TeamProfile;
