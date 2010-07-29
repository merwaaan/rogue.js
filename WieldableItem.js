function WieldableItem(x, y, type, owner)
{
   Item.call(this, x, y, type, owner);
}

WieldableItem.prototype =
{
   wield : null,
   unwield : null,
   isWielded : null
};

extend(WieldableItem, Item);
