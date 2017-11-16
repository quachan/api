# quachan-back

## Install

```bash
npm install
```

## Run

### Dev

```bash
npm run start:dev
```

### Production

```bash
npm run build
NODE_ENV=production npm run start
```

## Environmental Variables

* `IBB_DB_CONN_STR` - Database Connection String (default is `mongodb://localhost/imageboard-back`)

* `IBB_PORT` - Server Port (default is 3000)

* `IBB_THREADS` - Number of threads to make for the server

## Routes

### Board

* GET `/api/board/:id` - get board by id

* POST `/api/board/` - create a board

* GET `/api/board/list` - get list of boards

* GET `/api/board/find` - find board by name

### Thread

* GET `/api/thread/:id` - get thread by ID

* POST `/api/thread/` - create a thread

* GET `/api/thread/find` - find threads

### Post

* GET `/api/post/:id` - get post by id

* POST `/api/post/` - create a post

* GET `/api/post/find` - find posts

### Image

* GET `/api/image/:id/view` - get the full size image

* GET `/api/image/:id/preview` - get preview of the image
