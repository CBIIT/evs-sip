
import _ from 'lodash';

export const sortAlphabetically = (values) => {
  values.sort((a, b) => {
    const an = a.n.replace(/<b>/g, '').replace(/<\/b>/g, '').toLowerCase();
    const bn = b.n.replace(/<b>/g, '').replace(/<\/b>/g, '').toLowerCase();
    if (an > bn) { return 1; }
    if (bn > an) { return -1; }
    return 0;
  });
  return values;
};

export const sortAlphabeticallyObject = (object) => {
  let ordered = {}
  Object.keys(object).sort().forEach(key => ordered[key] = object[key])
  return ordered;
};

export const sortSynonyms = (synonyms) => {
  const mapped = { PT: 1, BR: 2, FB: 3, CN: 4, AB: 5, SY: 6, SN: 7, AD: 8, AQ: 9, AQS: 10 };
  synonyms.sort((a, b) => (mapped[a.termGroup] > mapped[b.termGroup]) ? 1 : (a.termGroup === b.termGroup) ? ((a.termName.toLowerCase() > b.termName.toLowerCase()) ? 1 : -1) : -1);
  return synonyms;
};

export const getHighlightObj = (highlight) => {
  let highlightObj = {};
  if (highlight !== undefined) {
    highlight.forEach(val => {
      let tmp = val.replace(/<b>/g, '').replace(/<\/b>/g, '');
      if (highlightObj[tmp] === undefined) highlightObj[tmp] = val;
    });
  }
  return highlightObj;
};

export const getAllValueHighlight = (enumHits) => {
  let highlightValueObj = {};
  enumHits.hits.forEach(emHit => {
    let emHighlight = emHit.highlight;
    let highlightValue = ('enum.n' in emHighlight) || ('enum.n.have' in emHighlight) ? emHighlight['enum.n'] || emHighlight['enum.n.have'] : undefined;
    if (highlightValue !== undefined) {
      highlightValue.forEach(val => {
        let tmp = val.replace(/<b>/g, '').replace(/<\/b>/g, '');
        if (highlightValueObj[tmp] === undefined) highlightValueObj[tmp] = val;
      });
    }
  });
  return highlightValueObj;
};

export const getAllSyn = (items) => {
  items.forEach(item => {
    if (item.ncit !== undefined) {
      item.all_syn = [];
      item.ncit.forEach(nc => {
        item.all_syn = item.all_syn.concat(nc.s.map(function (x) { return x.n; }));
      });
    }
  });
  return items;
};

export const searchFilter = (items, keyword) => {
  getAllSyn(items);
  let newItem = [];
  JSON.parse(JSON.stringify(items)).forEach(item => {
    let idx = item.n.toLowerCase().indexOf(keyword);
    if (idx !== -1) {
      if (idx === 0) newItem.unshift(item);
      if (idx !== 0) newItem.push(item);
    }
  });

  // // Search in all_syn synonyms if it has icdo3 code
  JSON.parse(JSON.stringify(items)).forEach(item => {
    if (item.all_syn !== undefined) {
      let tmpArr = item.all_syn.map(function (x) { return x.trim().toLowerCase(); }).map(function (s) { return s.indexOf(keyword) >= 0; });
      if (tmpArr.indexOf(true) >= 0 && !_.some(newItem, item)) {
        newItem.push(item);
      }
    }

    if (item.ncit !== undefined) {
      let tmpArr = item.ncit.map(function (x) { return x.c.trim().toLowerCase(); }).map(function (c) { return c.indexOf(keyword) >= 0; });
      if (tmpArr.indexOf(true) >= 0 && !_.some(newItem, item)) {
        newItem.push(item);
      }
    }

    if (item.ncit !== undefined) {
      let tmpArr = item.ncit.map(function (x) { return x.l.trim().toLowerCase(); }).map(function (l) { return l.indexOf(keyword) >= 0; });
      if (tmpArr.indexOf(true) >= 0 && !_.some(newItem, item)) {
        newItem.push(item);
      }
    }

    if (item.icdo !== undefined) {
      if(item.icdo.c.trim().toLowerCase().indexOf(keyword) >= 0){
        newItem.push(item);
        return;
      }
      let tmpArr = item.icdo.s.map(function (x) { return x.n.trim().toLowerCase(); }).map(function (s) { return s.indexOf(keyword) >= 0; });
      if (tmpArr.indexOf(true) >= 0 && !_.some(newItem, item)) {
        newItem.push(item);
      }
    }
  });

  // Highlight matched values and synonyms
  newItem.forEach(item => {
    item.n = item.n.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(new RegExp(keyword, 'ig'), '<b>$&</b>');
    if (item.icdo !== undefined) {
      item.icdo.c = item.icdo.c.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(new RegExp(keyword, 'ig'), '<b>$&</b>');
      item.icdo.s = item.icdo.s.map(function (x) { return { n: x.n.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(new RegExp(keyword, 'ig'), '<b>$&</b>'), t: x.t, src: x.src }});
    }

    if (item.ncit !== undefined) {
      item.ncit.forEach(nc => {
        if (nc.c !== undefined) {
          nc.c = nc.c.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(new RegExp(keyword, 'ig'), '<b>$&</b>')
        }
        if (nc.l !== undefined) {
          nc.l = nc.l.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(new RegExp(keyword, 'ig'), '<b>$&</b>')
        }
        if (nc.s === undefined) return;
        nc.s = nc.s.map(function (x) { return { n: x.n.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(new RegExp(keyword, 'ig'), '<b>$&</b>'), t: x.t, src: x.src }; });
      });
    }
  });
  return newItem;
};

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ 
const isSafari = navigator.userAgent.indexOf("Safari") > -1;

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

export const browserDetection = {
  isFirefox: isFirefox,
  isSafari: isSafari,
  isIE: isIE,
  isEdge: isEdge,
  isChrome: isChrome
}
