import { useEffect, useState } from "react";
import Home from "./components/home";
import SignIn from "./components/signIn";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "./firebase";
function App() {
  const [userIdError, setUserIdError] = useState("");
  const [approvedError, setApprovedError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    const savedPassword = localStorage.getItem("password");

    const autoLogin = async ({ savedUserId, savedPassword }) => {
      try {
        const q = query(
          collection(firestore, "users"),
          where("userId", "==", savedUserId)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setUserIdError("아이디가 바뀌었습니다.");
          return;
        }
        const user = querySnapshot.docs[0].data();
        const { email, approved } = user;
        if (!approved) {
          setApprovedError(true);
          return;
        }
        setApprovedError(false);

        await signInWithEmailAndPassword(auth, email, savedPassword);
        console.log("User logged in");
      } catch (error) {
        setPasswordError("비밀번호가 바뀌었습니다.");
      }
    };
    if (savedUserId && savedPassword) {
      console.log(
        "로컬 저장소에 저장된 아이디,비밀번호:",
        savedUserId,
        savedPassword
      );
      autoLogin({ savedUserId, savedPassword });
    }
  }, []);
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
