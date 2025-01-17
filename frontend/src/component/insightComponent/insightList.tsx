import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";
import {
  DropDownList,
  MultiSelect,
  MultiSelectChangeEvent,
  MultiSelectTree,
  MultiSelectTreeChangeEvent,
  MultiSelectTreeExpandEvent,
  getMultiSelectTreeValue,
} from "@progress/kendo-react-dropdowns";
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { getter, setter } from "@progress/kendo-react-common";
import { itemIndexStartsWith } from "@progress/kendo-react-dropdowns/dist/npm/common/utils";

const dataItemKey = "id";
const checkField = "checkField";
const checkIndeterminateField = "checkIndeterminateField";
const expandField = "expanded";
// const projectsTextField = "projectName";
// const constructionCompanyTextField = "constructionCompany";

const selectDropDownFields = {
  dataItemKey,
  checkField,
  checkIndeterminateField,
  expandField,
  //subItemsField,
};

const InsightList = (props: any) => {
  const [insightList, setInsightList] = useState<string[]>([
    "'우미건설'의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값에 대한 분석",
    "'계룡건설'의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값의 분포 분석 (BoxPlot)",
    "'우미건설'의 4개 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 종류별 사용비율 비교",
    "건설사별 콘크리트당 철근중량 비교",
    "'우미건설' 프로젝트에서 내력벽의 그루핑에 따른 콘크리트당 철근값의 비교",
    "'신세계 어바인시티' 프로젝트에서 층별, 부재타입별, 철근타입별로 콘크리트 당 철근 사용량 값의 대한 히트맵 분석",
  ]);
  //only in list
  const [selectedInsightInList, setSelectedInsightInList] = useState<string>();
  const [selectedInsightIndexInList, setSelectedInsightIndexInList] =
    useState(0);
  //actually selected value
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(-1);

  //constructionCompanyList's id is useless
  const [constructionCompanyList, setConstructionCompanyList] = useState<
    { constructionCompany: string; id: number }[]
  >([{ constructionCompany: "All", id: 0 }]);
  const [selectedConstructionCompanyList, setSelectedConstructionCompanyList] =
    useState<{ constructionCompany: string; id: number }[]>([]);

  const [projectList, setProjectList] = useState<
    { projectName: string; id: number }[]
  >([{ projectName: "All", id: 0 }]);
  const [selectedProjectList, setSelectedProjectList] = useState<
    { projectName: string; id: number }[]
  >([]);
  //const [expandedProject, setExpandedProject] = useState<string[]>([]);

  const [projectFilter, setProjectFilter] = useState<CompositeFilterDescriptor>(
    {
      logic: "and",
      filters: [],
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/dashboard/project"
        );
        const data = JSON.parse(response.data);

        setProjectList(
          data.map((item: any) => {
            return { projectName: item.project_name, id: item.id };
          })
        );

        const uniqueConstructionCompanies = Array.from(
          new Set(data.map((item: any) => item.construction_company))
        );
        setConstructionCompanyList(
          uniqueConstructionCompanies.map((constructionCompany: any) => {
            const item = data.find(
              (item: any) => item.construction_company === constructionCompany
            );
            return { constructionCompany, id: item.id };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(projectFilter );
  }, [projectFilter]);

  const onSelectedInsightChange = (e: any) => {
    setSelectedInsightIndexInList(e.target.index);
    setSelectedInsightInList(e.value);
  };

  const onButtonClick = () => {
    props.setSelectedInsightIndex(selectedInsightIndexInList);
    setSelectedInsightIndex(selectedInsightIndexInList);
  };

  //set filter here
  const onNewConstructionCompanySelection = (
    event: MultiSelectTreeChangeEvent
  ) => {
    if (event.items[0] !== undefined) {
      projectFilter.filters = projectFilter.filters.filter((filter) => {
        return !(
          "field" in filter &&
          filter.field === "constructionCompany" &&
          filter.value === event.items[0].constructionCompany
        );
      });

      projectFilter.filters.push({
        field: "constructionCompany",
        operator: "eq",
        value: event.items[0].constructionCompany,
      });
    }

    setSelectedConstructionCompanyList(
      getMultiSelectTreeValue(constructionCompanyList, {
        ...selectDropDownFields,
        ...event,
        value: selectedConstructionCompanyList,
      })
    );
  };

  //set filter here
  const onNewProjectSelection = (event: MultiSelectTreeChangeEvent) => {
    // console.log(event)
    setSelectedProjectList(
      getMultiSelectTreeValue(projectList, {
        ...selectDropDownFields,
        ...event,
        value: selectedProjectList,
      })
    );
  };

  useEffect(()=>{console.log(projectFilter)},[projectFilter.filters])
  
  // const expandedState = (
  //   item: unknown,
  //   dataItemKey: string,
  //   expanded: string[]
  // ) => {
  //   const nextExpanded = expanded.slice();
  //   const keyGetter = getter(dataItemKey);
  //   const itemKey = keyGetter(item);
  //   const index = expanded.findIndex((currentKey) => {
  //     return currentKey === itemKey;
  //   });
  //   index === -1 ? nextExpanded.push(itemKey) : nextExpanded.splice(index, 1);

  //   return nextExpanded;
  // };
  // const onProjectExpandChange = React.useCallback(
  //   (event: MultiSelectTreeExpandEvent) =>
  //     setExpandedProject(
  //       expandedState(event.item, dataItemKey, expandedProject)
  //     ),
  //   [expandedProject]
  // );

  return (
    <div>
      <label>Insight : </label>
      <DropDownList
        data={insightList}
        value={selectedInsightInList}
        onChange={onSelectedInsightChange}
        style={{ width: "30%", margin: "10px" }}
      />
      <Button onClick={onButtonClick}>Search</Button>

      <MultiSelectTree
        style={{ width: "20%", margin: "10px" }}
        data={constructionCompanyList}
        value={selectedConstructionCompanyList}
        onChange={onNewConstructionCompanySelection}
        textField="constructionCompany"
        dataItemKey="id"
        checkField={checkField}
        checkIndeterminateField={checkIndeterminateField}
        expandField={expandField}
      />

      <MultiSelectTree
        style={{ width: "20%", margin: "10px" }}
        data={projectList}
        value={selectedProjectList}
        onChange={onNewProjectSelection}
        textField="projectName"
        dataItemKey="id"
        checkField={checkField}
        checkIndeterminateField={checkIndeterminateField}
        expandField={expandField}
        //onExpandChange={onProjectExpandChange}
      />
    </div>
  );
};

export default InsightList;
