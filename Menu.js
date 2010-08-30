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
      this.right.append('<div id="equipment"></div>');

      // status
      var s = ['HP', 'XP']; 
      for(var i = 0; i < s.length; i++)
	      $('#status').append('<span id="' + s[i] + '">' + s[i] + ' <span id="' + s[i] + '_bar"></span> <span id="' + s[i] + '_label"></span>');
   
      // characteristics
      s = ['LVL', 'STR', 'DEF'];
      for(var i = 0; i < s.length; i++)
         $('#characteristics').append('<span id="' + s[i] + '">' + s[i] + ' <span id="' + s[i] + '_label"></span></span>'); 
   
      // equipment
      s = ['WEAPON', 'ARMOR'];
      for(var i = 0; i < s.length; i++)
         $('#info #equipment').append('<span id="' + s[i] + '">' + s[i] + ' <span id="' + s[i] + '_label"></span></span>');

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

      // weapon
      var name = g_player.weapon ? g_player.weapon.getName() : 'none';
      var damage = g_player.weapon ? g_player.weapon.getDamage() : 0;
      $('#WEAPON_label').text(name + ' (+' + damage + ')');

      // armor
      var name = g_player.armor ? g_player.armor.getName() : 'none';
      var protection = g_player.armor ? g_player.armor.getProtection() : 0;
      $('#ARMOR_label').text(name + ' (+' + protection + ')');
   },

   openPickUpChoiceFrame : function(items)
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="frameTitle">Which item do you want to pick up?</div><div id="pickUpChoice"><ul></ul></div>');

      // hold an array of shortcut/item associations
      var shortcuts = getItemShortcuts(items);

      for(var i = 0; i < items.length; i++)
      {
         var shortcut = String.fromCharCode(97 + i);
         var name = items[i].getName();

         $('#pickUpChoice ul').append('<li>' + name + ' (' + shortcut + ')</li>');
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
         // if the used shorcut is associated with an item, open the detail tab
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

      // display the list of possible actions
      if(item.drop)
         $('#inventory #details').append('<br/>drop (d)');

      if(item.wield && item.isWielded && !item.isWielded())
         $('#inventory #details').append('<br/>wield (w)');

      if(item.unwield && item.isWielded && item.isWielded())
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
            if(item.drop)
            {
               item.drop(g_player.x, g_player.y);
               
               menu.backToGame();
            }
         }
         // u : unwield item
         else if(event.keyCode == 85)
         {
            if(item.unwield && item.isWielded && item.isWielded())
            {
               item.unwield();

               menu.backToGame();
            }
         }
         // w : wield item
         else if(event.keyCode == 87)
         {
            if(item.wield && item.isWielded && !item.isWielded())
            {
               item.wield();

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

