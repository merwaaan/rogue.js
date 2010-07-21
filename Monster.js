function Monster()
{
	this.initMonster = function(type)
	{
		this.initCreature(type);

		this.HP = 5;
		this.XP = g_monsterInfo[this.type]['XP'];

		this.STR = g_monsterInfo[this.type]['STR'];
		this.DEF = g_monsterInfo[this.type]['DEF'];

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
