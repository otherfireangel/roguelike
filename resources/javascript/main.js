$(document).ready(function() {
  var rows = 20;
  var cols = 20;
  maze = makeMaze(rows, cols);
  boardSetup(rows, cols, maze);
  $("#game-map").one("click", function (){
    $(document).on("keyup", function(event){
      var key = event.which;
      var colNum = $(".char").attr("class").match(/[0-9]+/g)[0];
      var rowNum = $(".char").parent().attr("id").match(/[0-9]+/g)[0];
      move(rows, cols, maze, key, rowNum, colNum);
    });
  });
});

//makes rows and columns of empty divs and sets the border of the divs to match the walls
function boardSetup(rows, cols, maze) {
  for (var i = 0; i < rows; i++){
    $("#game-map").append("<div class='row' id='row" + i + "'></div>");
    for (var j = 0; j < cols; j++){
      $("#row" + i).append("<div class='column col" + j + "'></div>")
      if(maze[i][j].northWall){
        $("#row" + i + " .col" + j).css("border-top", "2px solid white");
      }
      if(maze[i][j].southWall){
        $("#row" + i + " .col" + j).css("border-bottom", "2px solid white");
      }
      if(maze[i][j].eastWall){
        $("#row" + i + " .col" + j).css("border-right", "2px solid white");
      }
      if(maze[i][j].westWall){
        $("#row" + i + " .col" + j).css("border-left", "2px solid white");
      }
    }
  }
  //puts the player in a random div
  x = Math.floor(Math.random() * cols);
  y = Math.floor(Math.random() * rows);
  $("#row" + x + " .col" + y).text("@").addClass("char");
}

//Calculates if you can move and if so, moves you
function move(rows, cols, maze, key, rowNum, colNum) {
  var borderLeft = maze[rowNum][colNum].westWall;
  var borderRight = maze[rowNum][colNum].eastWall;
  var borderTop = maze[rowNum][colNum].northWall;
  var borderBottom = maze[rowNum][colNum].southWall;
  if(key == 37){
    if(colNum == 0){

    }else if(borderLeft){

    }else{
      $(".char").text("").removeClass("char").addClass("temp");
      $(".temp").prev().text("@").addClass("char");
      $(".temp").removeClass("temp");
    }
  }
  if(key == 38){
    if(rowNum == 0){

    }else if(borderTop){

    }else{
      $(".char").text("").removeClass("char").addClass("temp");
      $(".temp").parent().prev().children(".col" + colNum).text("@").addClass("char");
      $(".temp").removeClass("temp");
    }
  }
  if(key == 39){
    if(colNum == cols-1){

    }else if(borderRight){

    }else{
      $(".char").text("").removeClass("char").addClass("temp");
      $(".temp").next().text("@").addClass("char");
      $(".temp").removeClass("temp");
    }
  }
  if(key == 40){
    if(rowNum == rows-1){

    }else if(borderBottom){

    }else{
      $(".char").text("").removeClass("char").addClass("temp");
      $(".temp").parent().next().children(".col" + colNum).text("@").addClass("char");
      $(".temp").removeClass("temp");
    }
  }
}

