import Home from "./components/home";
import SignIn from "./components/signIn";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={SignIn} />
        <Route path="/home" Component={Home} />
      </Routes>
    </Router>
  );
}

export default App;
