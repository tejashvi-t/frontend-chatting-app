import { Box } from "@chakra-ui/react";
import { ChatState } from "./Context/ChatProvider.js";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import SlideDrawer from "../component/InsideUi/SlideDrawer";
import { useState } from "react";

const Chatpage = () => {

    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }} >

            {user && <SlideDrawer />}

            <Box display={'flex'} justifyContent={'space-between'} w={'100%'} h='91.5vh' p={'10px'}
            >
                {user && (
                    <MyChats fetchAgain={fetchAgain} />)}

                {user &&
                    (
                        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
            </Box>

        </div>
    )


};

export default Chatpage
