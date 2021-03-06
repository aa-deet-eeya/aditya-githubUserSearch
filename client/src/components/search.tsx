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
import { Link } from "react-router-dom";

interface Result {
  id: string;
  avatar_url: string;
  login: string;
  url: string;
}

const userBox = (user: Result) => {
  return (
    <Link key={user.id} to={`/u/${user.login}`}>
      <Box p={4}>{user.login}</Box>
    </Link>
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
          //console.log(res.data);
          setResult(res.data.items);
        })
        .catch((error) => {
          //console.log(error);
        });
  }, [input]);
  //console.log(input);
  const finalRef: any = React.useRef();
  return (
    <>
      <Box ref={finalRef} onClick={onOpen}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input type="text" placeholder="Search for Users" />
        </InputGroup>
      </Box>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
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
              <Box
                onClick={onClose}
                m={2}
                w="100%"
                h="500px"
                overflowY="scroll"
              >
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
