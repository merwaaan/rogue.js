function Level()
{
	this.map = null;
	this.width = 0;
	this.height = 0;
	this.tileSize = 0;
	
	this.initLevel = function(width, height)
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
				this.map[y].push(new Tile().initTile(x, y, 'VOID'));	
			}
		}

		this.generate(2);

		return this;
	};

	this.draw = function(xOffset, yOffset)
	{
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
		    var tile = this.getTile(x + xOffset, y + yOffset);
		    var sprite;

		    // imaginary tiles, outside of the map
		    if (tile == undefined)
			sprite = ['U', 'white'];
		    // let the tile resolve what should be drawn
		    else
			sprite = tile.sprite();

		    // change the fill color
		    ctx.fillStyle = sprite[1];
		    // draw the character with current color
		    ctx.fillText(sprite[0], cx, cy);
		}
	    }
	};

	this.generate = function(depth)
	{
		// divide the map into several spaces
		var spaces = this.divideSpace(depth);

		// "dig" one room into each space
		var rooms = this.digRooms(spaces);

		// build corridors between the rooms
		this.linkRooms(rooms, depth);

		// put walls around built rooms and corridors
		this.buildWalls();
	};

	this.divideSpace = function(depth)
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
	}

	this.digRooms = function(spaces)
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
	};

	this.linkRooms = function(rooms, depth)
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
	};

	this.digCorridor = function(room1, room2)
	{
		// get random tiles inside each room
		var tile1 = this.getTile(getRandomInteger(room1.x, room1.x + room1.width - 1), getRandomInteger(room1.y, room1.y + room1.height - 1));
		var tile2 = this.getTile(getRandomInteger(room2.x, room2.x + room2.width - 1), getRandomInteger(room2.y, room2.y + room2.height - 1));

		var corridor = new AStar().getPath(tile1, tile2, false);	
		for(var j = 0; j < corridor.length; j++)
		{
			this.getTile(corridor[j].x, corridor[j].y).setType('FLOOR');
		}
	};

	this.buildWalls = function()
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
	};

	this.getTile = function(x, y)
	{
		if(this.map[y] == undefined || this.map[y][x] == undefined)
		{
			return undefined;
		}

		return this.map[y][x];
	};

	this.getRandomTile = function(type)
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
	};
}
