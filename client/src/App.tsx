import * as React from "react";
import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
  const [user, setUser] = useState<userI>({
    username: "",
    favs: [],
    email: "",
  });
  useEffect(() => {
    const cookies = new Cookies();
    axios
      .post("http://localhost:8000/api/isAuthenticated/", {
        token: cookies.get("githubUserSearch-session"),
      })
      .then((result: resultI) => {
        console.log(result);
        cookies.set("fav", result.data.user.favs);
        setIsAuthenticated(true);
        setUser(result.data.user);
      })
      .catch((err) => {
        console.log(err);
        setIsAuthenticated(false);
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
            <Route path="/register">
              <Register isAuthenticated={isAuthenticated} />
            </Route>
            <Route path="/u/:user">
              <UserPage fav={user.favs} />
            </Route>
            <Route exact path="/">
              <Home isAuthenticated={isAuthenticated} user={user} />
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
