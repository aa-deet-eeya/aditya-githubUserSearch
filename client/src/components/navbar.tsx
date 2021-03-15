import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { SearchBar } from "./search";

export const Navbar: React.FC = () => {
  return (
    <Flex justifyContent="space-between" borderBottom="1px solid #fff" p={2}>
      <Link>
        <Button>Github Users</Button>
      </Link>
      <Flex>
        <SearchBar />
        <ColorModeSwitcher justifySelf="flex-end" />
        <Box></Box>
      </Flex>
    </Flex>
  );
};
