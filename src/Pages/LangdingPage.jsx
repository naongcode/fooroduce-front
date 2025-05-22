// Pages/LandingPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingAnimation from "../components/LandingAnimation";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // 애니메이션 끝나고 자동 이동
    }, 6000); // 4.5초 후 이동 (애니메이션 길이에 따라 조절)

    return () => clearTimeout(timer);
  }, [navigate]);

  return <LandingAnimation />;
}
