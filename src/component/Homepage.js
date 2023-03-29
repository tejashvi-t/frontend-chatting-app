import React, { useEffect } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Box, Container, Text } from '@chakra-ui/react'

import Login from "../component/Authentication/Login"
import Signup from "../component/Authentication/Signup"
import {useHistory} from 'react-router-dom'
// import {useEffect} from 'react-router-dom'



const Homepage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push('/chats')
  }, [history])


  return (<Container maxW='xl' centerContent  >
    <Box display={'flex'} justifyContent={'center'} p={'3'} m={'8'} boxShadow='dark-lg' rounded='md' bg={'whiteAlpha.500'}  >
      <Text fontSize={'4xl'} fontFamily={'Work Sans'} color={'whiteAlpha.900'}  >
        Chatting Hub
      </Text>
    </Box>
    <Box p={'4 '} borderRadius='lg' borderWidth={'1px '} w={'100%'} bg={'whiteAlpha.500'}  >


      <Tabs variant='soft-rounded' colorScheme={'messenger'}>
        <TabList mb={'2em'} >
          <Tab width={'50%'} color={'white '} >Login</Tab>
          <Tab width={'50%'} color={'white '} >Sign up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {/* login page here  */}
            <Login />
          </TabPanel>

          <TabPanel>
            <Signup />
            {/* Signup page here  */}
          </TabPanel>
        </TabPanels>
      </Tabs>

    </Box>

  </Container>

  )
}

export default Homepage
