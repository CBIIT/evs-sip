import { connect } from "react-redux";
import DataDictionaryValuesTable from "./DataDictionaryValuesTable";

const ReduxDataDictionaryTable = (() => {
  const mapStateToProps = (state, ownProps) => ({
    open: ownProps.open,
    enum: ownProps.enum,
    hits: ownProps.hits,
    source: ownProps.source,
    category: ownProps.category,
    node: ownProps.node,
    property: ownProps.property,
    hasValues: ownProps.hasValues,
    type: ownProps.type,
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({});

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(DataDictionaryValuesTable);
})();

export default ReduxDataDictionaryTable;
