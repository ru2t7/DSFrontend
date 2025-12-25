import { BrowserRouter, Routes, Route,Navigate  } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import PeoplePage from "./pages/PeoplePage";
import RegisterPage from "./pages/RegisterPage";
import DevicesPage from "./pages/DevicesPage";
import MonitorPage from "./pages/MonitorPage";
import DeviceAssignmentPage from "./pages/DeviceAssignmentPage";
import { jwtDecode } from "jwt-decode";
import NotificationComponent from './components/NotificationComponent'; // Adjust path as needed

function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;

    try {
        const decoded = jwtDecode(token);
        const roles = decoded.roles || (decoded.role ? [decoded.role] : []);
        if (!roles.includes("ADMIN")) {
            return <Navigate to="/devices" replace />;
        }
    } catch {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default function App() {
    return (
        <AuthProvider>
            {/* 1. AppContent is now a "child" of AuthProvider, so it CAN use the context */}
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    // 2. Now this hook will work because it's inside the AuthProvider tree
    const { token } = useContext(AuthContext);

    return (
        <>
            <NotificationComponent token={token} />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* ... rest of your routes ... */}

                    <Route
                        path="/people"
                        element={
                            <PrivateRoute>
                                <AdminRoute>
                                    <PeoplePage />
                                </AdminRoute>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/devices"
                        element={
                            <PrivateRoute>
                                <DevicesPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/monitoring-data"
                        element={
                            <PrivateRoute>
                                <MonitorPage />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/devices" replace />} />
                    <Route path="/device-assignment" element={<DeviceAssignmentPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
//
// export default function App() {
//     const { token } = useContext(AuthContext);
//     return (
//         <AuthProvider>
//             <NotificationComponent token={token} />
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="/login" element={<LoginPage />} />
//                     <Route path="/register" element={<RegisterPage />} />
//                     {/* Admin-only People page */}
//                     <Route
//                         path="/people"
//                         element={
//                             <PrivateRoute>
//                                 <AdminRoute>
//                                     <PeoplePage />
//                                 </AdminRoute>
//                             </PrivateRoute>
//                         }
//                     />
//
//                     {/* Devices page for all logged-in users */}
//                     <Route
//                         path="/devices"
//                         element={
//                             <PrivateRoute>
//                                 <DevicesPage />
//                             </PrivateRoute>
//                         }
//                     />
//
//                     {/* ➡️ CRITICAL ADDITION: MONITORING PAGE ROUTE */}
//                     <Route
//                         path="/monitoring-data"
//                         element={
//                             <PrivateRoute> {/* Wrap in PrivateRoute for authentication */}
//                                 <MonitorPage />
//                             </PrivateRoute>
//                         }
//                     />
//
//                     {/* Fallback for unknown routes */}
//                     <Route path="*" element={<Navigate to="/devices" replace />} />
//                     <Route path="/device-assignment" element={<DeviceAssignmentPage />} />
//                 </Routes>
//             </BrowserRouter>
//         </AuthProvider>
//     );
// }
