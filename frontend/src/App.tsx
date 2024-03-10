import { Suspense, lazy } from "react";

import AuthUserProvider from "./Providers/AuthUserProvider";
import Routers from "./Routers";

const Loading = lazy(() => import("./Components/Common/Loading"));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AuthUserProvider unauthorized={<Routers.SessionRouter />}>
        <Routers.AppRouter />
      </AuthUserProvider>
    </Suspense>
  );
};

export default App;
