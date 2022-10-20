package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/golang-hello-world", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello-golang-world"))
	})

	fmt.Println(" => http://localhost:8099/golang-hello-world")
	err := http.ListenAndServe(":8099", nil)
	if err != nil {
		panic("Can not listen port 8099, program exit now!")
	}
}