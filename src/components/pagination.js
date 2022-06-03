import React from 'react';
import { usePagination, DOTS } from '../hooks/use-pagination';
import { HStack, Text, IconButton, Button, useColorMode } from 'native-base';
import { EvilIcons } from '@expo/vector-icons';
import { responsiveWidth } from '../utils/utils';

const Pagination = (props) => {
  const { colorMode } = useColorMode();

  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <>
      <HStack
        alignItems="center"
        justifyContent="center"
        pr={responsiveWidth(0.5)}
        flex={1}
      >
        {/* Left navigation arrow */}
        <IconButton
          _pressed={{
            bg: colorMode === 'dark' ? 'warning.300' : 'warning.100',
          }}
          disabled={currentPage === 1}
          variant={'ghost'}
          onPress={() => {
            onPrevious();
          }}
          _icon={{
            as: EvilIcons,
            name: 'arrow-left',
            size: 6,
            color: colorMode === 'dark' ? 'white' : 'black',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        />
        {paginationRange.map((pageNumber) => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber === DOTS) {
            return (
              <Text mt="-5" fontSize="4xl">
                &#8230;
              </Text>
            );
          }
          // Page Pills
          return (
            <Button
              _pressed={{
                bg: colorMode === 'dark' ? 'warning.300' : 'warning.100',
              }}
              m="1px"
              variant={'ghost'}
              borderRadius={2}
              size="sm"
              bg={pageNumber === currentPage ? 'warning.500' : 'transparent'}
              onPress={() => onPageChange(pageNumber)}
            >
              <Text>{pageNumber}</Text>
            </Button>
          );
        })}
        {/*  Right Navigation arrow */}
        <IconButton
          _pressed={{
            bg: colorMode === 'dark' ? 'warning.300' : 'warning.100',
          }}
          disabled={currentPage === lastPage}
          variant={'ghost'}
          onPress={() => {
            onNext();
          }}
          _icon={{
            as: EvilIcons,
            name: 'arrow-right',
            size: 6,
            color: colorMode === 'dark' ? 'white' : 'black',
            opacity: currentPage === lastPage ? 0.5 : 1,
          }}
        />
      </HStack>
    </>
  );
};

export default Pagination;
