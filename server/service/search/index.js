const express = require("express");
const controller = require("./controller");

const router = express.Router();

const localhostOnly = (req, res, next) => {
  const addr = req.socket.remoteAddress;
  if (addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};

// build indexes for opensearch — localhost only
router.post("/buildIndex", localhostOnly, controller.indexing);

// delete all indexes and rebuild — localhost only
router.post("/rebuildIndex", localhostOnly, controller.rebuildIndex);

// suggestions list api
router.get("/suggest", controller.suggestion);

// property based api
router.get("/all/p", controller.searchP);

//graphical view
router.get("/graph/gdc", controller.getGraphicalGDCDictionary);
router.get("/graph/icdc", controller.getGraphicalICDCDictionary);
router.get("/graph/ctdc", controller.getGraphicalCTDCDictionary);
router.get("/graph/pcdc", controller.getGraphicalPCDCDictionary);
router.get("/graph/p/vs", controller.getValuesForGraphicalView);
router.get("/p/local/vs", controller.getGDCData);

//for data preprocessing only
router.get('/compareAllWithGDCDictionary', localhostOnly, controller.compareAllWithGDCDictionary);
router.get('/exportCompareResult', localhostOnly, controller.exportCompareResult);
router.get('/exportAllCompareResult', localhostOnly, controller.exportAllCompareResult);
router.get('/generateCompareProperties', localhostOnly, controller.generateCompareProperties);
router.get('/generateCompareNodes', localhostOnly, controller.generateCompareNodes);

module.exports = router;
