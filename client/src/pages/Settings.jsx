import { Clock9, Send } from 'lucide-react';
import { THEMES } from '../utils';
import { useTheme } from '../store/useTheme';

const MESSAGE_PREVIEW = [
  { id: 1, message: 'Hey!,How is it going?', isSent: false },
  {
    id: 2,
    message: 'Im doing great! just working on some new features',
    isSent: true,
  },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="py-5 max-w-7xl mx-auto">
      <div className="theme mx-auto p-2">
        <div className="text-base-content">
          <h4 className="capitalize font-black text-2xl">theme</h4>
          <span>choose a theme for your chat interface</span>
        </div>
        <div className="themes my-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 space-y-5">
          {THEMES.map((t) => (
            <div
              key={t}
              data-theme={t}
              className="theme bg-base-200 w-fit p-2 cursor-pointer rounded hover:bg-base-300"
              onClick={() => setTheme(t)}
            >
              <div className="colors flex items-center gap-1">
                <span className="h-7 w-7 block bg-primary rounded"></span>
                <span className="h-7 w-7 block bg-secondary rounded"></span>
                <span className="h-7 w-7 block bg-accent rounded"></span>
                <span className="h-7 w-7 block bg-neutral rounded"></span>
              </div>
              <small className="capitalize text-center block mt-1">{t}</small>
            </div>
          ))}
        </div>
        <div></div>
      </div>
      <h4 className="capitalize font-black text-2xl mb-5">preview</h4>
      <div data-theme={theme} className="preview bg-base-300 rounded p-2">
        <div className="content bg-base-100 max-w-xl mx-auto rounded p-2">
          <div className="head mt-3 flex items-center gap-3 text-secondary">
            <Clock9 />
            <div className="flex flex-col gap-0 capitalize text-sm">
              <h4>mohamed youssef</h4>
              <span>online</span>
            </div>
          </div>
          <div className="info my-3 mt-10">
            {MESSAGE_PREVIEW.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col rounded w-fit p-1 text-sm ${
                  msg.id === 2
                    ? 'ml-auto text-black bg-secondary '
                    : 'bg-secondary/40'
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-[10px]">12:12</span>
              </div>
            ))}
          </div>
          <div className="footer flex items-center mt-5">
            <input
              type="text"
              className="border p-2 rounded w-full"
              disabled
              placeholder="Enter your message"
            />
            <Send
              className="bg-secondary p-2 rounded cursor-pointer m-0"
              size={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
