var SIZE = 25;
var HALF_SIZE = Math.floor(SIZE / 2);

var g_gameObjectManager = null;

var g_level = null;
var g_player = null;

window.onload = function()
{
	g_gameObjectManager = new GameObjectManager().initGameObjectManager();
	g_gameObjectManager.step();

	updateAllUI();
}
