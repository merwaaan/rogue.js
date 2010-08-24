function Player()
{
   Creature.apply(this, ['PLAYER']);

   this.info = g_playerInfo['PLAYER'];

   this.LVL = 1;

   this.HP = g_levelingInfo[this.LVL]['HP'];
   this.maxHP = g_levelingInfo[this.LVL]['HP'];
   this.XP = 0;

   this.STR = g_levelingInfo[this.LVL]['STR'];
   this.DEF = g_levelingInfo[this.LVL]['DEF'];

   this.weapon = new Weapon(null, null, 'SWORD', this);
   this.armor = new Armor(null, null, 'SKIN', this);

   this.inventory = new Inventory();
   this.inventory.add('WEAPON', this.weapon);
   this.inventory.add('ARMOR', this.armor);
   this.inventory.add('WEAPON', new Weapon(null, null, 'SPEAR', this));
   this.inventory.add('FOOD', new FoodItem(null, null, 'BREAD', this));

   this.seenTiles = new Array();
    
   // center the screen on the player
   g_gameObjectManager.xOffset = this.x - HALF_SIZE;
   g_gameObjectManager.yOffset = this.y - HALF_SIZE;
}

Player.prototype =
{
    // characteristics
    LVL : null,
    nextLevel : null,

    // inventory
    inventory : null,

    // tile memory
    seenTiles : null,

    destroyPlayer : function()
    {
        this.destroyCreature();
    },

    winXP : function(XP)
    {
        this.XP += XP;
        
        writeMessage(this.getName() + ' win ' + XP + ' XP points', 'GOOD');

        if(this.XP >= g_levelingInfo[this.LVL]['next'])
        {
            this.levelUp();
        }
        
        updateAllUI();
    },

    levelUp : function()
    {
        this.XP = this.XP % g_levelingInfo[this.LVL]['next'];

        this.LVL++;
        this.maxHP = g_levelingInfo[this.LVL]['HP'];
        this.STR = g_levelingInfo[this.LVL]['STR'];
        this.DEF = g_levelingInfo[this.LVL]['DEF'];

        writeMessage(this.getName() + ' level up!', 'GOOD'); // EVERYONE!
    },

    // TODO let the user choose the name of his adventurer
    getName : function()
    {
        return 'You';
    },

    keyDown : function(event)
    {
        var xOld = this.x;
        var yOld = this.y;

        var xMove = 0;
        var yMove = 0;

        // TODO: keyCode are not the same for FF
        // numpad only works in Chrome for the moment
        switch(event.keyCode)
        {
        // i : inventory
        case 73:
            this.inventory.open();
            return;
        // p : pick up
        case 80:
            // check if an item is on the tile
            if(g_level.getTile(this.x, this.y).items && g_level.getTile(this.x, this.y).items[0])
            {
               g_level.getTile(this.x, this.y).items[0].pickUp(this);
            }
            return;
        // left arrow
        case 37:
        // numpad 4
        case 100:
            xMove = -1;
            break;
        // up arrow
        case 38:
        // numpad 8
        case 104:
            yMove = -1;
            break;
        // right arrow
        case 39:
        // numpad 6
        case 102:
            xMove = 1;
            break;
        // down arrow
        case 40:
        // numpad 2
        case 98:
            yMove = 1;
            break;

        // diagonals
        // numpad 1
        case 97:
            xMove = -1;
            yMove =  1;
            break;
        // numpad 3
        case 99:
            xMove =  1;
            yMove =  1;
            break;
        // numpad 7
        case 103:
            xMove = -1;
            yMove = -1;
            break;
        // numpad 9
        case 105:
            xMove =  1;
            yMove = -1;
            break;
        }

        var xNew = this.x + xMove;
        var yNew = this.y + yMove;

        // check if a movement has to be made
        // don't walk into undefined tiles
        if((xNew != this.x || yNew != this.y) && g_level.getTile(xNew, yNew))
        {
            // if the target tile is walkable
            if(isTileWalkable(xNew, yNew))
            {
                this.move(xNew, yNew);

                // if there is items on the current tile, enumerate them
                var items;
                if(items = g_level.getTile(xNew, yNew).items)
                {
                  for(var i = 0; i < items.length; i++)
                  {
                     writeMessage('There is a ' + items[i].getName() + ' on the floor');
                  }
                }
            }
            // else if there is a monster on the tile
            else if(g_level.getTile(xNew, yNew).creature != null)
            {
                this.attack(g_level.getTile(xNew, yNew).creature);
            }
            
            g_gameObjectManager.xOffset += this.x - xOld;
            g_gameObjectManager.yOffset += this.y - yOld;

            g_gameObjectManager.turn++;
        }
    },

    /**
     * Commit the given tile to the player memory. A subsequent call
     * to this.hasSeenTile(tile) will return true.
     *
     * @requires tile is defined and not null
     * @modifies this.seenTiles
     * @effect add tile to this.seenTiles
     */
    addSeenTile : function(tile)
    {
        if (this.seenTiles[tile.x] === undefined)
            this.seenTiles[tile.x] = new Array();
        // record the sprite drawn for the tile to avoid omniscience
        this.seenTiles[tile.x][tile.y] = tile.sprite()[0];
    },

    /**
     * Return the sprite character of the tile as it was when the
     * player last saw it.  If the player has not previously seen the
     * given tile, undefined is returned.
     *
     * @requires tile is defined and not null,
     *           this.hasSeenTile(tile) is true
     * @return the tile's sprite character as it was when the player last
     *         commited it to memory, or undefined it the player never
     *         saw the tile
     */
    getSeenTile : function(tile)
    {
        return this.seenTiles[tile.x][tile.y];
    },

    /**
     * Whether this player has seen the given tile or not. To add a
     * tile to this player memory, use this.addSeenTile.
     *
     * @requires tile is defined and not null
     * @return true iff this player saw the tile :
     *         this.seenTiles.contains(tile)
     */
    hasSeenTile : function(tile)
    {
        return this.seenTiles[tile.x] && this.seenTiles[tile.x][tile.y];
    }
};

extend(Player, Creature);
