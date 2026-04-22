// --- 1. IMPORTS (Thư viện -> Redux -> Services -> Utils/Components) ---
import { Fragment, useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import routes from "./routes";
import { isJsonString } from "./untils";
import * as UserService from "./services/UserService";
import { refreshUser, updateUser } from "./redux/slides/userSlide";

import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import Loading from "./components/LoaddingComponent/Loadding";

function App() {
  // --- 2. STATE & REDUX ---
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. HELPER FUNCTIONS (Hàm bổ trợ xử lý Token) ---
  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  // --- 4. CORE LOGIC (Lấy thông tin User) ---
  const handleGetDetailUser = useCallback(
    async (id, token) => {
      try {
        setIsLoading(true);
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
      } catch (error) {
        localStorage.removeItem("access_token");
        dispatch(refreshUser());
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  // --- 5. SIDE EFFECTS (Luồng chạy khi load App) ---
  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, [handleGetDetailUser]);

  // --- 6. AXIOS INTERCEPTORS (Tự động làm mới Token khi hết hạn) ---
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currenTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currenTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data.access_token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // --- 7. RENDER JSX (Phần giao diện và Routes) ---
  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const ischeckAuth = !route.isPrivate || user.isAdmin;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;

              return (
                <Route
                  key={route.path}
                  path={ischeckAuth ? route.path : undefined}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}

export default App;
