import React from "react";
import Layout from "./components/layout/Layout";
// import TestInputs from "./pages/TestInputs";
// import Showcase  from "./components/ui/Showcase"; 
import Components from "./components/elements/AllComponentsPage";

const currentPath = [{ label: 'Settings', href: '/settings' }];

function App() {
  return (
    <Layout currentPath={currentPath}>
      {/* <TestInputs />
      <Showcase /> */}
      <Components />
    </Layout>
  );
}

export default App;