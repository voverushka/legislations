const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 8080;

// storage for favourites
const favourites = [];

const LEGISLATIONS_URL = 'https://api.oireachtas.ie/v1/legislation';

// filtering workaround: using cache of all records
let legislationsCache = {};

// helpers
const toResponse = (data, filterFn /* takes in result item and returns boolean */) => {
  const items = data.results.reduce((acc, currentBill, index) => {
      const  { uri, billNo, billType, status, sponsors, shortTitleEn, shortTitleGa } = currentBill.bill;
      const resultItem = {
          id: uri,
          billNumber: billNo, // TODO: this looks not uique, might be problem setting favourites
          billType: billType,
          billStatus: status,
          billSponsors: sponsors.reduce((sp, currentSp) => {
              // TODO: should I display only primary sponsor ?
              // can only one sponsor be primary, and what if none of sponsors are primary ?
              const sponsorName = currentSp.sponsor.as.showAs;
              if (sponsorName) {
                  sp.push(sponsorName);
              }
              return sp;
          }, []).join(", "),
          titleEn: shortTitleEn,
          titleGa: shortTitleGa,
          isFavourite: favourites.includes(uri)
      }

      if ((typeof filterFn === "function" && filterFn(resultItem) === true) || !filterFn) {
          acc.push(resultItem);
      }
      return acc;
  }, []);
  return {
    count: filterFn ? items.length: data.head.counts.billCount,
    items
  }
}

const getPage = (query, filterFn) => {
  const pageResponse = toResponse(legislationsCache.response, filterFn);
  const lastIndex = query.skip + query.limit;
  pageResponse.items = pageResponse.items.length > lastIndex ?
     pageResponse.items.slice(query.skip, lastIndex): pageResponse.items;
  return pageResponse;
}

const useCache = (query, filterFn) => {
  if (!legislationsCache.response) { // adding just in case, filtering should be disabled in this case
    getAllLegislations().then(response => {
      legislationsCache.response = response.data;
      return getPage(query, filterFn);
    })
  } else {
    return getPage(query, filterFn);
  }
}

const getAllLegislations = () => {
  return axios.get(LEGISLATIONS_URL, { // teest call to get total count
    params: {
      skip: 0,
      limit: 1
    }
  }).then((testResult) => {
    return axios.get(LEGISLATIONS_URL, {
      params: {
        skip: 0,
        limit: testResult.data.head.counts.billCount
      }
    });
  });	
};

// server
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use(cors());

app.post('/prefetch', (req, res) => {
  getAllLegislations().then(response => {
    legislationsCache.response = response.data;
    res.send();
  })
});

app.get('/legislation', (req, res) => {
  if (!req.query.bill_type) {
    axios.get(LEGISLATIONS_URL, {
      params: req.query
    }).then(response => {
          const clientResponse = toResponse(response.data);
          res.send(clientResponse);
      })
   } else { 
    const filterFn = item => item.billType.toLowerCase().includes(req.query.bill_type.toLowerCase());
    res.send(useCache(req.query, filterFn));
   }
});

app.post('/favourite', (req, res) => {
  setTimeout(() => {
    const { billId, isFavourite} = req.body;
    const favIndex = favourites.indexOf(billId);

    if (favIndex >= 0 && isFavourite === false) {
        favourites.splice(favIndex, 1);
    } else if (favIndex < 0 && isFavourite === true) {
        favourites.push(billId);
    }
    console.info(`Request to mark ${billId} as  ${isFavourite === true ? "favourite": "unfavourite"} done`);
    res.send({
        billNo: billId,
        isFavourite
    });
  },  500);

});

app.get('/favourites', (req, res) => {
  const result = useCache(req.query, item => favourites.includes(item.id));
  res.send(result);
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})