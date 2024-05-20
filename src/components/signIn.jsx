import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase";
import {
  FormLabel,
  Input,
  Checkbox,
  Button,
  FormControl,
  Box,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [approvedError, setApprovedError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setUserIdError("");
    setPasswordError("");
    console.log("핸들사인");

    console.log(userId, password);

    try {
      const q = query(
        collection(firestore, "users"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setUserIdError("존재하지 않는 아이디입니다.");
        return;
      }
      const user = querySnapshot.docs[0].data();
      console.log(user);
      const { email, approved } = user;
      if (!approved) {
        setApprovedError(true);
        return;
      }
      setApprovedError(false);

      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in");

      if (rememberMe) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("userId");
        localStorage.removeItem("password");
      }
      setUserId("");
      setPassword("");
    } catch (error) {
      setPasswordError("비밀번호가 틀립니다.");
    }
  };

  return (
    <div>
      <Heading>JSBTN</Heading>
      {approvedError && (
        <Alert status="error">
          <AlertIcon />
          권한이 없습니다.관리자에게 문의해주세요.
        </Alert>
      )}
      <Box
        maxW="md"
        mx="auto"
        mt={10}
        p={6}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
      >
        <SignUp isOpen={isOpen} onClose={onClose} />

        <form onSubmit={handleSignIn}>
          <FormControl id="userId" isRequired isInvalid={userIdError}>
            <FormLabel>아이디</FormLabel>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            ></Input>
            {userIdError && <FormErrorMessage>{userIdError}</FormErrorMessage>}
          </FormControl>
          <FormControl id="password" isRequired isInvalid={passwordError}>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></Input>
            {passwordError && (
              <FormErrorMessage>{passwordError}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="rememberMe">
            <Checkbox
              size="lg"
              mt={4}
              isChecked={rememberMe}
              onChange={(e) => {
                setRememberMe(e.target.checked);
              }}
            >
              자동 로그인
            </Checkbox>
          </FormControl>
          <Button colorScheme="blue" size="lg" w="full" mt={4} type="submit">
            로그인
          </Button>
          <Button colorScheme="pink" size="lg" w="full" mt={4} onClick={onOpen}>
            회원 가입
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default SignIn;
