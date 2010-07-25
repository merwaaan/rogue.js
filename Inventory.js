function Inventory()
{
   this.weapons = new Array();
   this.armors = new Array();
   this.edibleItems = new Array();

   this.shortcuts = new Array();
}

Inventory.prototype =
{
   // inventory content
   weapons : null,
   armors : null,
   edibleItems : null,

   /**
    * Array listing all of the shortcuts and the items associated to
    * each one of them.
    *
    * [[keycode, item], ...]
    */
   shortcuts : null,

   add : function(category, item)
   {
      if(category == 'WEAPON')
      {
         this.weapons.push(item);
      }
      else if(category == 'ARMOR')
      {
         this.armors.push(item);
      }
      else if(category == 'EDIBLE')
      {
         this.edibleItems.push(item);
      }
   },

   remove : function(category, item)
   {
      if(category == 'WEAPON')
      {
         this.weapons.removeObject(item);
      }
      else if(category == 'ARMOR')
      {
         this.armors.removeObject(item);
      }
      else if(category == 'EDIBLE')
      {
         this.edibleItems.removeObject(item);
      }
   },
            
   open : function()
   {
      buildInventoryFrame();

      // list of all the categories of items possibly in the inventory
      // [[category display name, local array], ...]
      var categories = [['Weapons', this.weapons], ['Armors', this.armors], ['Edible items', this.edibleItems]];

      // ASCII code of the key used to select an item
      var keyCodeAscii = 97;

      for(var i = 0; i < categories.length; i++)
      {
         var currentCat = categories[i];

         // display the name of the current category
         $('#inventory #items').append('<ul>' + currentCat[0] + '</ul>');

         // display the content of the current category
         if(currentCat[1].length > 0)
         {
            for(var j = 0; j < currentCat[1].length; j++)
            {
               var shortcut = String.fromCharCode(keyCodeAscii);
               $('#inventory #items ul:last-child').append('<li>' + currentCat[1][j].getName() + ' (' + shortcut + ')</li>');
               
               // memorize the shortcut and the associated item
               // 32 is the offset between a character's ASCII code and its Javascript code
               var keyCodeJS = keyCodeAscii - 32 + '';
               this.shortcuts[keyCodeJS] = currentCat[1][j];
               keyCodeAscii++;
            }
         }
      }

      var inv = this;

      // configure and set the current key handler
      this.keyHandler_items = function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            buildStatusFrame();

            setKeyHandler(g_gameObjectManager.keyHandler_game);
         }
         // if the used shorcut is associated with an item, open the detail tab
         else if(inv.shortcuts[event.keyCode])
         {
            inv.displayDetails(inv.shortcuts[event.keyCode]);
         }

         event.preventDefault();
      };

      setKeyHandler(this.keyHandler_items);
   },

   displayDetails : function(item)
   {
      // display basic information about the selected item
      $('#inventory #details').append(item.getName() + '<br/>' + item.getDescription());

      // display a list of possible actions depending on the item characteristics
      // temporary version for illustration purposes only
      $('#inventory #details').append('<br/><br/>drop (d)');

      // configure and set the current key handler
      this.keyHandler_details = function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            buildStatusFrame();

            setKeyHandler(g_gameObjectManager.keyHandler_game);
         }
        
         event.preventDefault();
      }

      setKeyHandler(this.keyHandler_details); 
   },

   keyHandler_items : null,
   
   keyHandler_details : null
}
