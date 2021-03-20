import { Box, Flex, Button, Text, Spinner } from "@chakra-ui/react";
import axios, { AxiosRequestConfig } from "axios";
import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import * as Yup from "yup";
import { InputField } from "../utils/inputField";

interface registerPropsI {
  isAuthenticated: boolean;
}

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Username Cannot be Empty"),
  password: Yup.string()
    .min(4, "Too Short!")
    .max(50, "Too Long!")
    .required("Password Cannot be Empty"),
  email: Yup.string().email("Invalid email").required("Email Cannot be Empty"),
});

const Register: React.FC<registerPropsI> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(props.isAuthenticated);
  const [isReloading, setIsReloading] = useState(false);
  const [isButReloading, setIsButReloading] = useState(false);
  useEffect(() => {
    const cookies = new Cookies();
    axios
      .post("https://aadeeteeya-server.herokuapp.com/api/isAuthenticated/", {
        token: cookies.get("githubUserSearch-session"),
      })
      .then((result) => {
        //console.log(result);
        setIsAuthenticated(true);
        setIsReloading(false);
      })
      .catch((err) => {
        setIsReloading(false);
      });
  }, []);

  useEffect(() => {}, [isAuthenticated]);
  return isAuthenticated ? (
    <Redirect to="/login" />
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
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setErrors }) => {
          setIsButReloading(true);
          //console.log(values);
          const config: AxiosRequestConfig = {
            method: "post",
            url: "https://aadeeteeya-server.herokuapp.com/api/register",
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
              setIsButReloading(false);
              window.location.reload();
            })
            .catch((error) => {
              //console.log(error);
              //console.log(error.response.data.errors);
              setErrors(error.response.data.errors);
              setIsButReloading(false);
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
              {isButReloading ? (
                <Spinner mt={5} ml={10} size="sm" />
              ) : (
                <Button m={2} type="submit" isLoading={isSubmitting}>
                  Register
                </Button>
              )}
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
