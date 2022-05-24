import React, { useState, useContext } from 'react';
import { Modal, Button, FormControl, VStack, Text, Switch } from 'native-base';
import NumericInput from 'react-native-numeric-input';
import { Context as ModalContext } from '../../context/modal-context';

const SeasonOptionModal = ({
  setSeason,
  fetchStats,
  setIsPostSeason,
  player,
  season,
  isPostSeason,
}) => {
  const modalContext = useContext(ModalContext);
  const showSeasonOptionModal = modalContext.state.showSeasonOptionModal;

  const [num, setNum] = useState(parseInt(season));
  const [truthy, setTruthy] = useState(isPostSeason);

  const toggleTruthy = () => setTruthy(!truthy);

  return (
    <Modal
      size="xs"
      isOpen={showSeasonOptionModal}
      onClose={() => modalContext.closeSeasonOptionModal()}
    >
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>
          <Text fontFamily="Oswald-Medium">Season options</Text>
        </Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>
                <Text fontFamily="Oswald-Regular">Year</Text>
              </FormControl.Label>
              <NumericInput
                type="up-down"
                value={num}
                onChange={(value) => setNum(value)}
                totalWidth={212}
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
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                modalContext.closeSeasonOptionModal();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="warning"
              onPress={() => {
                setSeason(num);
                setIsPostSeason(truthy);
                fetchStats(num, player.id, truthy);
                modalContext.closeSeasonOptionModal();
              }}
            >
              Get stats
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default SeasonOptionModal;
