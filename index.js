const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const MONERIS_API = 'https://gatewayt.moneris.com/chkt/request/request.php';

app.post('/create-session', async (req, res) => {
  const { amount, email } = req.body;

  const data = {
    action: 'txn',  // ✅ REQUIRED
    store_id: 'mogo092938',
    api_token: 'dGDSuUZcUrD3Wq7chG1z',
    checkout_id: 'go-invoice',
    txn_total: parseFloat(amount).toFixed(2),
    email
  };

  try {
    const response = await axios.post(MONERIS_API, data);
    const result = response.data?.response || {};

    if (result.checkout_url) {
      res.json({ checkout_url: result.checkout_url });
    } else {
      res.status(400).json({ error: 'No checkout_url from Moneris', raw: response.data });
    }
  } catch (err) {
    console.error('Moneris error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Moneris session creation failed' });
  }
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));
