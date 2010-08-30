function Menu()
{
   this.reset();
}

Menu.prototype =
{
   // panels
   right : null,
   bottom : null,

   reset : function()
   {
      if(this.right)
      {
         this.right.remove();
      }

      $('body').append('<div id="info"></div>');
      this.right = $('#info');

      if(this.bottom)
      {
         this.bottom.remove();
      }
      
      $('body').append('<div id="message"></div>');
      this.bottom = $('#message');
   },

   backToGame : function()
   {
      this.openStatusFrame();
      setKeyHandler(g_gameObjectManager.keyHandler_game);
   },

   openIntroFrame : function()
   {
      this.right.empty();

      //TODO
   },

   openStatusFrame : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="frameTitle">Status</div>');
      this.right.append('<div id="status"></div>');
      this.right.append('<div id="characteristics"></div>');
      this.right.append('<div id="hands"></div>');

      // status
      var s = ['HP', 'XP']; 
      for(var i = 0; i < s.length; i++)
	      $('#status').append('<span id="' + s[i] + '">' + s[i] + ' <span id="' + s[i] + '_bar"></span> <span id="' + s[i] + '_label"></span>');
   
      // characteristics
      s = ['LVL', 'STR', 'DEF'];
      for(var i = 0; i < s.length; i++)
         $('#characteristics').append('<span id="' + s[i] + '">' + s[i] + ' <span id="' + s[i] + '_label"></span></span>'); 

      // held objects
      $('#hands').append('<span id="leftHand"></span>');
      $('#hands').append('<span id="rightHand"></span>');

      this.updateStatusFrame();
   },

   updateStatusFrame : function()
   {
      // HP
      drawBar($('#HP_bar'), g_player.HP, g_player.maxHP);
      $('#HP_label').text(g_player.HP + '/' + g_player.maxHP);

      // XP
      drawBar($('#XP_bar'), g_player.XP, g_levelingInfo[g_player.LVL]['next']);
      $('#XP_label').text(g_player.XP + '/' + g_levelingInfo[g_player.LVL]['next']);

      // stats
      $('#LVL_label').text(g_player.LVL);
      $('#STR_label').text(g_player.STR);
      $('#DEF_label').text(g_player.DEF);

      // held items
      $('#hands #leftHand').text('Left hand : ' + (g_player.left ? g_player.left.getName() : 'empty'));
      $('#hands #rightHand').text('Right hand : ' + (g_player.right ? g_player.right.getName() : 'empty'));
   },

   openPickUpChoiceFrame : function(items)
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="frameTitle">Which item do you want to pick up?</div>');
      this.right.append('<div id="pickUpChoice"></div>');

      // hold an array of shortcut/item associations
      var shortcuts = getItemShortcuts(items);

      for(var i = 0; i < items.length; i++)
      {
         var shortcut = String.fromCharCode(97 + i);
         var name = items[i].getName();

         $('#pickUpChoice').append(name + ' (' + shortcut + ')<br/>');
      }

      // keyboard handling
      var menu = this;
      setKeyHandler(function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            menu.backToGame();
         }
         // if the pressed key is associated with an item, pick it up
         else if(shortcuts[event.keyCode])
         {
            shortcuts[event.keyCode].pickUp(g_player);

            menu.backToGame();
         }

         event.preventDefault();
      });

   },

   openTargetChoiceFrame : function()
   {
      this.right.empty();

      //TODO
   },

   openInventoryFrame : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="frameTitle">Your inventory</div>');
      this.right.append('<div id="inventory"><div id="items"></div><div id="details"></div></div>');

      var inv = g_player.inventory;

      // hold shortcut/item associations
      var shortcuts = getItemShortcuts(inv.items);

      for(var i = 0; i < inv.items.length; i++)
      {
         var shortcut = String.fromCharCode(97 + i);
         var name = inv.items[i].getName();
         
         // add a note if the item is held
         if(inv.items[i].isWielded('left'))
            name += ' [left hand]';
         else if(inv.items[i].isWielded('right'))
            name += ' [right hand]';

         $('#inventory #items').append(name + ' (' + shortcut + ')<br/>');
      }

      // keyboard handling
      var menu = this;
      setKeyHandler(function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            menu.backToGame();
         }
         // if the used shorcut is associated with an item, open the details tab
         else if(shortcuts[event.keyCode])
         {
            menu.displayInventoryDetails(shortcuts[event.keyCode]);
         }

         event.preventDefault();
      });
   },

   displayInventoryDetails : function(item)
   {
      // display basic information about the selected item
      $('#inventory #details').append(item.getName() + ' : ' + item.getDescription() + '<br/>');

      // flags for possible actions
      var drop = item.drop;
      var wieldLeft = item.wield && item.isWielded && !item.isWielded() && !g_player.left;
      var wieldRight = item.wield && item.isWielded && !item.isWielded() && !g_player.right;
      var unwield = item.unwield && item.isWielded && item.isWielded();

      // display the list of possible actions and record them
      if(drop)
         $('#inventory #details').append('<br/>drop (d)');

      if(wieldLeft)
         $('#inventory #details').append('<br/>hold in left hand (l)');

      if(wieldRight)
         $('#inventory #details').append('<br/>hold in right hand (r)');

      if(unwield)
         $('#inventory #details').append('<br/>unwield (u)');

      // key handling
      var menu = this;
      var inv = g_player.inventory;
      setKeyHandler(function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            menu.backToGame();
         }
         // d : drop item
         else if(event.keyCode == 68)
         {
            if(drop)
            {
               item.drop(g_player.x, g_player.y);
               
               menu.backToGame();
            }
         }
         // l : wield the item with the left hand
         else if(event.keyCode == 76)
         {
            if(wieldLeft)
            {
               item.wield('left');

               menu.backToGame();
            }
         }
         // r : wield the item with the right hand
         else if(event.keyCode == 82)
         {
            if(wieldRight)
            {
               item.wield('right');

               menu.backToGame();
            }
         }       
         // u : unwield
         else if(event.keyCode == 85)
         {
            if(unwield)
            {
               item.unwield();

               menu.backToGame();
            }
         }

         event.preventDefault();
      });
   },

   openHelpFrame : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="frameTitle">Help</div><div id="help"></div>');

      // fill with information
      $('#help').append('blablabla');

      // keyboard handling
      var menu = this;
      setKeyHandler(function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            menu.backToGame();

            event.preventDefault();
         }
      });
   },

   openGameOverFrame : function()
   {
      this.right.empty();
      this.right.append('-------- GAME OVER ---------<br/><br/>blabla');
   }
}

