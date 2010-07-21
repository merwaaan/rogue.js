function Creature()
{
	// status
	this.HP = 0;
	this.maxHP = 0;

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

		this.STR = 1;
		this.DEF = 1;

		this.weapon = g_weaponInfo['SWORD'];
		this.armor = g_armorInfo['SKIN'];

		return this;
	};

	this.attack = function(victim)
	{
		var damage = Math.round((this.STR + (this.weapon != null ? this.weapon.PWR : 0)) * getRandomDecimal(0.5, 1));

		victim.takeDamage(damage, this);
	};

	this.takeDamage = function(damage, attacker)
	{
		this.HP -= damage;

		writeMessage('The XXX loses ' + damage + 'HP', 'DAMAGE_GIVEN');

		if(this.HP <= 0)
		{
			g_level.getTile(this.x, this.y).creature = null;

			writeMessage('The XXX dies', 'DAMAGE_GIVEN');
		}
	};
}

Creature.prototype = new VisualGameObject;
