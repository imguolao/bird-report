import { createRoot } from 'react-dom/client';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello from iframe!</h1>
      <p>This content is rendered by React.</p>
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
