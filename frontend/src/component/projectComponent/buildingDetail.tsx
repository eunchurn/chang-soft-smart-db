import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";
import { useNavigate, Route, Routes } from "react-router-dom";
import { buildingInfo_interface } from "./../../interface/buildingInfo_interface";
import SubBuildingDetail from "./../SubBuildingComponent/subBuildingList";
import "./../../styles/GridDetail.scss";

const BuildingDetail = (props: any) => {
  const [imgPath, setImgPath] = useState<string>("");
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("props : ");
        console.log(props);
        const response = await axios.get(
          urlPrefix.IP_port +
            "/building/" +
            props.buildingInfo.id +
            "/get_project_name"
        );

        const data = JSON.parse(response.data);
        const importedImagePath = await import(
          "./../../resource/project_pictures/" +
            data[0].project_name +
            "/" +
            data[0].building_name +
            "/ScreenShot.png"
        );

        setBuildingInfo(props.buildingInfo);
        setImgPath(importedImagePath.default);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [props, imgPath]);

  const navigate = useNavigate();
  const onClick = () => {
    navigate("/sub_building_detail");
  };

  const headerClassName = "custom-header-cell";

  return (
    <div>
      <div style={{ width: "30%", float: "left", paddingLeft: "1%" }}>
        {imgPath && <img src={imgPath} alt="Building Image" height="300px" />}
      </div>
      <div style={{ width: "50%", float: "right", paddingLeft: "1%" }}>
        <div style={{ width: "200%"}}>
          <Button onClick={onClick}>상세보기</Button>
        </div>
        <Grid data={[buildingInfo]}>
          <GridColumn
            field="building_name"
            title="빌딩 이름"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
        </Grid>
        <Grid data={[buildingInfo]}>
          <GridColumn
            field="total_area"
            title="total_area"
            headerClassName={headerClassName}
            className="custom-number-cell"
          />
          <GridColumn
            field="stories"
            title="stories"
            headerClassName={headerClassName}
            className="custom-number-cell"
          />
          <GridColumn
            field="height"
            title="height"
            headerClassName={headerClassName}
            className="custom-number-cell"
          />
          <GridColumn
            field="construction_method"
            title="construction_method"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
        </Grid>

        <Grid data={[buildingInfo]}>
          <GridColumn
            field="top_down"
            title="top_down"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
          <GridColumn
            field="plane_shape"
            title="plane_shape"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
          <GridColumn
            field="foundation_type"
            title="foundation_type"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
          <GridColumn
            field="structure_code"
            title="structure_code"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
          <GridColumn
            field="performance_design_target"
            title="performance_design_target"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
        </Grid>
      </div>
    </div>
  );
};

export default BuildingDetail;
