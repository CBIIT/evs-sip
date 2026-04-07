/**
 * dev environment
 */

module.exports = {
  opensearch: {
    host: process.env.OPENSEARCH_HOST || 'http://localhost:9200',
    region: 'us-east-1',
  }
};
