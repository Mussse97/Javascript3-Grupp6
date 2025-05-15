import Footer from "./components/footer/Footer";
import { Header } from "./components/Header";
import "./App.css";
import Explore from "./components/Explore";
import SinglePost from "./components/singlepost/SinglePost";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/post/:slug" element={<SinglePost />} />
      </Routes>

      <Footer />
    </>
  );
}
export default App;
