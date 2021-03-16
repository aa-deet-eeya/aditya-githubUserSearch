import { Box, Flex, Button, Text } from "@chakra-ui/react";
import axios, { AxiosRequestConfig } from "axios";
import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { InputField } from "../utils/inputField";

interface registerPropsI {
  isAuthenticated: boolean;
}

const Register: React.FC<registerPropsI> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(props.isAuthenticated);
  useEffect(() => {
    const cookies = new Cookies();
    axios
      .post("http://localhost:8000/api/isAuthenticated/", {
        token: cookies.get("githubUserSearch-session"),
      })
      .then((result) => {
        console.log(result);
        setIsAuthenticated(true);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {}, [isAuthenticated]);
  return isAuthenticated ? (
    <Redirect to="/login" />
  ) : (
    <Box m="auto" w="400px">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const config: AxiosRequestConfig = {
            method: "post",
            url: "http://localhost:8000/api/register",
            data: { ...values },
          };
          axios(config)
            .then((result) => {
              console.log(result);
              const cookies = new Cookies();
              cookies.set("githubUserSearch-session", result.data.user, {
                path: "/",
                sameSite: "strict",
              });

              setIsAuthenticated(true);
            })
            .catch((error) => {
              console.log(error);
              setErrors({
                username: "",
                password: "",
              });
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="Choose your Username"
              label="Username"
            />
            <InputField
              name="email"
              placeholder="Choose your Email"
              label="Email"
            />
            <InputField
              name="password"
              placeholder="Set a password"
              label="Password"
              type="password"
            />
            <Flex justifyContent="space-between">
              <Button m={2} type="submit" isLoading={isSubmitting}>
                Register
              </Button>
              <Link to="/login">
                <Text p={2} m={2}>
                  Already Registered?
                </Text>
              </Link>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
