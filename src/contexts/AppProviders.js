import { DataProvider } from "./DataContext";
import { ModalProvider } from "./ModalContext";
import { NavbarProvider } from "./NavbarContext";
import { SidebarProvider } from "./SidebarContext";
import { ToastProvider } from "./ToastContext";

const AppProviders = ({ children }) => {
  return (
    <ToastProvider>
      <SidebarProvider>
        <NavbarProvider>
          <DataProvider>
            <ModalProvider>{children}</ModalProvider>
          </DataProvider>
        </NavbarProvider>
      </SidebarProvider>
    </ToastProvider>
  );
};

export default AppProviders;
