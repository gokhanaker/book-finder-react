import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import BookDetail from "./pages/BookDetail";
import AuthorDetail from "./pages/AuthorDetail";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/book/:bookId" element={<BookDetail />} />
        <Route path="/author/:authorId" element={<AuthorDetail />} />
        {}
      </Routes>
    </Router>
  );
};

export default App;
