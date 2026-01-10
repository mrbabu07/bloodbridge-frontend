import { RouterProvider } from "react-router-dom";
import router from "./Routes/Router";
import { AuthProvider } from "./Context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { ConfigProvider } from "antd";
import AdminSetup from "./Components/AdminSetup";
import "./App.css";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#dc2626", // Corporate Red
          borderRadius: 8,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Card: {
            borderRadius: 12,
          },
        },
      }}
    >
      <AdminSetup>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </AdminSetup>
    </ConfigProvider>
  );
}

export default App;
