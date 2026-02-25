import { DataProvider } from "./DataContext";
import { ModalProvider } from "./ModalContext";
import { NavbarProvider } from "./NavbarContext";
import { SidebarProvider } from "./SidebarContext";
import { ToastProvider } from "./ToastContext";
import { UiDirectionProvider } from "./UiDirectionContext";

const AppProviders = ({ children }) => {
  return (
    <ToastProvider>
      <UiDirectionProvider>
        <SidebarProvider>
          <NavbarProvider>
            <DataProvider>
              <ModalProvider>{children}</ModalProvider>
            </DataProvider>
          </NavbarProvider>
        </SidebarProvider>
      </UiDirectionProvider>
    </ToastProvider>
  );
};

export default AppProviders;
