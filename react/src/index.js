import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import ErrorPage from "./error-page";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import 'react-toastify/dist/ReactToastify.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import Home from "./screen/home.js";
import Ledgers from "./screen/ledgers.js";
import LedgersNew from "./screen/ledgerNew.js";
import Customer from "./screen/customer.js";
import Iteam from "./screen/item.js";
import IteamNew from "./screen/itemnew.js";
import Rates from "./screen/rates.js";
import Payment from "./screen/payment.js";

import SalesVoucher from './screen/SalesVoucher';
import ReceiptVoucher from './screen/ReceiptVoucher';
import Cashledger from "./screen/cashLedgerpage.js";
import Daybook from "./screen/DayBookPage.js";

import TransactionPage from "./screen/TransactionPage.js";
import TransactionForm from "./screen/TransactionForm.js";
import TransactionList from "./screen/TransactionList.js";
import LedgerTransactionsPage from "./screen/LedgerTransactionsPage.js";
import NewCustomer from "./screen/customerNew.js";
import Headers from './component/header.js';
import Footer from './component/footer.js';
import EditCustomerPage from './screen/EditCustomer.js';
import PurchaseVoucherForm from './screen/PurchaseVoucherForm.js';
import Tasks from './screen/TaskListPage.js';
import BalanceCustomer from './screen/balancecustomer.js';
import LedgerEditPage from './screen/LedgerEditPage.js';
import CustomerLedgerPage from './screen/CustomerLedgerPage.js';
import InvoiceList from './screen/invoicelist.js';
import Ledgerimport from './screen/ledgerimport.js';
import Bankimport from './screen/bankimport.js';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <div className="container-fluid mt-0 mb-0">
          <Headers />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customer/:customerId/ledger" element={<CustomerLedgerPage />} />
            <Route path="/ledger" element={<Ledgers />} />
            <Route path="/ledgernew" element={<LedgersNew />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/payment" element={<Payment />} />
            <Route path='/ledgerimport' element={<Ledgerimport/>} />
            <Route path='/bankimport' element={<Bankimport/>} />
            <Route path="/newcustomer" element={<NewCustomer />} />
            <Route path="/item" element={<Iteam />} />
            <Route path="/newitem" element={<IteamNew />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/pvoucher" element={<PurchaseVoucherForm />} />
            <Route path="/daybook" element={<Daybook />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/balancecustomer" element={<BalanceCustomer />} />
            <Route path="/sales-voucher" element={<SalesVoucher />} />
            <Route path="/receipt-voucher" element={<ReceiptVoucher />} />
            <Route path="/cash-ladger" element={<Cashledger />} />
            <Route path="/editcustomer/:id" element={<EditCustomerPage />} />
            <Route path='/invoicelist' element={<InvoiceList />} />
            <Route path="/ledgeredit/:id" element={<LedgerEditPage />} />


            <Route path="/transaction" element={<TransactionPage />} />
            <Route path="/transactionform" element={<TransactionForm />} />
            <Route path="/transactionlist" element={<TransactionList />} />
            <Route path="/ledger-transactions" element={<LedgerTransactionsPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </div>
      </HashRouter>
    </Provider>
  </React.StrictMode >
);