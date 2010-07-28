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

// UI

function buildStatusFrame()
{
   $('#info').empty();
   
   // "status" part
   $('#info').append('<div id="status"></div>');
   
   var s = ['HP', 'XP']; 
   for(var i = 0; i < s.length; i++)
   {
	$('#info #status').append('<span id="' + s[i] + '">' + s[i] + ' <span id="' + s[i] + '_bar"></span> <span id="' + s[i] + '_label"></span>');
   }
   
   // "characteristics" part
   $('#info').append('<div id="characteristics"></div>');
    
   s = ['LVL', 'STR', 'DEF'];
   for(var i = 0; i < s.length; i++)
   {
      $('#info #characteristics').append('<span id="' + s[i] + '">' + s[i] + ' <span id="' + s[i] + '_label"></span></span>');                         
   }
   
   // "equipment" part
   $('#info').append('<div id="equipment"></div>');
    
   s = ['WEAPON', 'ARMOR'];
   for(var i = 0; i < s.length; i++)
   {
      $('#info #equipment').append('<span id="' + s[i] + '">' + s[i] + ' <span id="' + s[i] + '_label"></span></span>');
   }

   updateAllUI();
}

function buildInventoryFrame()
{
   $('#info').empty();
   
   $('#info').append('<div id="inventory"><div id="items"></div><div id="details"></div></div>');
}

function updateHP()
{
    drawBar($('#HP_bar'), g_player.HP, g_player.maxHP);
    $('#HP_label').text(g_player.HP + '/' + g_player.maxHP);
}

function updateXP()
{
    drawBar($('#XP_bar'), g_player.XP, g_levelingInfo[g_player.LVL]['next']);
    $('#XP_label').text(g_player.XP + '/' + g_levelingInfo[g_player.LVL]['next']);
}

function updateLVL()
{
    $('#LVL_label').text(g_player.LVL);
}

function updateSTR()
{
    $('#STR_label').text(g_player.STR);
}

function updateDEF()
{
    $('#DEF_label').text(g_player.DEF);
}

function updateWEAPON()
{
   var name = g_player.weapon ? g_player.weapon.getName() : 'none';
   var damage = g_player.weapon ? g_player.weapon.getDamage() : 0;

   $('#WEAPON_label').text(name + ' (+' + damage + ')');
}

function updateARMOR()
{
   var name = g_player.armor ? g_player.armor.getName() : 'none';
   var protection = g_player.armor ? g_player.armor.getProtection() : 0;

    $('#ARMOR_label').text(name + ' (+' + protection + ')');
}

function updateAllUI()
{
    updateHP();
    updateXP();
    updateLVL();
    updateSTR();
    updateDEF();
    updateWEAPON();
    updateARMOR();
}

function clearMessages()
{
    $('#message').empty();
}

function writeMessage(message, type)
{
    if(type == undefined)
    {
        type = 'DEFAULT';
    }

    $('#message').append('<span style="color:' + g_messageInfo[type]['color'] + '">' + message + '</span>');    
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

// Next-gen lighting effects

TORCH_PALETTE = [ 'white', '#fff72e', '#ffde2e', '#ffb12e', '#ff7e2e', '#ff3b2e', '#9c453f' ];

/**
 * Return the color the tile shoud be painted with to make it looks
 * like the player is holding a torch.
 * Preferably use with tiles that are in line of sight.
 *
 * @requires tile is defined and not null
 * @return a CSS color-code to paint the tile with
 */
function torchlightTile(tile)
{
    // compute distance from player to tile
    var dx = tile.x - g_player.x;
    var dy = tile.y - g_player.y;
    // euclidean distance looks nicer
    var d = Math.sqrt(dx * dx + dy * dy);
    // expand radius (increase to widen torch radius)
    d /= 3.5;
    // add noise variation
    d += d * Math.random();
    // round to integer
    d = Math.round(d);
    // clamp d to array indices
    d = Math.max(0, d);
    d = Math.min(d, TORCH_PALETTE.length - 1);

    // return the corresponding color in palette
    return TORCH_PALETTE[d];
}

/**
 * Toggle realtime drawing of the screen.
 *
 * @requires enable is true or false, interval is a positive integer
 * @param enable true redraws the screen every interval ms, false
 *        redraws the screen at every key input 
 * @param interval the interval at which to refresh the screen in milliseconds
 */
function setRealtimeDraw(enable, interval)
{
    // use the global refreshTimer to remember the timer
    if (enable)
        refreshTimer = setInterval('redraw()', interval);
    else
        clearInterval(refreshTimer);
}

/**
 * Redraw the level
 */
function redraw()
{
    g_level.draw(g_gameObjectManager.xOffset, g_gameObjectManager.yOffset);
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
    $('#wall').append('----- GAME OVER -----<br/><br/>');
    $('#wall').append('Your quest lasted for ' + g_gameObjectManager.turn + ' turns');
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

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to)
{
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    
    return this.push.apply(this, rest);
}; 

Array.prototype.removeObject = function(object)
{
    for(var i = 0; i < this.length; ++i)
    {
        if(this[i] === object)
        {
            this.remove(i);
            break;
        }
    }
};

Array.prototype.containsObject = function(object)
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
 * @requires tiles is an array of level tiles
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
