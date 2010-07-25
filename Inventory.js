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
    * Array listing all of the shortcuts and the objects associated to
    * each one of them.
    *
    * [[keycode, object], ...]
    */
   shortcuts : null,

   add : function(category, type)
   {
      if(category == 'WEAPON')
      {
         this.weapons.push(g_weaponInfo[type]);
      }
      else if(category == 'ARMOR')
      {
         this.armors.push(g_armorInfo[type]);
      }
      else if(category == 'EDIBLE')
      {
         this.edibleItems.push(g_edibleItemInfo[type]);
      }
   },

   remove : function(category, type)
   {
      if(category == 'WEAPON')
      {
         this.weapons.removeObject(g_weaponInfo[type]);
      }
      else if(category == 'ARMOR')
      {
         this.armors.removeObject(g_armorInfo[type]);
      }
      else if(category == 'EDIBLE')
      {
         this.edibleItems.removeObject(g_edibleItemInfo[type]);
      }
   },
            
   open : function()
   {
      buildInventoryFrame();

      // list of all the categories of objects possibly in the inventory
      // [[category display name, local array], ...]
      var categories = [['Weapons', this.weapons], ['Armors', this.armors], ['Edible items', this.edibleItems]];

      // ASCII code of the key used to select an object
      var keyCodeAscii = 97;

      for(var i = 0; i < categories.length; i++)
      {
         var currentCat = categories[i];

         // display the name of the current category
         $('#inventory #objects').append('<ul>' + currentCat[0] + '</ul>');

         // display the content of the current category
         if(currentCat[1].length > 0)
         {
            for(var j = 0; j < currentCat[1].length; j++)
            {
               var shortcut = String.fromCharCode(keyCodeAscii);
               $('#inventory #objects ul:last-child').append('<li>' + currentCat[1][j]['name'] + ' (' + shortcut + ')</li>');
               
               // memorize the shortcut and the associated object
               // 32 is the offset between a character's ASCII code and its Javascript code
               var keyCodeJS = keyCodeAscii - 32 + '';
               this.shortcuts[keyCodeJS] = currentCat[1][j];
               keyCodeAscii++;
            }
         }
      }

      var inv = this;

      // configure and set the current key handler
      this.keyHandler_objects = function(event)
      {
         // ESCAPE
         if(event.keyCode == 27)
         {
            buildStatusFrame();

            setKeyHandler(g_gameObjectManager.keyHandler_game);
         }
         // if the used shorcut is associated with an object, open the detail tab
         else if(inv.shortcuts[event.keyCode])
         {
            inv.displayDetails(inv.shortcuts[event.keyCode]);
         }

         event.preventDefault();
      };

      setKeyHandler(this.keyHandler_objects);
   },

   displayDetails : function(obj)
   {
      // display basic information about the selected object
      $('#inventory #details').append(obj['name'] + '<br/>' + obj['desc']);

      // display a list of possible actions depending on the object characteristics
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

   keyHandler_objects : null,
   
   keyHandler_details : null
}
