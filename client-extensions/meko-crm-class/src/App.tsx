import { ClassPage } from './pages/ClassPage';
import { Header } from '../../common/components/Header.tsx';

function App() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header activePath="/web/guest/class" />

      <main>
        <ClassPage />
      </main>
    </div>
  );
}

export default App;
