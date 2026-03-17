const SUPABASE_URL = 'https://zaukdakfcsmckbzvknaf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdWtkYWtmY3NtY2tienZrbmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NjI0NDIsImV4cCI6MjA4NzIzODQ0Mn0.zgZhm5sSVTl9mz-IOc-sYQvTaPveuA90_VPpqRGKuxM';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { table, filter } = req.query;
  if (!table) return res.status(400).json({ error: 'Table required' });

  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  if (filter) url += `?${filter}`;

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Prefer': 'return=minimal'
  };

  try {
    const fetchOptions = { method: req.method, headers };
    if (req.body && req.method !== 'GET') {
      fetchOptions.body = JSON.stringify(req.body);
    }
    const response = await fetch(url, fetchOptions);
    const text = await response.text();
    res.status(response.status);
    if (text) {
      try { res.json(JSON.parse(text)); }
      catch(e) { res.send(text); }
    } else {
      res.end();
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
