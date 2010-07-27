function State(host)
{
   this.host = host;
}

State.prototype =
{
   host: null,

   enter : null,
   update : null,
   exit : null
}

// FOLLOW

function FollowState(host, target)
{
   State.call(this, host);

   this.target = target;
}

FollowState.prototype =
{
   target : null,

   update : function()
   {
      if(this.host.nextTo(this.target))
      {
         this.host.brain.changeState(new AttackState(this.host, this.target));
      }
      else
      {
         var path = new AStar().getInBetweenPath(g_level.getTile(this.host.x, this.host.y), g_level.getTile(this.target.x, this.target.y));
         if(path)
         {
            this.host.move(path[0].x, path[0].y);
         }
      }
   },
};

extend(FollowState, State);

// ATTACK

function AttackState(host, target)
{
   State.call(this, host);

   this.target = target;
}

AttackState.prototype =
{
   target : null,

   update : function()
   {
      if(!this.host.nextTo(this.target))
      {
         this.host.brain.changeState(new FollowState(this.host, this.target));
      }
      else
      {
         this.host.attack(this.target);
      }
   },
};

extend(AttackState, State);
