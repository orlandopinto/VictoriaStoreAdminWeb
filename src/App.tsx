import { Outlet } from "react-router-dom";
import '../src/assets/css/globalStyles.css';
import 'primeicons/primeicons.css';
import '../src/assets/css/core.min.css';
import './i18n';

export default function App() {
  return (
    <Outlet />
  )
}