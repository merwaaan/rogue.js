// RANDOM

function getRandomInteger(a, b)
{
	return Math.floor(Math.random() * (b - a + 1) + a);
}

function getRandomDecimal(a, b)
{
	return Math.random() * (b - a) + a;
}

function getRandomFromList(list)
{
	return list[getRandomInteger(0, list.length - 1)];
}

// DRAWING

function drawView(view)
{
	$('#frame').empty();
	$('#frame').append(view);
}

function getModel(character, color)
{
	return '<span style="color:' + color + '">' + character + '</span>';
}

function drawPath(path)
{
	for(var i = 0; i < path.length; i++)
	{
		drawCharacter('.', path[i].x - g_gameObjectManager.xOffset, path[i].y - g_gameObjectManager.yOffset);
	};
}

function drawBar(element, value, max)
{
	var limit = Math.round(value / max * 10);

	var bar = '|';
	for(var i = 0; i < 10; i++)
	{
		if(i < limit)
		{
			bar += '=';
		}
		else
		{
			bar += '-';
		}
	}
	bar += '|';

	element.text(bar);
}

// UI

function updateHP()
{
	drawBar($('#HP_bar'), g_player.HP, g_player.maxHP);
	$('#HP_label').text(g_player.HP + '/' + g_player.maxHP);
}

function updateXP()
{
	drawBar($('#XP_bar'), g_player.XP, g_player.nextLevel);
	$('#XP_label').text(g_player.XP + '/' + g_player.nextLevel);
}

function updateLVL()
{
	$('#LVL_label').text(g_player.LVL);
}

function updateSTR()
{
	$('#STR_label').text(g_player.STR);
}

function updateDEF()
{
	$('#DEF_label').text(g_player.DEF);
}

function updateWEAPON()
{
	$('#WEAPON_label').text(g_player.weapon['name'] + ' (+' + g_player.weapon['PWR'] + ')');
}

function updateARMOR()
{
	$('#ARMOR_label').text(g_player.armor['name'] + ' (+' + g_player.armor['PWR'] + ')');
}

function updateAllUI()
{
	updateHP();
	updateXP();
	updateLVL();
	updateSTR();
	updateDEF();
	updateWEAPON();
	updateARMOR();
}

function clearMessages()
{
	$('#message').empty();
}

function writeMessage(message, type)
{
	if(type == undefined)
	{
		type = 'DEFAULT';
	}

	$('#message').append('<span style="color:' + g_messageInfo[type]['color'] + '">' + message + '</span>');	
}

// LIGHTING

function castLightRay()
{

};

// MISC.

function isTileWalkable(x, y)
{
	var tile = g_level.getTile(x, y);

	if(tile == undefined || !tile.isWalkable())
	{
		return false;
	}

	return true;
}

function gameOver()
{
	$('#wall').append('----- GAME OVER -----<br/><br/>');
	$('#wall').append('Your quest lasted for ' + g_gameObjectManager.turn + ' turns');
}

Array.prototype.remove = function(from, to)
{
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	
	return this.push.apply(this, rest);
}; 

Array.prototype.removeObject = function(object)
{
	for(var i = 0; i < this.length; ++i)
	{
		if(this[i] === object)
		{
			this.remove(i);
			break;
		}
	}
}
