const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;

// storage for favourites
const favourites = [];

const LEGISLATIONS_URL = 'https://api.oireachtas.ie/v1/legislation';


const toResponse = (data) => {
  const items = data.results.reduce((acc, currentBill, index) => {
      const  { uri, billNo, billType, status, sponsors, shortTitleEn, shortTitleGa } = currentBill.bill;
      acc.push({
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
      })
      return acc;
  }, []);
  return {
    count: data.head.counts.billCount,
    items
  }
}

// parallel calls. Our requests based on initial count we got
// if count does change in between, we are not aware here
const getAllInParallelRequests = async () => {
	const maxPageSize = 50;
	return axios.get(LEGISLATIONS_URL, {
    params: {
      skip: 0,
      limit: maxPageSize
    }
  }).then(
		(response) => {
      const r = toResponse(response.data);
			if (r.count <= r.items.length) {
				// should be == but just in case adding <
				return r;
			}
			const additionaRequests = [];

			// issue parallel requests for remaining items
			for (
				let i = r.items.length;
				i < r.count;
				i += maxPageSize
			) {
				additionaRequests.push(
          axios.get(LEGISLATIONS_URL, {
						limit: maxPageSize,
						skip: i * maxPageSize,
					})
				);
			}

			return Promise.all(additionaRequests.slice(0, 10)).then(additionaRequestsResponses => {
      	for (let i = 0; i < additionaRequestsResponses.length; i++) {
       ;
					r.items = [
						...r.items,
						...(toResponse(additionaRequestsResponses[i].data).items ?? []),
					];
				}
				return r;
			});
		}
	);
};


app.use(express.urlencoded({ extended: true }));

app.get('/legislation', (req, res) => {
  if (!req.query.bill_type) {
    axios.get(LEGISLATIONS_URL, {
      params: req.query
    }).then(response => {
          const clientResponse = toResponse(response.data);
          res.send(clientResponse);
      })
   } else { 
      getAllInParallelRequests().then((data) => {
        console.log("Data is ", data);

      })
   }
});

// TODO: change to post or put
app.get('/favourite', (req, res) => {
  const { billId, isFavourite} = req.query;
  const favIndex = favourites.indexOf(billId);

  if (favIndex >= 0 && isFavourite == "false") {
      favourites.splice(favIndex, 1);
  } else if (favIndex < 0 && isFavourite == "true") {
      favourites.push(billId);
  }

  // TODO: handle error
  res.send({
      billNo: billId,
      isFavourite
  });

});


// if I have favourites in array, I know what bill no I need to filter by
app.get('/favourites', (req, res) => {

  axios.get(LEGISLATIONS_URL, {
    params: req.query
  }).then(response => {
        const clientResponse = toResponse(response.data);
        clientResponse.items = clientResponse.items.filter(it => it.isFavourite === true);
        clientResponse.count = favourites.length;
        res.send(clientResponse);
    })

});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})