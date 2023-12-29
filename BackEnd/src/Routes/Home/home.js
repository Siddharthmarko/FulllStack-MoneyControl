const express = require("express");
const LogType = require('../Model/Expens_Log_Type');
const Log = require('../Model/Expens_Log');
const Tag = require('../Model/Expens_Tag');
const router = express.Router();

router.post("/expense-data-filter", async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    const result = await Log.find({
      date: { $gte: startDate, $lt: endDate }, // Range query for date
      trash: 0 // Filter by trash value
    })
      .sort({ date: -1 }) // Sort by date descending
      .exec();

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});

router.get("/expense-data-trash", async (req, res, next) => {
  try {
    const result = await Log.find({ trash: 1 })
      .sort({ _id: -1 }) // Sort by _id descending (equivalent to id in MySQL)
      .exec();

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});


router.get("/expense-data-type", async (req, res, next) => {
  try {
    const result = await LogType.find().exec();
    const output = result.map((item) => ({
      value: item._id,
      label: item.description
    }));
    res.status(200).json(output)
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});

router.delete("/expense-data-type/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await LogType.deleteOne({ _id: id }); // Delete using _id field
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});


router.post("/expense-data", async (req, res, next) => {
  try {
    const data = req.body;
    const newLog = new Log(data); // Create a new Log document
    await newLog.save(); // Insert into database
    
    // res.json({ message: "ok" });
    res.json(newLog);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});

router.post("/update-expense-data", async (req, res, next) => {
  try {
    const { date, method, payto, category, amount, description, tag, id, type } = req.body;
    const updateData = {}; // Create an empty object for updates

    // Conditional assignment for fields to be updated
    if (method) updateData.method = method;
    if (payto) updateData.payto = payto;
    if (category) updateData.category = category;
    if (amount) updateData.amount = amount;
    if (description) updateData.description = description;
    if (tag) updateData.tag = tag;
    if (date) updateData.date = date;
    if (type) updateData.type = type;

    await Log.findByIdAndUpdate(id, updateData, { new: true }); // Find and update
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});

router.post("/expense-tag", async (req, res, next) => {
  try {
    const data = req.body;
    const newTag = new Tag(data); 
    await newTag.save(); 
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});

router.post("/expense-data-type", (req, res) => {
  console.log("got /expense-data-type")
    const data = req.body;
    const newLogType = new LogType(data); // Create a new LogType document
    newLogType.save(function (err, note) {
      if (err) {
        res.status(400).json(err);
      }
      res.status(200).json(note);
    }); // Insert into database
});

router.get("/update-data/:id", async (req, res, next) => {
  try {
    const desID = req.params.id;
    const expenseLog = await Log.findById(desID); // Find by _id

    if (!expenseLog) {
      return res.status(404).json({ message: "Expense log not found" });
    }

    res.status(200).json(expenseLog);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});

router.delete("/expense-data/delete/:id", async (req, res, next) => {
  try {
    const desID = req.params.id;
    await Log.findByIdAndUpdate(desID, { trash: 1 }); // Soft delete
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});


router.delete("/expense-data/recycle/:id", async (req, res, next) => {
  try {
    const desID = req.params.id;
    await Log.findByIdAndUpdate(desID, { trash: 0 }); // Restore
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});

router.delete("/expense-data/hard-delete/:id", async (req, res, next) => {
  try {
    const desID = req.params.id;
    await Log.findByIdAndDelete(desID); // Permanently delete
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    next(error);
  }
});


module.exports = router;