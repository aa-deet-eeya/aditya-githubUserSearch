import * as React from "react";
import { ChakraProvider, Box, theme, Spinner } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
// import { ColorModeSwitcher } from "./ColorModeSwitcher"
// import { SearchBar } from "./components/search"
import { Navbar } from "./components/navbar";
import { UserPage } from "./components/user";
import { PageNotFound } from "./components/illegalURL";
import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/login";
import Cookies from "universal-cookie";
import Home from "./components/home";
import Register from "./components/register";
// import { Logo } from "./Logo"
interface resultI {
  data: {
    msg: string;
    user: userI;
  };
}

interface userI {
  username: string;
  favs: string[];
  email: string;
}

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReloading, setIsReloading] = useState(true);
  const [user, setUser] = useState<userI>({
    username: "",
    favs: [],
    email: "",
  });
  useEffect(() => {
    const cookies = new Cookies();
    axios
      .post("https://aadeeteeya-server.herokuapp.com/api/isAuthenticated/", {
        token: cookies.get("githubUserSearch-session"),
      })
      .then((result: resultI) => {
        // //console.log(result);
        cookies.set("fav", result.data.user.favs);
        setIsAuthenticated(true);
        setUser(result.data.user);
        setIsReloading(false);
      })
      .catch((err) => {
        // //console.log(err);
        setIsAuthenticated(false);
        setIsReloading(false);
      });
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar isAuthenticated={isAuthenticated} user={user} />
        <Box textAlign="center" p={4}>
          <Switch>
            <Route path="/login">
              <Login isAuthenticated={isAuthenticated} />
            </Route>
            <Redirect exact from="/redirect" to="/" />
            <Route path="/register">
              <Register isAuthenticated={isAuthenticated} />
            </Route>
            <Route path="/u/:user">
              <UserPage fav={user.favs} />
            </Route>
            <Route exact path="/">
              {isReloading ? (
                <Spinner
                  m={5}
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              ) : (
                <Home isAuthenticated={isAuthenticated} user={user} />
              )}
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </Box>
      </Router>
    </ChakraProvider>
  );
};
