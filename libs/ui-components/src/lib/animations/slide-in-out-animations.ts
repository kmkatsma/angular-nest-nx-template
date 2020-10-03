import { animate, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';

// Component transition animations
export const slideInAnimation: AnimationTriggerMetadata =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(100%)'
      }),
      animate('0.5s ease-in')
    ]),
    transition(':leave', [
      animate('0.5s ease-out', style({
        opacity: 0,
        transform: 'translateX(100%)'
      }))
    ])
  ]);

export const slideInFromLeftAnimation: AnimationTriggerMetadata =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('0.4s ease-in')
    ]),
  ]);

// Component transition animations
export const slideOutAnimation: AnimationTriggerMetadata =
  trigger('routeAnimation2', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':leave', [
      animate('0.5s ease-out', style({
        opacity: 0,
        transform: 'translateX(100%)'
      }))
    ])
  ]);

export const slideOutLeftAnimation: AnimationTriggerMetadata =
  trigger('routeAnimationOut', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':leave', [
      animate('0.5s ease-out', style({
        opacity: 0,
        transform: 'translateX(-100%)', position: 'absolute', left: 0, right: 0, top: 0
      }))
    ])
  ]);
