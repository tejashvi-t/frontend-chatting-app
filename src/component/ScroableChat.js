import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastmessage, isSameSender, isSameSenderMargin, isSameUser } from '../Config/chatLogic'
import { ChatState } from './Context/ChatProvider'

const ScroableChat = ({ messages }) => {

  const { user } = ChatState()


  return (
    <ScrollableFeed>
      {
        messages && messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id} >
            {(isSameSender(messages, m, i, user._id)
              || isLastmessage(messages, i, user._id)) &&
              (
                <Tooltip
                  label={m.sender.name}
                  placement='bottom-start'
                  hasArrow >

                  <Avatar
                    mt={'7px'} mr={1}
                    size='sm' cursor={'pointer'}
                    name={m.sender.name} src={m.sender.pic}
                  />
                </Tooltip>
              )}

            <span
              style=
              {
                {
                  background: `${m.sender._id === user._id ? "#250B33" : '#055460'}`,
                  borderRadius: '20px',
                  padding: '5px 15px',
                  maxWidth: '75%',
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,

                }
              }  >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScroableChat
