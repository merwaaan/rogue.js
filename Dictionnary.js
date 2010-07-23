/**
 * This file contains information about the elements populating the game (tiles, creatures, items...)
 *
 * All of these categories often have similar fields describing them :
 * - name : the name of the object
 * - description : a short sentence describing the object
 * - char : the character used to represent the object on the screen
 * - color : the CSS color of the character
 */

/**
 * walkable : true if creature can go through this type of tile
 */

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

/**
 * PWR : power of the weapon, it is added to the STR of the creature wielding it
 */

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

/**
 * PWR : power of the armor, it is added to the DEF of the creature wielding it
 */

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

/**
 * - stat : name of the state which will be altered once the item is used (HP, STR, DEF, maybe more later...)
 * - value : quantity of the targetted stat which will be altered
 * - alteration : type of alteration applied to the stat
 *   - 'relative' : stat = current stat + value
 *   - 'absolute' : stat = value
 *   - 'progressive' : stat = current stat + value at a regular frequency
 * - frequency : frequency in turn of a progressive alteration
 * - duration : maximum duration in turn of a progressive alteration
 */

var g_edibleItemInfo =
{
	'BREAD' :
	{
		'name' : 'bread',
		'desc' : 'A piece of stale bread',
		'char' : 'o',
		'color' : 'white',
		'stat' : 'HP',
		'value' : 5,
		'alteration' : 'relative'
	},
	'POISONNED_BREAD' :
	{
		'name' : 'poisonned bread',
		'desc' : 'A piece of reaaally stale bread',
		'char' : 'o',
		'color' : 'pink',
		'stat' : 'HP',
		'value' : -1,
		'alteration' : 'progressive',
		'frequency' : 1,
		'duration' : 10
	}
};

/**
 * - STR : strength of this type monster
 * - DEF : defense of this type of monster
 * - XP : quantity of XP that @ will win if he kills this type of monster
 */

var g_monsterInfo =
{
	'SNAKE' :
	{
		'name' : 'snake',
		'desc' : 'A small yet venomous snake',
		'char' : 's',
		'color' : 'yellow',
		'STR' : 3,
		'DEF' : 1,
		'XP' : 20
	},
	'SPIDER' :
	{
		'name' : 'spider',
		'desc' : 'An eight-legged horror',
		'char' : 'x',
		'color' : 'red',
		'STR' : 1,
		'DEF' : 0,
		'XP' : 10
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

var g_levelingInfo =
{

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
