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
    $('#WEAPON_label').text(g_player.weapon['name'] + ' (+' + g_player.weapon['PWR'] + ')');
}

function updateARMOR()
{
    $('#ARMOR_label').text(g_player.armor['name'] + ' (+' + g_player.armor['PWR'] + ')');
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
}


// INHERITANCE

function extend(child, superclass)
{
    child.prototype.__proto__ = superclass.prototype;
}

