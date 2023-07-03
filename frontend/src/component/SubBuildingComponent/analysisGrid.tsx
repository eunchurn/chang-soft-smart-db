import React, { useEffect, useState } from "react";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import { subBuildingTotalAnalysisTable2_interface } from "./../../interface/subBuildingTotalAnalysisTable2_interface";

import {
  Grid,
  GridColumn,
  GridDetailRow,
  GridToolbar,
  GridDetailRowProps,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
} from "@progress/kendo-react-grid";

const TotalAnalysisGrid2 = (props: any) => {
  const [selectedBuildingInfo, setSelectedBuildingInfo] =
    useState<subBuildingTotalAnalysisTable2_interface[]>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/total_analysis_table2/" +
            props.buildingId
        );
        const data = JSON.parse(response.data);
        setSelectedBuildingInfo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props]);

  return (
    <div>
      {selectedBuildingInfo && (
        <div>
          <Grid data={selectedBuildingInfo}>
            <GridColumn title="구분" field="component_type" />
            <GridColumn title="콘크리트(m³)" field="concrete_volume" />
            <GridColumn title="콘크리트(%)" field="concrete_percentage" />
            <GridColumn title="거푸집(㎡)" field="formwork_area" />
            <GridColumn title="거푸집(%)" field="formwork_percentage" />
            <GridColumn title="철근(Ton)" field="rebar_weight" />
            <GridColumn title="철근(%)" field="rebar_percentage" />
          </Grid>
        </div>
      )}
    </div>
  );
};

export default TotalAnalysisGrid2;