import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import "@/i18n/i18n";

import { App } from "@/app";

// biome-ignore lint/style/noNonNullAssertion: root always exists
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
