function State(host)
{
   this.host = host;
}

State.prototype =
{
   host: null,

   enter : null,
   update : null,
   exit : null,

   // toString() MUST returns the name of the class
   toString : null
}

// IDLE

function IdleState(host, args)
{
   State.call(this, host);
}

IdleState.prototype =
{
   update : function()
   {
      // well... 
   },

   toString : function()
   {
      return 'IdleState';
   }
};

extend(IdleState, State);

// ROAM

function RoamState(host, args)
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
   },

   toString : function()
   {
      return 'RoamState';
   }
};

extend(RoamState, State);


// FOLLOW

function FollowState(host, args)
{
   State.call(this, host);

   this.target = args[0];
}

FollowState.prototype =
{
   target : null,

   update : function()
   {
      var path = new AStar().getInBetweenPath(this.host.getTile(), this.target.getTile());
      if(path)
      {
         this.host.move(path[0].x, path[0].y);
      }
   },

   toString : function()
   {
      return 'FollowState';
   }
};

extend(FollowState, State);

// ATTACK

function AttackState(host, args)
{
   State.call(this, host);

   this.target = args[0];
}

AttackState.prototype =
{
   target : null,

   update : function()
   {
      this.host.attack(this.target);
   },

   toString : function()
   {
      return 'AttackState';
   }
};

extend(AttackState, State);
