import { Route, Routes } from "react-router-dom";
import "./App.css";
import TitleScreen from "@/pages/title-screen/TitleScreen";
import MainMenu from "./pages/main-menu/MainMenu";
import GamePage from "./pages/game-page/GamePage";
import GameScene from "./pages/game-page/test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitleScreen />} />
      <Route path="/main-menu" element={<MainMenu />} />
      <Route path="/room/:gameId" element={<GamePage />} />
      <Route path="/test-scene" element={<GameScene />} />
    </Routes>
  );
}

export default App;
