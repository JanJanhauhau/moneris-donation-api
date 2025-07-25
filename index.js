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
    checkout_id: 'go-invoice',
    store_id: 'mogo092938',
    api_token: 'dGDSuUZcUrD3Wq7chG1z',
    txn_total: parseFloat(amount).toFixed(2),
    email
  };

  try {
    const response = await axios.post(MONERIS_API, data);
    if (response.data?.response?.checkout_url) {
      res.json({ checkout_url: response.data.response.checkout_url });
    } else {
      res.status(400).json({ error: 'No checkout_url from Moneris', raw: response.data });
    }
  } catch (err) {
    console.error('Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create Moneris session' });
  }
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));
