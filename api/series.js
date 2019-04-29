const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const issuesRouter = require('./issues.js');


//seriesRouter.use('/', issuesRouter);

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  db.get(`SELECT * FROM Series WHERE Series.ID = $seriesId`, {$seriesId: seriesId}, (err, series) => {
    if(err){
      next(err)
    } else if (series){
      req.series = series;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

seriesRouter.use('/:seriesId/issues', issuesRouter);

seriesRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Series`, (err, series) => {
    if(err){
      next(err)
    } else {
      res.status(200).send({series: series});
    }
  });
});

seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).json({series: req.series});
});

seriesRouter.post('/', (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;

  if (!name || !description) {
    return res.sendStatus(400);
  }
  db.run(`INSERT INTO Series(name, description) VALUES ($name, $description)`,
  {$name: name, $description: description}, function(error) {
    if(error){
      next(error);
    } else { db.get(`SELECT * FROM Series WHERE Series.id = ${this.lastID}`,
      (error, series) => {
        res.status(201).json({series: series});
      });
    }
  });
});

seriesRouter.put('/:seriesId', (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;
  const seriesId = req.params.seriesId;

  if (!name || !description) {
    return res.sendStatus(400);
  }
  db.run(`UPDATE Series SET name = $name, description = $description  WHERE Series.id = $seriesId`,
    {$name: name, $description: description, $seriesId: seriesId}, (error) => {
      if(error){
        next(error);
      } else { db.get(`SELECT * FROM Series WHERE series.id = ${seriesId}`,
        (error, series) => {
          res.status(200).json({series: series});
        });
      }
    });
  });

seriesRouter.delete('/:seriesId', (req, res, next) => {
    const seriesId = req.params.seriesId;
    db.run(`SELECT * FROM Issue WHERE Issue.series_id = $seriesId`, {$seriesId: seriesId}, (error, issue) => {
      if(error){
        res.sendStatus(400);
        next(error);
      }else if(issue){
        res.sendStatus(400);
      } else {
        db.run(`DELETE FROM Series WHERE Series.id = $seriesId`, {$seriesId: seriesId}, (error) => {
          res.sendStatus(204);
        });
      }
    });
  });

module.exports=seriesRouter;
