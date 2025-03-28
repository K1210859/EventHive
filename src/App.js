import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Plan from "./Plan";
import Invites from "./Invites";
import Events from "./Events";
import Money from "./Money";
import "./App.css";

function App() {
  return (
    <Router basename="/EventHive">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/invites" element={<Invites />} />
        <Route path="/events" element={<Events />} />
        <Route path="/money" element={<Money />} />
      </Routes>
    </Router>
  );
}

export default App;
