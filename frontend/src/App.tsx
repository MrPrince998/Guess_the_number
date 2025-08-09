import { Route, Routes } from "react-router-dom";
import "./App.css";
import TitleScreen from "@/pages/title-screen/TitleScreen";
import MainMenu from "./pages/main-menu/MainMenu";
import Login from "./pages/login-page/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitleScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main-menu" element={<MainMenu />} />
    </Routes>
  );
}

export default App;
