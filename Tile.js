function Tile()
{
	this.x = 0;
	this.y = 0;
	this.type = null;

	// ascii representation, precomputed to speed up the drawing process
	this.model = null;

	// apparence
	this.light = false;
	this.explored = false;

	// held creature (player or monster)
	this.creature = null;

	// held item
	this.item = null;

	// pathfinding variables
	this.parent = null;
	this.c = 0; // cost from the start
	this.m = 0; // manhattan distance

	this.initTile = function(x, y, type)
	{
		this.x = x;
		this.y = y;
		this.type = type;

		this.model = getModel(g_tileInfo[this.type]['char'], g_tileInfo[this.type]['color']);

		return this;
	};

	this.setType = function(type)
	{
		this.type = type;
		this.model = getModel(g_tileInfo[this.type]['char'], g_tileInfo[this.type]['color']);
	};

	this.isWalkable = function()
	{
		return g_tileInfo[this.type]['walkable'] && this.creature == null;
	};

	this.equals = function(tile)
	{
		if(this.x == tile.x && this.y == tile.y)
		{
			return true;
		}
		
		return false;
	};

    /** @return the sprite to represent this tile, as an array [char,color] */
    this.sprite = function()
    {
	var sprite;
 
	// if the tile holds a creature, draw it
	if(this.creature != null)
	{
	    sprite = this.creature.model;
	}
	else if(this.item != null)
	{
	    sprite = this.item.model;
	}
	// if the tile is empty, just draw its character
	else
	{
	    sprite = this.model;
	}

	return sprite;
    };
}
