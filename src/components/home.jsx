import React, { useState, useEffect, useRef } from "react";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Icon,
  Spacer,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon,
  EditIcon,
  SettingsIcon,
} from "@chakra-ui/icons";

const EditableInputWithDropdown = () => {
  const [items, setItems] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // 로컬 스토리지에서 목록 불러오기
    const savedItems = JSON.parse(localStorage.getItem("sites")) || ["Asda"];
    setItems(savedItems);
  }, []);

  const handleItemClick = (item) => {
    inputRef.current.blur(); // 인풋 필드 포커스 해제
  };

  return (
    <ChakraProvider>
      <Box
        maxW="md"
        mx="auto"
        mt={10}
        p={6}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
      >
        <FormControl>
          <FormLabel>사이트 선택</FormLabel>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<ChevronDownIcon />}
                  onClick={() => inputRef.current.focus()} // 버튼 클릭 시 인풋 필드 포커스
                >
                  {isOpen ? "Select Item" : "Select Item"}
                </MenuButton>

                {isOpen && (
                  <MenuList>
                    {items.map((item, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleItemClick(item)}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </MenuList>
                )}
              </>
            )}
          </Menu>
        </FormControl>
        <Button w="full" colorScheme="blue" size="lg" mt={2}>
          시작
        </Button>
      </Box>
      <Flex mt={2}>
        <Spacer />
        <Button mr={4} leftIcon={<SettingsIcon />}>
          설정
        </Button>
      </Flex>
    </ChakraProvider>
  );
};

export default EditableInputWithDropdown;
