import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AIChat from './AIChat';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background bg-gradient-radial">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <AIChat />
    </div>
  );
}
