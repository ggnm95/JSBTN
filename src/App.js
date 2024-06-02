import { useEffect, useState } from "react";
import Home from "./components/home";
import SignIn from "./components/signIn";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "./firebase";
function App() {
  const [autoSignError, setAutoSignError] = useState({
    error: "",
    errorMessage: "",
  });
  const [autoSignIn, setAutoSignIn] = useState(false);
  console.log(autoSignError);
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
          setAutoSignError({
            error: "userId",
            errorMessage: "아이디가 바뀌었습니다.",
          });
          return;
        }
        const user = querySnapshot.docs[0].data();
        const { email, approved } = user;
        if (!approved) {
          setAutoSignError({
            error: "approved",
            errorMessage: "권한이 없습니다.관리자에게 문의해주세요.",
          });
          return;
        }

        await signInWithEmailAndPassword(auth, email, savedPassword);
        console.log("User logged in");
        setAutoSignIn(true);
      } catch (error) {
        setAutoSignError({
          error: "password",
          errorMessage: "비밀번호가 바뀌었습니다.",
        });
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
        <Route exact path="/" Component={autoSignIn ? Home : SignIn} />
        <Route path="/home" Component={Home} />
      </Routes>
    </Router>
  );
}

export default App;
