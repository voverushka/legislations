# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

## How to run

You need to have node installed.
- After cloning repo, change into your src dir (like <em>legislations/src</em>)
- Run <em>npm install</em>
- Change into <em>server</em> dir (different tab)
- Run <em>node express.js</em> to start express server
- Change back to <em>src</em>
- Run <em>npm start</em> (runs in dev mode)
- Open your browser with url http://localhost:3000
- Playwright tests could be run in <em>legislations</em> dir <em>npx playwright test</em>

## Notes

- I use <em>express.js</em>, as I was expecting to do some sequential API calls to get filtered data. In reality, not that bad, as you can fetch full list at once. But did not want to change it at this point.

- When app loads, I do legislations prefetch for filtering by type. Favourites tab also uses filtering (by favourite flag), so both filter and <em>Favourites<em> tab are not available till prefetch done. I did not do any cache expire at this point. It will redo this on page refresh.
- While pretch is on, you still can do pagination and mark/unmark favourites (click on the star icon to do that).
- express does console logging when favoriting/unfavouritting is complete.
- I do request cancellation. It should be visible on slow network.
- both <em>All</em> and <em>Favourites</em> tabs have pagination.

- In case of marking favourites, there is a danger, that user can spawn multiple request very easily. In this case it would be better to submit these requests in batches. But it all depends on how long processing of request will last. I did not try to do batches now.
- I used hooks, reducer, state, but little of <em>Redux<em>. I need to change my current mentality for that.
- there were other things I wanted to do, like to remember tab query globally in order to restore it (would use <em>Redux</em>), but was aiming for MVP.
