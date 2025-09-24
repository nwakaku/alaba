import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Providers from "@/providers";
import Header from "@/components/Header";
import Home from "@/app/page";
import Profile from "@/app/profile/page";

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}


