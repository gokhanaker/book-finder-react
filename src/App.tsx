import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import BookDetail from "./pages/BookDetail";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/book/:bookId" element={<BookDetail />} />
        // TODO Author Detail and 404 routes
        {}
      </Routes>
    </Router>
  );
};

export default App;
