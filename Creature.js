function Creature(type)
{
    // search a FLOOR tile where the creature can be positionned
    var tile = g_level.getRandomTile('FLOOR');

    VisualGameObject.apply(this, [tile.x, tile.y, type]);

    this.HP = 15;
    this.maxHP = 15;
}

Creature.prototype =
{
    // status
    HP : null,
    maxHP : null,
    XP : null,

    // characteristics
    STR : null,
    DEF : null,

    // equipment
    weapon : null,
    armor : null,

    destroyCreature : function()
    {
        // if the creature is positionned, we free its tile
        if(this.x != null && this.y != null)
        {
            g_level.getTile(this.x, this.y).creature = null;
        }
        
        this.destroyVisualGameObject();
    },
    
    attack : function(victim)
    {
        var damage = this.STR + (this.weapon != null ? this.weapon.getDamage() : 0);

        victim.takeDamage(damage, this);
    },

    takeDamage : function(damage, attacker)
    {
        this.HP -= damage;

        if(this.type == 'PLAYER')
        {
            updateHP();
            writeMessage(this.getName() + ' lose ' + damage + ' HP');
        }
        else
        {
            writeMessage(this.getName() + ' loses ' + damage + 'HP');
        }

        if(this.HP <= 0)
        {
            this.HP = 0;

            this.die(); 

            if(attacker.type == 'PLAYER')
            {
                attacker.winXP(this.XP);
            }
        }
        // INTELLIGENCE!!!
        else if(this.type != 'PLAYER')
        {
            this.attack(attacker);
        }
    },

    // TODO
    getHealth : function(quantity)
    {
        this.HP += quantity;

        if(this.HP > this.maxHP)
        {
            this.HP = this.maxHP;
        }
    },

    die : function()
    {
        if(this.type == 'PLAYER')
        {
            writeMessage(this.getName() + ' die');
            gameOver();
        }
        else
        {
            writeMessage(this.getName() + ' dies');
            // drop stuff
        }

        this.destroyCreature();
    },

    /**
     * Whether or not this creature can see the given tile. A creature
     * can see a tile if there are no objects it can't see through on
     * the line from its position to the tile. If the creature can't
     * see through the tile itself, it can still see the tile.
     * Currently, the line used is Bresenham's.
     *
     * @requires tile is defined and not null
     * @return true iff this creature can see the tile
     */
    canSeeTile : function(tile)
    {
        // get all the points from this creature to the tile
        var points = bresenhamLinePoints(this.x, this.y, tile.x, tile.y);
        var x, y;
        var tileAtPoint;
        var canSee = true;
        
        // we just need to check all the points minus the tile
        for (var i = 0; i < points.length - 1; ++i)
        {
            x = points[i][0]; y = points[i][1];
            tileAtPoint = g_level.getTile(x, y);

            // if any obstacle is in the way, we can't see the tile
            if (!this.canSeeThroughTile(tileAtPoint))
                canSee = false;
        }

        // if there was no obstacle, then the creature can see the tile, even
        // though it might not see through it.

        // Fix for some walls not being seen due to the path the
        // Bresenham's line took.
        // We get around this by making walls seen whenever the floor
        // next to it is seen.
        if (!canSee && tile.type == 'WALL')
        {
            // get the floors between the wall and the creature
            var dx = this.x < tile.x ? -1 : 1;
            var dy = this.y < tile.y ? -1 : 1;
            // three possibilities of floors adjacent to this wall in
            // the creature direction
            var nearTiles = [];
            // push the diagonal possibility first
            nearTiles.push(g_level.getTile(tile.x + dx, tile.y + dy));
            nearTiles.push(g_level.getTile(tile.x + dx, tile.y));
            nearTiles.push(g_level.getTile(tile.x, tile.y + dy));


            // the creature can see the wall if it can see the all the
            // floors adjacent to it
            for (var i = 0, t; i < nearTiles.length; ++i)
            {
                t = nearTiles[i];
                if (t && t.type == 'FLOOR')
                    canSee = this.canSeeTile(t);
            }
        }

        return canSee;
    },

    /**
     * Whether or not this creature can see through the tile.
     *
     * @requires tile defined and not null
     * @return true iff this creature can see through the tile
     */
    canSeeThroughTile : function(tile)
    {
        // walls are the default light-ender
        // other fun mechanisms could interact with this, like magic,
        // status effects, special monsters ...
        return tile.type != 'WALL';
    }
};

extend(Creature, VisualGameObject);
