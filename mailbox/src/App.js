import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/login";
import Mailbox from "./views/mailbox";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/mailbox" element={<Mailbox />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
