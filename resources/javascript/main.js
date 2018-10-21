$(document).ready(function() {
  const LV_EXP = {
    1: 10,
    2: 30,
    3: 60,
    4: 100,
    5: 150
  };
  let rows = 20;
  let cols = 20;
  let init_hp = 10;
  let init_exp = 0;
  let you = initChar(init_hp, init_exp, LV_EXP);
  let maze = makeMaze(rows, cols);
  you.loc = boardSetup(rows, cols, maze);
  $("#game-map").one("click", function (){
    $(document).on("keyup", function(event){
      let key = event.which;
      you = move(rows, cols, maze, key, you, LV_EXP);
      reveal(you.loc[0], you.loc[1], maze);
    });
  });
});

//Makes the character object and gives it starting HP and EXP
function initChar(init_hp, init_exp, LV_EXP) {
  let char = {
    hp: init_hp,
    exp: init_exp,
    lv: 0,
    loc: [],
    dmg: 5
  };
  statUpdate(char, LV_EXP);
  return char;
}

//Updates the stats of the character based on what just happened
function statUpdate(char, LV_EXP) {
  $("#health").text(" " + char.hp);
  if((LV_EXP[char.lv + 1] - char.exp) == 0){
    char.lv += 1;
  }
  $("#level").text(" " + char.lv);
  $("#to-level").text(" " + (LV_EXP[char.lv + 1] - char.exp));
}

//makes rows and columns of empty divs and sets the border of the divs to match the walls
function boardSetup(rows, cols, maze) {
  for (let i = 0; i < rows; i++){
    $("#game-map").append("<div class='row' id='row" + i + "'></div>");
    for (let j = 0; j < cols; j++){
      $("#row" + i).append("<div class='tile column col" + j + "'></div>")
    }
  }
  //puts spikes in 10 random divs
  for(let a = 0; a < 10; a++) {
    x2 = Math.floor(Math.random() * cols);
    y2 = Math.floor(Math.random() * rows);
    while($("#row" + y2 + " .col" + x2).text() != ""){
      x2 = Math.floor(Math.random() * cols);
      y2 = Math.floor(Math.random() * rows);
    }
    $("#row" + y2 + " .col" + x2).text("M");
    maze[y2][x2].monsters[0] = "true";
    maze[y2][x2].monsters[1].loc = [y2, x2];
    maze[y2][x2].monsters[1].hp = 5;
    maze[y2][x2].monsters[1].exp = 5;
    maze[y2][x2].monsters[1].dmg = 2;
  }
  //puts potions in 10 random divs
  for(let b = 0; b < 10; b++) {
    x3 = Math.floor(Math.random() * cols);
    y3 = Math.floor(Math.random() * rows);
    while($("#row" + y3 + " .col" + x3).text() != ""){
      x3 = Math.floor(Math.random() * cols);
      y3 = Math.floor(Math.random() * rows);
    }
    $("#row" + y3 + " .col" + x3).text("P");
    maze[y3][x3].items.push("potion");
  }
  //puts the player in a random div
  x = Math.floor(Math.random() * cols);
  y = Math.floor(Math.random() * rows);
  while($("#row" + y + " .col" + x).text() != ""){
    x = Math.floor(Math.random() * cols);
    y = Math.floor(Math.random() * rows);
  }
  $("#row" + y + " .col" + x).text("@").addClass("char");
  reveal(y, x, maze);
  return [y,x];
}

//Just draws the walls of one given square
function drawWalls(y, x, maze) {
  if(maze[y][x].northWall){
    $("#row" + y + " .col" + x).css("border-top", "2px solid white");
    if(y > 0){
      $("#row" + (y-1) + " .col" + x).css("border-bottom", "2px solid white");
    }
  }
  if(maze[y][x].southWall){
    $("#row" + y + " .col" + x).css("border-bottom", "2px solid white");
    if(y < maze.length-1){
      $("#row" + (y+1) + " .col" + x).css("border-top", "2px solid white");
    }
  }
  if(maze[y][x].westWall){
    $("#row" + y + " .col" + x).css("border-left", "2px solid white");
    if(x > 0){
      $("#row" + y + " .col" + (x-1)).css("border-right", "2px solid white");
    }
  }
  if(maze[y][x].eastWall){
    $("#row" + y + " .col" + x).css("border-right", "2px solid white");
    if(x < maze[0].length){
      $("#row" + y + " .col" + (x+1)).css("border-left", "2px solid white");
    }
  }
}

