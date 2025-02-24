package game

import (
  "bytes"

  _ "embed"
)

//go:embed words.txt
var wordsFile []byte

type w3Type  [3]byte
type w4Type  [4]byte
type w5Type  [5]byte
type w6Type  [6]byte
type w7Type  [7]byte
type w8Type  [8]byte
type w9Type  [9]byte
type w10Type [10]byte
type w11Type [11]byte
type w12Type [12]byte
type w13Type [13]byte
type w14Type [14]byte
type w15Type [15]byte
type w16Type [16]byte
type w17Type [17]byte
type w18Type [18]byte
type w19Type [19]byte
type w20Type [20]byte

func (w w3Type)  Bytes() []byte { return w[:] }
func (w w4Type)  Bytes() []byte { return w[:] }
func (w w5Type)  Bytes() []byte { return w[:] }
func (w w6Type)  Bytes() []byte { return w[:] }
func (w w7Type)  Bytes() []byte { return w[:] }
func (w w8Type)  Bytes() []byte { return w[:] }
func (w w9Type)  Bytes() []byte { return w[:] }
func (w w10Type) Bytes() []byte { return w[:] }
func (w w11Type) Bytes() []byte { return w[:] }
func (w w12Type) Bytes() []byte { return w[:] }
func (w w13Type) Bytes() []byte { return w[:] }
func (w w14Type) Bytes() []byte { return w[:] }
func (w w15Type) Bytes() []byte { return w[:] }
func (w w16Type) Bytes() []byte { return w[:] }
func (w w17Type) Bytes() []byte { return w[:] }
func (w w18Type) Bytes() []byte { return w[:] }
func (w w19Type) Bytes() []byte { return w[:] }
func (w w20Type) Bytes() []byte { return w[:] }

func (w w3Type)  String() string { return string(w.Bytes()) }
func (w w4Type)  String() string { return string(w.Bytes()) }
func (w w5Type)  String() string { return string(w.Bytes()) }
func (w w6Type)  String() string { return string(w.Bytes()) }
func (w w7Type)  String() string { return string(w.Bytes()) }
func (w w8Type)  String() string { return string(w.Bytes()) }
func (w w9Type)  String() string { return string(w.Bytes()) }
func (w w10Type) String() string { return string(w.Bytes()) }
func (w w11Type) String() string { return string(w.Bytes()) }
func (w w12Type) String() string { return string(w.Bytes()) }
func (w w13Type) String() string { return string(w.Bytes()) }
func (w w14Type) String() string { return string(w.Bytes()) }
func (w w15Type) String() string { return string(w.Bytes()) }
func (w w16Type) String() string { return string(w.Bytes()) }
func (w w17Type) String() string { return string(w.Bytes()) }
func (w w18Type) String() string { return string(w.Bytes()) }
func (w w19Type) String() string { return string(w.Bytes()) }
func (w w20Type) String() string { return string(w.Bytes()) }

func (w  w3Type) FromBytes(b []byte) wType { return w3Type(b) }
func (w  w4Type) FromBytes(b []byte) wType { return w4Type(b) }
func (w  w5Type) FromBytes(b []byte) wType { return w5Type(b) }
func (w  w6Type) FromBytes(b []byte) wType { return w6Type(b) }
func (w  w7Type) FromBytes(b []byte) wType { return w7Type(b) }
func (w  w8Type) FromBytes(b []byte) wType { return w8Type(b) }
func (w  w9Type) FromBytes(b []byte) wType { return w9Type(b) }
func (w w10Type) FromBytes(b []byte) wType { return w10Type(b) }
func (w w11Type) FromBytes(b []byte) wType { return w11Type(b) }
func (w w12Type) FromBytes(b []byte) wType { return w12Type(b) }
func (w w13Type) FromBytes(b []byte) wType { return w13Type(b) }
func (w w14Type) FromBytes(b []byte) wType { return w14Type(b) }
func (w w15Type) FromBytes(b []byte) wType { return w15Type(b) }
func (w w16Type) FromBytes(b []byte) wType { return w16Type(b) }
func (w w17Type) FromBytes(b []byte) wType { return w17Type(b) }
func (w w18Type) FromBytes(b []byte) wType { return w18Type(b) }
func (w w19Type) FromBytes(b []byte) wType { return w19Type(b) }
func (w w20Type) FromBytes(b []byte) wType { return w20Type(b) }

func (w  w3Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w  w4Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w  w5Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w  w6Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w  w7Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w  w8Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w  w9Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w10Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w11Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w12Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w13Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w14Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w15Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w16Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w17Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w18Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w19Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }
func (w w20Type) MarshalJSON() ([]byte, error) { return []byte("\"" + w.String() + "\""), nil }

var w3  []w3Type
var w4  []w4Type
var w5  []w5Type
var w6  []w6Type
var w7  []w7Type
var w8  []w8Type
var w9  []w9Type
var w10 []w10Type
var w11 []w11Type
var w12 []w12Type
var w13 []w13Type
var w14 []w14Type
var w15 []w15Type
var w16 []w16Type
var w17 []w17Type
var w18 []w18Type
var w19 []w19Type
var w20 []w20Type

func initFunc() {
  words := bytes.Split(wordsFile, []byte{'\n'})
  for _, str := range words {
    switch len(str) {
    case 3:  w3  = append(w3,   w3Type(bytes.ToLower(str)))
    case 4:  w4  = append(w4,   w4Type(bytes.ToLower(str)))
    case 5:  w5  = append(w5,   w5Type(bytes.ToLower(str)))
    case 6:  w6  = append(w6,   w6Type(bytes.ToLower(str)))
    case 7:  w7  = append(w7,   w7Type(bytes.ToLower(str)))
    case 8:  w8  = append(w8,   w8Type(bytes.ToLower(str)))
    case 9:  w9  = append(w9,   w9Type(bytes.ToLower(str)))
    case 10: w10 = append(w10, w10Type(bytes.ToLower(str)))
    case 11: w11 = append(w11, w11Type(bytes.ToLower(str)))
    case 12: w12 = append(w12, w12Type(bytes.ToLower(str)))
    case 13: w13 = append(w13, w13Type(bytes.ToLower(str)))
    case 14: w14 = append(w14, w14Type(bytes.ToLower(str)))
    case 15: w15 = append(w15, w15Type(bytes.ToLower(str)))
    case 16: w16 = append(w16, w16Type(bytes.ToLower(str)))
    case 17: w17 = append(w17, w17Type(bytes.ToLower(str)))
    case 18: w18 = append(w18, w18Type(bytes.ToLower(str)))
    case 19: w19 = append(w19, w19Type(bytes.ToLower(str)))
    case 20: w20 = append(w20, w20Type(bytes.ToLower(str)))
    }
  }
}

func init() {
  initFunc()
}

