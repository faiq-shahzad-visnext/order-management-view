const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let orders = [
  { id: 10248, customerName: 'VINET', freight: 32.38, shipName: 'Commodities', shipCountry: 'France' },
  { id: 10249, customerName: 'TOMSP', freight: 11.61, shipName: 'Toms Spezialitäten', shipCountry: 'Germany' },
  { id: 10250, customerName: 'HANAR', freight: 6.00, shipName: 'Hanari Carnes', shipCountry: 'Brazil' },
  { id: 10251, customerName: 'VICTE', freight: 41.34, shipName: 'Victuailles en stock', shipCountry: 'France' },
  { id: 10252, customerName: 'SUPRD', freight: 51.30, shipName: 'Suprêmes délices', shipCountry: 'Belgium' },
  { id: 10253, customerName: 'HANAR', freight: 58.17, shipName: 'Hanari Carnes', shipCountry: 'Brazil' },
  { id: 10254, customerName: 'CHOPS', freight: 22.98, shipName: 'Chop-suey Chinese', shipCountry: 'Switzerland' },
  { id: 10255, customerName: 'RICSU', freight: 148.33, shipName: 'Richter Supermarkt', shipCountry: 'Switzerland' },
  { id: 10256, customerName: 'WELLI', freight: 13.97, shipName: 'Wellington Importadora', shipCountry: 'Brazil' },
  { id: 10257, customerName: 'HILAA', freight: 81.91, shipName: 'HILARION-Abastos', shipCountry: 'Venezuela' },
];

// Get all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Add a new order
app.post('/orders', (req, res) => {
  const newOrder = { ...req.body, id: Date.now() };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Edit an order
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const idx = orders.findIndex(order => order.id == id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  orders[idx] = { ...orders[idx], ...req.body };
  res.json(orders[idx]);
});

// Delete an order
app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;
  const idx = orders.findIndex(order => order.id == id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  const deleted = orders.splice(idx, 1);
  res.json(deleted[0]);
});

// Add a /countries endpoint
app.get('/countries', (req, res) => {
  const countries = Array.from(new Set(orders.map(o => o.shipCountry))).sort();
  res.json(countries);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 