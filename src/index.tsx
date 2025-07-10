import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DealCreationLayer } from "./screens/DealCreationLayer/DealCreationLayer";
import Layout from "./components/Layout/Layout";

// Breadcrumb data for the main layout
const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Deals", href: "/deals" },
  { label: "New Deal", href: "/deals/new" }
];

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Layout currentPath={breadcrumbItems}>
      <DealCreationLayer />
    </Layout>
  </StrictMode>,
);
