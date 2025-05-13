import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

interface ChatButtonProps {
  receiverId: string;
}

const ChatButton: FC<ChatButtonProps> = ({ receiverId }) => {
  const navigate = useNavigate();

  const handleChatRedirect = () => {
    // navigate(`/chat/${clientId}`);
    // console.log('conosle from chatbutton :',clientId)
    navigate('/messages',{
        state:{receiverId}
    })
  };

  return (
    <button
      onClick={handleChatRedirect}
      className="p-2 rounded-full hover:bg-gray-200 transition"
      title="Chat"
    >
      <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-blue-600" />
    </button>
  );
};

export default ChatButton;
