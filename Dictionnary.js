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

const THROW_RADIUS = 10;

/**
 * walkable : true if creature can go through this type of tile
 */

var g_tileInfo =
{
    VOID :
    {
        char : '',
        color : 'white',
        walkable : true,
    },
    FLOOR :
    {
        char : '.',
        color : 'white',
        walkable : true
    }, 
    WALL :
    {
        char : '#',
        color : 'white',
        walkable : false
    }
};

var g_weaponInfo =
{
    RUSTY_SWORD :
    {
        name : 'rusty sword',
        desc : 'An old rusty sword',
        char : 't',
        color : 'orange',
        damage : 1
    },
    WOODEN_BOW :
    {
        name : 'bow',
        desc : 'A wooden bow',
        char : 'D',
        color : 'brown',
        damage : 1,
        maxDistance : 12,
        minDistance: 4
    }
};

var g_projectileInfo =
{
   ARROW :
   {
      name : 'arrow',
      desc : 'A fragile wooden arrow',
      char : '-',
      color : 'white'
   }
}
var g_monsterInfo =
{
   SNAKE :
   {
      name : 'snake',
      desc : 'A small yet venomous snake',
      char : 's',
      color : 'yellow'
   }
};

var g_playerInfo =
{
    PLAYER :
    {
        char : '@',
        color : 'white'
    }
};

var g_sanityLevels = ['Utterly insane', 'Verging on dementia', 'Mildly delirious', 'Lightly disturbed', 'Sane'];

// ANIMATIONS

const THROW_ANIM_FREQ = 30;
const THROW_ANIM_CHAR = '*';

// UI

const REACHABLE_AREA_COLOR = 'rosybrown';
const TARGET_COLOR = 'crimson';
const TARGET_NO_COLOR = 'purple';

var g_messageInfo =
{
    DEFAULT :
    {
        color : 'white'
    },
    AMBIANCE :
    {
        color : 'gold'
    },
    INFO :
    {
        color : 'lightseagreen'
    },
    GOOD :
    {
        color : 'chartreuse'
    },
    BAD :
    {
        color : 'crimson'
    }
};
