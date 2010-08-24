function Tile(x, y, type)
{
    this.x = x;
    this.y = y;

    this.type = type;

    this.info = g_tileInfo[type];

    this.items = new Array();
}

Tile.prototype =
{
    x : null,
    y : null,

    type : null,

    // data from the dictionnary
    info : null,

    // held creature (player or monster)
    creature : null,

    // held items
    items : null,

    // pathfinding variables
    parent : null,
    c : 0, // cost from the start
    m : 0, // manhattan distance

    isWalkable : function()
    {
        return g_tileInfo[this.type]['walkable'] && !this.creature;
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
        if(this.creature)
        {
            sprite = this.creature.model();
        }
        // else if it holds one or more items, draw the first
        else if(this.items && this.items[0])
        {
            sprite = this.items[0].model();
        }
        // else if the tile is empty, just draw its character
        else
        {
            sprite = this.model();
        }

        return sprite;
    },

    model : function()
    {
        return [this.info['char'], this.info['color']];
    },

   // drop an item on the tile
   dropItem : function(item)
   {
      this.items.push(item);
   },

   // remove an item from the tile
   pickUpItem : function(item)
   {
      this.items.removeObject(item);
   }
}
