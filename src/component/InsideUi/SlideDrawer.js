/* eslint-disable no-unused-vars */
import { effect, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Toast, Tooltip, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from "../Context/ChatProvider";
import { Avatar } from '@chakra-ui/react'
import ProfileModal from '../InsideUi/ProfileModal';
import { useHistory } from "react-router-dom"
import axios from 'axios'
import ChatLoading from '../ChatLoading';
import UserListItem from "../UsersAvatars/UserListItem";
import { getSender } from '../../Config/chatLogic';
 import {Effect}  from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';



const SlideDrawer = () => {


    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingchat, setLoadingChat] = useState(false);
    const toast = useToast();



    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, setSelectedChats, chats, setchats, notification, setNotification } = ChatState();
    const history = useHistory();



    // logout handler 
    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        history.push("/")
    }



    // handle search  it search one user

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/chat?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    // access chat 

    const accessChat = async (userId) => {
        // console.log(userId);
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/chats', { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);

            setSelectedChats(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error fetching the chat ",
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',

            })
        }

    }

    // access chat ends here 

    return (
        <>
            {/* ,making  a header   */}
            <Box display={'flex'} justifyContent='space-between'
                alignItems='center ' bg={'whiteAlpha.300'} w='100%' p='5px 10px 5px 10px ' borderWidth={'5px'}
            >
                <Tooltip label={'Search users to chat'} hasArrow placement='bottom-end' >

                    <Button variant={'ghost'} onClick={onOpen}  > <i className="fas fa-search" ></i>
                        <Text display={{ base: 'none', md: 'flex' }} px={'4'}   >   Search user   </Text>
                    </Button>
                </Tooltip>
                <Text fontSize={'2xl'} fontFamily="Work sans" >
                    Chatting Hub
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={'1'} >
                             <NotificationBadge count={notification.length} effect={Effect.SCALE}   />
                            <BellIcon fontSize={'2xl'} m={'1'} />
                        </MenuButton>
                        <MenuList bgColor={'#5F187A'} color={'black'}  >
                            {!notification.length && 'No new Message'}
                            {notification.map((notif) => (
                                <MenuItem key={notif._id} onClick={() => {
                                    setSelectedChats(notif.chat)
                                    setNotification(notification.filter((n) => n!== notif))
                                }}     >
                                    {notif.chat.isGroupChat ? `New nofication in ${notif.chat.chatName}`
                                        : `New message from ${getSender(user, notif.chat.users)}`}

                                </MenuItem>

                            ))}

                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                            <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} />
                        </MenuButton>

                        <MenuList bg={'blackAlpha.600'}  >

                            <ProfileModal user={user}  >
                                <MenuItem bg={'blackAlpha.400'} > My Profile  </MenuItem>
                            </ProfileModal>

                            < MenuDivider />
                            <MenuItem onClick={logoutHandler} bg={'blackAlpha.400'} >  LogOut    </MenuItem>
                        </MenuList>

                    </Menu>
                </div>
            </Box>


            {/* side SlideDrawer */}
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}  >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'}   > Search user   </DrawerHeader>

                    <DrawerBody>
                        <Box display={'flex'} pb={2}  >
                            <Input placeholder='Search by Name or Email' mr={'2'} value={search} onChange={(e) => setSearch(e.target.value)} />

                            <Button onClick={handleSearch} > Go </Button>
                        </Box>

                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}

                        {loadingchat && <Spinner ml='auto' display='flex' />}

                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>

    )
};

export default SlideDrawer;
