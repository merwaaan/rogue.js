function Level(width, height)
{
    g_level = this;

    this.width = width;
    this.height = height;

    this.map = new Array();

    for(var y = 0; y < this.height; y++)
    {
        this.map.push(new Array());

        for(var x = 0; x < this.width; x++)
        {
            this.map[y].push(new Tile(x, y, 'VOID'));   
        }
    }

    this.generate(2);
}

Level.prototype =
{
    map : null,

    // level size
    width : null,
    height : null,
    
    draw : function(xOffset, yOffset)
    {
       // if no parameter are specified, use the default offsets from g_gameObjectManager
      if(!xOffset || !yOffset)
      {
         xOffset = g_gameObjectManager.xOffset;
         yOffset = g_gameObjectManager.yOffset;
      }

        // get the canvas 2d context
        var ctx = document.getElementById('canvas').getContext('2d');
        // clear the canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.font = DRAW_FONT;
        
        // cx and cy are the canvas coordinate we will draw text at
        // they increase with the font width and height respectively
        for(var y = 0, cy = 0; y < SIZE; y++, cy += FONT_HEIGHT)
        {
            for(var x = 0, cx = 0; x < SIZE; x++, cx += FONT_WIDTH)
            {
                // get the tile
                var tile = this.getTile(x + xOffset, y + yOffset);

                // do not draw undefined tiles
                if (tile != undefined)
                {
                    // let the tile resolve what should be drawn
                    var sprite = tile.sprite();

                    // if the targeting interface is in draw mode, highlight
                    // the reachable tiles and the current target
                    if(g_targetingInterface.drawCursor || g_targetingInterface.drawArea)
                    {
                       // current target (cursor)
                       if(g_targetingInterface.drawCursor && g_targetingInterface.isTileTarget(tile))
                       {
                           ctx.fillStyle = g_targetingInterface.isTileReachable(tile) ? TARGET_COLOR : TARGET_NO_COLOR;
                           ctx.fillRect(cx, cy - FONT_HEIGHT - 1, FONT_WIDTH, FONT_HEIGHT);
                       }
                       // reachable area
                       else if(g_targetingInterface.drawArea && g_targetingInterface.isTileReachable(tile))
                       {
                           ctx.fillStyle = REACHABLE_AREA_COLOR;
                           ctx.fillRect(cx, cy - FONT_HEIGHT - 1, FONT_WIDTH, FONT_HEIGHT);
                       }
                    }

                    // if the player can see the tile, draw it
                    // otherwise, if the player previously saw the
                    // tile, draw the tile as it was last seen, and
                    // grey it out (fog of war)
                    // otherwise, don't draw it
                    if (g_player.canSeeTile(tile))
                    {
                        g_player.addSeenTile(tile);
                        ctx.fillStyle = sprite[1];
                        // draw the character with its natural color
                        ctx.fillText(sprite[0], cx, cy);
                    }
                    else if (g_player.hasSeenTile(tile))
                    {
                        ctx.fillStyle = FOW_COLOR;
                        // draw the last seen character with fog of war
                        ctx.fillText(g_player.getSeenTile(tile), cx, cy);
                    }
                }
            }
        }
    },

    generate : function(depth)
    {
        // divide the map into several spaces
        var spaces = this.divideSpace(depth);

        // "dig" one room into each space
        var rooms = this.digRooms(spaces);

        // build corridors between the rooms
        this.linkRooms(rooms, depth);

        // put walls around built rooms and corridors
        this.buildWalls();
    },

    divideSpace : function(depth)
    {
        var spaces = new Array();

        // put the whole map as the only space
        spaces.push({x : 0, y : 0, width : this.width, height : this.height});

        for(var i = 0; i < depth; i++)
        {
            var ratio = 0;

            var spacesNbr = spaces.length;
            for(var s = 0; s < spacesNbr; s++)
            {
                var horizontal = Math.random() > 0.5;

                ratio = getRandomDecimal(0.4, 0.6);

                // remove the space to be divided
                var oldSpace = spaces.shift();
                var separation = Math.floor((horizontal ? oldSpace.height : oldSpace.width) * ratio);

                var newSpace = {x : oldSpace.x, y : oldSpace.y, width : horizontal ? oldSpace.width : separation, height : horizontal ? separation : oldSpace.height};
                spaces.push(newSpace);

                newSpace = {x : horizontal ? oldSpace.x : separation, y : horizontal ? separation : oldSpace.y, width : horizontal ? oldSpace.width : oldSpace.width - separation, height : horizontal ? oldSpace.height - separation : oldSpace.height};
                spaces.push(newSpace);
            }
        }

        return spaces;
    },

    digRooms : function(spaces)
    {
        var rooms = new Array();

        for(var i = 0; i < spaces.length; i++)
        {
            var width = Math.floor(getRandomDecimal(0.6 * spaces[i].width, spaces[i].width));
            var height = Math.floor(getRandomDecimal(0.6 * spaces[i].height, spaces[i].height));

            var newRoom = {x : spaces[i].x + getRandomInteger(0, spaces[i].width - width), y : spaces[i].y + getRandomInteger(0, spaces[i].height - height), width : width, height : height};
            rooms.push(newRoom);
        }
        
        for(var i = 0; i < rooms.length; i++)
        {
            for(var y = rooms[i].y; y < rooms[i].height + rooms[i].y; y++)
            {
                for(var x = rooms[i].x; x < rooms[i].width + rooms[i].x; x++)
                {
                    this.getTile(x, y).setType('FLOOR');
                }
            }
        }

        return rooms;
    },

    linkRooms : function(rooms, depth)
    {
        // first part : link rooms with following indexes (ensures they are all connected)
        for(var i = 0; i < rooms.length - 1; i++)
        {
            this.digCorridor(rooms[i], rooms[i + 1]);
        }

        // second part : randomly connect rooms to add more variety
        for(var i = 0; i < depth * 2; i++)
        {
            this.digCorridor(getRandomFromList(rooms), getRandomFromList(rooms));
        }
    },

    digCorridor : function(room1, room2)
    {
        // get random tiles inside each room
        var tile1 = this.getTile(getRandomInteger(room1.x, room1.x + room1.width - 1), getRandomInteger(room1.y, room1.y + room1.height - 1));
        var tile2 = this.getTile(getRandomInteger(room2.x, room2.x + room2.width - 1), getRandomInteger(room2.y, room2.y + room2.height - 1));

        var corridor = new AStar().getPath(tile1, tile2, false);

        for(var j = 0; j < corridor.length; j++)
        {
            this.getTile(corridor[j].x, corridor[j].y).setType('FLOOR');
        }
    },

    buildWalls : function()
    {
        // go through each tile of the map
        for(var y = 0; y < this.height; y++)
        {
            for(var x = 0; x < this.width; x++)
            {
                var tile = this.getTile(x, y);

                if(tile.type == 'VOID')
                {
                    // check if one of the neighbors is a FLOOR tile
                    for(var i = -1; i < 2; i++)
                    {
                        for(var j = -1; j < 2; j++)
                        {
                            if(i != 0 || j != 0)
                            {
                                var neighbor = this.getTile(x + j, y + i);

                                if(neighbor != undefined && neighbor.type == 'FLOOR')
                                {
                                    this.getTile(x, y).setType('WALL');
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    getTile : function(x, y)
    {
        if(this.map[y] == undefined || this.map[y][x] == undefined)
        {
            return undefined;
        }

        return this.map[y][x];
    },

    getRandomTile : function(type)
    {
        if(type == undefined)
        {
            return this.getTile(getRandomInteger(0, this.width - 1), getRandomInteger(0, this.height - 1));
        }

        var tile = null;

        do
        {
            tile = this.getTile(getRandomInteger(0, this.width - 1), getRandomInteger(0, this.height - 1));             
        } while(tile.type != type);
        
        return tile;
    }
}
