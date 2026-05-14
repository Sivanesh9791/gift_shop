import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminPinLock from './AdminPinLock';
import AdminLayout from './components/AdminLayout';

const AdminAppContent = () => {
  const { isAdminAuthenticated } = useAdmin();

  if (!isAdminAuthenticated) {
    return <AdminPinLock />;
  }

  return <AdminLayout />;
};

export default function AdminApp() {
  return (
    <AdminProvider>
      <AdminAppContent />
    </AdminProvider>
  );
}
