const express = require("express");
const esapi = require("../service/esapi/esapi");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const router = express.Router();

router.get('/', function (req, res) {
    res.json({
        'version': '1.0.0',
        'title': 'EVS-SIP RESTful API',
        'documentation': 'https://' + req.headers.host+ [':300',':80'].some((e) => req.headers.host.includes(e))?'/api/docs/':'/evssip/api/docs/'
    });
});

router.use('/docs',
    swaggerUi.serve,
    function (req, res) {
        const protocol = req.get('host').includes('gov')?'https':'http';
        const host = req.get('host');
        const baseUrl = [':300',':80'].some((e) => host.includes(e))?'/api':'/evssip/api';
        swaggerUi.setup(swaggerDocument(protocol, host, baseUrl))(req, res);
    }
);

router.use('/swaggerjson',
    function (req, res) {
        const protocol = req.get('host').includes('gov')?'https':'http';
        const host = req.get('host');
        const baseUrl = [':300',':80'].some((e) => host.includes(e))?'/api':'/evssip/api';
        const swaggerdoc = swaggerDocument(protocol, host, baseUrl);
        res.json(swaggerdoc);
    }
);

// api search from elasticSearch
router.get("/search", esapi.apiEsSearch);

//source view from dict files
router.get("/data_dictionary/source/:model", esapi.getEsModelData);
router.get("/data_dictionary/source/:model/:node", esapi.getEsModelData);
router.get("/data_dictionary/source/:model/:node/:prop", esapi.getEsModelData);

module.exports = router;