//Shows walls and floors to the North until it hits a wall
function lookNorth(y, x, maze) {
  if(maze[y][x].northWall){
    $("#row" + y + " .col" + x).css("border-top", "2px solid white");
    return;
  }else{
    y--;
    $("#row" + y + " .col" + x).removeClass("tile");
    drawWalls(y, x, maze);
    lookNorth(y, x, maze);
  }
}
//Shows walls and floors to the South until it hits a wall
function lookSouth(y, x, maze) {
  if(maze[y][x].southWall){
    $("#row" + y + " .col" + x).css("border-bottom", "2px solid white");
    return;
  }else{
    y++;
    $("#row" + y + " .col" + x).removeClass("tile");
    drawWalls(y, x, maze);
    lookSouth(y, x, maze);
  }
}
//Shows walls and floors to the West until it hits a wall
function lookWest(y, x, maze) {
  if(maze[y][x].westWall){
    $("#row" + y + " .col" + x).css("border-left", "2px solid white");
    return;
  }else{
    x--;
    $("#row" + y + " .col" + x).removeClass("tile");
    drawWalls(y, x, maze);
    lookWest(y, x, maze);
  }
}
//Shows walls and floors to the East until it hits a wall
function lookEast(y, x, maze) {
  if(maze[y][x].eastWall){
    $("#row" + y + " .col" + x).css("border-right", "2px solid white");
    return;
  }else{
    x++;
    $("#row" + y + " .col" + x).removeClass("tile");
    drawWalls(y, x, maze);
    lookEast(y, x, maze);
  }
}

//Reveals where you've been
function reveal(y, x, maze){
  $("#row" + y + " .col" + x).removeClass("tile");
  drawWalls(y, x, maze);
  lookNorth(y, x, maze);
  lookSouth(y, x, maze);
  lookWest(y, x, maze);
  lookEast(y, x, maze);
}

//Calculates if you can move and if so, moves you
function move(rows, cols, maze, key, you, LV_EXP) {
  let dir = "";
  let borderLeft = maze[you.loc[0]][you.loc[1]].westWall;
  let borderRight = maze[you.loc[0]][you.loc[1]].eastWall;
  let borderTop = maze[you.loc[0]][you.loc[1]].northWall;
  let borderBottom = maze[you.loc[0]][you.loc[1]].southWall;
  if(key == 37){
    if(you.loc[1] == 0){

    }else if(borderLeft){

    }else{
      you.loc[1] --;
      if(maze[you.loc[0]][you.loc[1]].monsters[0]){
        you = fight(maze, you, LV_EXP, key);
      }else{
        $(".char").text("").removeClass("char").addClass("temp");
        $(".temp").prev().text("@").addClass("char");
        $(".temp").removeClass("temp");
      }
    }
  }else if(key == 38){
    if(you.loc[0] == 0){

    }else if(borderTop){

    }else{
      you.loc[0] --;
      if(maze[you.loc[0]][you.loc[1]].monsters[0]){
        you = fight(maze, you, LV_EXP, key);
      }else{
        $(".char").text("").removeClass("char").addClass("temp");
        $(".temp").parent().prev().children(".col" + you.loc[1]).text("@").addClass("char");
        $(".temp").removeClass("temp");
      }
    }
  }else if(key == 39){
    if(you.loc[1] == cols-1){

    }else if(borderRight){

    }else{
      you.loc[1] ++;
      if(maze[you.loc[0]][you.loc[1]].monsters[0]){
        you = fight(maze, you, LV_EXP, key);
      }else{
        $(".char").text("").removeClass("char").addClass("temp");
        $(".temp").next().text("@").addClass("char");
        $(".temp").removeClass("temp");
      }
    }
  }else if(key == 40){
    if(you.loc[0] == rows-1){

    }else if(borderBottom){

    }else{
      you.loc[0] ++;
      if(maze[you.loc[0]][you.loc[1]].monsters[0]){
        you = fight(maze, you, LV_EXP, key);
      }else{
        $(".char").text("").removeClass("char").addClass("temp");
        $(".temp").parent().next().children(".col" + you.loc[1]).text("@").addClass("char");
        $(".temp").removeClass("temp");
      }
    }
  }else{

  }

  if(maze[you.loc[0]][you.loc[1]].items.includes("potion")) {
    you.hp += Math.floor(Math.random() * 1) + 1;
    if(you.hp > 10){
      you.hp = 10;
    }
    statUpdate(you, LV_EXP);
    let index = maze[you.loc[0]][you.loc[1]].items.indexOf("potion");
    maze[you.loc[0]][you.loc[1]].items.splice(index, 1);
  }
  return you;
}

