import { Route, BrowserRouter, Routes } from "react-router-dom";
import ScrollableMenu from "./page/ScrollableMenu";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ScrollableMenu />} />
    </Routes>
  </BrowserRouter>
);

export default App;
