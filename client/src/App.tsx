import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Code,
  Grid,
  theme,
  Flex,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { SearchBar } from "./components/search"
// import { Logo } from "./Logo"

export const App : React.FC = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <Flex>
          <SearchBar />
          <ColorModeSwitcher justifySelf="flex-end" />
        </Flex>
        <VStack spacing={8}>
          {/* <Logo h="40vmin" pointerEvents="none" /> */}
          <Text>
            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
          </Text>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)
