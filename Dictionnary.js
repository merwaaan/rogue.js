var g_tileInfo =
{
	'VOID' :
	{
		'char' : '&nbsp;',
		'color' : 'white',
		'walkable' : true,
	},
	'FLOOR' :
	{
		'char' : '.',
		'color' : 'gray',
		'walkable' : true
	}, 
	'WALL' :
	{
		'char' : '#',
		'color' : 'white',
		'walkable' : false
	}
};

var g_weaponInfo =
{
	'SWORD' :
	{
		'name' : 'sword',
		'desc' : 'A big sword',
		'PWR' : 0
	},
	'SPEAR' :
	{
		'name' : 'spear',
		'desc' : 'A long shining spear',
		'PWR' : 1
	}
};

var g_armorInfo =
{
	'SKIN' :
	{
		'name' : 'wolf skin',
		'desc' : 'A glorious wolf skin',
		'PWR' : 0
	},
	'MAIL' :
	{
		'name' : 'silver mail',
		'desc' : 'A shiny mail',
		'PWR' : 3
	}
};

var g_monsterInfo =
{
	'SNAKE' :
	{
		'name' : 'snake',
		'desc' : 'A small yet venomous snake',
		'STR' : 1,
		'DEF' : 1,
		'XP' : 20,
		'char' : 's',
		'color' : 'yellow'
	},
	'SPIDER' :
	{
		'name' : 'spider',
		'desc' : 'An eight-legged horror',
		'STR' : 1,
		'DEF' : 0,
		'XP' : 10,
		'char' : 'x',
		'color' : 'red'
	}
};

var g_playerInfo =
{
	'PLAYER' :
	{
		'char' : '@',
		'color' : 'white'
	}
};

var g_messageInfo =
{
	'DEFAULT' :
	{
		'color' : 'white'
	},
	'AMBIANCE' :
	{
		'color' : 'yellow'
	},
	'ITEM_FOUND' :
	{
		'color' : 'blue'
	},
	'GOOD_NEWS' :
	{
		'color' : 'green'
	},
	'BAD_NEWS' :
	{
		'color' : 'red'
	}
};
