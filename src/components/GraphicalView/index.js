import React from "react";
import ReduxDataDictionary from "./DataDictionary";

const GraphicalView = (props) => {
  let graphType = props.type;

  if (graphType.indexOf("readonly") > 0) {
    return <ReduxDataDictionary graphType={graphType} />;
  } else {
    return (
      <ReduxDataDictionary
        graphType={graphType}
        keyword={props.keyword}
        source={props.source}
      />
    );
  }
};

export default GraphicalView;
