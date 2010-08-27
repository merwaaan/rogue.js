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

   openIntroFrame : function()
   {
      this.right.empty();

      //TODO
   },

   openStatusFrame : function()
   {
      // build the structure
      this.right.empty();
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

   openPickUpChoiceFrame : function()
   {
      //TODO
   },

   openTargetChoiceFrame : function()
   {
      //TODO
   },

   openInventoryFrame : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div id="inventory"><div id="items"></div><div id="details"></div></div>');

      var inv = g_player.inventory;

      // list of all the categories of items possibly in the inventory
      // [[category display name, inventory local array], ...]
      var categories = [['Weapons', inv.weapons], ['Armors', inv.armors], ['Food', inv.food]];

      // ASCII code of the key used to select an item (we start with 'a')
      var keyCodeAscii = 97;

      // hold shortcut/item associations
      var shortcuts = [];

      for(var i = 0; i < categories.length; i++)
      {
         var currentCat = categories[i];

         // display the name of the current category
         $('#inventory #items').append('<ul><span class="category">' + currentCat[0] + '</span></ul>');

         // display the content of the current category
         if(currentCat[1].length > 0)
         {
            for(var j = 0; j < currentCat[1].length; j++)
            {
               var shortcut = String.fromCharCode(keyCodeAscii);
               var name = currentCat[1][j].getName();

               // change the color of the item name if it is a wielded weapon or armor
               if(currentCat[1][j].isWielded && currentCat[1][j].isWielded())
               {
                  name = '<span class="wielded">' + name + '</span>';
               }

               $('#inventory #items ul:last-child').append('<li>' + name + ' (' + shortcut + ')</li>');
               
               // memorize the shortcut and the associated item
               // (32 is the offset between a character's ASCII code and its Javascript code)
               var keyCodeJS = keyCodeAscii - 32 + '';
               shortcuts[keyCodeJS] = currentCat[1][j];
               keyCodeAscii++;
            }
         }
      }

      // keyboard handling
      var menu = this;
      setKeyHandler(function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            inv.close();
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
            inv.close();
         }
         // d : drop item
         else if(event.keyCode == 68)
         {
            if(item.drop)
            {
               item.drop(g_player.x, g_player.y);
               g_player.inventory.remove(item.getCategory(), item);
               inv.close();
            }
         }
         // u : unwield item
         else if(event.keyCode == 85)
         {
            if(item.unwield && item.isWielded && item.isWielded())
            {
               item.unwield();
               inv.close();
            }
         }
         // w : wield item
         else if(event.keyCode == 87)
         {
            if(item.wield && item.isWielded && !item.isWielded())
            {
               item.wield();
               inv.close();
            }
         }
                 
         event.preventDefault();
      });
   },

   openHelpFrame : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div id="help"></div>');

      // fill with information
      $('#help').append('HELP<br/><br/>blablabla');

      // keyboard handling
      var menu = this;
      setKeyHandler(function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            menu.openStatusFrame();
            setKeyHandler(g_gameObjectManager.keyHandler_game);

            event.preventDefault();
         }
      });
   }
}

