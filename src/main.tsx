import { FilterMatchMode, PrimeReactProvider } from 'primereact/api';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '../src/assets/css/globalStyles.css';
import AppRoutes from './routes/AppRoutes.tsx';

const value = {
  filterMatchMode: {
    text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
    numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
    date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
  },
  cssTransition: true,
  hideOverlaysOnDocumentScrolling: true,
  //inputStyle: 'filled' as 'filled' | 'outlined',
  nullSortOrder: 1,
  ripple: true,
  zIndex: {
    modal: 1100,    // dialog, sidebar
    overlay: 1000,  // dropdown, overlaypanel
    menu: 1000,     // overlay menus
    tooltip: 1100,   // tooltip
    toast: 1200     // toast
  },
  autoZIndex: true,
};

let root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <PrimeReactProvider value={value}>
    <RouterProvider router={AppRoutes} />
  </PrimeReactProvider>
);