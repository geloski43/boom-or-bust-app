import React, { useState } from 'react';
import {
  Button,
  FormControl,
  VStack,
  Text,
  Switch,
  Popover,
  Icon,
} from 'native-base';
import NumericInput from 'react-native-numeric-input';
import { Ionicons } from '@expo/vector-icons';

const SeasonOption = ({
  setSeason,
  fetchStats,
  setIsPostSeason,
  player,
  num,
  setNum,
  truthy,
  setTruthy,
  size,
  margin,
  placement,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTruthy = () => setTruthy(!truthy);

  return (
    <Popover
      placement={placement}
      trigger={(triggerProps) => {
        return (
          <Button
            mt={margin}
            {...triggerProps}
            _pressed={{ colorScheme: 'dark', borderRadius: 'full' }}
            variant="ghost"
            onPress={() => setIsOpen(true)}
            _dark={{ colorScheme: 'blueGray' }}
            m="1"
            alignSelf="flex-start"
            leftIcon={
              <Icon
                size={size}
                as={Ionicons}
                name="options-outline"
                color="warning.800"
              />
            }
          />
        );
      }}
      isOpen={isOpen}
      onClose={() => setIsOpen(!isOpen)}
    >
      <Popover.Content w="56">
        <Popover.Arrow />
        <Popover.CloseButton onPress={() => setIsOpen(false)} />
        <Popover.Header>Season options</Popover.Header>
        <Popover.Body>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>
                <Text fontFamily="Oswald-Regular">Year</Text>
              </FormControl.Label>
              <NumericInput
                type="up-down"
                value={num}
                onChange={(value) => setNum(value)}
                totalWidth={197}
                totalHeight={50}
                step={1}
                valueType="real"
                rounded
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                <Text fontFamily="Oswald-Regular">
                  {truthy ? 'Playoffs' : 'Regular season'}
                </Text>
              </FormControl.Label>
              <Switch
                isChecked={truthy}
                onToggle={toggleTruthy}
                aria-label={
                  !truthy ? 'switch to playoffs' : 'switch to regular season'
                }
                alignSelf="flex-start"
                size="md"
                offTrackColor="orange.100"
                onTrackColor="orange.200"
                onThumbColor="orange.500"
                offThumbColor="muted.500"
              />
            </FormControl>
          </VStack>
        </Popover.Body>
        <Popover.Footer justifyContent="flex-end">
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="warning"
              onPress={() => {
                setSeason(num);
                setIsPostSeason(truthy);
                fetchStats(num, player && player.id, truthy);
                setIsOpen(false);
              }}
            >
              Get stats
            </Button>
          </Button.Group>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  );
};

export default SeasonOption;
