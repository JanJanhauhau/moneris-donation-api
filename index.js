const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.post('/create-session', async (req, res) => {
  const { amount, email } = req.body;

  const payload = {
    store_id: 'mogo092938',
    api_token: 'dGDSuUZcUrD3Wq7chG1z',
    checkout_id: 'go-invoice',
    txn_total: parseFloat(amount).toFixed(2),
    action: 'txn',
    email: email // optional but included if needed
  };

  try {
    const { data } = await axios.post(
      'https://gatewayt.moneris.com/chkt/request/request.php',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Success structure
    if (data?.response?.checkout_url) {
      return res.json({ checkout_url: data.response.checkout_url });
    }

    // Error logging
    return res.status(400).json({
      error: "No checkout_url from Moneris",
      raw: data
    });
  } catch (error) {
    console.error("❌ Moneris Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Moneris request failed" });
  }
});

app.listen(3000, () => console.log("✅ Backend running on port 3000"));
