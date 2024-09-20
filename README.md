# katamarichess
A custom chess variant that revolves around combining pieces together through captures.

This is a website that is currently not hosted but it is containerised.
- Build: `sudo docker build -t katamarichess`
- Run: `sudo docker run katamarichess:latest` (add: `-p myport:8080` to host on
  `myport` instead of 8080)

Instructions on how to play can be found on the website itself, this project is
local-play only.

![the movement of a composite piece](./example_images/ex1.png)
![the composition of that composite piece](./example_images/ex2.png)
![the movement of a different composite piece that includes moves that can be
made by both sides](./example_images/ex3.png)
