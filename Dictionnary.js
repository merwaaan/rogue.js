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
		'name' : 'Sword',
		'desc' : 'A big sword',
		'PWR' : 0
	},
	'SPEAR' :
	{
		'name' : 'Spear',
		'desc' : 'A long shining spear',
		'PWR' : 1
	}
};

var g_armorInfo =
{
	'SKIN' :
	{
		'name' : 'Wolf skin',
		'desc' : 'A glorious wolf skin',
		'PWR' : 0
	},
	'MAIL' :
	{
		'name' : 'Silver mail',
		'desc' : 'A shiny mail',
		'PWR' : 3
	}
};

var g_monsterInfo =
{
	'SNAKE' :
	{
		'name' : 'Snake',
		'desc' : 'A small yet venomous snake',
		'STR' : 1,
		'DEF' : 1,
		'XP' : 5,
		'char' : 's',
		'color' : 'yellow'
	},
	'SPIDER' :
	{
		'name' : 'Spider',
		'desc' : 'An eight-legged horror',
		'STR' : 1,
		'DEF' : 0,
		'XP' : 2,
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
	'DAMAGE_TAKEN' :
	{
		'color' : 'red'
	},
	'DAMAGE_GIVEN' :
	{
		'color' : 'pink'
	}
};
