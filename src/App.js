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
import PlaceCardUsageRate from "./pages/PlaceCardUsageRate";
import PlaceCardUsageDetail from "./pages/PlaceCardUsageDetail";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutSide />}>
        {/* <Route path="/"> */}
          {/* Nested Routes */}
          <Route index element={<CardUsageRate />} />
          <Route path="dateshow" element={<DateCardUsageRate />} />
          <Route path="placeshow" element={<PlaceCardUsageRate />} />
          <Route path="placeshow/:event_holding_id" element={<PlaceCardUsageDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;