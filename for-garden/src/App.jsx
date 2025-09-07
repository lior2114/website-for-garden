

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GameProvider } from './Contexts/GameContext'
import { AudioProvider } from './Contexts/AudioContext'
import { RewardsProvider } from './Contexts/RewardsContext'
import { UserProvider } from './Contexts/UserContext'
import StartPage from './Pages/StartPage'
import LevelSelectPage from './Pages/LevelSelectPage'
import QuestionPage from './Pages/QuestionPage'
import CorrectPage from './Pages/CorrectPage'
import IncorrectPage from './Pages/IncorrectPage'
import CelebrationPage from './Pages/CelebrationPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import ShopPage from './Pages/ShopPage'
import ProfilePage from './Pages/ProfilePage'
import BackgroundMusic from './Components/BackgroundMusic'
import Decorations from './Components/Decorations'

function App() {
  return (
    <UserProvider>
      <AudioProvider>
        <GameProvider>
          <RewardsProvider>
            <BrowserRouter>
              <BackgroundMusic />
              <Decorations />
              <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/levels" element={<LevelSelectPage />} />
                <Route path="/question" element={<QuestionPage />} />
                <Route path="/correct" element={<CorrectPage />} />
                <Route path="/incorrect" element={<IncorrectPage />} />
                <Route path="/celebration" element={<CelebrationPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </BrowserRouter>
          </RewardsProvider>
        </GameProvider>
      </AudioProvider>
    </UserProvider>
  )
}

export default App
