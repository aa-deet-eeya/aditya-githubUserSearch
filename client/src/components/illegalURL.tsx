import { Center, Heading, Stack, Image } from "@chakra-ui/react";
import React from "react";
import ErrorImage from "../assets/404.jpg";

export const PageNotFound: React.FC = () => {
  return (
    <Center>
      <Stack spacing={6}>
        <Center bg="white">
          <Image boxSize="35%" src={ErrorImage} alt="404" />
        </Center>
        <Heading as="h1" size="2xl">
          Page Not Found
        </Heading>
      </Stack>
    </Center>
  );
};
