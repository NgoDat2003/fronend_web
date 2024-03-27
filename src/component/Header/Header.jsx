import "./Header.scss";
import { NavLink } from "react-router-dom";
function Header() {
  const items= [
    {
      key: '1',
      label: (
        <NavLink to="/login">Đăng nhập</NavLink>
      ),
    },
    {
      key: '2',
      label: (
        <NavLink to="/register">Đăng ký</NavLink>
      ),
    },
  ];
  return (
    <div>Header</div>
  );
}

export default Header;
