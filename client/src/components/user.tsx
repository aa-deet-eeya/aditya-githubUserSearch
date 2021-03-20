import {
  Box,
  Button,
  // Center,
  Flex,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Redirect, useParams } from "react-router";
import Cookies from "universal-cookie";

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

interface RepoArray extends Array<Repo> {}

interface userPageI {
  fav: string[];
}

export const UserPage: React.FC<userPageI> = (props) => {
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
  const [userReloading, setUserReloading] = useState(true);
  const [favReloading, setFavReloading] = useState(false);
  const [repoReloading, setRepoReloading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserResult>(init);
  const [repos, setRepos] = useState<RepoArray>([]);
  const [redirect, setRedirect] = useState(false);
  const cookies = new Cookies();
  const [favs, setFavs] = useState(cookies.get("fav"));
  //console.log(Array.isArray(repos), repos);
  // let favs = cookies.get("fav");
  const addFav = (user: string) => {
    const cookies = new Cookies();
    setFavReloading(true);
    axios
      .post("https://aadeeteeya-server.herokuapp.com/fav", {
        favName: user,
        token: cookies.get("githubUserSearch-session"),
      })
      .then((res) => {
        //console.log(res);
        cookies.set("fav", res.data.newUser.favs);
        setFavs(res.data.newUser.favs);
        setFavReloading(false);
      })
      .catch((err) => {
        //console.log(err);
        setFavReloading(false);
      });
  };
  useEffect(() => {
    setUserDetails(init);
    setRepoReloading(true);
    setRepos([]);
    axios
      .get(`https://api.github.com/users/${user}`)
      .then((res) => {
        // //console.log(res);
        setUserDetails(res.data);
        setUserReloading(false);
      })
      .catch((err) => {
        //console.log(err);
        setUserReloading(false);
        setRedirect(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setRepoReloading(true);
    axios
      .get(userDetails.repos_url)
      .then((res) => {
        //console.log(res.data);
        if (res.data) setRepos(res.data);
        else setRepos([]);
        setRepoReloading(false);
      })
      .catch((err) => console.log(err));
  }, [userDetails]);
  return redirect ? (
    <Redirect to="/404" />
  ) : userReloading ? (
    <Spinner
      m={5}
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  ) : (
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
          {repoReloading ? (
            <Spinner
              m={5}
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          ) : repos.length === 0 ? (
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
                {Array.isArray(repos) &&
                  repos.map((repo: Repo) => (
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
        {favs &&
          (favReloading ? (
            <Spinner mt={4} mr="10%" size="sm" />
          ) : (
            <Button onClick={() => addFav(user)} rightIcon={<StarIcon />}>
              {favs && favs.includes(user)
                ? "Remove User from Favorites"
                : "Add User to Favorites"}
            </Button>
          ))}
      </Flex>
    </>
  );
};
