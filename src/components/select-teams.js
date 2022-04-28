import React from 'react';
import { VStack, Select, CheckIcon } from 'native-base';

const SelectTeams = ({
  items,
  setSelected,
  placeHolder,
  selectedValue,
  objKey,
}) => {
  return (
    <VStack>
      <Select
        shadow={2}
        selectedValue={selectedValue[objKey]}
        minWidth="95"
        accessibilityLabel={placeHolder}
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size="5" />,
        }}
        _light={{
          bg: 'coolGray.100',
        }}
        _dark={{
          bg: 'coolGray.800',
        }}
        onValueChange={(itemValue) =>
          objKey === 'conference'
            ? setSelected({ division: 'All', [objKey]: itemValue })
            : setSelected({ conference: 'All', [objKey]: itemValue })
        }
      >
        {items.map((item) => (
          <Select.Item
            key={item}
            shadow={2}
            label={`${item} ${placeHolder}`}
            value={item}
          />
        ))}
      </Select>
    </VStack>
  );
};

export default SelectTeams;
