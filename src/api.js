const express = require("express");
const jwt = require("jsonwebtoken");
const jsonpatch = require("jsonpatch");
const fs = require("fs");
const paths = require("path");
const request = require("request");
const sharp = require("sharp");
const auth = require("./auth");

const router = new express.Router();

//login route 
router.post("/login", (req, res) => {
  try {
    const datas = Object.keys(req.body);
    const allowedDatas = ["username", "password"];
    const isValidDatas = datas.every((data) => allowedDatas.includes(data));

    if (!isValidDatas) {
      return res
        .status(400)
        .send({
          error: "Invalid Login Credentials. Please use username and password!",
        });
    }

    if (req.body.username == "" || req.body.password == "") {
      return res
        .status(400)
        .send({ error: "Username and password cannot be empty!" });
    }

    const token = jwt.sign(
      { password: req.body.password.toString() },
      process.env.JWT_SECRET_KEY
    );

    res.status(201).send({ success: "Login successful", token });
  } catch (e) {
    res.status(500).send();
  }
});

//edit jsonPatch
router.patch("/edit", auth, (req, res) => {
  const data = req.body;
  try {
    if (data.baz == "" || data.foo == "") {
      return res.status(400).send({ error: "Inputs cannot be empty!" });
    }
    const thepatch = [{ op: "replace", path: "/baz", value: "boo" }];

    const patcheddoc = jsonpatch.apply_patch(data, thepatch);

    res.send(patcheddoc);
  } catch (e) {
    res.status(500).send();
  }
});

//create thumbnail route
router.post("/create", auth, (req, res) => {
  const url = req.body;

  try {
    if (url.url == "") {
      return res.status(400).send({ error: "Url cannot be empty!" });
    }

    //download image from url
    const download = (url, path, callback) => {
      request.head(url, (err, res, body) => {
        request(url).pipe(fs.createWriteStream(path)).on("close", callback);
      });
    };

    const path = "./downloads/image.png";
    const filename = "newfile.png";
    const imgUrl = process.env.SERVER_URL + "/resized/image/" + filename;

    //resize image after download
    download(url, path, () => {
      const inputFile = paths.join(__dirname, "../downloads/image.png");
      const outFile = "thumbnail/newfile.png";
      imageResize(inputFile, outFile);

      res.send({thumbnail:imgUrl, msg:"✅ Done!"});  
    });

    //resize image
    const imageResize = (inputFile, outputFile) => {
      const reader = fs.createReadStream(inputFile);
      const outStream = fs.createWriteStream(outputFile, { flags: "w" });

      const transform = sharp().resize({ width: 50, height: 50 });

      reader.pipe(transform).pipe(outStream);
    };
  } catch (e) {
    res.status(500).send();
  }
});

//get resized image
router.get('/resized/image/:id', (req, res) => { 
  const id = req.params.id
  const filePath = `thumbnail/${id}`
  const file = paths.resolve(__dirname, "../", filePath)

    if(fs.existsSync(file)){
        const reader = fs.createReadStream(file) 
        return reader.pipe(res)
    }
    res.send({error:"The file you are looking for does not exists!"})
})

module.exports = router; 