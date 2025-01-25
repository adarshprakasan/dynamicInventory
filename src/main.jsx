import { createRoot } from "react-dom/client";
import "./index.css";
import DynamicInventory from "./dynamicInventory";

createRoot(document.getElementById("root")).render(
  <>
    <DynamicInventory />
  </>
);
