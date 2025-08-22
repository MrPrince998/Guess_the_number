import { Route, Routes } from "react-router-dom";
import "./App.css";
import { GamePage, MainMenu, TitleScreen } from "./routes/lazyRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitleScreen />} />
      <Route path="/main-menu" element={<MainMenu />} />
      <Route path="/room/:gameId" element={<GamePage />} />
    </Routes>
  );
}

export default App;
