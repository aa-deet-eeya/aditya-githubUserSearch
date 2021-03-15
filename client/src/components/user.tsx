import {
  Box,
  Button,
  // Center,
  Flex,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";

interface UserResult {
  id: string;
  name: string;
  blog: string;
  company: string;
  avatar_url: string;
  repos_url: string;
  login: string;
  location: string;
  bio: string;
  html_url: string;
  url: string;
}

interface Repo {
  id: string;
  name: string;
  fork: boolean;
  full_name: string;
  stargazers_count: string;
  html_url: string;
}

export const UserPage: React.FC = () => {
  const init = {
    id: "",
    name: "",
    blog: "",
    company: "",
    avatar_url: "",
    repos_url: "",
    login: "",
    location: "",
    bio: "",
    html_url: "",
    url: "",
  };
  let { user } = useParams() as { user: string };
  const [userDetails, setUserDetails] = useState<UserResult>(init);
  const [repos, setRepos] = useState<Repo[]>([]);
  useEffect(() => {
    setUserDetails(init);
    setRepos([]);
    axios
      .get(`https://api.github.com/users/${user}`)
      .then((res) => {
        // console.log(res);
        setUserDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    axios
      .get(userDetails.repos_url)
      .then((res) => {
        console.log(res.data);
        setRepos(res.data);
      })
      .catch((err) => console.log(err));
  }, [userDetails]);
  return (
    <>
      <Box ml={5} mr={5} p={4} borderWidth="1px" borderRadius="lg">
        <Flex>
          <Image
            m={4}
            borderRadius="full"
            boxSize="250px"
            src={userDetails.avatar_url}
            alt={userDetails.login}
          />
          <Stack spacing={3}>
            <Text textAlign="left" fontSize="4xl">
              {userDetails.name ? userDetails.name : userDetails.login}
            </Text>
            {userDetails.company && (
              <Text textAlign="left" fontSize="lg">
                Company : {userDetails.company}
              </Text>
            )}
            {userDetails.blog && (
              <Text textAlign="left" fontSize="lg">
                Blog: {userDetails.blog}
              </Text>
            )}
            {userDetails.location && (
              <Text textAlign="left" fontSize="lg">
                Location: {userDetails.location}
              </Text>
            )}
            {userDetails.bio && (
              <Text textAlign="left" fontSize="lg">
                Bio: {userDetails.bio}
              </Text>
            )}
            <Text textAlign="left" fontSize="lg">
              Github Link:
              <a style={{ color: "teal" }} href={userDetails.html_url}>
                @{userDetails.login}
              </a>
            </Text>
          </Stack>
        </Flex>
      </Box>
      <Flex justifyContent="space-between" p={4}>
        <Box w="50%">
          {repos.length === 0 ? (
            <Text ml={4} pl={2} textAlign="left" fontSize="xl">
              No Repositories
            </Text>
          ) : (
            <>
              <Text ml={4} pl={2} textAlign="left" fontSize="xl">
                {repos.length} Repositories
              </Text>
              <Box
                w="100%"
                h="50vh"
                overflowY="scroll"
                m={4}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
              >
                {repos.map((repo: Repo) => (
                  <Box
                    key={repo.id}
                    m={1}
                    p={2}
                    borderWidth="1px"
                    borderRadius="lg"
                  >
                    <Text textAlign="left" fontSize="xl">
                      {repo.name} {repo.fork && " (fork)"}
                    </Text>
                    <Flex justifyContent="space-between">
                      <Text textAlign="left" fontSize="lg">
                        Stars: {repo.stargazers_count}
                      </Text>
                      <Text textAlign="left" fontSize="lg">
                        Github Link:
                        <a style={{ color: "teal" }} href={repo.html_url}>
                          @{repo.full_name}
                        </a>
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
        <Button rightIcon={<StarIcon />}>Add User to Favorites</Button>
      </Flex>
    </>
  );
};
