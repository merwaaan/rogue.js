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
      this.right.append('<div id="hands"></div>');
   
      // mental status
      $('#status').append('<span id="sanity"></span>');

      // held objects
      $('#hands').append('<span id="leftHand"></span>');
      $('#hands').append('<span id="rightHand"></span>');

      this.updateStatusFrame();
   },

   updateStatusFrame : function()
   {
      // mental status
      $('#sanity').text(g_sanityLevels[g_player.sanity]);

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
      this.right.append('<div class="frameTitle">Inventory</div>');
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

         $('#inventory #items').append(shortcut + ' - ' + name + '<br/>');
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
      var wieldLeft = item.wield && !item.isWielded('left');
      var wieldRight = item.wield && !item.isWielded('right');
      var unwield = item.unwield && item.isWielded && item.isWielded();

      // display the list of possible actions and record them
      if(drop)
         $('#inventory #details').append('<br/>d - drop');

      if(wieldLeft)
         $('#inventory #details').append('<br/>l - hold in left hand' + (item.owner.left ? ' (will unwield the ' + item.owner.left.getName() + ')' : ''));

      if(wieldRight)
         $('#inventory #details').append('<br/>r - hold in right hand '+ (item.owner.right ? ' (will unwield the ' + item.owner.right.getName() + ')' : ''));

      if(unwield)
         $('#inventory #details').append('<br/>u - unwield');

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
      this.right.append('-------- GAME OVER ---------<br/><br/>Work it harder,<br/>Make it better,<br/>Do it faster,<br/>Makes us stronger<br/>');

      // block inputs from the player
      setKeyHandler(null);
   }
}

