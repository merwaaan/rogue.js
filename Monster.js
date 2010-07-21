function Monster()
{
	this.initMonster = function(type)
	{
		this.initCreature(type);

		this.HP = 5;
		this.XP = g_monsterInfo[this.type]['XP'];

		this.STR = 1;
		this.DEF = 1;

		this.model = getModel(g_monsterInfo[this.type]['char'], g_monsterInfo[this.type]['color']);

		return this;
	};

	this.destroyMonster = function()
	{
		this.destroyCreature();
	};

	this.getName = function()
	{
		return 'The ' + g_monsterInfo[this.type]['name'];
	};
}

Monster.prototype = new Creature;
