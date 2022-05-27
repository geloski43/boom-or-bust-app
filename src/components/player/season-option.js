import React, { useState, useContext } from 'react';
import { Icon, Button, FormControl, VStack, Text, Switch, Popover } from 'native-base';
import NumericInput from 'react-native-numeric-input';
import { Context as ModalContext } from '../../context/modal-context';
import { Ionicons } from '@expo/vector-icons';
import { width } from "../../utils/utils"

const SeasonOption = ({
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
        <Popover
            placement="left top"
            onClose={() => modalContext.closeSeasonOptionModal()}
            isOpen={showSeasonOptionModal}
            trigger={triggerProps => {
                return <Button
                    mt="5"
                    mr={width * 0.05}
                    hitSlop={{ top: 12, bottom: 12, right: 12, left: 12 }}
                    _pressed={{ colorScheme: 'dark', borderRadius: 'full' }}
                    variant="ghost"
                    {...triggerProps}
                    _dark={{ colorScheme: 'blueGray' }}
                    onPress={() => modalContext.openSeasonOptionModal()}
                    m="1"
                    rightIcon={
                        <Icon
                            size="27px"
                            as={Ionicons}
                            name="options-outline"
                            color="darkBlue.500"
                            _dark={{
                                color: 'warmGray.50',
                            }}
                        />
                    }
                />

            }}>
            <Popover.Content accessibilityLabel="Season Options" w="56">
                <Popover.Arrow />
                <Popover.CloseButton />
                <Popover.Header>Season Options</Popover.Header>
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
                </Popover.Body>
                <Popover.Footer justifyContent="flex-end">
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
                </Popover.Footer>
            </Popover.Content>
        </Popover>
    )
}

export default SeasonOption;