//Fights monsters
function fight(maze, you, LV_EXP, key) {
  thisMonster = maze[you.loc[0]][you.loc[1]].monsters[1];
  you.hp -= Math.floor(Math.random() * 3) + 1;
  thisMonster.hp -= Math.floor(Math.random() * you.dmg) + 1;
  if(thisMonster.hp <= 0){
    maze[you.loc[0]][you.loc[1]].monsters[0] = false;
    $("#row" + you.loc[0] + " .col" + you.loc[1]).text("");
    you.exp += thisMonster.exp;
  }
  if(you.hp <= 0){
    you.hp = 0;
    $("#row0 .col0").text("G").css("color", "white");
    $("#row0 .col1").text("A").css("color", "white");
    $("#row0 .col2").text("M").css("color", "white");
    $("#row0 .col3").text("E").css("color", "white");
    $("#row0 .col4").text("");
    $("#row0 .col5").text("O").css("color", "white");
    $("#row0 .col6").text("V").css("color", "white");
    $("#row0 .col7").text("E").css("color", "white");
    $("#row0 .col8").text("R").css("color", "white");
    for(let i = 0; i < maze.length; i++){
      for(let j = 0; j < maze[0].length; j++){
        $("#row" + i + " .col" + j).addClass("tile").css("border", "none");
      }
    }
  }
  switch(key){
    case 37:
      you.loc[1]++;
      break;
    case 39:
      you.loc[1]--;
      break;
    case 38:
      you.loc[0]++;
      break;
    case 40:
      you.loc[0]--;
      break;
  }
  statUpdate(you, LV_EXP);
  return you;
}

//Makes a maze in a 2d array and returns that
function makeMaze(rows, cols) {
  let maze = [];
  for(let i = 0; i < rows; i++){
    maze[i] = [];
    for(let j = 0; j < cols; j++){
      maze[i][j] = {
        yIndex: i,
        xIndex: j,
        items: [],
        monsters: [false, monster = {}],
        visited: false,
        northWall: true,
        eastWall: true,
        southWall: true,
        westWall: true
      };
    }
  }
  drawRooms(maze, rows, cols);
  let startPoint = maze[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
  let endPoint = maze[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
  let path = [];
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
  for(let y = 0; y < maze.length; y++) {
    for(let x = 0; x < maze[y].length; x++) {
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
  let x = current.xIndex;
  let y = current.yIndex;
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
  let roomMaxX = cols / 5;
  let roomMaxY = rows / 5;
  let numRooms = 10;
  while(numRooms > 0) {
    let roomX = Math.floor(Math.random() * roomMaxX-1) + 2;
    let roomY = Math.floor(Math.random() * roomMaxY-1) + 2;
    let locX = Math.floor(Math.random() * ((maze[0].length - roomX) + 1));
    let locY = Math.floor(Math.random() * ((maze.length - roomY) + 1));
    for(let y = locY; y < (locY + roomY); y ++) {
      for(let x = locX; x < (locX + roomX); x++) {
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
