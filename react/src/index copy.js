import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ErrorPage from "./error-page";
import Contact from "./routes/contact";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/bootstrap/js/dist/dropdown.js";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./component/header";
import Footer from "./component/footer";
import SOP from "./screens/sop";
import POS from "./screens/pos";
import BAR from "./screens/bar";
import Menu from "./screens/menu";
import InvoiceAddItem from "./screens/invoiceadditem";
import MenuAdd from "./screens/menuadd";
import Home from "./screens/home";
import BillAdd from "./screens/bill";
import Kot from "./screens/kot";
import Kotb from "./screens/kotb";
import Reportlist from "./screens/reports/reportlist";
import Invoice from "./screens/invoice";
import Task from "./screens/tasks/tasklist";
import AddTask from "./screens/tasks/taskadd";
import Swimming from "./screens/swimming/swimminglist";
import RunningTable from "./screens/runningtable";
import InvoicePrint from "./screens/invoiceprint";
import InvoiceSearch from "./screens/invoiceprintsearch";
import Thali from "./screens/tiffin";
import ThaliTaken from "./screens/tiffintaken";
import Thalidetails from "./screens/tiffindetails";
import Thalilist from "./screens/tiffinlist";
import ReportDateWise from "./screens/datewisesalereport";
import Itemadd from "./screens/itemadd";
import ItemList from "./screens/itemlist";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>

      <BrowserRouter>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sop" element={<SOP />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/bar" element={<BAR />} />
            <Route path="/runningtable" element={<RunningTable />} />
            <Route path="/menu/:id" element={<Menu />} />
            <Route path="/invoiceadditem/:id/:invoiceid" element={<InvoiceAddItem />} />
            <Route path="/menuadd" element={<MenuAdd />} />
            <Route path="/reports" element={<Reportlist />} />
            <Route path="/billadd" element={<BillAdd />} />
            <Route path="/kot" element={<Kot />} />
            <Route path="/bkot" element={<Kotb />} />
            <Route path="/tiffin" element={<Thali />} />
            <Route path="/tiffintaken" element={<ThaliTaken />} />
            <Route path="/tiffindetails" element={<Thalidetails />} />
            <Route path="/tiffinlist" element={<Thalilist />} />
            <Route path="/tasks" element={<Task />} />
            <Route path="/tasks/add" element={<AddTask/>} />
            <Route path="/report/datewise/:date" element={<ReportDateWise/>} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/swimming" element={<Swimming />} />
            <Route path="/invoicesearch" element={<InvoiceSearch/>} />
            <Route path="/invoiceprint/:invoiceprint" element={<InvoicePrint/>} />
            <Route path="/itemadd" element={<Itemadd/>} />
            <Route path="/itemlist" element={<ItemList/>} />
            <Route path="*" element={<ErrorPage />} />
           
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
