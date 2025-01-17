# Lost in Code

## Introduction

This project is a prototype for a serious game called "Lost in Code", developed
for the purpose of teaching a programming language to beginners using said game
as the teaching method. The project itself contains multiple parts.

1. A playable game where you're an Astronaut having to repair a spaceship by
   solving Programming Tasks.
2. An Administrative application for managing users and programming tasks for
   the game.
3. An API that is used to control the data flow between Admin-App, Game and
   Database
4. A php server for executing code snippets from users created when solving
   programming Tasks

## Installation

### Dependencies

To run this project you need to have [docker](https://www.docker.com) installed
on your system

### Download & Install

1. Clone the project onto your system
2. Duplicate the [env.db.template](.env.db.template) file, rename it to
   `.env.db` and fill in your database information in the fields marked with the
   `< >` brackets (make sure to remove the brackets)
3. run the `docker compose build` command in the root directory of the project
   to build and the application (more information on the
   [docker compose build](https://docs.docker.com/engine/reference/commandline/compose_build/)
   command)

### Run the Project

1.  run the `docker compose up` command in the root directory of the project to
    run the application (more information on the
    [docker compose up](https://docs.docker.com/engine/reference/commandline/compose_up/)
    command)
2.  The application will now be accessible via `localhost` or the ip address of
    your system

## Usage

### The Game

To use the game, visit the game endpoint mentioned under
[endpoints](#application-endpoints) and login with an account (you can use the
default [admin account](#default-admin-user))

### The Admin App

To use the admin application, visit the admin endpoint mentioned under
[endpoints](#application-endpoints) and login with an account with the `ADMIN`
status. Here you can manage the users, user groups and curricula.

### Application Endpoints

The different endpoints for the systems are:

|  Endpoint |  System         |
| --------- | --------------- |
| `/`       |  the Admin-App  |
|  `/game`  |  the game       |
| `/api`    |  the api        |
|  `/php`   |  the php server |

(All endpoints have to be prefixed with either `localhost` or your systems IP
address)

## API Information

### Default Admin user

|          |               |
| -------- | ------------- |
| Username | `admin`       |
| Email    | `admin@admin` |
| Password | `test`        |

### API Endpoints

#### General Routes

| Method | Endpoint   | Requirements | Description                                               |
| ------ | ---------- | ------------ | --------------------------------------------------------- |
| `GET`  | `/api`     | None         | Returns a Hello World response to check if server is live |
| `GET`  | `/api/me`  | None         | Checks and responds if the user is logged in              |
| `POST` | `/api/php` | None         | Proxies the request to the PHP server                     |

#### Users

| Method   | Endpoint                             | Role Requirements          | Description                               |
| -------- | ------------------------------------ | -------------------------- | ----------------------------------------- |
| `POST`   | `/api/users`                         | Admin                      | Create user                               |
| `GET`    | `/api/users`                         | Admin                      | Get all users                             |
| `GET`    | `/api/users/me/curriculum_data`      | None                       | Get specific user data (for current user) |
| `GET`    | `/api/users/:id/curriculum_data`     | User (only himself), Admin | Get specific user's curriculum data       |
| `GET`    | `/api/users/:id`                     | User (only himself), Admin | Get specific user                         |
| `PUT`    | `/api/users/:id`                     | User (only himself), Admin | Update specific user                      |
| `DELETE` | `/api/users/:id`                     | Admin                      | Delete specific user                      |
| `POST`   | `/api/users/:userId/groups/:groupId` | Admin                      | Move user to specific group               |

#### Groups

| Method   | Endpoint                                    | Requirements | Description                       |
| -------- | ------------------------------------------- | ------------ | --------------------------------- |
| `POST`   | `/api/groups/`                              | Admin        | Create new group                  |
| `GET`    | `/api/groups/`                              | Admin        | Get all groups                    |
| `GET`    | `/api/groups/:id`                           | Admin        | Get a specific group              |
| `GET`    | `/api/groups/:id/full`                      | Admin        | Get a FULL specific group         |
| `PUT`    | `/api/groups/:id`                           | Admin        | Update a specific group           |
| `DELETE` | `/api/groups/:id`                           | Admin        | Delete a specific group           |
| `POST`   | `/api/groups/:curriculumId/groups/:groupId` | Admin        | Set curriculum for specific group |

#### Curriculums

| Method   | Endpoint                    | Requirements | Description                         |
| -------- | --------------------------- | ------------ | ----------------------------------- |
| `POST`   | `/api/curriculums/`         | Admin        | Create new curriculum               |
| `POST`   | `/api/curriculums/full`     | Admin        | Create new FULL curriculum          |
| `GET`    | `/api/curriculums/`         | None         | Get all curriculums                 |
| `GET`    | `/api/curriculums/:id`      | None         | Get specific curriculum via ID      |
| `GET`    | `/api/curriculums/:id/full` | None         | Get specific FULL curriculum via ID |
| `PUT`    | `/api/curriculums/:id`      | Admin        | Update specific curriculum          |
| `DELETE` | `/api/curriculums/:id`      | Admin        | Delete specific curriculum          |

#### Chapters

| Method   | Endpoint                                             | Requirements | Description                                 |
| -------- | ---------------------------------------------------- | ------------ | ------------------------------------------- |
| `POST`   | `/api/chapters/`                                     | Admin        | Create new chapter                          |
| `POST`   | `/api/chapters/full`                                 | Admin        | Create new FULL chapter with questions      |
| `GET`    | `/api/chapters/`                                     | None         | Get all chapters                            |
| `GET`    | `/api/chapters/me`                                   | None         | Get all chapters from user's curriculum     |
| `GET`    | `/api/chapters/:id`                                  | None         | Get specific chapter                        |
| `GET`    | `/api/chapters/:id/full`                             | None         | Get specific FULL chapter and all questions |
| `PUT`    | `/api/chapters/:id`                                  | Admin        | Update specific chapter                     |
| `DELETE` | `/api/chapters/:id`                                  | Admin        | Delete specific chapter                     |
| `POST`   | `/api/chapters/:chapterId/curriculums/:curriculumId` | Admin        | Change associated curriculum for chapter    |

#### Questions

| Method   | Endpoint                                         | Requirements | Description                                   |
| -------- | ------------------------------------------------ | ------------ | --------------------------------------------- |
| `POST`   | `/api/questions/`                                | Admin        | Create new question                           |
| `POST`   | `/api/questions/full`                            | Admin        | Create new FULL question                      |
| `GET`    | `/api/questions/`                                | None         | Get all questions                             |
| `GET`    | `/api/questions/:id`                             | None         | Get a specific question                       |
| `GET`    | `/api/questions/:id/full`                        | None         | Get a FULL specific question                  |
| `PUT`    | `/api/questions/:id`                             | Admin        | Update a question                             |
| `DELETE` | `/api/questions/:id`                             | Admin        | Delete a specific question                    |
| `POST`   | `/api/questions/:questionId/chapters/:chapterId` | Admin        | Change the chapter associated with a question |

#### Gamestates

| Method   | Endpoint                  | Requirements | Description                                    |
| -------- | ------------------------- | ------------ | ---------------------------------------------- |
| `POST`   | `/api/gamestates/`        | None         | Create a new game state                        |
| `GET`    | `/api/gamestates/me`      | None         | Get game state for the current user            |
| `GET`    | `/api/gamestates/:userId` | None         | Get game state for a specific user by their ID |
| `PUT`    | `/api/gamestates/me`      | None         | Update game state for the current user         |
| `PUT`    | `/api/gamestates/:userId` | None         | Update game state for a specific user by ID    |
| `DELETE` | `/api/gamestates/:userId` | None         | Delete game state for a specific user by ID    |

#### Question Elements

| Method   | Endpoint                                                         | Requirements | Description                                        |
| -------- | ---------------------------------------------------------------- | ------------ | -------------------------------------------------- |
| `POST`   | `/api/question_elements/`                                        | Admin        | Create a new question element                      |
| `GET`    | `/api/question_elements/`                                        | None         | Retrieve all question elements                     |
| `GET`    | `/api/question_elements/:id`                                     | None         | Retrieve a specific question element by its ID     |
| `PUT`    | `/api/question_elements/:id`                                     | Admin        | Update a specific question element by its ID       |
| `DELETE` | `/api/question_elements/:id`                                     | Admin        | Delete a specific question element by its ID       |
| `POST`   | `/api/question_elements/:questionElementId/question/:questionId` | Admin        | Change question ID for a specific question element |

#### Correct Answers

| Method   | Endpoint                                                                    | Requirements | Description                                                    |
| -------- | --------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| `POST`   | `/api/correct_answers/`                                                     | Admin        | Create a new correct answer                                    |
| `GET`    | `/api/correct_answers/`                                                     | None         | Retrieve all correct answers                                   |
| `GET`    | `/api/correct_answers/:id`                                                  | None         | Retrieve a specific correct answer by its ID                   |
| `PUT`    | `/api/correct_answers/:id`                                                  | Admin        | Update a specific correct answer by its ID                     |
| `DELETE` | `/api/correct_answers/:id`                                                  | Admin        | Delete a specific correct answer by its ID                     |
| `POST`   | `/api/correct_answers/:correctAnswerId/question_element/:questionElementId` | Admin        | Change the `question_element_id` for a specific correct answer |

#### Login

| Method | Endpoint     | Request Body          | Description                                                                                                                      |
| ------ | ------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/login` | `{ email, password }` | Authenticates the user and logs them in. If successful, returns user data and sets an authentication token in a HttpOnly cookie. |

#### Logout

| Method | Endpoint       | Requirements | Description     |
| ------ | -------------- | ------------ | --------------- |
| `POST` | `/api/logout/` | None         | Logout the user |

### JSON-Data Structures

For using the database or uploading a new curriculum to the admin application,
the following JSON-structures are used.

#### Curriculum

##### Empty Curriculum

```JSON
{
    "name": "Name of the curriculum (Bsp. PHP)",
    "description": "Description of the curriculum",
    "prog_lang": "php",
    "chapters": [...]      //The Chapters inside this curriculum
}

```

##### Full Curriculum Example

```JSON
{
    "name": "PHP für einsteiger",
    "description": "Ein curriculum zum vermitteln von PHP basics",
    "prog_lang": "php",
    "chapters": [
        {
            "name": "Einführung",
            "material": "Was ist php? PHP ist eine scripting sprache welche ....",
            "order_position": 1,
            "questions": [
                {
                    "question_text": "Was ist php?",
                    "type": "CHOICE",
                    "difficulty": 1,
                    "elements": [
                        {
                            "content": "Ein Computer",
                            "is_correct": false
                        },
                        {
                            "content": "Eine Scripting sprache",
                            "is_correct": true
                        },
                        {
                            "content": "Etwas zum essen",
                            "is_correct": false
                        }
                    ]
                },
                {
                    "question_text": "Was ist der output dieses code abschnitts?",
                    "code_text": "<?php echo 'Hello There'; ?>",
                    "hint": "schau hinter dem echo",
                    "type": "SINGLE_INPUT",
                    "difficulty": 1,
                    "elements": [
                        {
                            "element_identifier": "i1",
                            "correct_answers": ["Hello There", "hello there"]
                        }
                    ]
                },
                {
                    "question_text": "Vervollständige den Code sodass 5 als ausgabe rauskommt",
                    "code_text": "<?php \n$x = 3; \n$y = 2; \necho '###INPUT|i1|20|true###'; \n?>", 
                    "type": "CLOZE",
                    "difficulty": 3,
                    "elements": [
                        {
                            "element_identifier": "i1",
                            "correct_answers": ["$x+$y"]
                        }
                    ]
                },
                {
                    "question_text": "Bringe die code abschnitte in die richtige reihenfolge",
                    "type": "DRAG_DROP",
                    "difficulty": 3,
                    "elements": [
                        {
                            "content": "<?php \n$x = 3;",
                            "correct_order_position": 1
                        },
                        {
                            "content": "$y = 2; \necho '$x';",
                            "correct_order_position": 2
                        },
                        {
                            "content": "?>",
                            "correct_order_position": 3
                        }
                    ]
                },
                {
                    "question_text": "Welche dieser code blöcke ist eine function?",
                    "type": "SELECT_ONE",
                    "difficulty": 2,
                    "elements": [
                        {
                            "content": "<?php \n$x = 3; \n$y = 2; \necho '$x+$y'; \n?>",
                            "is_correct": false
                        },
                        {
                            "content": "<?php \nfunction functionName() { \n$y = 2; \necho '$y+5'; \n} \n?>",
                            "is_correct": true
                        }
                    ]
                },
                {
                    "question_text": "Complete this function so that it adds 2 numbers together!",
                    "code_text": "function calculateSum($num1, $num2){\n ###INPUT|i1|50|true### \n}",
                    "hint": null,
                    "type": "CREATE",
                    "difficulty": 5,
                    "elements": [
                        {
                            "content": "echo calculateSum(5,10);",
                            "element_identifier": "i1",
                            "correct_order_position": null,
                            "correct_answers": ["calculateSum(5,10) == 15", "calculateSum(20,20) == 40"],
                            "is_correct": null
                        }
                    ]
                }
            ]
        }
    ]
}
```

#### Chapter

```JSON
{
    "name": "Chapter Name (Syntax)",
    "material": "The Learning-material like explanations etc. goes here",
    "order_position": 1,    //Position of the chapter inside the curriculum
    "questions": [...]         //The contained questions inside this Chapter
}
```

#### Question

##### Empty Question

```JSON
{
    "question_text": "The Question the user sees at the top of the screen",
    "code_text": "<?php echo 'Hello There'; ?>",        //Here code can be entered which will be displayed to the user in some question types
    "hint": "A hint that could theoretically be displayed for the user",    //currently not used
    "type": "CHOICE / SINGLE_INPUT / CLOZE / DRAG_DROP / SELECT_ONE / CREATE",  //One of the these types have to be used
    "difficulty": 1,    //Subjective difficulty level defined by question creator
    "elements": []      //Question elements needed for the different question types
}
```

##### Question Type Examples

###### Multiple / single choice question

```JSON
{
    "question_text": "Was ist php?",
    "type": "CHOICE",
    "difficulty": 1,
    "elements": [
        {
            "content": "Ein Computer",
            "is_correct": false
        },
        {
            "content": "Eine Scripting sprache",
            "is_correct": true
        },
        {
            "content": "Etwas zum essen",
            "is_correct": false
        }
    ]
}
```

###### Input field question

Here an input field is displayed underneath a code block

```JSON
{
    "question_text": "Was ist der output dieses code abschnitts?",
    "code_text": "<?php echo 'Hello There'; ?>",
    "hint": "schau hinter dem echo",
    "type": "SINGLE_INPUT",
    "difficulty": 1,
    "elements": [
        {
            "element_identifier": "i1",
            "correct_answers": ["Hello There", "hello there"]
        }
    ]
}
```

###### Fill in the blanks / CLOZE question

Here input fields are displayed inside the code block to fill in the blanks.

```JSON
{
    "question_text": "Vervollständige den Code sodass 5 als ausgabe rauskommt",
    "code_text": "<?php \n$x = 3; \n$y = 2; \necho '###INPUT|i1|20|true###'; \n?>",
    "type": "CLOZE",
    "difficulty": 3,
    "elements": [
        {
            "element_identifier": "i1",
            "correct_answers": ["$x+$y"]
        }
    ]
}
```

The following piece of code

```
###INPUT|i1|20|true###
```

describes an input field with the corresponding element id `i1` and a maximum of `20` characters as input

###### Drag and drop question

This question displays code blocks that have to be reordered into the correct order

```JSON
{
    "question_text": "Bringe die code abschnitte in die richtige reihenfolge",
    "type": "DRAG_DROP",
    "difficulty": 3,
    "elements": [
        {
            "content": "<?php \n$x = 3;",
            "correct_order_position": 1
        },
        {
            "content": "$y = 2; \necho '$x';",
            "correct_order_position": 2
        },
        {
            "content": "?>",
            "correct_order_position": 3
        }
    ]
}
```

###### Select one code block question

In this question the correct code block / code blocks have to be selected to answer the question.

```JSON
{
    "question_text": "Welche dieser code blöcke ist eine function?",
    "type": "SELECT_ONE",
    "difficulty": 2,
    "elements": [
        {
            "content": "<?php \n$x = 3; \n$y = 2; \necho '$x+$y'; \n?>",
            "is_correct": false
        },
        {
            "content": "<?php \nfunction functionName() { \n$y = 2; \necho '$y+5'; \n} \n?>",
            "is_correct": true
        }
    ]
}
```

###### Create question

Here a user has to write code that will be evaluated on a server to answer the question

```JSON
{
    "question_text": "Complete this function so that it adds 2 numbers together!",
    "code_text": "function calculateSum($num1, $num2){\n ###INPUT|i1|50|true### \n}",   //The code the user will see and the defined input field for the user
    "hint": null,
    "type": "CREATE",
    "difficulty": 5,
    "elements": [
        {
            "content": "echo calculateSum(5,10);",  //The code that will be executed when the user wants to evaluate his current code without committing his answer
            "element_identifier": "i1",
            "correct_order_position": null,
            "correct_answers": ["calculateSum(5,10) == 15", "calculateSum(20,20) == 40"],   //The tests that have to be passed by the written code to complete the question
            "is_correct": null
        }
    ]
}
```



#### Question Element

The question elements that are used inside the question, such as:

- multiple / single choice buttons
- Drag and Drop Code blocks
- Selectable code blocks
- input fields

See [question type examples](#question-type-examples) for examples of how to use this element

```JSON
{
    "content": "The text that will be displayed on a multiple choice button / the code that will be shown inside a drag and drop code element",
    "element_identifier": "can be anything but must be unique to other identifiers in the same question (is used to distinguish html input elements e.g. input1 or i1 etc )",
    "correct_order_position": 1,    //For drag and drop questions this is the correct position of the code blocks
    "correct_answers": ["answer", "options", "for a text field"],   //For text inputs
    "is_correct": true  //For single or multiple choice questions, this marks which element is correct
}
```
