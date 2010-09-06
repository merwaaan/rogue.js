// RANDOM

function getRandomInteger(a, b)
{
    return Math.floor(Math.random() * (b - a + 1) + a);
}

function getRandomDecimal(a, b)
{
    return Math.random() * (b - a) + a;
}

function getRandomFromList(list)
{
    return list[getRandomInteger(0, list.length - 1)];
}

// DRAWING

/** @return the 2d canvas context for drawing */
function getCanvasContext()
{
    return document.getElementById('canvas').getContext('2d');
}

/** @return the model as an array [char, color] */
function getModel(character, color)
{
    // XXX admittedly, it's a bit useless right now, so we should
    // refactor this at one point
    return [character, color];
}

function drawPath(path)
{
    for(var i = 0; i < path.length; i++)
    {
        drawCharacter('.', path[i].x - g_gameObjectManager.xOffset, path[i].y - g_gameObjectManager.yOffset);
    };
}

// UI

function drawBar(element, value, max)
{
    var limit = Math.round(value / max * 10);

    var bar = '|';
    for(var i = 0; i < 10; i++)
    {
        if(i < limit)
        {
            bar += '=';
        }
        else
        {
            bar += '-';
        }
    }
    bar += '|';

    element.text(bar);
}

function clearMessages()
{
   $('#message').empty();
}

function logMessage(message)
{
   g_log.push(message);
}

function writeMessage(message, type)
{
   if(type == undefined)
   {
       type = 'DEFAULT';
   }

   $('#message').append('<span style="color:' + g_messageInfo[type]['color'] + '">' + message + '</span>');

   logMessage(message);    
}

// LIGHTING

/**
 * @requires x0, y0, x1 and y1 to be integers
 * @return the array of all the [x, y] points the bresenham line going
 *    from (x0, y0) to (x1, y1) pass through, in order.
 *    That is, if we do :
 *    var p = bresenhamLinePoints(x0, y0, x1, y1);
 *    then the following statements are true :
 *    p[0][0] == x0; p[0][1] == y0;
 *    p[p.length-1][0] == x1; p[p.length-1][1] == y1;
 */
function bresenhamLinePoints(x0, y0, x1, y1)
{
    // This is the "optimized" Bresenham's algorithm from :
    // http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Optimization (25/07/2010)
    // but adapted to return the points in order

    // We could use a fancy generator instead of returning an
    // whole array, and minimize overhead, but generators are only
    // available in Mozilla's Javascript implementation.

    // the array of points to return
    var points = new Array();

    // we need to know if the line's slope is above or below 1,
    // that is, if the line is above or below the diagonal y = x
    var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

    // if the line is above, take its symmetrical along the y = x axis
    if (steep)
    {
        // swap x and y
        var t;
        t = x0, x0 = y0, y0 = t;
        t = x1, x1 = y1, y1 = t;
    }

    // now the line is going to the right, and increases faster in x
    // than in y
    // we just have to remember we swapped x and y when steep == true,
    // and add the points accordingly

    var deltax = Math.abs(x1 - x0);
    var deltay = Math.abs(y1 - y0);
    var error = deltax >> 1;  // error = floor(deltax / 2)
    var xstep = x0 < x1 ? 1 : -1;
    var ystep = y0 < y1 ? 1 : -1;
    var y = y0;
    
    // go along the line, and add each point
    for (var x = x0; x != x1; x += xstep)
    {
        // if steep, remember we swapped x and y
        if (steep)
            points[points.length] = [y, x];
        else
            points[points.length] = [x, y];

        // increase y when x has increased enough
        error -= deltay;
        if (error < 0)
        {
            y += ystep;
            error += deltax;
        }
    }

    // add the end point
    if (steep)
        points[points.length] = [y, x];
    else
        points[points.length] = [x, y];

    return points;
}

// MISC.

function isTileWalkable(x, y)
{
    var tile = g_level.getTile(x, y);

    if(tile == undefined || !tile.isWalkable())
    {
        return false;
    }

    return true;
}

function gameOver()
{
   g_menu.openGameOverMenu();
}

function setKeyHandler(keyHandler)
{
    // Browsers have different behaviors regarding repeating
    // keys and special keys like arrows. Short version,
    // Chrome repeat the keyDown event for repeating arrow
    // keys, while FF repeat the keyPress event.
    // Long version : http://unixpapa.com/js/key.html
    if ($.browser.webkit)
        document.onkeydown = keyHandler;
    else
        document.onkeypress = keyHandler;
}

// ARRAY

