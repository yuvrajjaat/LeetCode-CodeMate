import { HashRouter, Routes, Route } from 'react-router-dom'
import { UserContextProvider } from './contexts/UserContext'
import { UrlContextProvider } from './contexts/UrlContext'
import CommonLayout from './layouts/CommonLayout'
import HomePage from './pages/HomePage'
import FriendsPage from './pages/FriendsPage'
import InstitutePage from './pages/InstitutePage'
import NewInstitutePage from './pages/NewInstitutePage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  return (
    <UserContextProvider>
      <UrlContextProvider>
        <HashRouter>
          <CommonLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/institute" element={<InstitutePage />} />
              <Route path="/new-institute" element={<NewInstitutePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </CommonLayout>
        </HashRouter>
      </UrlContextProvider>
    </UserContextProvider>
  )
}

export default App
