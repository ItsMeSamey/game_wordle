# usages
run `go run main.go` to run the server

or compile with `go build -o dist/main -ldflags='-s -w' main.go`
<br>
and run in docker with `docker-compose up --build`

# Where is what?

### [env variables info](./ENV.md)

### `./common`
`.env` loader and some common functions

### `./router`
all the routing is done here
