import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  // Globals
  // only accepts images from https-source
  var expressionjpg = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i
  var regex = new RegExp(expressionjpg);

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // Filter the image and send it back.
  app.get("/filteredimage", async (req, res) => {
    // Test the incoming data to fit a proper website
    if (req.query.image_url.match(regex)) {
      var file = await filterImageFromURL(req.query.image_url)
      fs.readFile(file, function(err, data) {
        if (err) 
          {
            res.json({"message": "Invalid Image"})
            res.status(422)
          };
        res.set("Content-Type", "image/jpeg")
        res.status(200).end(data, 'binary')
        deleteLocalFiles([file])  // I don't change the given function, it requires an array
    });
    }
    else {
      res.json({"message": "Invalid Parameter"})
      res.status(422)
      
    }
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();