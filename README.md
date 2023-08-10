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

### Useful information

#### Application Endpoints

The different endpoints for the systems are:

|  Endpoint |  System         |
| --------- | --------------- |
| `/`       |  the Admin-App  |
|  `/game`  |  the game       |
| `/api`    |  the api        |
|  `/php`   |  the php server |

(All endpoints have to be prefixed with either `localhost` or your systems IP
address)

#### Default Admin user

|          |               |
| -------- | ------------- |
| Username | `admin`       |
| Email    | `admin@admin` |
| Password | `test`        |

#### API Endpoints

**Users**

| Method   | Endpoint                             | Role Requirements          | Description                               |
| -------- | ------------------------------------ | -------------------------- | ----------------------------------------- |
| `POST`   | `/api/users`                         | Admin                      | Create user                               |
| `GET`    | `/api/users`                         | Admin                      | Get all users                             |
| `GET`    | `/api/users/me/curriculum_data`      | -                          | Get specific user data (for current user) |
| `GET`    | `/api/users/:id/curriculum_data`     | User (only himself), Admin | Get specific user's curriculum data       |
| `GET`    | `/api/users/:id`                     | User (only himself), Admin | Get specific user                         |
| `PUT`    | `/api/users/:id`                     | User (only himself), Admin | Update specific user                      |
| `DELETE` | `/api/users/:id`                     | Admin                      | Delete specific user                      |
| `POST`   | `/api/users/:userId/groups/:groupId` | Admin                      | Move user to specific group               |

**Groups**

| Method   | Endpoint                                    | Requirements | Description                       |
| -------- | ------------------------------------------- | ------------ | --------------------------------- |
| `POST`   | `/api/groups/`                              | Admin        | Create new group                  |
| `GET`    | `/api/groups/`                              | Admin        | Get all groups                    |
| `GET`    | `/api/groups/:id`                           | Admin        | Get a specific group              |
| `GET`    | `/api/groups/:id/full`                      | Admin        | Get a FULL specific group         |
| `PUT`    | `/api/groups/:id`                           | Admin        | Update a specific group           |
| `DELETE` | `/api/groups/:id`                           | Admin        | Delete a specific group           |
| `POST`   | `/api/groups/:curriculumId/groups/:groupId` | Admin        | Set curriculum for specific group |

**Curriculums**

| Method   | Endpoint                    | Requirements | Description                         |
| -------- | --------------------------- | ------------ | ----------------------------------- |
| `POST`   | `/api/curriculums/`         | Admin        | Create new curriculum               |
| `POST`   | `/api/curriculums/full`     | Admin        | Create new FULL curriculum          |
| `GET`    | `/api/curriculums/`         | -            | Get all curriculums                 |
| `GET`    | `/api/curriculums/:id`      | -            | Get specific curriculum via ID      |
| `GET`    | `/api/curriculums/:id/full` | -            | Get specific FULL curriculum via ID |
| `PUT`    | `/api/curriculums/:id`      | Admin        | Update specific curriculum          |
| `DELETE` | `/api/curriculums/:id`      | Admin        | Delete specific curriculum          |

**Chapters**

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

**Questions**

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
