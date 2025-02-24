package game

import (
  "strconv"

  "github.com/gofiber/fiber/v3"
)

type wType interface {
  Bytes() []byte
  String() string
  FromBytes([]byte) wType
}

func contains(word []byte, what byte) (at byte) {
  for i, char := range word {
    if char == what { return byte(i) }
  }
  return 0xff
}

func calcDiff(og, guess []byte) (diff []byte) {
  diff = make([]byte, len(og))

  for i, char := range guess {
    if (og[i] == char) {
      diff[i] = 'g' // green
      og[i] = 0
    }
  }
  for i, char := range guess {
    if diff[i] != 0 || og[i] == 0 { continue }
    idx := contains(og, char)
    if idx == 0xff {
      diff[i] = 'r' // red
    } else {
      diff[i] = 'y' // yellow
      og[idx] = 0
    }
  }

  return
}

func addRoutes[T interface{
  comparable
  wType
}](app fiber.Router, w []T) {
  var lt T
  l := len(lt.Bytes())
  lStr := strconv.Itoa(l)

  wStr := make([]byte, len(w) * l)
  for i, v := range w {
    for j, char := range v.Bytes() {
      wStr[i*l+j] = char
    }
  }
  wMap := make(map[T]struct{})
  for _, v := range w { wMap[v] = struct{}{} }

  app.Get("/" + lStr, func(c fiber.Ctx) error {
    return c.Send(wStr)
  })
}

func AddRoutes(app fiber.Router) {
  addRoutes(app, w3 )
  addRoutes(app, w4 )
  addRoutes(app, w5 )
  addRoutes(app, w6 )
  addRoutes(app, w7 )
  addRoutes(app, w8 )
  addRoutes(app, w9 )
  addRoutes(app, w10)
  addRoutes(app, w11)
  addRoutes(app, w12)
  addRoutes(app, w13)
  addRoutes(app, w14)
  addRoutes(app, w15)
  addRoutes(app, w16)
  addRoutes(app, w17)
  addRoutes(app, w18)
  addRoutes(app, w19)
  addRoutes(app, w20)
}

