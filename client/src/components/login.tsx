import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import axios, { AxiosRequestConfig } from "axios";
import { Formik, Form } from "formik";
import React from "react";
import { InputField } from "../utils/inputField";
import Cookies from "universal-cookie";
import { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { useEffect } from "react";

interface loginProps {
  isAuthenticated: boolean;
}

export const Login: React.FC<loginProps> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReloading, setIsReloading] = useState(true);
  useEffect(() => {
    const cookies = new Cookies();
    axios
      .post("https://aadeeteeya-server.herokuapp.com/api/isAuthenticated/", {
        token: cookies.get("githubUserSearch-session"),
      })
      .then((result) => {
        // //console.log(result);
        setIsAuthenticated(true);
        setIsReloading(false);
      })
      .catch((err) => {
        setIsReloading(false);
      });
  }, []);

  useEffect(() => {}, [isAuthenticated]);
  return isAuthenticated ? (
    <Redirect to="/redirect" />
  ) : isReloading ? (
    <Spinner
      m={5}
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  ) : (
    <Box m="auto" w="400px">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          // //console.log(values);
          const config: AxiosRequestConfig = {
            method: "post",
            url: "https://aadeeteeya-server.herokuapp.com/api/login",
            data: { ...values },
          };
          axios(config)
            .then((result) => {
              //console.log(result);
              const cookies = new Cookies();
              cookies.set("githubUserSearch-session", result.data.user, {
                path: "/",
                sameSite: "strict",
              });
              setIsAuthenticated(true);
              window.location.reload();
            })
            .catch((error) => {
              //console.log(error);
              setErrors({
                username: " ",
                password: "Wrong Username or Password",
              });
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="Enter your Username or Email"
              label="Username"
            />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
            <Flex justifyContent="space-between">
              <Button m={2} type="submit" isLoading={isSubmitting}>
                LOGIN
              </Button>
              <Link to="/register">
                <Text p={2} m={2}>
                  Not Registered?
                </Text>
              </Link>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
