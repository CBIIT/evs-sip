// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconCase from '-!react-svg-loader!./icons/icon_case.svg';
import IconCase from "./SVGComponents/IconCase";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconAdministrative from '-!react-svg-loader!./icons/icon_administrative.svg';
import IconAdministrative from "./SVGComponents/IconAdministrative";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconAnalysis from '-!react-svg-loader!./icons/icon_analysis.svg';
import IconAnalysis from "./SVGComponents/IconAnalysis";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconBiospecimen from '-!react-svg-loader!./icons/icon_biospecimen.svg';
import IconBiospecimen from "./SVGComponents/IconBiospecimen";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconClinical from '-!react-svg-loader!./icons/icon_clinical.svg';
import IconClinical from "./SVGComponents/IconClinical";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconDataFile from '-!react-svg-loader!./icons/icon_data_file.svg';
import IconDataFile from "./SVGComponents/IconDataFile";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconGeneratedDataFile from '-!react-svg-loader!./icons/icon_generated_data_file.svg';
import IconGeneratedDataFile from "./SVGComponents/IconGeneratedDataFile";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconMetadata from '-!react-svg-loader!./icons/icon_metadata.svg';
import IconMetadata from "./SVGComponents/IconMetadata";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconNotation from '-!react-svg-loader!./icons/icon_notation.svg';
import IconNotation from "./SVGComponents/IconNotation";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconNucleicAcidVariant from '-!react-svg-loader!./icons/icon_nucleic_acid_variant.svg';
import IconNucleicAcidVariant from "./SVGComponents/IconNucleicAcidVariant";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconIndexFile from '-!react-svg-loader!./icons/icon_index_file.svg';
import IconIndexFile from "./SVGComponents/IconIndexFile";
// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconDefault from '-!react-svg-loader!./icons/icon_default.svg';
import IconDefault from "./SVGComponents/IconDefault";

const nodeCategoryList = {
  clinical: {
    icon: IconClinical,
    color: "#05B8EE",
  },
  biospecimen: {
    icon: IconBiospecimen,
    color: "#27AE60",
  },
  data_file: {
    icon: IconDataFile,
    color: "#7EC500",
  },
  generated_data_file: {
    icon: IconGeneratedDataFile,
    color: "#7EC500",
  },
  metadata_file: {
    icon: IconMetadata,
    color: "#F4B940",
  },
  analysis: {
    icon: IconAnalysis,
    color: "#FF7ABC",
  },
  case: {
    icon: IconCase,
    color: "#AD91FF",
  },
  administrative: {
    icon: IconAdministrative,
    color: "#5d74f5",
  },
  nucleic_acid_variant: {
    icon: IconNucleicAcidVariant,
    color: "#E74C3C",
  },
  notation: {
    icon: IconNotation,
    color: "#E74C3C",
  },
  index_file: {
    icon: IconIndexFile,
    color: "#26D9B1",
  },
  aml: {
    icon: IconMetadata,
    color: "#F4B940",
  },
  ews: {
    icon: IconMetadata,
    color: "#26D9B1",
  },
  gct: {
    icon: IconMetadata,
    color: "#FF7ABC",
  },
  all: {
    icon: IconMetadata,
    color: "#AD91FF",
  },
  hl: {
    icon: IconMetadata,
    color: "#05b8ee",
  },
  os: {
    icon: IconMetadata,
    color: "#5d74f5",
  },
};

const defaultCategory = {
  icon: IconDefault,
  color: "#9B9B9B",
};

export const getCategoryIconSVG = (category) => {
  if (nodeCategoryList[category]) {
    return nodeCategoryList[category].icon;
  }

  return defaultCategory.icon;
};

export const getCategoryColor = (category) => {
  if (nodeCategoryList[category]) {
    return nodeCategoryList[category].color;
  }

  return defaultCategory.color;
};
