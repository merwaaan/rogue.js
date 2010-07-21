function Player()
{
	// status
	this.XP = 0;
	this.nextLevel = 0;

	// characteristics
	this.LVL = 0;

	// inventory
	this.inv_weapons = null;
	this.inv_armors = null;
	this.inv_misc = null;

	this.initPlayer = function()
	{
		// search a FLOOR tile where the player can be positionned
		var tile = g_level.getRandomTile('FLOOR');

		this.initVisualGameObject(tile.x, tile.y, 'PLAYER');

		this.HP = 15;
		this.maxHP = 15;
		this.XP = 0;
		this.nextLevel = 100;

		this.LVL = 1;
		this.STR = 1;
		this.DEF = 1;

		this.weapon = g_weaponInfo['SWORD'];
		this.armor = g_armorInfo['SKIN'];
		
		this.model = getModel(g_playerInfo[this.type]['char'], g_playerInfo[this.type]['color']);

		// center the screen on the player
		g_gameObjectManager.xOffset = this.x - HALF_SIZE;
		g_gameObjectManager.yOffset = this.y - HALF_SIZE;

		return this;
	};

	this.keyDown = function(event)
	{
		var xOld = this.x;
		var yOld = this.y;

		var xMove = 0;
		var yMove = 0;

		switch(event.keyCode)
		{
			case 37:
				xMove = -1;
				break;
			case 38:
				yMove = -1;
				break;
			case 39:
				xMove = 1;
				break;
			case 40:
				yMove = 1;
				break;
		}

		var xNew = this.x + xMove;
		var yNew = this.y + yMove;

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
	};
}

Player.prototype = new Creature;
