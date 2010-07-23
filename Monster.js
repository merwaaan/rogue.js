function Monster()
{
	this.initMonster = function(type)
	{
		this.info = g_monsterInfo[type];

		this.initCreature(type);

		this.HP = 5;
		this.XP = g_monsterInfo[this.type]['XP'];

		this.STR = this.info['STR'];
		this.DEF = this.info['DEF'];

		return this;
	};

	this.destroyMonster = function()
	{
		this.destroyCreature();
	};

	this.getName = function()
	{
		return 'The ' + this.info['name'];
	};
}

Monster.prototype = new Creature;
