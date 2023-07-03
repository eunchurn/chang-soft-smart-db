import React, { useState } from 'react';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { NavigationLayout } from "./component/NavgationLayout";
import { Home } from "./pages/Home";
import Projects from "./pages/Projects";
import UserPage from "./pages/user";
import Insight from "./pages/insight";
import SubBuildingDetail from "./pages/SubBuildingDetail"
import { buildingInfo_interface } from "./interface/buildingInfo_interface"

function App() {
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();
  const [projectName, setProjectName] = useState<string>("");

  return (
    <div className="App">
      <NavigationLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects setBuildingInfo={setBuildingInfo} setProjectName={setProjectName} />} />
          <Route path="/insight" element={<Insight />} />
          <Route path="/user_info" element={<UserPage />} />
          <Route path="/sub_building_detail" element={<SubBuildingDetail buildingInfo={buildingInfo} projectName={projectName} />} />
        </Routes>
      </NavigationLayout>
    </div>
  );
}

export default App;
