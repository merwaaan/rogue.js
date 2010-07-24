function Monster(type)
{
	Creature.call(this, type);

	this.info = g_monsterInfo[type];

	this.HP = 5;
	this.XP = g_monsterInfo[this.type]['XP'];

	this.STR = this.info['STR'];
	this.DEF = this.info['DEF'];
}

Monster.prototype =
{
	destroyMonster : function()
	{
		this.destroyCreature();
	},

	getName : function()
	{
		return 'the ' + this.info['name'];
	}
}

extend(Monster, Creature);
