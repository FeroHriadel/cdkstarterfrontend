import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import UserContextProvider from './context/UserContext';

import AdminOnly from './components/routeGuards/AdminOnly';
import MainNav from './components/MainNav';
import HomePage  from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CategoriesPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';
import TagFormPage from './pages/TagFormPage';
import CategoryFormPage from './pages/CategoryFormPage';




function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <MainNav />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/categories' element={<CategoriesPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/signin' element={<SigninPage />} />
          <Route path='/forgotpassword' element={<ForgotPasswordPage />} />
          <Route path='/tags' element={<TagsPage />} />

          <Route path='/admin' element={<AdminOnly />}>
            <Route path='/admin/tagform' element={<TagFormPage />} />
            <Route path='/admin/categoryform' element={<CategoryFormPage />} />
          </Route>

          <Route path='*' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
