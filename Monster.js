function Monster()
{
	this.initMonster = function(type)
	{
		this.initVisualGameObject(10, 10, type);

		this.HP = 5;

		this.STR = 1;
		this.DEF = 1;

		this.model = getModel(g_monsterInfo[this.type]['char'], g_monsterInfo[this.type]['color']);

		return this;
	};
}

Monster.prototype = new Creature;
