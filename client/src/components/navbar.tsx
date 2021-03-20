import { HamburgerIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  // Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
// import { useEffect } from "react";
import Cookies from "universal-cookie";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { SearchBar } from "./search";

interface navbarProps {
  isAuthenticated: boolean;
  user: {
    username: string;
    favs: string[];
    email: string;
  };
}

const logout = () => {
  //console.log("logout");
  const cookie = new Cookies();
  cookie.set("fav", []);
  cookie.set("githubUserSearch-session", "remove", {
    path: "/",
    sameSite: "strict",
  });
  cookie.remove("githubUserSearch-session", {
    path: "/",
    sameSite: "strict",
  });
  cookie.remove("fav");
  window.location.reload();
};

export const Navbar: React.FC<navbarProps> = (props) => {
  const { isAuthenticated, user } = props;
  return (
    <Flex justifyContent="space-between" borderBottom="1px solid #fff" p={2}>
      <Link to="/">
        <Button>Github Users</Button>
      </Link>
      <Flex>
        <SearchBar />
        {isAuthenticated && (
          <Menu>
            <MenuButton
              ml={2}
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <Text p={4} textAlign="center" fontSize="lg">
                Logged In as {user.username}
              </Text>
              <MenuItem icon={<ExternalLinkIcon />} onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        <ColorModeSwitcher justifySelf="flex-end" />
      </Flex>
    </Flex>
  );
};
