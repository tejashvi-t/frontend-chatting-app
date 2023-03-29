/* eslint-disable no-undef */
import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import {
    Box, Button, FormControl, IconButton, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
    ModalHeader, ModalOverlay, Spinner, useToast
} from '@chakra-ui/react'
import UserBadgeItem from '../UsersAvatars/UserBadgeItem'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UsersAvatars/UserListItem'

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);


    const toast = useToast();

    const { user, selectedChats, setSelectedChats } = ChatState();

    // handle remove 
    const handleRemove = async (user1) => {
        if (selectedChats.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
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
            const { data } = await axios.put(
                `/api/chats/groupremove`,
                {
                    chatId: selectedChats._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChats() : setSelectedChats(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    }


    // handel add user
    const handleAddUser = async (user1) => {

        if (selectedChats.users.find((u) => user._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChats.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
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
            const { data } = await axios.put(
                `/api/chats/groupadd`,
                {
                    chatId: selectedChats._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChats(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");


    }

    // handle rename
    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chats/rename`,
                {
                    chatId: selectedChats._id,
                    chatName: groupChatName,
                },
                config
            );

            console.log(data._id);
            // setSelectedChat("");
            setSelectedChats(data);
            setFetchAgain(!fetchAgain);
            setRenameloading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameloading(false);
        }
        setGroupChatName("");
    }



    // /* handle search  
    const handleSearch = async (query) => {

        setSearch(query);
        if (!query) {
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
            console.log(data);
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

    //  handle search ends here 



    // main component

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon bg={'black'} />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>  {selectedChats.chatName} </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display={'flex'} flexWrap='wrap' pb={3} >
                            {selectedChats.users.map((user) => (

                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleRemove(user)}
                                />
                            ))}
                        </Box>

                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />

                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)} >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </>
    )
}

export default UpdateGroupChatModel
