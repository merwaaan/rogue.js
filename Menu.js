function Menu()
{
   this.reset();
}

Menu.prototype =
{
   // panels
   right : null,
   bottom : null,

   /**
    * Fully reset the menu structure. It can be divided into two parts :
    *    - the right panel displays status, help and several types of interactive menus
    *    - the bottom panel displays messages to the player
    */
   reset : function()
   {
      // reset the right panel
      if(this.right)
         this.right.remove();

      $('body').append('<div id="info"></div>');
      this.right = $('#info');

      // reset the bottom panel
      if(this.bottom)
         this.bottom.remove();
      
      $('body').append('<div id="message"></div>');
      this.bottom = $('#message');
   },

   /**
    * Display the default in-game menu (Status) and set the global
    * key handler to be the one controlling the player's actions and
    * movement.
    */
   backToGame : function()
   {
      this.openStatusMenu();
      setKeyHandler(g_gameObjectManager.keyHandler_game);
   },

   /**
    *
    */
   openIntroMenu : function()
   {
      this.right.empty();

      //TODO
   },

   /**
    * Open the default in-game menu (status) in the right panel of the screen,
    * it contains informations about the player mental state and the equipped
    * items.
    */
   openStatusMenu : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="menuTitle">Status</div>');
      this.right.append('<div id="status"></div>');
      this.right.append('<div id="hands"></div>');
   
      // mental status
      $('#status').append('<span id="sanity"></span>');

      // held objects
      $('#hands').append('<span id="leftHand"></span>');
      $('#hands').append('<span id="rightHand"></span>');

      this.updateStatusMenu();
   },

   /**
    * Update the content of the status menu.
    * This function needs to be called each time a described attribute is
    * altered (ie mental state alteration, wielding of a new item, ...)
    */
   updateStatusMenu : function()
   {
      // mental status
      $('#sanity').text(g_sanityLevels[g_player.sanity]);

      // held items
      $('#hands #leftHand').text('Left hand : ' + (g_player.left ? g_player.left.getName() : 'empty'));
      $('#hands #rightHand').text('Right hand : ' + (g_player.right ? g_player.right.getName() : 'empty'));
   },

   /**
    * Return a string representing a HTML formatted list of items. Each item 
    * is associated with an alphanumeric shortcut (starting from 'a') which 
    * will also be displayed in the list.
    *
    * @requires items to be an array of valid items.
    * @returns a string representing a list of items.
    */
   getItemList : function(items)
   {
      var list = new String();

      for(var i = 0; i < items.length; i++)
      {
         var shortcut = String.fromCharCode(97 + i);
         var name = items[i].getName();
         
         // add a note if the item is held
         if(items[i].isWielded('left'))
            name += ' <span class="wielded">[left hand]</span>';
         else if(items[i].isWielded('right'))
            name += ' <span class="wielded">[right hand]</span>';

         list += shortcut + ' - ' + name + '<br/>';
      }

      return list;
   },

   /**
    * Return an associative array of item/shortcut associations. The shortcuts 
    * are the keys and the items are the values. The shortcuts are alphanumeric 
    * characters that can later be used to let the user choose an item from a list.
    *
    * ex: [97:item1, 98:item2, ...]
    *
    * @requires items to be an array of valid items
    * @returns an associative array of shortcut/item associations
    */
   getItemShortcuts : function(items)
   {
      var shortcuts = [];

      // ASCII code of the key used to select an item (we start with 'a')
      var keyCodeAscii = 97;

      for(var i = 0; i < items.length; i++)
      {
         // memorize the shortcut and the associated item
         // (32 is the offset between a character's ASCII code and its Javascript code)
         var keyCodeJS = keyCodeAscii - 32 + '';
         shortcuts[keyCodeJS] = items[i];
         keyCodeAscii++;
      }

      return shortcuts;
   },

   /**
    * Open a menu letting the user manually choose an item to pick up when
    * several are pickable. Each available item is associated with a shortcut
    * which, when pressed, will add the item to the player's inventory.
    */
   openPickUpChoiceMenu : function(items)
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="menuTitle">Which item do you want to pick up?</div>');
      this.right.append('<div id="pickUpChoice"></div>');

      // hold an array of shortcut/item associations
      var shortcuts = this.getItemShortcuts(items);

      // display the items
      $('#pickUpChoice').append(this.getItemList(items));

      // keyboard handling
      var menu = this;
      setKeyHandler(function(event)
      {
         // ESC
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

   /**
    * Open a menu letting the user manually choose an item to drop. 
    * Each available item is associated with a shortcut which, when 
    * pressed, will drop the item to the floor.
    */
   openDropChoiceMenu : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="menuTitle">Which item do you want to drop?</div>');
      this.right.append('<div id="dropChoice"></div>');

      var items = g_player.inventory.items;

      // hold an array of shortcut/item associations
      var shortcuts = this.getItemShortcuts(items);

      // display the items
      $('#dropChoice').append(this.getItemList(items));

      // keyboard handling
      var menu = this;
      setKeyHandler(function(event)
      {
         // ESC
         if(event.keyCode == 27)
         {
            menu.backToGame();
         }
         // if the pressed key is associated with an item, drop it
         else if(shortcuts[event.keyCode])
         {
            shortcuts[event.keyCode].drop(g_player.x, g_player.y);

            menu.backToGame();
         }

         event.preventDefault();
      });

   },

   /**
    * Open a menu letting the user manually choose an item to trhow. 
    * Each available item is associated with a shortcut which, when 
    * pressed, will open a targeting interface.
    */
   openThrowChoiceMenu : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="menuTitle">Which item do you want to throw?</div>');
      this.right.append('<div id="throwChoice"></div>');

      var items = g_player.inventory.items;

      // hold an array of shortcut/item associations
      var shortcuts = this.getItemShortcuts(items);

      // display the items
      $('#throwChoice').append(this.getItemList(items));

      // keyboard handling
      var menu = this;
      setKeyHandler(function(event)
      {
         // ESC
         if(event.keyCode == 27)
         {
            menu.backToGame();
         }
         // if the pressed key is associated with an item, open the targeting interface
         else if(shortcuts[event.keyCode])
         {
            menu.openTargetingMenu(shortcuts[event.keyCode]);
         }

         event.preventDefault();
      });
   },

   /**
    * Open a menu letting the user select a position where to throw
    * the item given as parameter.
    *
    * @requires item to be a valid item
    */
   openTargetingMenu : function(item)
   {
      this.right.empty();

      //TODO
   },

   /**
    * Open a menu in the right of the screen. It contains the list of
    * items contained in the player's inventory. Each item is associated
    * with a shortcut which, when pressed, will open a new menu listing
    * possible interactions with the selected object.
    */
   openInventoryMenu : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="menuTitle">Inventory</div>');
      this.right.append('<div id="inventory"><div id="items"></div><div id="details"></div></div>');

      var inv = g_player.inventory;

      // hold shortcut/item associations
      var shortcuts = this.getItemShortcuts(inv.items);

      // display the items
      $('#inventory #items').append(this.getItemList(inv.items));

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

   /**
    * Open a menu in the right of the screen. It contains a list of possible
    * actions compatible with the item given in parameter. Each item is associated
    * with a shortcut which, when pressed, will execute it.
    *
    * @requires item to be a valid item
    */
   displayInventoryDetails : function(item)
   {
      // flags for possible actions
      var drop = item.drop;
      var wieldLeft = item.wield && !item.isWielded('left');
      var wieldRight = item.wield && !item.isWielded('right');
      var unwield = item.unwield && item.isWielded && item.isWielded();

      // display the list of possible actions and record them
      if(drop)
         $('#inventory #details').append('d - Drop<br/>');

      if(wieldLeft)
         $('#inventory #details').append('l - Hold in left hand' + (item.owner.left ? ' (will unwield the ' + item.owner.left.getName() + ')' : '') + '<br/>');

      if(wieldRight)
         $('#inventory #details').append('r - Hold in right hand '+ (item.owner.right ? ' (will unwield the ' + item.owner.right.getName() + ')' : '') + '<br/>');

      if(unwield)
         $('#inventory #details').append('u - Unwield<br/>');

      // display a description of the selected item
      $('#inventory #details').append('<br/>' + item.getDescription());

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
               // unwield the item if it is already held by the other hand
               if(item == item.owner.right)
                  item.owner.right.unwield();

               item.wield('left');

               menu.backToGame();
            }
         }
         // r : wield the item with the right hand
         else if(event.keyCode == 82)
         {
            if(wieldRight)
            {
               // unwield the item if it is already held by the other hand
               if(item == item.owner.left)
                  item.owner.left.unwield();

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

   /**
    * Open a menu in the right of the screen. It contains the list of 
    * commands available in the game.
    */
   openHelpMenu : function()
   {
      // build the structure
      this.right.empty();
      this.right.append('<div class="menuTitle">Help</div><div id="help"></div>');

      // fill with information
      $('#help').append('i - Inventory<br/><br/>p - Pick up an item<br/>d - Drop an item<br/>t - Throw an item<br/><br/>ESC - Cancel');

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

   /**
    * Open a menu in the right of the screen. It contains a "game over"
    * message and statistics about the game.
    */
   openGameOverMenu : function()
   {
      this.right.empty();
      this.right.append('-------- GAME OVER ---------<br/><br/>Work it harder,<br/>Make it better,<br/>Do it faster,<br/>Makes us stronger<br/>');

      // block inputs from the player
      setKeyHandler(null);
   }
}

