var path = require("path");
var _ = require("lodash");

const cfg = require("dotenv").config();
if (!cfg.error && cfg.parsed) {
  const tmp = cfg.parsed;

  // Load .env as fallback values only; keep explicit process env highest priority.
  process.env = {
    ...tmp,
    ...process.env,
  };

  // Backward compatibility: SERVICE_PORT in .env maps to process.env.PORT.
  if (!process.env.PORT && tmp.SERVICE_PORT) {
    process.env.PORT = tmp.SERVICE_PORT;
  }
} else if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "dev";
}

// All configurations will extend these options
// ============================================
var all = {
  // Root path of server
  root: path.resolve(__dirname, "../../"),

  // Server port
  port: process.env.PORT || 3000,

  // Server port
  logDir: process.env.LOGDIR || "/local/content/evssip/logs",

  // Node environment (dev, test, stage, prod), must select one.
  env: process.env.NODE_ENV || "prod",

  // general evssip index name
  indexName: "evssip",

  // suggestion evssip name for typeahead
  suggestionName: "evssip-suggestion",

  // index name for properties
  index_p: "evssip-p",

  // GDC searchable nodes
  gdc_searchable_nodes: [
    "case",
    "demographic",
    "diagnosis",
    "exposure",
    "family_history",
    "follow_up",
    "molecular_test",
    "treatment",
    "slide",
    "sample",
    "read_group",
    "portion",
    "analyte",
    "aliquot",
    "slide_image",
    "analysis_metadata",
    "clinical_supplement",
    "experiment_metadata",
    "pathology_detail",
    "pathology_report",
    "run_metadata",
    "biospecimen_supplement",
    "submitted_aligned_reads",
    "submitted_genomic_profile",
    "submitted_methylation_beta_value",
    "submitted_tangent_copy_number",
    "submitted_unaligned_reads",
    "data_release",
    "root",
  ],

  // GDC drugs properties
  drugs_properties: ["therapeutic_agents"],

  // get data from caDSR
  caDSR_url: [
    "https://cdebrowser.nci.nih.gov/cdebrowserServer/rest/search?publicId=",
    "https://cdebrowser.nci.nih.gov/cdebrowserServer/rest/CDEData?deIdseq=",
  ],

  // get synonyms from NCIt
  NCIt_url: [
    "https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI_Thesaurus&code=",
    "https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI_Thesaurus&type=synonym&code=",
    "http://nciws-d790.nci.nih.gov:15080/evsrestapi2/api/v1/ctrp/concept/",
    "https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=CTCAE&type=synonym&code=",
    "https://evsrestapi.nci.nih.gov/evsrestapi/api/v1/ctrp/concept/",
    "https://evsrestapi-stage.nci.nih.gov/evsrestapi/api/v1/conceptList?db=weekly&properties=Code,Preferred_Name,FULL_SYN,DEFINITION&concepts=",
    "https://api-evsrest.nci.nih.gov/api/v1/concept/ncit/",
  ],

  //in memory cache ttl
  item_ttl: 24 * 60 * 60,

  //Typeahead item size
  suggestion_size: 10,

  //search result limit
  search_result_limit: 50,
};

// Export the config object based on the NODE_ENV
// ==============================================
const mergedConfig = _.merge(all, require("./" + all.env + ".js") || {});
const requiresOpenSearchHost = ["qa", "stage", "prod"].includes(mergedConfig.env);
const openSearchHost = mergedConfig.opensearch && mergedConfig.opensearch.host;

if (requiresOpenSearchHost && (!openSearchHost || !openSearchHost.trim())) {
  throw new Error(
    "Missing required OPENSEARCH_HOST for NODE_ENV=" +
      mergedConfig.env +
      ". Set OPENSEARCH_HOST in environment variables."
  );
}

if (openSearchHost && openSearchHost.trim()) {
  const normalizedOpenSearchHost = openSearchHost.trim();
  if (!/^https?:\/\//i.test(normalizedOpenSearchHost)) {
    throw new Error(
      "Invalid OPENSEARCH_HOST '" +
        normalizedOpenSearchHost +
        "'. Expected a full URL including protocol, e.g. http://127.0.0.1:9200 or https://example.us-east-1.es.amazonaws.com."
    );
  }
  mergedConfig.opensearch.host = normalizedOpenSearchHost;
}

module.exports = mergedConfig;
