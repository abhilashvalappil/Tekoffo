import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { createChat, fetchChat } from '../../../api';

interface ChatButtonProps {
  senderId: string;
  receiverId: string;
}

const ChatButton: FC<ChatButtonProps> = ({senderId, receiverId }) => {
  const navigate = useNavigate();
  
  const handleChatRedirect = async() => {
    try {
      const ischatExisting = await fetchChat(senderId, receiverId);
      console.log('fetched chat:', ischatExisting);

      if (!ischatExisting) {
        console.log('Creating new chat...');
        await createChat(senderId, receiverId);
      }

      navigate('/messages', { state: { receiverId } });
    } catch (err) {
      console.error('Error in handleChatRedirect:', err);
    }
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
