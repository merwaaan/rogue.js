function Creature()
{
	// status
	this.HP = 0;
	this.maxHP = 0;
	this.XP = 0;

	// characteristics
	this.STR = 0;
	this.DEF = 0;

	// equipment
	this.weapon = null;
	this.armor = null;

	this.initCreature = function(type)
	{
		// search a FLOOR tile where the creature can be positionned
		var tile = g_level.getRandomTile('FLOOR');

		this.initVisualGameObject(tile.x, tile.y, type);

		this.HP = 15;
		this.maxHP = 15;

		this.weapon = g_weaponInfo['SWORD'];
		this.armor = g_armorInfo['SKIN'];

		return this;
	};

	this.destroyCreature = function()
	{
		// if the creature is positionned, we free its tile
		if(this.x != null && this.y != null)
		{
			g_level.getTile(this.x, this.y).creature = null;
		}
		
		this.destroyVisualGameObject();
	};
	
	this.attack = function(victim)
	{
		var damage = this.STR + (this.weapon != null ? this.weapon.PWR : 0);

		victim.takeDamage(damage, this);
	};

	this.takeDamage = function(damage, attacker)
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
	};

	this.die = function()
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
	};
}

Creature.prototype = new VisualGameObject;
