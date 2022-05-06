<VStack
  m="1"
  rounded="sm"
  borderWidth="1"
  p="2"
  justifyContent="center"
  alignItems="center"
>
  <Center m="1" w="50%" rounded="sm" borderWidth="1">
    <VStack space={2} alignItems="center">
      <Skeleton
        borderWidth={1}
        borderColor="coolGray.200"
        endColor="warmGray.50"
        size="200px"
        rounded="lg"
      />
      <Stack mt="5" alignItems="center" space={2} direction="column">
        <Skeleton.Text lines={1} w="80px" />
        <Skeleton.Text lines={1} w="100px" />
      </Stack>
    </VStack>
  </Center>
</VStack>;
