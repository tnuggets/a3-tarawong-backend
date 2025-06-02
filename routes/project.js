const express = require("express")
const router = express.Router()
const Utils = require("./../utils")
const Project = require("./../models/Project")
const path = require("path")

// GET- get all projects ---------------------------
router.get("/", Utils.authenticateToken, (req, res) => {
  Project.find()
    // bring in the user ID, first name, and last name
    .populate("user", "_id firstName lastName")
    .then((projects) => {
      if (projects == null) {
        return res.status(404).json({
          message: "No projects found",
        })
      }
      res.json(projects)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting projects",
      })
    })
})

// POST - create new project --------------------------------------
router.post("/", (req, res) => {
  // validate
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "project content can't be empty" })
  }
  // validate - check if image file exist
  if (!req.files || !req.files.image) {
    return res.status(400).send({ message: "Image can't be empty" })
  }

  console.log("req.body = ", req.body)

  // image file must exist, upload, then create new project
  let uploadPath = path.join(__dirname, "..", "public", "images")
  Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {
    // create new project
    let newProject = new Project({
      name: req.body.name,
      overview: req.body.overview,
      price: req.body.price,
      user: req.body.user,
      image: uniqueFilename,
      gender: req.body.gender,
      length: req.body.length,
    })

    newProject
      .save()
      .then((project) => {
        // success!
        // return 201 status with project object
        return res.status(201).json(project)
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).send({
          message: "Problem creating project",
          error: err,
        })
      })
  })
})

// export
module.exports = router
