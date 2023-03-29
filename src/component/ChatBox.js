import { Box } from "@chakra-ui/layout";

import { ChatState } from "./Context/ChatProvider";
import SingleChat from "./SingleChat";



const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChats } = ChatState();
  

  return (
    <Box
      d={{ base: selectedChats ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="whiteAlpha.700"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;