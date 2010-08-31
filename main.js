var SIZE = 25;
var HALF_SIZE = Math.floor(SIZE / 2);

// 13 is the monospace font width (13px)
// 9 is the monospace font height (9px)
const DRAW_FONT = '13px monospace';
const FONT_WIDTH = 9;
const FONT_HEIGHT = 13;
const CANVAS_WIDTH = SIZE * FONT_WIDTH;
const CANVAS_HEIGHT = SIZE * FONT_HEIGHT;

var g_gameObjectManager = null;

// message log
var g_log = new Array();

var g_menu = null;
var g_level = null;
var g_player = null;

window.onload = function()
{
   // set the canvas dimension dynamically
   var canvas = document.getElementById('canvas');
   canvas.width = CANVAS_WIDTH;
   canvas.height = CANVAS_HEIGHT;

   g_gameObjectManager = new GameObjectManager();
   g_gameObjectManager.step();

   g_menu = new Menu();
   g_menu.openStatusMenu();
}
