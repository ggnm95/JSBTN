import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";

export const Setting = ({ isOpen, onClose, sitesData, setSitesData, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSiteData, setSelectedSiteData] = useState({
    createAt: "",
    name: "",
    url: "",
    id: "",
    password: "",
    logo: "",
  });
  const [siteNum, setSiteNum] = useState("");

  const [arraySiteData, setArraySiteData] = useState(Object.entries(sitesData));

  const showPasswordClicked = () => setShowPassword(!showPassword);
  const navigate = useNavigate();
  const currentTime = new Date();
  const toast = useToast();

  useEffect(() => {
    setArraySiteData(Object.entries(sitesData));
  }, [sitesData]);

  const handleSelectChange = (e) => {
    console.log("change:", e.target.value);
    if (e.target.value === "add" || e.target.value === "") {
      setSelectedSiteData({
        createAt: "",
        name: "",
        url: "",
        id: "",
        password: "",
        logo: "",
      });
    } else {
      const selectedSite = arraySiteData.find((s) => s[0] === e.target.value);
      setSelectedSiteData({
        name: selectedSite[1].name,
        url: selectedSite[1].url,
        id: selectedSite[1].id,
        password: selectedSite[1].password,
        logo: selectedSite[1].logo,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("저장");
    if (!user) {
      navigate("/");
      throw new Error("User is not authenticated");
    }
    if (siteNum === "add") {
      console.log("add");
      await setDoc(
        doc(db, "sitesData", user.uid),
        {
          [currentTime]: {
            name: selectedSiteData.name,
            url: selectedSiteData.url,
            id: selectedSiteData.id,
            password: selectedSiteData.password,
            logo: selectedSiteData.logo,
          },
        },
        { merge: true }
      );
      setSiteNum(currentTime);
      return;
    }
    try {
      await setDoc(
        doc(db, "sitesData", user.uid),
        {
          [siteNum]: {
            name: selectedSiteData.name,
            url: selectedSiteData.url,
            id: selectedSiteData.id,
            password: selectedSiteData.password,
            logo: selectedSiteData.logo,
          },
        },
        { merge: true }
      );
      toast({
        title: "저장되었습니다.",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (e) => {
    try {
      const docRef = doc(db, "sitesData", user.uid);
      await updateDoc(docRef, {
        [siteNum]: deleteField(),
      });
      setSelectedSiteData({
        createAt: "",
        name: "",
        url: "",
        id: "",
        password: "",
        logo: "",
      });
      setSiteNum("");
      console.log(selectedSiteData.name, "이 삭제 되었습니다.");
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>설정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>사이트 선택</FormLabel>
              <Select
                placeholder="설정하실 사이트를 선택해주세요."
                value={siteNum}
                onChange={(e) => {
                  setSiteNum(e.target.value);
                  handleSelectChange(e);
                }}
              >
                {Object.entries(sitesData).map(([key, site], i) => {
                  return (
                    <option key={key} value={key}>
                      {site.name}
                    </option>
                  );
                })}
                <option value="add">사이트 추가</option>
              </Select>
            </FormControl>

            <Tabs>
              <TabList>
                <Tab>기본 설정</Tab>
                <Tab>관리자 설정</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <FormControl isRequired>
                    <FormLabel>사이트 명칭</FormLabel>
                    <Input
                      value={selectedSiteData.name}
                      onChange={(e) =>
                        setSelectedSiteData((prevdata) => ({
                          ...prevdata,
                          name: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>사이트 URL</FormLabel>
                    <Input
                      type="url"
                      value={selectedSiteData.url}
                      onChange={(e) =>
                        setSelectedSiteData((prevdata) => ({
                          ...prevdata,
                          url: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>사이트 아이디</FormLabel>
                    <Input
                      value={selectedSiteData.id}
                      onChange={(e) =>
                        setSelectedSiteData((prevdata) => ({
                          ...prevdata,
                          id: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>사이트 비밀번호</FormLabel>
                    <InputGroup size="md">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={selectedSiteData.password}
                        onChange={(e) =>
                          setSelectedSiteData((prevdata) => ({
                            ...prevdata,
                            password: e.target.value,
                          }))
                        }
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          onClick={showPasswordClicked}
                          icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </TabPanel>
                <TabPanel>
                  <FormControl>
                    <FormLabel>사이트 로고</FormLabel>
                    <Input
                      type="url"
                      value={selectedSiteData.logo}
                      onChange={(e) =>
                        setSelectedSiteData((prevdata) => ({
                          ...prevdata,
                          logo: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </form>
        </ModalBody>
        <ModalFooter>
          {siteNum && (
            <ButtonGroup gap={1}>
              <Button colorScheme="blue" onClick={handleSubmit}>
                저장
              </Button>
              <Button colorScheme="pink" onClick={onClose}>
                취소
              </Button>
              {siteNum !== "add" && (
                <Button colorScheme="red" onClick={handleDelete}>
                  삭제
                </Button>
              )}
            </ButtonGroup>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default Setting;
