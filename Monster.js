function Monster(type)
{
    Creature.call(this, type);

    this.info = g_monsterInfo[type];

    this.HP = 5;
    this.XP = g_monsterInfo[this.type]['XP'];

    this.STR = this.info['STR'];
    this.DEF = this.info['DEF'];

    // DO NOT uncomment if you want to live!
    this.brain = new FiniteStateMachine(new FollowState(this, g_player));
}

Monster.prototype =
{
   brain : null,

   destroyMonster : function()
   {
       this.destroyCreature();
   },

   update : function()
   {
      if(this.brain)
      {
         this.brain.think();
      }
   },

   getName : function()
   {
       return 'the ' + this.info['name'];
   }
}

extend(Monster, Creature);
