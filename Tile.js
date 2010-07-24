function Tile(x, y, type)
{
    this.x = x;
    this.y = y;

    this.type = type;

    this.info = g_tileInfo[type];
}

Tile.prototype =
{
    x : null,
    y : null,

    type : null,

    // data from the dictionnary
    info : null,

    // apparence
    light : false,
    explored : false,

    // held creature (player or monster)
    creature : null,

    // held item
    item : null,

    // pathfinding variables
    parent : null,
    c : 0, // cost from the start
    m : 0, // manhattan distance

    isWalkable : function()
    {
        return g_tileInfo[this.type]['walkable'] && this.creature == null;
    },

    setType : function(type)
    {
        this.type = type;

        // update the data from the dictionnary
        this.info = g_tileInfo[type];
    },

    equals : function(tile)
    {
        if(this.x == tile.x && this.y == tile.y)
        {
            return true;
        }
        
        return false;
    },

    /** @return the sprite to represent this tile, as an array [char,color] */
    sprite : function()
    {
        var sprite;
        
        // if the tile holds a creature, draw it
        if(this.creature != null)
        {
            sprite = this.creature.model();
        }
        else if(this.item != null)
        {
            sprite = this.item.model();
        }
        // if the tile is empty, just draw its character
        else
        {
            sprite = this.model();
        }

        return sprite;
    },

    model : function()
    {
        return [this.info['char'], this.info['color']];
    }
}
