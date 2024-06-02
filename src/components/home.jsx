import React, { useState, useEffect } from "react";
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
  Select,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon,
  EditIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import Setting from "./setting";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

export const HomePage = () => {
  const [sitesData, setSitesData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const listenToCollection = () => {
      const docRef = doc(db, "sitesData", user.uid);

      // 실시간 리스너 설정
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSitesData(data);
          } else {
            console.log("No such document❌❌❌");
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error listening to collection:", error);
          setIsLoading(false);
        }
      );

      return unsubscribe; // 리스너를 중지하기 위한 함수 반환
    };
    const unsubcribe = listenToCollection();
    return () => unsubcribe();
  }, [user]);
  if (isLoading) {
    return (
      <ChakraProvider>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Spinner size="xl" />
        </Box>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider>
      <Setting
        isOpen={isOpen}
        onClose={onClose}
        sitesData={sitesData}
        setSitesData={setSitesData}
        user={user}
      />
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
          <Select>
            {Object.entries(sitesData).map(([key, site], i) => {
              return (
                <option key={key} value={site}>
                  {site.name}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <Button w="full" colorScheme="blue" size="lg" mt={2}>
          시작
        </Button>
      </Box>
      <Flex mx="auto" maxW="md" mt={2}>
        <Spacer />
        <Button leftIcon={<SettingsIcon />} onClick={onOpen}>
          설정
        </Button>
      </Flex>
    </ChakraProvider>
  );
};

export default HomePage;
