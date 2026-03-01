import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import AgentPage from "./pages/AgentPage";
import SubmitPage from "./pages/SubmitPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/agent/:author/:name" element={<AgentPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
