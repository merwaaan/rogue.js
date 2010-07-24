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

    this.weapon = g_weaponInfo['SWORD'];
    this.armor = g_armorInfo['SKIN'];
    
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
    inv_weapons : null,
    inv_armors : null,
    inv_misc : null,

    destroyPlayer : function()
    {
        this.destroyCreature();
    },

    winXP : function(XP)
    {
        this.XP += XP;
        
        writeMessage('You win ' + XP + ' XP', 'GOOD_NEWS');

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

        writeMessage('You level up!', 'GOOD_NEWS'); // EVERYONE!
    },

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
        if(xNew != this.x || yNew != this.y)
        {
            // if the target tile is walkable
            if(isTileWalkable(xNew, yNew))
            {
                this.move(xNew, yNew);

                // if there is an item on the tile
                if(true)
                {
                    
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
    }
};

extend(Player, Creature);
