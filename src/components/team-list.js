import React from 'react';
import {
  FlatList,
  Image,
  Box,
  Text,
  VStack,
  Spacer,
  HStack,
} from 'native-base';
import SelectTeams from './select-teams';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const TeamList = ({ data, toFilter, setToFilter }) => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    return (
      <Box
        borderBottomWidth="1"
        _dark={{
          borderColor: 'gray.600',
        }}
        borderColor="coolGray.200"
        pl="4"
        pr="5"
        py="2"
        mb="2"
      >
        <HStack space={3} justifyContent="space-between">
          <Image
            size={50}
            resizeMode={'contain'}
            borderRadius="sm"
            source={item.logo}
            alt="Alternate Text"
          />
          <VStack>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Team', {
                  itemId: item.id,
                  itemName: item.full_name,
                });
              }}
            >
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800"
                bold
              >
                {item.full_name}
              </Text>
            </TouchableOpacity>
            <Text
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
            >
              {item.conference}
            </Text>
          </VStack>
          <Spacer />
          <VStack>
            <Text
              fontSize="xs"
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              alignSelf="flex-end"
            >
              {item.division}
            </Text>
            <Text
              fontSize="xs"
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              alignSelf="flex-end"
            >
              Division
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  };

  return (
    <>
      <HStack mb="2" justifyContent="flex-end">
        <SelectTeams
          items={['All', 'East', 'West']}
          setSelected={setToFilter}
          placeHolder="Conference"
          selectedValue={toFilter}
          objKey={'conference'}
        />
        <SelectTeams
          items={[
            'All',
            'Atlantic',
            'Central',
            'Southeast',
            'Northwest',
            'Pacific',
            'Southwest',
          ]}
          setSelected={setToFilter}
          placeHolder="Division"
          selectedValue={toFilter}
          objKey={'division'}
        />
      </HStack>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
  );
};

export default TeamList;
