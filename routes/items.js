const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", (req, res, next) => {
  res.json({ items });
});

router.post("/", (req, res, next) => {
  if (!req.body.name || !req.body.price)
    throw new ExpressError("Invalid request please add item's name and price");
  const newItem = { name: req.body.name, price: req.body.price };
  items.push(newItem);
  res.status(201).json({ added: newItem });
});

router.get("/:name", (req, res, next) => {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (!foundItem) throw new ExpressError("Item not found", 404);
  res.json({ foundItem });
});

router.patch("/:name", (req, res, next) => {
  const foundItem = items.find((item) => (item.name = req.params.name));
  if (!foundItem) throw new ExpressError("Item not found", 404);
  foundItem.name = req.body.name;
  foundItem.price = req.body.price;
  res.json({ updated: foundItem });
});

router.delete("/:name", (req, res, next) => {
  const foundItemIdx = items.findIndex(
    (itemIdx) => itemIdx.name === req.params.name
  );
  if (foundItemIdx === -1) throw new ExpressError("Item not found", 404);
  items.splice(foundItemIdx, 1);
  res.json({ message: "Deleted" });
});

module.exports = router;
