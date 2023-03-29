/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react'
import { ChatState } from './Context/ChatProvider'
import { IconButton } from "@chakra-ui/react"
import { useToast, Text, Box, Input, FormControl, Spinner, } from '@chakra-ui/react'
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from '../Config/chatLogic';
import ProfileModal from "./InsideUi/ProfileModal"
import UpdateGroupChatModal from './InsideUi/UpdateGroupChatModel'
import axios from 'axios';
import "./styles.css"
import ScroableChat from './ScroableChat';
import io from 'socket.io-client';


const ENDPOINT = "http://localhost:7000";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setsocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setisTyping] = useState(false)

  const toast = useToast();
  const { user, selectedChats, setSelectedChats, notification, setNotification } = ChatState();

  // / fetch messages */
  const fetchMessages = async () => {
    if (!selectedChats) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true)
      const { data } = await axios.get(`/api/message/${selectedChats._id}`
        , config
      );

      setMessages(data)
      setLoading(false)

      socket.emit('join chat', selectedChats._id)
    } catch (error) {
      toast({
        title: ' Error occured',
        description: 'Failed to load msg',
        status: 'errro',
        duration: 5000,
        isClosable: 'true',
        position: 'bottom'
      })
    }
  };

  // sending messages 
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit('stop typing', selectedChats._id)

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          }
        }

        setNewMessage("")
        const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChats._id,
        },
          config
        );

        socket.emit('new message', data);
        setMessages([...messages, data])


      } catch (error) {
        toast({
          title: ' Error occured',
          description: 'Filed to send the messages',
          status: 'errro',
          duration: 5000,
          isClosable: 'true',
          position: 'bottom'
        })
      }
    }

  }
  // sending messages end here 



  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connected', () => setsocketConnected(true))
    socket.on('typing', () => setisTyping(true))
    socket.on('stop typing', () => setisTyping(false))
  }, [])





  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChats

  }, [selectedChats])




  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {

        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain)
        }
      }
      else {
        setMessages([...messages, newMessageRecieved])
      }
    })
  })



  // typing handler  
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChats._id)
    }

    let lastTypingtime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingtime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChats._id)
        setTyping(false)
      }
    }, timerLength);

  };




  return (
    <>
      {selectedChats ? (
        <>
          <Text fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"   >

            <IconButton
              display={{ base: "flex", md: "none" }}
              bgColor={'black'}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChats("")}
            />

            {!selectedChats.isGroupChat ? (
              <>
                {getSender(user, selectedChats.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChats.users)}
                />
              </>

            ) : (

              <> {selectedChats.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}

                />
              </>
            )}


          </Text>

          <Box display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#0e1e3c"
            w="100%"
            h="90%"
            borderRadius="lg"
            overflowY="hidden" >

            {loading ? (
              <Spinner
                size={'xl'}
                w={'20'}
                h={20}
                alignSelf='center'
                margin={'auto'}
              />
            )
              : (
                <div className='messages'>
                  < ScroableChat messages={messages} />
                </div>
              )}


            <FormControl onKeyDown={sendMessage} isRequired mt={3} >

              {isTyping ? <div> typing....  </div> : <></>}

              <Input placeholder='Enter Messege '
                variant='filled'
                onChange={typingHandler}
                value={newMessage}
              />

            </FormControl>
          </Box>

        </>

      ) : (

        <Box display='flex' alignItems='center' justifyContent='center' h='100%'  >
          <Text fontSize='3xl' pd={3} fontFamily='Work sans'  >
            Click on a user to start Chatting
          </Text>
        </Box>
      )}

    </>
  )
}


export default SingleChat
