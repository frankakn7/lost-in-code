import { Socket } from "dgram";
import express, { Request, Response } from "express";
import { IncomingMessage, ServerResponse } from "http";
import httpProxy from "http-proxy";

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

// User Management Routes

app.post('/api/users', (req: Request, res: Response) => {
  res.send('Create a new user');
});

app.get('/api/users', (req: Request, res: Response) => {
  res.send('Get a list of all users');
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  res.send(`Get details of user with ID: ${userId}`);
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  res.send(`Update user with ID: ${userId}`);
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  res.send(`Delete user with ID: ${userId}`);
});

// Group Management Routes

app.post('/api/groups', (req: Request, res: Response) => {
  res.send('Create a new group');
});

app.get('/api/groups', (req: Request, res: Response) => {
  res.send('Get a list of all groups');
});

app.get('/api/groups/:id', (req: Request, res: Response) => {
  const groupId = req.params.id;
  res.send(`Get details of group with ID: ${groupId}`);
});

app.put('/api/groups/:id', (req: Request, res: Response) => {
  const groupId = req.params.id;
  res.send(`Update group with ID: ${groupId}`);
});

app.delete('/api/groups/:id', (req: Request, res: Response) => {
  const groupId = req.params.id;
  res.send(`Delete group with ID: ${groupId}`);
});

app.post('/api/groups/:groupId/users/:userId', (req: Request, res: Response) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;
  res.send(`Assign user with ID ${userId} to group with ID ${groupId}`);
});

app.delete('/api/groups/:groupId/users/:userId', (req: Request, res: Response) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;
  res.send(`Remove user with ID ${userId} from group with ID ${groupId}`);
});

// Curriculum Management Routes

app.post('/api/curriculums', (req: Request, res: Response) => {
  res.send('Create a new curriculum');
});

app.get('/api/curriculums', (req: Request, res: Response) => {
  res.send('Get a list of all curriculums');
});

app.get('/api/curriculums/:id', (req: Request, res: Response) => {
  const curriculumId = req.params.id;
  res.send(`Get details of curriculum with ID: ${curriculumId}`);
});

app.put('/api/curriculums/:id', (req: Request, res: Response) => {
  const curriculumId = req.params.id;
  res.send(`Update curriculum with ID: ${curriculumId}`);
});

app.delete('/api/curriculums/:id', (req: Request, res: Response) => {
  const curriculumId = req.params.id;
  res.send(`Delete curriculum with ID: ${curriculumId}`);
});

app.post('/api/curriculums/:curriculumId/groups/:groupId', (req: Request, res: Response) => {
  const curriculumId = req.params.curriculumId;
  const groupId = req.params.groupId;
  res.send(`Associate curriculum with ID ${curriculumId} to group with ID ${groupId}`);
});

app.delete('/api/curriculums/:curriculumId/groups/:groupId', (req: Request, res: Response) => {
  const curriculumId = req.params.curriculumId;
  const groupId = req.params.groupId;
  res.send(`Remove curriculum with ID ${curriculumId} from group with ID ${groupId}`);
});

// Chapter Management Routes

app.post('/api/chapters', (req: Request, res: Response) => {
  res.send('Create a new chapter');
});

app.get('/api/chapters', (req: Request, res: Response) => {
  res.send('Get a list of all chapters');
});

app.get('/api/chapters/:id', (req: Request, res: Response) => {
  const chapterId = req.params.id;
  res.send(`Get details of chapter with ID: ${chapterId}`);
});

app.put('/api/chapters/:id', (req: Request, res: Response) => {
  const chapterId = req.params.id;
  res.send(`Update chapter with ID: ${chapterId}`);
});

app.delete('/api/chapters/:id', (req: Request, res: Response) => {
  const chapterId = req.params.id;
  res.send(`Delete chapter with ID: ${chapterId}`);
});

app.post('/api/chapters/:chapterId/curriculums/:curriculumId', (req: Request, res: Response) => {
  const chapterId = req.params.chapterId;
  const curriculumId = req.params.curriculumId;
  res.send(`Associate chapter with ID ${chapterId} to curriculum with ID ${curriculumId}`);
});

app.delete('/api/chapters/:chapterId/curriculums/:curriculumId', (req: Request, res: Response) => {
  const chapterId = req.params.chapterId;
  const curriculumId = req.params.curriculumId;
  res.send(`Remove chapter with ID ${chapterId} from curriculum with ID ${curriculumId}`);
});

// Question Management Routes

app.post('/api/questions', (req: Request, res: Response) => {
  res.send('Create a new question');
});

app.get('/api/questions', (req: Request, res: Response) => {
  res.send('Get a list of all questions');
});

app.get('/api/questions/:id', (req: Request, res: Response) => {
  const questionId = req.params.id;
  res.send(`Get details of question with ID: ${questionId}`);
});

app.put('/api/questions/:id', (req: Request, res: Response) => {
  const questionId = req.params.id;
  res.send(`Update question with ID: ${questionId}`);
});

app.delete('/api/questions/:id', (req: Request, res: Response) => {
  const questionId = req.params.id;
  res.send(`Delete question with ID: ${questionId}`);
});

app.post('/api/questions/:questionId/chapters/:chapterId', (req: Request, res: Response) => {
  const questionId = req.params.questionId;
  const chapterId = req.params.chapterId;
  res.send(`Associate question with ID ${questionId} to chapter with ID ${chapterId}`);
});

app.delete('/api/questions/:questionId/chapters/:chapterId', (req: Request, res: Response) => {
  const questionId = req.params.questionId;
  const chapterId = req.params.chapterId;
  res.send(`Remove question with ID ${questionId} from chapter with ID ${chapterId}`);
});

// Game State Management Routes

app.post('/api/gamestate', (req: Request, res: Response) => {
  res.send('Create a new game state for a user');
});

app.get('/api/gamestate/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  res.send(`Get game state of user with ID: ${userId}`);
});

app.put('/api/gamestate/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  res.send(`Update game state of user with ID: ${userId}`);
});

app.delete('/api/gamestate/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  res.send(`Delete game state of user with ID: ${userId}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
