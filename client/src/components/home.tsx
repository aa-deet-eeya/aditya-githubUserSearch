import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

interface HomeI {
  isAuthenticated: boolean;
  user: {
    username: string;
    favs: string[];
    email: string;
  };
}

const Home: React.FC<HomeI> = (props) => {
  return (
    <Box>
      {props.isAuthenticated ? (
        <Flex w="100%">
          <Box
            h="125px"
            w="40%"
            m={1}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
          >
            <Stack spacing={3}>
              <Text textAlign="left" fontSize="xl">
                Username : {props.user.username}
              </Text>
              <Text textAlign="left" fontSize="xl">
                Email : {props.user.email}
              </Text>
            </Stack>
          </Box>
          <Box w="30%" m={1} p={4} borderWidth="1px" borderRadius="lg">
            <Text textAlign="left" fontSize="2xl">
              Fav Users :
            </Text>
            {props.user.favs.length === 0 ? (
              <Text fontSize="lg">Nothing here :(</Text>
            ) : (
              props.user.favs.map((fav) => (
                <Box key={fav} textAlign="left" color="teal" p={2}>
                  <Link to={`/u/${fav}`}>++ {fav}</Link>
                </Box>
              ))
            )}
          </Box>
        </Flex>
      ) : (
        <Box>
          <Text textAlign="left" fontSize="2xl">
            Not Logged In
          </Text>
          <Link to="/login">
            <Button>Login In Now</Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default Home;
