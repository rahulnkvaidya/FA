const express = require('express');
const cors = require('cors');
const apiaiRouter = require('./routes/api');
const apicustomer = require("./routes/customer");
//const apiloginRouter = require('./routes/login');
const taskRoutes = require('./routes/task');
const ledgerRoutes = require('./routes/ledger');
const invoiceRoutes = require('./routes/invoice');
const importRoutes = require('./routes/import');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cors({ origin: true }));
// Routes
app.use('/api/', apiaiRouter);
app.use('/api/customer/', apicustomer);
app.use('/api/task/', taskRoutes);
app.use('/api/ledgers/', ledgerRoutes);
app.use('/api/invoice/', invoiceRoutes);
app.use('/api/import/', importRoutes);

// Default route
app.use('/', (req, res) => {
    res.send('Hello, World!');
});

// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Unexpected error occurred.');
});


const PORT = 3005;
 app.listen(PORT, console.log(`listening on PORT ${PORT}`));