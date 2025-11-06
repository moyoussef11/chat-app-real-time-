import { MessageSquareMore } from 'lucide-react';

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100 h-full rounded">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-[#7459b3]/30 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquareMore
                size={40}
                className="text-[#7459b3] bg-[#7459b3]/30 p-2 rounded-full"
              />{' '}
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold">Welcome to Chaty!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
