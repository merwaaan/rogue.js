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

// IDLE

function IdleState(host)
{
   State.call(this, host);
}

IdleState.prototype =
{
   update : function()
   {
      // well... 
   },
};

extend(IdleState, State);

// ROAM

function RoamState(host)
{
   State.call(this, host);

   this.getNewDestination();
}

RoamState.prototype =
{
   destination : null,

   update : function()
   {
      // if the creature knows where to go
      if(this.destination)
      {
         // if the destination is reached
         if(this.host.nextTo(this.destination))
         {
            this.getNewDestination();
         }
         // else walk to the destination
         else
         {
            var path = new AStar().getInBetweenPath(this.host.getTile(), this.destination);
             // if a path is found, move there
             if (path)
                 this.host.move(path[0].x, path[0].y);
         }
      }
      else if(!this.destination)
      {
         this.getNewDestination();
      }
   },

   getNewDestination : function()
   {
      this.destination = null;

      while(!this.destination)
      {
         this.destination = g_level.getRandomTile('FLOOR');
      }
   }
};

extend(RoamState, State);


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
         var path = new AStar().getInBetweenPath(this.host.getTile(), this.target.getTile());
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
