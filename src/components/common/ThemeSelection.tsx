import { useEffect } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function ThemeSelection() {

     const prefersTheme = () => {
          if (typeof window === "undefined") {
               return 'light'
          }
          const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
          return prefersColorScheme.matches ? 'dark' : 'light';
     }

     const [theme, setTheme] = useLocalStorage("theme", prefersTheme)

     const toggleTheme = () => {
          setTheme((prevTheme: string) => {
               return prevTheme === 'dark' ? 'light' : 'dark';
          });
     };

     useEffect(() => {
          // If a theme is set, save it to localStorage and apply the theme
          if (theme) {
               const existingLink = document.getElementById('theme-link');
               if (existingLink) {
                    existingLink.remove();
               }

               const link = document.createElement('link');
               link.id = 'theme-link';
               link.rel = 'stylesheet';
               link.href = theme === 'dark'
                    ? '../../../public/resourses/themes/dark-theme.css'
                    : '../../../public/resourses/themes/light-theme.css';

               document.head.appendChild(link);
          }
     }, [theme]);

     return (
          <div className="mr-2">
               <i style={{ fontSize: '1.5rem', cursor: 'pointer' }} className={theme === 'dark' ? "pi pi-sun" : "pi pi-moon"} onClick={toggleTheme}></i>
          </div>
     );
}