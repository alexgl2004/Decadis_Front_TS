//import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import Home from './pages/Home';
import Users from './pages/Users';
import Items from './pages/Items';
import Item from './pages/Item';
import Nulled from './pages/Nulled';


import Routerblock from './components/Routerblock';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Routerblock />}>
      <Route index element={<Home />} />
      <Route path="users" element={<Users />} />
      <Route path="items" element={<Items />} />
      <Route path="items/:id" element={<Item />} />
      <Route path="nulled" element={<Nulled />} />
    </Route>
  )
)

function App() {

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
