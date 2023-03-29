/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from './Context/ChatProvider'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../Config/chatLogic';
import GroupChatModal from './InsideUi/GroupChatModal';

const MyChats = ({ fetchAgain }) => {

  const [loggedUser, setLoggedUser] = useState();

  const { selectedChats, setSelectedChats, user, chats, setchats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chats', config);
      setchats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);



  return (
    <Box display={{ base: selectedChats ? "none" : "flex", md: "flex" }}
      flexDir='column'
      alignItems='center'
      p={3} bg={'white'}
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth={'1px'}
      background={'whiteAlpha.300'}
    >

      <Box pb={4} px={3} py={3} fontSize={'Work sans'}
        display='flex' width={'100%'}
        justifyContent="space-between"
        alignItems={'center'} bgColor={'blackAlpha.700'} color={'white'}
      >
        My Chats
        <GroupChatModal   >
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }} color='black'
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#0E1E3C"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >

        {chats ? (
          <Stack overflowY="scroll" background={'blackAlpha.900'} >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChats(chat)}
                cursor="pointer"
                bg={selectedChats === chat ? "#cf578f" : "#E8E8E8"}
                color={selectedChats === chat ? "blue" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}

      </Box>

    </Box>
  )
}

export default MyChats
