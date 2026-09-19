import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './views/common/Navbar'
import BlogView from './views/blog/BlogView'
import ForumView from './views/forum/ForumView'
import AddTopicView from './views/forum/AddTopicView'
import UsersView from './views/admin/UsersView'
import AddUserView from './views/admin/AddUserView'
import ForumAdminView from './views/admin/ForumAdminView'
import LoginView from './views/auth/LoginView'
import RegisterView from './views/auth/RegisterView'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<BlogView />} />
          <Route path="/foro" element={<ForumView />} />
          <Route path="/foro/nuevo-tema" element={<AddTopicView />} />
          <Route path="/admin/usuarios" element={<UsersView />} />
          <Route path="/admin/usuarios/nuevo" element={<AddUserView />} />
          <Route path="/admin/foro" element={<ForumAdminView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/registro" element={<RegisterView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App