
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Portfolio } from './pages/Portfolio';
import { BlogList } from './pages/BlogList';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { PageResolver } from './pages/PageResolver';
import { ToastProvider } from './contexts/ToastContext';

// Wrapper for public pages to apply layout
const PublicLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />
          
          <Route path="/services" element={
            <PublicLayout>
              <Services />
            </PublicLayout>
          } />
          
          <Route path="/portfolio" element={
            <PublicLayout>
              <Portfolio />
            </PublicLayout>
          } />

          <Route path="/blog" element={
            <PublicLayout>
              <BlogList />
            </PublicLayout>
          } />

          <Route path="/about" element={
            <PublicLayout>
              <About />
            </PublicLayout>
          } />

          <Route path="/contact" element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          } />
          
          {/* Admin page has its own layout */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Legacy route kept for compatibility */}
          <Route path="/services/:slug" element={
            <PublicLayout>
              <PageResolver />
            </PublicLayout>
          } />

          {/* SEO Optimization: Universal Page Resolver (Service or Blog at root) */}
          <Route path="/:slug" element={
            <PublicLayout>
              <PageResolver />
            </PublicLayout>
          } />
        </Routes>
      </ToastProvider>
    </Router>
  );
};

export default App;
