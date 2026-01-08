import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIChat from './AIChat';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background bg-gradient-radial flex flex-col">
      <Navbar />
      <main className="pt-20 flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIChat />
    </div>
  );
}
