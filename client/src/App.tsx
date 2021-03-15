import * as React from "react";
import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { ColorModeSwitcher } from "./ColorModeSwitcher"
// import { SearchBar } from "./components/search"
import { Navbar } from "./components/navbar";
import { UserPage } from "./components/user";
import { PageNotFound } from "./components/illegalURL";
// import { Logo } from "./Logo"

export const App: React.FC = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Navbar />
      <Box textAlign="center" p={4}>
        <Switch>
          <Route path="/u/:user">
            <UserPage />
          </Route>
          <Route exact path="/">
            Home
          </Route>
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
      </Box>
    </Router>
  </ChakraProvider>
);
