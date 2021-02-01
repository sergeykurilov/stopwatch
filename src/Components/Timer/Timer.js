import React from 'react';


export function Timer(props) {
    return (
        <section>
            <p className="app-title">Stopwatch</p>
            <p className="app-timer">
                {Math.floor(props.time / 3600)
                    ? props.time / 3600 >= 10
                        ? Math.floor(props.time / 3600)
                        : '0' + Math.floor(props.time / 3600)
                    : '00'}{' '}
                :
                {Math.floor(props.time / 60)
                    ? props.time / 60 >= 10
                        ? Math.floor(props.time / 60)
                        : '0' + Math.floor(props.time / 60)
                    : '00'}{' '}
                :{props.time % 60 >= 10 ? props.time % 60 : '0' + (props.time % 60)}
            </p>
        </section>
    )
}