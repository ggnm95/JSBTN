import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { auth, db, firestore } from "../firebase";
export const SignUp = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userIdError, setUserIdError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setUserIdError("");
    if (password.length < 6) {
      setPasswordError("비밀번호는 6자리 이상이어야 합니다.");
      return;
    }
    // Firestore에서 userId 중복 확인
    try {
      const userQuery = query(
        collection(firestore, "users"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        setUserIdError("이미 사용중인 아이디입니다.");
        return;
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const currentTime = new Date();
      // 사용자 데이터 Firestore에 저장
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        userId: userId,
        password: password,
        approved: false, // 관리자 승인 여부 초기값
        createdAt: currentTime,
      });
      onClose();
      setEmail("");
      setUserId("");
      setPassword("");
      console.log("User signed up:", user);
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원 가입</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSignUp}>
            <FormControl id="email" isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="userId" isRequired isInvalid={userIdError}>
              <FormLabel htmlFor="userId">아이디</FormLabel>
              <Input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              {userIdError && (
                <FormErrorMessage>{userIdError}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl id="password" isRequired isInvalid={passwordError}>
              <FormLabel htmlFor="password">비밀번호</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              )}
            </FormControl>

            <Button colorScheme="blue" mt={4} type="submit">
              가입
            </Button>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default SignUp;
