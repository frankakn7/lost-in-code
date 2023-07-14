import { Socket } from "dgram";
import express, { Request, Response } from "express";
import { IncomingMessage, ServerResponse } from "http";
import httpProxy from "http-proxy";

import userRouter from "./routes/user"
import groupRouter from "./routes/group"
import curriculumRouter from "./routes/curriculum"
import chapterRouter from "./routes/chapter"
import questionRouter from "./routes/question"
import gamestateRouter from "./routes/gamestate"
import questionElementRouter from "./routes/questions_element"
import correctAnswerRouter from "./routes/correct_answer"

const app = express();
const port = process.env.PORT || 8080;

const proxy = httpProxy.createProxyServer();

app.get("/api", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.post("/api/php", (req: Request, res: Response) => {
    proxy.web(req, res, {
        target: 'http://php_executor:6000', // Replace with the appropriate URL of your other server
    });
});

// Handle errors that occur during the proxy request
proxy.on("error", (err:Error, req:IncomingMessage, res) => {
  console.error(err);
  (res as ServerResponse<IncomingMessage>).writeHead(500);
  res.end("There was an error with the PHP code");
});

// proxy.on('proxyRes', function (proxyRes, req:IncomingMessage, res:ServerResponse) {
//   var body = '';
//   proxyRes.on('data', function (data: Buffer) {
//       body += data;
//   });
//   proxyRes.on('end', function () {
//       let responseBody = JSON.parse(body);

//       // If there's an error in the response, handle it
//       if (responseBody.error) {
//           console.error(responseBody.error);
//           console.log(responseBody)
//           res.statusCode = 500;
//           // res.end(JSON.stringify({error: 'There was an error with the PHP code'}));
//           res.end(body);
//           return;
//       }

//       // If no error, just forward the response
//       res.end(JSON.stringify(responseBody));
//   });
// });

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/groups', groupRouter)
app.use('/api/curriculums', curriculumRouter)
app.use('/api/chapters', chapterRouter)
app.use('/api/questions', questionRouter)
app.use('/api/gamestate', gamestateRouter)
app.use('/api/question_elements', questionElementRouter)
app.use('/api/correct_answers', correctAnswerRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
