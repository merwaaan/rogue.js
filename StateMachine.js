function StateMachine(host, behavior)
{
   this.host = host;
   this.behavior = behavior;

   this.changeState(new RoamState(this.host));
}

StateMachine.prototype =
{
   // creature whose actions are controlled by this FSM
   host : null,
   
   // transition table
   behavior : null,

   // current state
   state : null,

   think : function()
   {
      this.checkPossibleTransitions();
      this.state.update();
   },

   /**
    * change the current state of the state machine,
    * exit()ing the previous state and enter()ing the new one
    */
   changeState : function(state)
   {
      if(this.state && this.state.exit)
         this.state.exit();
      
      this.state = state;
      
      if(this.state && this.state.enter)
         this.state.enter();

      console.log(this.host.getName() + ' switches to ' + this.state.toString())
   },

   /**
    * Check all the transitions of the current state. If no transition is possible,
    * nothing happens. If exactly one transition is possible, switch to it. If more
    * than one transitions is possible, randomly select one according to their 
    * respective weights.
    */
   checkPossibleTransitions : function()
   {
      // get all the possible transitions from the current state
      var currentState = this.behavior[this.state];

      // holds the possible transitions and their weights
      // [[next state, weight], ...]
      var possibleTransitions = [];

      // for each transition, check if it is possible
      for(var transition in currentState)
      {
         // a little bit of parsing : if the check function string is preceded by '!', negate it
         var negate = currentState[transition]['check'].charAt(0) == '!' ? true : false;

         var func = (negate ? '!' : '') + 'this.host.';
         func += (negate ? currentState[transition]['check'].substr(1) : currentState[transition]['check']) + '()';

         if(eval(func))
            possibleTransitions.push([new currentState[transition]['next'](this.host), currentState[transition]['weight']]);
      }

      // if there is exactly one possible transition, switch to it
      if(possibleTransitions.length == 1)
         this.changeState(possibleTransitions[0][0]);
      // if there are several possible outcomes, randomly select one according to their respective weight
      else if(possibleTransitions.length > 1)
         this.changeState(selectRandomTransition(possibleTransitions));
   },
         
  /**
   * Randomly select a state within a list of possible weighted transitions.
   * The array given in parameter obeys to the following structure :
   * [[state, weight], ...].
   */ 
   selectRandomTransition: function(transitions)
   {
      // calculate the sum of all the weights
      var totalWeight = 0;
      for(var i = 0; i < transitions.length; i++)
         totalWeight += transitions[i][1];
              
      // pick a random value
      var x = getRandomDecimal(0, totalWeight);

      // return the "winning" transition
      for(var i = 0; i < transitions.length; i++)
         if(x < transitions[i][1])
            return transition[i][0];
         else
            x -= transitions[i][1];
   }
};
