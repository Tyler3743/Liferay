import { CoursePage } from './pages/CoursePage';
import { Header } from '../../common/components/Header.tsx';

function App() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header activePath="/web/guest/courses" />

      <main>
        <CoursePage />
      </main>
    </div>
  )
}

export default App;