//Makes a maze in a 2d array and returns that
function makeMaze(rows, cols) {
  var maze = [];
  for(var i = 0; i < rows; i++){
    maze[i] = [];
    for(var j = 0; j < cols; j++){
      maze[i][j] = {
        yIndex: i,
        xIndex: j,
        visited: false,
        northWall: true,
        eastWall: true,
        southWall: true,
        westWall: true
      };
    }
  }
  drawRooms(maze, rows, cols);
  var startPoint = maze[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
  var endPoint = maze[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
  var path = [];
  current = startPoint;
  current.visited = true;
  options = checkNeighbors(maze, current, rows, cols);
  current = newCurrent(options, maze, current);
  step(maze, path, current, endPoint, rows, cols);
  fixWalls(maze);
  return maze;
}

//Makes sure that all walls exist from both sides
function fixWalls(maze) {
  for(var y = 0; y < maze.length; y++) {
    for(var x = 0; x < maze[y].length; x++) {
      //makes the top/bottom edges solid and fixes north/south walls
      if(y == 0){
        maze[y][x].northWall = true;
      }else if(y == maze.length-1){
        maze[y][x].southWall = true;
      }
      if(y != 0 && maze[y][x].northWall){
        maze[y-1][x].southWall = true;
      }
      if(y != maze.length-1 && maze[y][x].southWall){
        maze[y+1][x].northWall = true;
      }
      //same as above for left and right
      if(x == 0){
        maze[y][x].westWall = true;
      }else if(x == maze[y].length-1){
        maze[y][x].eastWall = true;
      }
      if(x != 0 && maze[y][x].westWall){
        maze[y][x-1].eastWall = true;
      }
      if(x != maze[y].length-1 && maze[y][x].eastWall){
        maze[y][x+1].westWall = true;
      }
    }
  }
}

//Checks the neighboring cells and returns unvisited ones
function checkNeighbors(maze, current, rows, cols){
  var x = current.xIndex;
  var y = current.yIndex;
  options = []
  if(y > 0 && maze[y-1][x].visited == false){
    options.push([y-1,x,"N"]);
  }
  if(y < rows-1 && maze[y+1][x].visited == false){
    options.push([y+1,x,"S"]);
  }
  if(x > 0 && maze[y][x-1].visited == false){
    options.push([y,x-1,"W"]);
  }
  if(x < cols-1 && maze[y][x+1].visited == false){
    options.push([y,x+1,"E"]);
  }
  return options;
}

//Either fixes a dead end or removes a wall, either way there's a new current
function newCurrent(options, maze, current){
  pick = options[Math.floor(Math.random() * options.length)];
  temp = maze[pick[0]][pick[1]];
  switch(pick[2]){
    case "N": //temp is north of start
      current.northWall = false;
      temp.southWall = false;
      break;
    case "S":
      current.southWall = false;
      temp.northWall = false;
      break;
    case "W":
      current.westWall = false;
      temp.eastWall = false;
      break;
    case "E":
      current.eastWall = false;
      temp.westWall = false;
      break;
  }
  current = temp;
  return current;
}

//The recursive bastard that runs the show
function step(maze, path, current, endPoint, rows, cols){
  if(current == endPoint){
    current.visited = true;
    current = path.pop();
    step(maze, path, current, endPoint, rows, cols);
  }else{
    current.visited = true;
    path.push(current);
    options = checkNeighbors(maze, current, rows, cols);
    if(options.length == 0){
      path.pop();
      if(path.length == 0){
        return maze;
      }else{
        current = path.pop();
      }
    }else{
      current = newCurrent(options, maze, current);
    }
    step(maze, path, current, endPoint, rows, cols);
  }
}

//takes the empty maze and creates rectangular rooms
function drawRooms(maze, rows, cols) {
  //size of rooms as a function of maze size (range)
  var roomMaxX = cols / 5;
  var roomMaxY = rows / 5;
  var numRooms = 10;
  while(numRooms > 0) {
    var roomX = Math.floor(Math.random() * roomMaxX-1) + 2;
    var roomY = Math.floor(Math.random() * roomMaxY-1) + 2;
    var locX = Math.floor(Math.random() * ((maze[0].length - roomX) + 1));
    var locY = Math.floor(Math.random() * ((maze.length - roomY) + 1));
    for(var y = locY; y < (locY + roomY); y ++) {
      for(var x = locX; x < (locX + roomX); x++) {
        if(y == locY){
          maze[y][x].southWall = false;
        }else if(y == locY + roomY){
          maze[y][x].northWall = false;
        }else{
          maze[y][x].southWall = false;
          maze[y][x].northWall = false;
        }
        if(x == locX){
          maze[y][x].eastWall = false;
        }else if(x == locX + roomX){
          maze[y][x].westWall = false;
        } else {
          maze[y][x].eastWall = false;
          maze[y][x].westWall = false;
        }
      }
    }
    numRooms --;
  }
}
