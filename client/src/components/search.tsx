import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  InputGroup,
  InputLeftElement,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Box,
  Center,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface Result {
  id: string;
  avatar_url: string;
  login: string;
  url: string;
}

const userBox = (user: Result) => {
  return (
    <Box key={user.id} p={4}>
      {user.login}
    </Box>
  );
};

export const SearchBar: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState([]);

  //   let result = {}
  useEffect(() => {
    if (input.length > 1)
      axios
        .get(`https://api.github.com/search/users?per_page=20&q=${input}`)
        .then((res) => {
          console.log(res.data);
          setResult(res.data.items);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [input]);

  console.log(input);
  return (
    <>
      <Box onClick={onOpen}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input type="text" placeholder="Search for Users" />
        </InputGroup>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                type="text"
                placeholder="Search for Users"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </InputGroup>
            {input.length > 1 && result.length > 1 && (
              <Box m={2} w="100%" h="500px" overflowY="scroll">
                {result.map((user) => {
                  return userBox(user);
                })}
              </Box>
            )}
            {input.length > 1 && result.length === 0 && (
              <Center m={4}>No User Found</Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
