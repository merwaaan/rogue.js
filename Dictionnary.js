/**
 * This file contains information about the elements populating the game (tiles, creatures, items...)
 *
 * All of these categories often have similar fields describing them :
 * - name : the name of the object
 * - description : a short sentence describing the object
 * - char : the character used to represent the object on the screen
 * - color : the CSS color of the character
 */

// color to draw the tiles in the fog of war in
const FOW_COLOR = 'rgb(80,80,80)';

/**
 * walkable : true if creature can go through this type of tile
 */

var g_tileInfo =
{
    'VOID' :
    {
        'char' : '',
        'color' : 'white',
        'walkable' : true,
    },
    'FLOOR' :
    {
        'char' : '.',
        'color' : 'white',
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
        'char' : 't',
        'color' : 'blue',
        'PWR' : 0
    },
    'SPEAR' :
    {
        'name' : 'spear',
        'desc' : 'A long shining spear',
        'char' : 'l',
        'color' : 'blue',
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
        'char' : 's',
        'color' : 'blue',
        'PWR' : 0
    },
    'MAIL' :
    {
        'name' : 'silver mail',
        'desc' : 'A shiny mail',
        'char' : 'm',
        'color' : 'blue',
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

var g_foodInfo =
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
        'STR' : 1,
        'DEF' : 1,
        'XP' : 70
    },
    'SPIDER' :
    {
        'name' : 'spider',
        'desc' : 'An eight-legged horror',
        'char' : 'x',
        'color' : 'red',
        'STR' : 1,
        'DEF' : 0,
        'XP' : 60
    }
};

// keep all the item dictionnaries and their respective categories (mainly used in the player's inventory)
// [[dictionnary, category name], ...]

var g_itemsCategories = [[g_weaponInfo, 'WEAPON'], [g_armorInfo, 'ARMOR'], [g_foodInfo, 'FOOD']];

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
    1 :
    {
        'HP' : '15',
        'STR' : 1,
        'DEF' : 1,
        'next' : 100
    },
    2 :
    {
        'HP' : '5',
        'STR' : 1,
        'DEF' : 1,
        'next' : 130
    },
    3 :
    {
        'HP' : '5',
        'STR' : 1,
        'DEF' : 0,
        'next' : 200
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
        'color' : 'gold'
    },
    'INFO' :
    {
        'color' : 'lightseagreen'
    },
    'GOOD' :
    {
        'color' : 'chartreuse'
    },
    'BAD' :
    {
        'color' : 'crimson'
    }
};