// By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to)
{
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    
    return this.push.apply(this, rest);
}; 

Array.prototype.removeObject = function(object)
{
    for(var i = 0; i < this.length; ++i)
        if(this[i] === object)
        {
            this.remove(i);
            return;
        }
};

Array.prototype.contains = function(object)
{
   for(var i = 0; i < this.length; i++)
   {
      if(this[i] === object)
      {
         return true;
      }
   }

   return false;
};

// INHERITANCE

function extend(child, superclass)
{
    child.prototype.__proto__ = superclass.prototype;
}

// INTERACTIVE DEBUGGING

/** @effect outputs player position to the console */
function playerPos()
{
    console.log("Player is at " + g_player.x + ',' + g_player.y);
}

/**
 * @requires x0, y0, x1 and y1 are canvas coordinates
 * @effect draw a blue line from (x0,y0) to (x1,y1) on the canvas
 */
function drawLine(x0, y0, x1, y1)
{
    var ctx = getCanvasContext();
    ctx.strokeStyle = 'blue';
    // so much code for just one line ...
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
}

/**
 * @requires points is an array of level coordinates
 * @effect highlight an array of points by drawing a rectangle
 * around each one 
 */
function highlightPoints(points)
{
    var ctx = getCanvasContext();
    ctx.strokeStyle = 'gold';

    for (var i = 0; i < points.length; ++i)
    {
        // the rectangles are the size of the font
        // the '+2' is a graphical shift for better visual alignment which
        // I got from trial and error
        var cxy = levelToCanvasCoord(points[i][0], points[i][1]);
        ctx.strokeRect(cxy[0], cxy[1] + 2, FONT_WIDTH, FONT_HEIGHT);
    }
}

/**
 * @requires tiles is an array tiles
 * @effect highlight an array of tiles by drawing a rectangle
 * around each one 
 */
function highlightTiles(tiles)
{
    var ctx = getCanvasContext();
    ctx.strokeStyle = 'gold';

    for (var i = 0; i < tiles.length; ++i)
    {
        // the rectangles are the size of the font
        // the '+2' is a graphical shift for better visual alignment which
        // I got from trial and error
        var cxy = levelToCanvasCoord(tiles[i].x, tiles[i].y);
        ctx.strokeRect(cxy[0], cxy[1] + 2, FONT_WIDTH, FONT_HEIGHT);
    }
}

/**
 * @requires x and y are level coordinates
 * @effect draw a rectangle around each point on the path from the
 * player to (x,y)
 */
function highlightPathTo(x, y)
{
    highlightPoints(bresenhamLinePoints(g_player.x, g_player.y, x, y));
}

/**
 * @requires x and y are level coordinates
 * @effect draw a rectangle around each point on the path from the
 * player to (x,y)
 */
function highlightAStarTo(x, y)
{
   var from = g_level.getTile(g_player.x, g_player.y);
   var to = g_level.getTile(x, y);

   highlightTiles(new AStar().getPath(from, to));
}

/**
 * @requires cx and cy are canvas coordinates
 * @return the level coordinates [x, y] which correspond to the given
 * canvas coordinates
 */
function canvasToLevelCoord(cx, cy)
{
    // we add 1 to y to be consistent with levelToCanvasCoord
    return [Math.floor(cx / FONT_WIDTH + g_gameObjectManager.xOffset),
            Math.floor(cy / FONT_HEIGHT + g_gameObjectManager.yOffset + 1)];
}

/**
 * @requires x, y are level coordinates
 * @return the canvas coordinates [cx, cy] which correspond to the
 * given level coordinates
 */
function levelToCanvasCoord(x, y)
{
    // we substract 1 from y otherwise we end up with the wrong tile
    return [(x - g_gameObjectManager.xOffset) * FONT_WIDTH,
            (y - g_gameObjectManager.yOffset - 1) * FONT_HEIGHT];
}

/** @effect binds left mouse click to highlightPathTo(click.x, click.y) */
function debugShowPathTo()
{
    document.getElementById('canvas').addEventListener('click', function(e) {
        var xy = canvasToLevelCoord(e.offsetX, e.offsetY);
        highlightPathTo(xy[0], xy[1]);
    }, false);
}

/** @effect binds left mouse click to highlightAStarTo(click.x, click.y) */
function debugShowAStarTo()
{
    document.getElementById('canvas').addEventListener('click', function(e) {
        var xy = canvasToLevelCoord(e.offsetX, e.offsetY);
        highlightAStarTo(xy[0], xy[1]);
    }, false);
}
