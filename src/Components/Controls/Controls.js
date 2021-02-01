import React from 'react';
import "../../index.css"
import {BehaviorSubject, fromEvent, interval, timer} from "rxjs";
import {buffer, debounce, filter, map, mergeMap, takeWhile} from "rxjs/operators";
import {Timer} from "../Timer/Timer";


export function Controls() {
 const stopStartBtn = React.useRef(null);
 const waitBtn = React.useRef(null);
 const resetBtn = React.useRef(null);



 const [time, setTime] = React.useState(0);

 React.useEffect(() => {
  let isStart = false;
  let isWait = false;
  let isReset = false;
  let latestValue = 0;

  const stopwatch$ = new BehaviorSubject('');
  const timer$ = interval(1000).pipe(
      map((v) => v + latestValue),
      takeWhile((v) => {
       if (isWait) {
        isWait = false;
        latestValue = v;
       }
       return isStart;
      }),
  );

  const stopStart$ = fromEvent(stopStartBtn.current, 'click')
      .pipe(
          mergeMap(() => {
           console.log('Stop/Start Clicked');
           isStart = !isStart;
           if (!isStart) latestValue = 0;
           if (isReset) {
            isReset = false;
            latestValue = 0;
            console.log('isReset set to true in stop/start');
           }
           return timer$;
          }),
      )
      .subscribe((v) => {
       if (!isReset) stopwatch$.next(v);
      });

  const wait$ = fromEvent(waitBtn.current, 'click');
  wait$
      .pipe(
          buffer(wait$.pipe(debounce(() => timer(250)))),
          filter((clickArray) => {
           const isDoubleClick = clickArray.length === 2;
           if (isDoubleClick) {
            isWait = true;
            isStart = false;
           }
           return isDoubleClick;
          }),
      )
      .subscribe(() => {
       console.log('Wait Clicked!');
       isReset = false;
      });

  const reset$ = fromEvent(resetBtn.current, 'click')
      .pipe(
          mergeMap(() => {
           console.log('Reset Clicked');
           isReset = true;
           isStart = true;
           latestValue = 0;
           return timer$;
          }),
      )
      .subscribe((v) => stopwatch$.next(v));

  stopwatch$.subscribe((v) => {
   setTime(v);
  });
  return () => {
   stopwatch$.unsubscribe();
   stopStart$.unsubscribe();
   timer$.unsubscribe();
   wait$.unsubscribe();
   reset$.unsubscribe();
  };
 }, []);
return(
 <section>
  <Timer time={time}/>
  <div className="buttons">
   <button ref={stopStartBtn}>Start/Stop</button>
   <button ref={waitBtn}>Wait</button>
   <button ref={resetBtn}>Reset</button>
  </div>
 </section>
)
}