import React from 'react';
import {
  Icon,
  Modal,
  FormControl,
  Input,
  WarningOutlineIcon,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SetPlayerModal = ({
  isOpen,
  setIsOpen,
  header,
  placeholder,
  query,
  searchPlayer,
  handleSearchChange,
  clearQuery,
}) => {
  const initialRef = React.useRef(null);

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>{header}</Modal.Header>
        <Modal.Body>
          <FormControl isInvalid={query.length === 0} w="55%" maxW="300px">
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Please enter a name
            </FormControl.ErrorMessage>
            <Input
              ref={initialRef}
              h="38px"
              onSubmitEditing={() => {
                searchPlayer(query, 1);
                setIsOpen(false);
              }}
              // this will prevent auto scroll top when the input is focused
              // instead move to index save to playerlistscrollposition state
              bg="blueGray.300"
              _dark={{ bg: 'blueGray.600' }}
              value={query}
              onChangeText={handleSearchChange}
              placeholder={placeholder}
              variant="filled"
              borderRadius="10"
              my="1"
              px="2"
              borderWidth="0"
              InputLeftElement={
                query.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      clearQuery();
                    }}
                  >
                    <Icon
                      mx="2"
                      size="4"
                      color="red.400"
                      as={<Ionicons name="close-circle-outline" />}
                    />
                  </TouchableOpacity>
                )
              }
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    searchPlayer(query, 1);
                    setIsOpen(false);
                  }}
                >
                  <Icon
                    mr="2"
                    size="4"
                    color="gray.400"
                    as={<Ionicons name="send-outline" />}
                  />
                </TouchableOpacity>
              }
            />
          </FormControl>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default SetPlayerModal;
