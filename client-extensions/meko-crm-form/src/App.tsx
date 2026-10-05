import { LandingPage } from './pages/LandingPage';
import { Header } from '../../common/components/Header.tsx';

function App() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main>
        <LandingPage />
      </main>
    </div>
  );
}

export default App;
