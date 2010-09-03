/**
 * This file describes various behaviors usable by the state machines modeling
 * the creatures brains.
 *
 * Each of these is a nested object containing this kind of behavioral mapping :
 *
 * current state :
 * {
 *    0 : {'check' : stimulus function, 'next' : next state [, 'weight' : weight]},
 *    ...
 * }
 *
 * - 'current state' requires to be a State class.
 * 
 * - 'stimulus function' requires to be a string representing the name of a boolean 
 *    member function of the creature, without parenthesis or argument.
 *   It is possible to negate this function by adding '!' at the start of the string.
 * 
 * - 'next state' requires to be a State class.
 *
 * - weight is not mandatory and is used when several candidate states are competing.
 *   The bigger the weight, the greater the chance for a state to be next.
 *   
 * The principle of this system can be summed up as follows :
 * If in the current state, the stimulus is verified, switch to the next state.
 */

var g_roamerBehavior =
{
   RoamState :
   {
      0 : {'check' : 'seeEnemy', 'next' : FollowState}
   },
   FollowState :
   {
      0 : {'check' : 'nextToTarget', 'next' : AttackState}
   },
   AttackState :
   {
      0 : {'check' : '!nextToTarget', 'next' : FollowState, 'weight' : 3},
      1 : {'check' : 'hasCriticalHealth', 'next' : FleeState, 'weight' : 1}
   },
   FleeState :
   {
      0 : {'check' : 'farFromTarget', 'next' : RoamState}
   }
};
