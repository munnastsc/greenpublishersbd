import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

// Pages
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import AudioPage from './pages/AudioPage';
import VideosPage from './pages/VideosPage';
import ShikshaUpokoronPage from './pages/ShikshaUpokoronPage';
import ProsikkhonManualPage from './pages/ProsikkhonManualPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import CategoriesPage from './pages/CategoriesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import PlaceholderAdminPage from './pages/admin/PlaceholderAdminPage';
import AdminAudio from './pages/admin/AdminAudio';
import AdminAuthors from './pages/admin/AdminAuthors';
import AdminBanners from './pages/admin/AdminBanners';
import AdminBooks from './pages/admin/AdminBooks';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminCustomPages from './pages/admin/AdminCustomPages';
import AdminEducationalMaterials from './pages/admin/AdminEducationalMaterials';
import AdminHomeSections from './pages/admin/AdminHomeSections';
import AdminMenus from './pages/admin/AdminMenus';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPublishers from './pages/admin/AdminPublishers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTrainingManuals from './pages/admin/AdminTrainingManuals';
import AdminUnits from './pages/admin/AdminUnits';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVideos from './pages/admin/AdminVideos';
import AdminActivationCodes from './pages/admin/AdminActivationCodes';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 80px - 300px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/audio" element={<AudioPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/shiksha-upokoron" element={<ShikshaUpokoronPage />} />
          <Route path="/prosikkhon-manual" element={<ProsikkhonManualPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="authors" element={<AdminAuthors />} />
            <Route path="publishers" element={<AdminPublishers />} />
            <Route path="menus" element={<AdminMenus />} />
            <Route path="home-sections" element={<AdminHomeSections />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="audio" element={<AdminAudio />} />
            <Route path="units" element={<AdminUnits />} />
            <Route path="educational-materials" element={<AdminEducationalMaterials />} />
            <Route path="training-manuals" element={<AdminTrainingManuals />} />
            <Route path="custom-pages" element={<AdminCustomPages />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="activation-codes" element={<AdminActivationCodes />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </Router>
  );
}

export default App;
