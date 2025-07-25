const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-session', async (req, res) => {
  const { amount, email } = req.body;

  const payload = {
    store_id: 'mogo092938',
    api_token: 'dGDSuUZcUrD3Wq7chG1z',
    checkout_id: 'go-invoice',
    txn_total: parseFloat(amount).toFixed(2),
    action: 'txn',
    email: email
  };

  try {
    const response = await axios.post(
      'https://gatewayt.moneris.com/chkt/request/request.php',
      payload,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log("✅ Moneris raw response:", response.data);

    if (response.data?.response?.checkout_url) {
      return res.json({ checkout_url: response.data.response.checkout_url });
    } else {
      return res.status(400).json({
        error: 'No checkout_url from Moneris',
        raw: response.data
      });
    }
  } catch (err) {
    console.error('❌ Moneris error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Moneris session creation failed' });
  }
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));
