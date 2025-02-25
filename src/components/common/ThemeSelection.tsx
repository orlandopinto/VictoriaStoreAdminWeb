import { useEffect } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function ThemeSelection() {
     // Determine the preferred theme based on system settings
     const getPreferredTheme = (): string => {
          if (typeof window === "undefined") return "light"; // Server-side check
          const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
          return prefersDarkMode ? "dark" : "light";
     };

     // Use local storage to persist the theme
     const [theme, setTheme] = useLocalStorage("theme", getPreferredTheme());

     // Toggle between light and dark themes
     const toggleTheme = () => {
          setTheme((prevTheme: string) => (prevTheme === "dark" ? "light" : "dark"));
     };

     // Dynamically apply the theme stylesheet
     useEffect(() => {
          const applyTheme = (selectedTheme: string) => {
               const existingLink = document.getElementById("theme-link");
               if (existingLink) {
                    existingLink.remove();
               }

               const link = document.createElement("link");
               link.id = "theme-link";
               link.rel = "stylesheet";
               link.href = selectedTheme === "dark"
                    ? "../../../src/resourses/themes/dark-theme.css" // Adjust path as needed
                    : "../../../src/resourses/themes/light-theme.css"; // Adjust path as needed
               document.head.appendChild(link);
          };

          if (theme) {
               applyTheme(theme);
          }
     }, [theme]);

     return (
          <div className="mr-2">
               {/* Theme toggle icon */}
               <i
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    className={theme === "dark" ? "pi pi-sun" : "pi pi-moon"}
                    onClick={toggleTheme}
                    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
               ></i>
          </div>
     );
}