import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import 'antd/dist/reset.css';  // Add this import at the top

import LayoutSide from "./components/Layout";
import CardUsageRate from "./pages/CardUsageRate";

import DateCardUsageRate from "./pages/DateCardUsageRate";
import DateCardUsageDetail from "./pages/DateCardUsageRate/DateCardUsageDetail";

import PlaceCardUsageRate from "./pages/PlaceCardUsageRate";
import PlaceCardUsageDetail from "./pages/PlaceCardUsageRate/PlaceCardUsageDetail";
import NotFound from "./pages/NotFound";
import PokemonAuth from './pages/LoginPage/LoginPage';
import UserManagement from './pages/UserManagement/UserManagement';
import Category from './pages/CategoryPage/CategoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutSide />}>
          {/* <Route path="/"> */}
          {/* Nested Routes */}
          <Route index element={<CardUsageRate />} />
          <Route path="dateshow" element={<DateCardUsageRate />} />
          <Route path="dateshow/:event_holding_date" element={<DateCardUsageDetail />} />
          <Route path="placeshow" element={<PlaceCardUsageRate />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="category" element={<Category />} />
          <Route path="placeshow/:event_holding_id" element={<PlaceCardUsageDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<PokemonAuth />} />
      </Routes>
    </Router>
  );
}

export default App;