import logoImg from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  return (
    <img
      src={logoImg}
      alt="SPARK Logo"
      className="logo w-[100px] h-auto"
      onClick={handleClick}
    />
  );
};
export default Logo;
