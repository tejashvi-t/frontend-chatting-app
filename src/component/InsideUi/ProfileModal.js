import React from 'react'
import { ViewIcon } from '@chakra-ui/icons';

import {
    Image,
    Modal, ModalBody,
    ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import { Button, IconButton } from '@chakra-ui/button'



const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <>
            {children ? (<span onClick={onOpen} > {children} </span>
            ) : (
                <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
            )}

            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered  >
                <ModalOverlay />
                <ModalContent h={'400px'}  >
                    <ModalHeader
                        fontSize={'40px'}
                        fontFamily={"Work sans"}
                        display='flex'
                        justifyContent='center'
                    > {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDir='column' alignItems="center" justifyContent='space-between' >
                        <Image border='full'
                            boxSize='150px'
                            src={user.pic}
                        />
                        <Text fontSize={{ base: '28px', md: '30px' }} fontFamily='work sans '>   Email :{user.email}  </Text>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}

export default ProfileModal
